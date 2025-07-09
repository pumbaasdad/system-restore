const fs = require('fs');
const yaml = require('js-yaml');
const zlib = require('zlib');

// Import functions to test
const {
  fetchPackageList,
  parsePackageEntry,
  compareVersions,
  getLatestVersion,
  findLatestPackageVersions,
  processPackageUpdates,
  loadAndValidateConfig,
  updateYamlFile,
} = require('../index');

describe('Depend APT Bot', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  describe('fetchPackageList', () => {
    describe('apt', () => {
      it('should build correct package index URLs', () => {
        const repository = 'https://repo.mongodb.org/apt/ubuntu';
        const distribution = 'noble/mongodb-org/8.0';
        const arch = 'amd64';
        const components = ['multiverse', 'main'];

        const result = fetchPackageList('apt', repository, distribution, arch, components);

        expect(result).toEqual([
          'https://repo.mongodb.org/apt/ubuntu/dists/noble/mongodb-org/8.0/multiverse/binary-amd64/Packages.gz',
          'https://repo.mongodb.org/apt/ubuntu/dists/noble/mongodb-org/8.0/main/binary-amd64/Packages.gz',
        ]);
      });

      it('should handle single component', () => {
        const result = fetchPackageList('apt', 'https://example.com', 'dist', 'arm64', ['universe']);

        expect(result).toEqual([
          'https://example.com/dists/dist/universe/binary-arm64/Packages.gz',
        ]);
      });

      it('should handle empty components', () => {
        const result = fetchPackageList('apt', 'https://example.com', 'dist', 'arm64', []);

        expect(result).toEqual([
          'https://example.com/dists/dist//binary-arm64/Packages.gz',
        ]);
      });
    });

    describe('apk', () => {
      it('should build correct package index URLs for Alpine repositories', () => {
        const repository = 'https://dl-cdn.alpinelinux.org/alpine';
        const distribution = 'v3.18';
        const arch = 'x86_64';
        const components = ['main', 'community'];

        const result = fetchPackageList('apk', repository, distribution, arch, components);

        expect(result).toEqual([
          'https://dl-cdn.alpinelinux.org/alpine/v3.18/main/x86_64/APKINDEX.tar.gz',
          'https://dl-cdn.alpinelinux.org/alpine/v3.18/community/x86_64/APKINDEX.tar.gz',
        ]);
      });

      it('should handle single component', () => {
        const result = fetchPackageList('apk', 'https://example.com/alpine', 'edge', 'aarch64', ['testing']);

        expect(result).toEqual([
          'https://example.com/alpine/edge/testing/aarch64/APKINDEX.tar.gz',
        ]);
      });

      it('should handle empty components', () => {
        const result = fetchPackageList('apk', 'https://example.com/alpine', 'edge', 'aarch64', []);

        expect(result).toEqual([
          'https://example.com/alpine/edge//aarch64/APKINDEX.tar.gz',
        ]);
      });
    });

    it('should throw error for unsupported package manager', () => {
      expect(() => {
        fetchPackageList('unsupported', 'https://example.com', 'dist', 'amd64', ['main']);
      }).toThrow('Unsupported package manager: unsupported');
    });
  });

  describe('parsePackageEntry', () => {
    describe('apt', () => {
      it('should parse package name and version correctly', () => {
        const packageEntry = `Package: mongodb-org
Version: 8.0.0
Description: MongoDB database
Architecture: amd64`;

        const result = parsePackageEntry(packageEntry, 'apt');

        expect(result).toEqual({
          name: 'mongodb-org',
          version: '8.0.0',
        });
      });

      it('should handle missing package name', () => {
        const packageEntry = `Version: 1.0.0
Description: Some package`;

        const result = parsePackageEntry(packageEntry, 'apt');

        expect(result).toEqual({
          name: null,
          version: '1.0.0',
        });
      });

      it('should handle missing version', () => {
        const packageEntry = `Package: test-package
Description: Some package`;

        const result = parsePackageEntry(packageEntry, 'apt');

        expect(result).toEqual({
          name: 'test-package',
          version: null,
        });
      });

      it('should handle empty entry', () => {
        const result = parsePackageEntry('', 'apt');

        expect(result).toEqual({
          name: null,
          version: null,
        });
      });
    });

    describe('apk', () => {
      it('should parse package name and version correctly for APK format', () => {
        const packageEntry = `P:nginx
V:1.24.0-r0
A:x86_64
D:HTTP and reverse proxy server
C:Natanael Copa <ncopa@alpinelinux.org>`;

        const result = parsePackageEntry(packageEntry, 'apk');

        expect(result).toEqual({
          name: 'nginx',
          version: '1.24.0-r0',
        });
      });

      it('should handle missing package name in APK format', () => {
        const packageEntry = `V:1.0.0-r0
A:x86_64
C:Alpine maintainer`;

        const result = parsePackageEntry(packageEntry, 'apk');

        expect(result).toEqual({
          name: null,
          version: '1.0.0-r0',
        });
      });

      it('should handle missing version in APK format', () => {
        const packageEntry = `P:test-package
A:x86_64
C:Alpine maintainer`;

        const result = parsePackageEntry(packageEntry, 'apk');

        expect(result).toEqual({
          name: 'test-package',
          version: null,
        });
      });

      it('should handle empty entry for APK format', () => {
        const result = parsePackageEntry('', 'apk');

        expect(result).toEqual({
          name: null,
          version: null,
        });
      });
    });

    describe('unsupported', () => {
      it('should throw error for unsupported package manager', () => {
        expect(() => {
          parsePackageEntry('some package data', 'npm');
        }).toThrow('Unsupported package manager: npm');
      });
    });
  });

  describe('compareVersions', () => {
    describe('apt package manager', () => {
      it('should compare APT versions correctly with real comparison', () => {
        // Test with actual version comparison
        const result1 = compareVersions('2.0.0', '1.0.0', 'apt');
        const result2 = compareVersions('1.0.0', '2.0.0', 'apt');
        const result3 = compareVersions('1.0.0', '1.0.0', 'apt');

        expect(result1).toBeGreaterThan(0); // 2.0.0 > 1.0.0
        expect(result2).toBeLessThan(0); // 1.0.0 < 2.0.0
        expect(result3).toBe(0); // 1.0.0 == 1.0.0
      });

      it('should handle Debian version formats', () => {
        // Test with Debian-style versions
        const result1 = compareVersions('1:2.0.0-1', '1:1.0.0-1', 'apt');
        const result2 = compareVersions('2.0.0-1ubuntu1', '2.0.0-1', 'apt');
        const result3 = compareVersions('1.0.0~alpha1', '1.0.0~beta1', 'apt');
        const result4 = compareVersions('1.0.0~beta1', '1.0.0', 'apt');

        expect(result1).toBeGreaterThan(0); // Epoch version comparison
        expect(result2).toBeGreaterThan(0); // Ubuntu version comparison
        expect(result3).toBeLessThan(0); // Tilde comparison
        expect(result4).toBeLessThan(0); // Tilde vs final
      });

      it('should use apt as default when no package manager is specified', () => {
        const result1 = compareVersions('2.0.0', '1.0.0');
        const result2 = compareVersions('1.0.0', '2.0.0');
        const result3 = compareVersions('1.0.0', '1.0.0');

        expect(result1).toBeGreaterThan(0); // 2.0.0 > 1.0.0
        expect(result2).toBeLessThan(0); // 1.0.0 < 2.0.0
        expect(result3).toBe(0); // 1.0.0 == 1.0.0
      });

      it('should handle invalid APT version formats gracefully', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        // Test with invalid formats which should trigger the error handling
        const result1 = compareVersions(null, '1.0.0', 'apt');
        const result2 = compareVersions('1.0.0', undefined, 'apt');

        expect(result1).toBe(0);
        expect(result2).toBe(0);
        expect(consoleWarnSpy).toHaveBeenCalled();

        consoleWarnSpy.mockRestore();
      });
    });

    describe('apk package manager', () => {
      it('should compare APK versions correctly using semver', () => {
        // Standard semver comparisons
        const result1 = compareVersions('2.0.0', '1.0.0', 'apk');
        const result2 = compareVersions('1.0.0', '2.0.0', 'apk');
        const result3 = compareVersions('1.0.0', '1.0.0', 'apk');

        expect(result1).toBeGreaterThan(0); // 2.0.0 > 1.0.0
        expect(result2).toBeLessThan(0); // 1.0.0 < 2.0.0
        expect(result3).toBe(0); // 1.0.0 == 1.0.0
      });

      it('should handle complex semver formats for APK', () => {
        // APK-specific version formats
        const result1 = compareVersions('1.0.0-r1', '1.0.0-r2', 'apk');
        const result2 = compareVersions('1.0.0-alpha', '1.0.0-beta', 'apk');
        const result3 = compareVersions('1.0.0-beta', '1.0.0', 'apk');
        const result4 = compareVersions('1.2.3', '1.10.0', 'apk');

        expect(result1).toBeLessThan(0); // Release comparison
        expect(result2).toBeLessThan(0); // Pre-release comparison
        expect(result3).toBeLessThan(0); // Pre-release vs release
        expect(result4).toBeLessThan(0); // Numeric ordering
      });

      it('should handle invalid APK version formats gracefully', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        // Invalid versions should return 0
        const result1 = compareVersions('invalid', '1.0.0', 'apk');
        const result2 = compareVersions('1.0.0', 'completely-invalid', 'apk');
        const result3 = compareVersions('not-a-version', 'also-not-a-version', 'apk');

        expect(result1).toBe(0);
        expect(result2).toBe(0);
        expect(result3).toBe(0);
        expect(consoleWarnSpy).toHaveBeenCalled();

        consoleWarnSpy.mockRestore();
      });
    });

    describe('unsupported package manager', () => {
      it('should throw an error for unsupported package managers', () => {
        // These should throw errors
        expect(() => compareVersions('1.0.0', '1.0.1', 'npm')).toThrow(/Unsupported package manager/);
        expect(() => compareVersions('1.0.0', '1.0.1', 'yum')).toThrow(/Unsupported package manager/);
        expect(() => compareVersions('1.0.0', '1.0.1', '')).toThrow(/Unsupported package manager/);
      });
    });
  });

  describe('getLatestVersion', () => {
    it('should return version for existing package', () => {
      const packageVersions = new Map([
        ['package-a', '1.0.0'],
        ['package-b', '2.0.0'],
      ]);

      const result = getLatestVersion('package-a', packageVersions);

      expect(result).toBe('1.0.0');
    });

    it('should return null for non-existing package', () => {
      const packageVersions = new Map([
        ['package-a', '1.0.0'],
      ]);

      const result = getLatestVersion('package-b', packageVersions);

      expect(result).toBeNull();
    });

    it('should return null for empty map', () => {
      const packageVersions = new Map();

      const result = getLatestVersion('package-a', packageVersions);

      expect(result).toBeNull();
    });
  });

  describe('findLatestPackageVersions', () => {
    it('should fetch and parse package versions successfully', async () => {
      const mockPackageContent = `Package: mongodb-org
Version: 8.0.0
Architecture: amd64
Description: MongoDB database

Package: mongodb-org-database
Version: 8.0.1
Architecture: amd64
Description: MongoDB database files

Package: unrelated-package
Version: 1.0.0
Architecture: amd64
Description: Not needed`;

      // Mock the response as gzipped content
      const gzippedContent = zlib.gzipSync(Buffer.from(mockPackageContent));
      fetch.mockResponseOnce(gzippedContent);

      const packageIndexUrls = ['https://example.com/Packages.gz'];
      const requiredPackages = new Set(['mongodb-org', 'mongodb-org-database']);

      const result = await findLatestPackageVersions(packageIndexUrls, requiredPackages, 'apt');

      expect(result.get('mongodb-org')).toBe('8.0.0');
      expect(result.get('mongodb-org-database')).toBe('8.0.1');
      expect(result.has('unrelated-package')).toBe(false);
    });

    it('should handle HTTP errors gracefully', async () => {
      fetch.mockRejectOnce(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const packageIndexUrls = ['https://example.com/Packages.gz'];
      const requiredPackages = new Set(['mongodb-org']);

      const result = await findLatestPackageVersions(packageIndexUrls, requiredPackages, 'apt');

      expect(result.size).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch package index https://example.com/Packages.gz: Network error',
      );

      consoleSpy.mockRestore();
    });

    it('should handle 404 responses gracefully', async () => {
      fetch.mockResponseOnce('', { status: 404, statusText: 'Not Found' });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const packageIndexUrls = ['https://example.com/Packages.gz'];
      const requiredPackages = new Set(['mongodb-org']);

      const result = await findLatestPackageVersions(packageIndexUrls, requiredPackages, 'apt');

      expect(result.size).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch https://example.com/Packages.gz: 404 Not Found',
      );

      consoleSpy.mockRestore();
    });

    it('should stop early when all packages are found', async () => {
      const mockPackageContent = `Package: mongodb-org
Version: 8.0.0
Architecture: amd64
Description: MongoDB database

Package: mongodb-org-database
Version: 8.0.1
Architecture: amd64
Description: MongoDB database files`;

      // Mock the response as gzipped content
      const gzippedContent = zlib.gzipSync(Buffer.from(mockPackageContent));
      fetch.mockResponseOnce(gzippedContent);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const packageIndexUrls = ['https://example.com/Packages.gz'];
      const requiredPackages = new Set(['mongodb-org', 'mongodb-org-database']);

      const result = await findLatestPackageVersions(packageIndexUrls, requiredPackages, 'apt');

      expect(result.size).toBe(2);
      expect(consoleSpy).toHaveBeenCalledWith('Found all required packages, stopping early');

      consoleSpy.mockRestore();
    });

    it('should process all packages without early exit when not all found', async () => {
      const mockPackageContent = `Package: test-package
Version: 1.0.0
Architecture: amd64

Package: test-package
Version: 2.0.0
Architecture: amd64

Package: unrelated-package
Version: 1.0.0
Architecture: amd64`;

      // Mock the response as gzipped content
      const gzippedContent = zlib.gzipSync(Buffer.from(mockPackageContent));
      fetch.mockResponseOnce(gzippedContent);

      const packageIndexUrls = ['https://example.com/Packages.gz'];
      const requiredPackages = new Set(['test-package', 'missing-package']);

      const result = await findLatestPackageVersions(packageIndexUrls, requiredPackages, 'apt');

      expect(result.get('test-package')).toBe('2.0.0');
      expect(result.has('missing-package')).toBe(false);
    });
  });

  describe('processPackageUpdates', () => {
    it('should update packages when newer versions are available', () => {
      const currentPackages = {
        'mongodb-org': '7.0.0',
        'mongodb-org-database': '7.0.0',
      };

      const latestVersions = new Map([
        ['mongodb-org', '8.0.0'],
        ['mongodb-org-database', '8.0.1'],
      ]);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = processPackageUpdates(currentPackages, latestVersions);

      expect(result.updatedPackages).toEqual({
        'mongodb-org': '8.0.0',
        'mongodb-org-database': '8.0.1',
      });
      expect(result.updatedPackageNames).toEqual(['mongodb-org', 'mongodb-org-database']);

      consoleSpy.mockRestore();
    });

    it('should keep packages when they are already up to date', () => {
      const currentPackages = {
        'mongodb-org': '8.0.0',
        'mongodb-org-database': '8.0.1',
      };

      const latestVersions = new Map([
        ['mongodb-org', '8.0.0'],
        ['mongodb-org-database', '8.0.1'],
      ]);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = processPackageUpdates(currentPackages, latestVersions);

      expect(result.updatedPackages).toEqual({
        'mongodb-org': '8.0.0',
        'mongodb-org-database': '8.0.1',
      });
      expect(result.updatedPackageNames).toEqual([]);

      consoleSpy.mockRestore();
    });

    it('should handle missing packages gracefully', () => {
      const currentPackages = {
        'mongodb-org': '8.0.0',
        'missing-package': '1.0.0',
      };

      const latestVersions = new Map([
        ['mongodb-org', '8.0.1'],
      ]);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const result = processPackageUpdates(currentPackages, latestVersions);

      expect(result.updatedPackages).toEqual({
        'mongodb-org': '8.0.1',
        'missing-package': '1.0.0',
      });
      expect(result.updatedPackageNames).toEqual(['mongodb-org']);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Could not find package missing-package, keeping current version');

      consoleSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('should handle empty package lists', () => {
      const result = processPackageUpdates({}, new Map());

      expect(result.updatedPackages).toEqual({});
      expect(result.updatedPackageNames).toEqual([]);
    });

    it('should mix updated and unchanged packages correctly', () => {
      const currentPackages = {
        'package-a': '1.0.0',
        'package-b': '2.0.0',
        'package-c': '3.0.0',
      };

      const latestVersions = new Map([
        ['package-a', '1.1.0'], // Update available
        ['package-b', '2.0.0'], // Already up to date
        ['package-c', '3.0.0'], // Already up to date
      ]);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = processPackageUpdates(currentPackages, latestVersions);

      expect(result.updatedPackages).toEqual({
        'package-a': '1.1.0',
        'package-b': '2.0.0',
        'package-c': '3.0.0',
      });
      expect(result.updatedPackageNames).toEqual(['package-a']);

      consoleSpy.mockRestore();
    });
  });

  describe('loadAndValidateConfig', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should throw error if file does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      expect(() => {
        loadAndValidateConfig('/path/to/nonexistent.yml', 'config-key');
      }).toThrow('File not found: /path/to/nonexistent.yml');
    });

    it('should throw error if config is null after parsing', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue('');
      jest.spyOn(yaml, 'load').mockReturnValue(null);

      expect(() => {
        loadAndValidateConfig('/path/to/empty.yml', 'empty-key');
      }).toThrow('Invalid YAML format. Could not parse configuration.');
    });

    it('should throw error if config is undefined after parsing', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue('invalid yaml content');
      jest.spyOn(yaml, 'load').mockReturnValue(undefined);

      expect(() => {
        loadAndValidateConfig('/path/to/invalid.yml', 'config-key');
      }).toThrow('Invalid YAML format. Could not parse configuration.');
    });

    it('should throw error if config is not an object', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue('simple string');
      jest.spyOn(yaml, 'load').mockReturnValue('not an object');

      expect(() => {
        loadAndValidateConfig('/path/to/string.yml', 'config-key');
      }).toThrow('Invalid YAML format. Could not parse configuration.');
    });

    it('should throw error if top-level key is missing', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue('yaml content');
      jest.spyOn(yaml, 'load').mockReturnValue({
        distribution: 'noble/mongodb-org/8.0',
        arch: 'amd64',
        components: ['multiverse'],
        packages: { 'mongodb-org': '7.0.0' },
      });

      expect(() => {
        loadAndValidateConfig('/path/to/missing-key.yml', 'missing-key');
      }).toThrow('Invalid YAML format. Expected missing-key field to be an object.');
    });

    it('should throw error if top-level key is not an object', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue('yaml content');
      jest.spyOn(yaml, 'load').mockReturnValue({
        not_object: 'this is a string',
        distribution: 'noble/mongodb-org/8.0',
        arch: 'amd64',
        components: ['multiverse'],
        packages: { 'mongodb-org': '7.0.0' },
      });

      expect(() => {
        loadAndValidateConfig('/path/to/not_object.yml', 'not_object');
      }).toThrow('Invalid YAML format. Expected not_object field to be an object.');
    });

    describe('apt object validation_error', () => {
      const errorMessage = 'Invalid YAML format. Expected repository, distribution, arch, components, and '
        + 'packages fields under apt key.';

      it('should throw error if repository field is missing', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('yaml content');
        jest.spyOn(yaml, 'load').mockReturnValue({
          'no-repo': {
            apt: {
              distribution: 'noble/mongodb-org/8.0',
              arch: 'amd64',
              components: ['multiverse'],
              packages: { 'mongodb-org': '7.0.0' },
            },
          },
        });

        expect(() => {
          loadAndValidateConfig('/path/to/no-repo.yml', 'no-repo', 'apt');
        }).toThrow(errorMessage);
      });

      it('should throw error if distribution field is missing', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('yaml content');
        jest.spyOn(yaml, 'load').mockReturnValue({
          'no-dist': {
            apt: {
              repository: 'https://repo.mongodb.org/apt/ubuntu',
              arch: 'amd64',
              components: ['multiverse'],
              packages: { 'mongodb-org': '7.0.0' },
            },
          },
        });

        expect(() => {
          loadAndValidateConfig('/path/to/no-dist.yml', 'no-dist', 'apt');
        }).toThrow(errorMessage);
      });

      it('should throw error if arch field is missing', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('yaml content');
        jest.spyOn(yaml, 'load').mockReturnValue({
          'no-arch': {
            apt: {
              repository: 'https://repo.mongodb.org/apt/ubuntu',
              distribution: 'noble/mongodb-org/8.0',
              components: ['multiverse'],
              packages: { 'mongodb-org': '7.0.0' },
            },
          },
        });

        expect(() => {
          loadAndValidateConfig('/path/to/no-arch.yml', 'no-arch', 'apt');
        }).toThrow(errorMessage);
      });

      it('should throw error if components field is missing', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('yaml content');
        jest.spyOn(yaml, 'load').mockReturnValue({
          'no-components': {
            apt: {
              repository: 'https://repo.mongodb.org/apt/ubuntu',
              distribution: 'noble/mongodb-org/8.0',
              arch: 'amd64',
              packages: { 'mongodb-org': '7.0.0' },
            },
          },
        });

        expect(() => {
          loadAndValidateConfig('/path/to/no-components.yml', 'no-components', 'apt');
        }).toThrow(errorMessage);
      });

      it('should throw error if packages field is missing', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('yaml content');
        jest.spyOn(yaml, 'load').mockReturnValue({
          'no-packages': {
            apt: {
              repository: 'https://repo.mongodb.org/apt/ubuntu',
              distribution: 'noble/mongodb-org/8.0',
              arch: 'amd64',
              components: ['multiverse'],
            },
          },
        });

        expect(() => {
          loadAndValidateConfig('/path/to/no-packages.yml', 'no-packages', 'apt');
        }).toThrow(errorMessage);
      });

      it('should throw error if repository field is empty string', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('yaml content');
        jest.spyOn(yaml, 'load').mockReturnValue({
          'empty-repo': {
            apt: {
              repository: '',
              distribution: 'noble/mongodb-org/8.0',
              arch: 'amd64',
              components: ['multiverse'],
              packages: { 'mongodb-org': '7.0.0' },
            },
          },
        });

        expect(() => {
          loadAndValidateConfig('/path/to/empty-repo.yml', 'empty-repo', 'apt');
        }).toThrow(errorMessage);
      });
    });

    it('should throw error if apt key is missing', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue('yaml content');
      jest.spyOn(yaml, 'load').mockReturnValue({
        'missing-apt': {
          // apt key is missing
          repository: 'https://repo.mongodb.org/apt/ubuntu',
          distribution: 'noble/mongodb-org/8.0',
          arch: 'amd64',
          components: ['multiverse'],
          packages: { 'mongodb-org': '7.0.0' },
        },
      });

      expect(() => {
        loadAndValidateConfig('/path/to/missing-apt.yml', 'missing-apt', 'apt');
      }).toThrow('Invalid YAML format. Expected missing-apt.apt field to be an object.');
    });

    it('should throw error if apt key is not an object', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue('yaml content');
      jest.spyOn(yaml, 'load').mockReturnValue({
        'invalid-apt': {
          apt: 'not an object',
        },
      });

      expect(() => {
        loadAndValidateConfig('/path/to/invalid-apt.yml', 'invalid-apt', 'apt');
      }).toThrow('Invalid YAML format. Expected invalid-apt.apt field to be an object.');
    });

    it('should successfully validate and return valid config', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue('yaml content');
      const validConfig = {
        valid: {
          apt: {
            repository: 'https://repo.mongodb.org/apt/ubuntu',
            distribution: 'noble/mongodb-org/8.0',
            arch: 'amd64',
            components: ['multiverse'],
            packages: { 'mongodb-org': '7.0.0' },
          },
        },
      };
      jest.spyOn(yaml, 'load').mockReturnValue(validConfig);

      const result = loadAndValidateConfig('/path/to/valid.yml', 'valid', 'apt');

      expect(result).toEqual(validConfig.valid.apt);
    });
  });

  describe('updateYamlFile', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should write updated YAML content to file', () => {
      const existingYaml = {
        valid: {
          apt: {
            repository: 'https://repo.mongodb.org/apt/ubuntu',
            distribution: 'noble/mongodb-org/8.0',
            arch: 'amd64',
            components: ['multiverse'],
            packages: { 'mongodb-org': '7.0.0' },
          },
        },
        test: {
          apt: {
            repository: 'https://repo.mongodb.org/apt/ubuntu',
            distribution: 'noble/mongodb-org/8.0',
            arch: 'amd64',
            components: ['multiverse'],
            packages: { 'mongodb-org': '7.0.0' },
          },
        },
      };

      jest.spyOn(yaml, 'load').mockReturnValue(existingYaml);
      const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      jest.spyOn(yaml, 'dump').mockReturnValue(
        'repository: https://repo.mongodb.org/apt/ubuntu\npackages:\n  mongodb-org: 8.0.0\n',
      );

      const config = {
        repository: 'https://repo.mongodb.org/apt/ubuntu',
        distribution: 'noble/mongodb-org/8.0',
        arch: 'amd64',
        components: ['multiverse'],
        packages: {
          'mongodb-org': '8.0.0',
        },
      };

      updateYamlFile('/path/to/test.yml', config, 'test', 'apt');

      // The expected object has the updated packages
      const expectedWithPreservedKeys = {
        valid: {
          apt: {
            repository: 'https://repo.mongodb.org/apt/ubuntu',
            distribution: 'noble/mongodb-org/8.0',
            arch: 'amd64',
            components: ['multiverse'],
            packages: { 'mongodb-org': '7.0.0' },
          },
        },
        test: {
          apt: {
            repository: 'https://repo.mongodb.org/apt/ubuntu',
            distribution: 'noble/mongodb-org/8.0',
            arch: 'amd64',
            components: ['multiverse'],
            packages: { 'mongodb-org': '8.0.0' },
          },
        },
      };

      expect(yaml.dump).toHaveBeenCalledWith(expectedWithPreservedKeys, { lineWidth: -1 });
      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        '/path/to/test.yml',
        expect.stringContaining('mongodb-org: 8.0.0'),
      );
      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        '/path/to/test.yml',
        expect.stringContaining('repository: https://repo.mongodb.org/apt/ubuntu'),
      );
    });

    it('should handle configuration with multiple packages', () => {
      // Create a YAML with the proper structure
      const existingYaml = {
        multi: {
          apt: {
            repository: 'https://repo.mongodb.org/apt/ubuntu',
            distribution: 'noble/mongodb-org/8.0',
            arch: 'amd64',
            components: ['multiverse', 'main'],
            packages: { 'mongodb-org': '7.0.0' },
          },
        },
      };

      jest.spyOn(fs, 'readFileSync').mockReturnValue('existing yaml content');
      jest.spyOn(yaml, 'load').mockReturnValue(existingYaml);
      const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      jest.spyOn(yaml, 'dump').mockReturnValue(`repository: https://repo.mongodb.org/apt/ubuntu
components:
  - multiverse
  - main
packages:
  mongodb-org: 8.0.0
  mongodb-org-database: 8.0.1
  mongodb-org-server: 8.0.2
`);

      const config = {
        repository: 'https://repo.mongodb.org/apt/ubuntu',
        distribution: 'noble/mongodb-org/8.0',
        arch: 'amd64',
        components: ['multiverse', 'main'],
        packages: {
          'mongodb-org': '8.0.0',
          'mongodb-org-database': '8.0.1',
          'mongodb-org-server': '8.0.2',
        },
      };

      updateYamlFile('/path/to/multi.yml', config, 'multi', 'apt');

      const writtenContent = writeFileSyncSpy.mock.calls[0][1];
      expect(writtenContent).toContain('mongodb-org: 8.0.0');
      expect(writtenContent).toContain('mongodb-org-database: 8.0.1');
      expect(writtenContent).toContain('mongodb-org-server: 8.0.2');
      expect(writtenContent).toContain('- multiverse');
      expect(writtenContent).toContain('- main');
    });

    it('should handle empty packages object', () => {
      // Create a YAML with the proper structure
      const existingYaml = {
        empty: {
          apt: {
            repository: 'https://repo.mongodb.org/apt/ubuntu',
            distribution: 'noble/mongodb-org/8.0',
            arch: 'amd64',
            components: ['multiverse'],
            packages: { 'some-package': '1.0.0' },
          },
        },
      };

      jest.spyOn(fs, 'readFileSync').mockReturnValue('existing yaml content');
      jest.spyOn(yaml, 'load').mockReturnValue(existingYaml);
      const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      jest.spyOn(yaml, 'dump').mockReturnValue(
        'repository: https://repo.mongodb.org/apt/ubuntu\npackages: {}\n',
      );

      const config = {
        repository: 'https://repo.mongodb.org/apt/ubuntu',
        distribution: 'noble/mongodb-org/8.0',
        arch: 'amd64',
        components: ['multiverse'],
        packages: {},
      };

      updateYamlFile('/path/to/empty.yml', config, 'empty', 'apt');

      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        '/path/to/empty.yml',
        expect.stringContaining('packages: {}'),
      );
    });

    it('should preserve YAML structure and formatting', () => {
      // Create a YAML with the proper structure
      const existingYaml = {
        formatted: {
          apt: {
            repository: 'https://repo.mongodb.org/apt/ubuntu',
            distribution: 'noble/mongodb-org/8.0',
            arch: 'amd64',
            components: ['multiverse'],
            packages: { 'some-package': '1.0.0' },
          },
        },
      };

      jest.spyOn(fs, 'readFileSync').mockReturnValue('existing yaml content');
      jest.spyOn(yaml, 'load').mockReturnValue(existingYaml);
      const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      jest.spyOn(yaml, 'dump').mockReturnValue(`repository: https://repo.mongodb.org/apt/ubuntu
arch: amd64
components:
  - multiverse
packages:
  package-with-dashes: 1.0.0
  package_with_underscores: 2.0.0
`);

      const config = {
        repository: 'https://repo.mongodb.org/apt/ubuntu',
        distribution: 'noble/mongodb-org/8.0',
        arch: 'amd64',
        components: ['multiverse'],
        packages: {
          'package-with-dashes': '1.0.0',
          package_with_underscores: '2.0.0',
        },
      };

      updateYamlFile('/path/to/formatted.yml', config, 'formatted', 'apt');

      const writtenContent = writeFileSyncSpy.mock.calls[0][1];
      // Verify the YAML structure looks correct
      expect(writtenContent).toMatch(/repository:\s*https:\/\/repo\.mongodb\.org\/apt\/ubuntu/);
      expect(writtenContent).toMatch(/arch:\s*amd64/);
      expect(writtenContent).toMatch(/components:\s*\n\s*-\s*multiverse/);
    });

    it('should preserve existing YAML structure and only update packages', () => {
      const existingYaml = {
        otherTopKey: {
          someValue: 'should remain untouched',
        },
        formatted: {
          apt: {
            repository: 'https://repo.mongodb.org/apt/ubuntu',
            distribution: 'noble/mongodb-org/8.0',
            arch: 'amd64',
            components: ['multiverse'],
            packages: {
              'package-a': '1.0.0',
              'package-b': '2.0.0',
            },
            extraAptProperty: 'should be preserved',
          },
          otherProperty: 'should be preserved',
        },
      };

      jest.spyOn(yaml, 'load').mockReturnValue(existingYaml);
      const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

      // Mock yaml.dump to return a predictable value we can test against
      jest.spyOn(yaml, 'dump').mockImplementation((obj) => JSON.stringify(obj));

      const config = {
        repository: 'https://repo.mongodb.org/apt/ubuntu',
        distribution: 'noble/mongodb-org/8.0',
        arch: 'amd64',
        components: ['multiverse'],
        packages: {
          'package-a': '1.5.0', // Updated version
          'package-b': '2.0.0', // Same version
        },
      };

      updateYamlFile('/path/to/config.yml', config, 'formatted', 'apt');

      // Verify that yaml.dump was called with the expected object structure
      const expectedConfig = {
        otherTopKey: {
          someValue: 'should remain untouched',
        },
        formatted: {
          apt: {
            repository: 'https://repo.mongodb.org/apt/ubuntu',
            distribution: 'noble/mongodb-org/8.0',
            arch: 'amd64',
            components: ['multiverse'],
            packages: {
              'package-a': '1.5.0', // Only packages are updated
              'package-b': '2.0.0',
            },
            extraAptProperty: 'should be preserved',
          },
          otherProperty: 'should be preserved',
        },
      };

      expect(yaml.dump).toHaveBeenCalledWith(expectedConfig, { lineWidth: -1 });
      expect(writeFileSyncSpy).toHaveBeenCalledWith('/path/to/config.yml', expect.any(String));
    });

    it('should handle missing topKey or apt sections', () => {
      // This test originally checked if the function created missing structure
      // Now we'll verify it throws an error when the structure is missing
      const existingYaml = {
        otherTopKey: {
          someValue: 'should remain untouched',
        },
        // 'newKey' doesn't exist in the original YAML
      };

      jest.spyOn(fs, 'readFileSync').mockReturnValue('existing yaml content');
      jest.spyOn(yaml, 'load').mockReturnValue(existingYaml);

      const config = {
        repository: 'https://repo.mongodb.org/apt/ubuntu',
        distribution: 'noble/mongodb-org/8.0',
        arch: 'amd64',
        components: ['multiverse'],
        packages: {
          'package-a': '1.0.0',
        },
      };

      expect(() => {
        updateYamlFile('/path/to/config.yml', config, 'newKey');
      }).toThrow();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle typical MongoDB package scenario', () => {
      const mockPackageContent = `Package: mongodb-org
Version: 8.0.0
Architecture: amd64
Description: MongoDB database

Package: mongodb-org-database
Version: 8.0.1
Architecture: amd64
Description: MongoDB database files

Package: unrelated-package
Version: 1.0.0
Architecture: amd64
Description: Not needed`;

      const requiredPackages = new Set(['mongodb-org', 'mongodb-org-database']);

      // Test the package parsing logic
      const packages = mockPackageContent.split('\n\n');
      const results = new Map();

      for (const pkg of packages) {
        const { name, version } = parsePackageEntry(pkg, 'apt');
        if (name && version && requiredPackages.has(name)) {
          results.set(name, version);
        }
      }

      expect(results.get('mongodb-org')).toBe('8.0.0');
      expect(results.get('mongodb-org-database')).toBe('8.0.1');
      expect(results.has('unrelated-package')).toBe(false);
    });
  });
});
