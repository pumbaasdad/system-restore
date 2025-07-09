const apkCompare = require('compare-versions');
const core = require('@actions/core');
const debVersionCompare = require('deb-version-compare');
const fs = require('fs');
const yaml = require('js-yaml');
const zlib = require('zlib');

/**
 * Builds URLs for package index files
 * @param {string} packageManager - Package manager type ('apt' or 'apk')
 * @param {string} repository - Repository URL
 * @param {string} distribution - Distribution path
 * @param {string} arch - Target architecture
 * @param {string[]} components - List of repository components
 * @returns {string[]} Array of package index URLs
 */
function fetchPackageList(packageManager, repository, distribution, arch, components) {
  const consideredComponents = components.length === 0 ? [''] : components;

  if (packageManager === 'apt') {
    return consideredComponents.map((component) => {
      const packagesPath = `${component}/binary-${arch}/Packages.gz`;
      return `${repository}/dists/${distribution}/${packagesPath}`;
    });
  } if (packageManager === 'apk') {
    return consideredComponents.map(
      (component) => `${repository}/${distribution}/${component}/${arch}/APKINDEX.tar.gz`,
    );
  }
  throw new Error(`Unsupported package manager: ${packageManager}`);
}

/**
 * Parses a single package entry from package index
 * @param {string} packageEntry - Raw package entry text
 * @param {string} packageManager - Package manager type ('apt' or 'apk')
 * @returns {{name: string|null, version: string|null}} Package name and version
 */
function parsePackageEntry(packageEntry, packageManager) {
  const lines = packageEntry.split('\n');
  let name = null;
  let version = null;

  let packagePrefix;
  let versionPrefix;

  // Set the prefixes based on package manager
  if (packageManager === 'apt') {
    packagePrefix = 'Package: ';
    versionPrefix = 'Version: ';
  } else if (packageManager === 'apk') {
    packagePrefix = 'P:';
    versionPrefix = 'V:';
  } else {
    throw new Error(`Unsupported package manager: ${packageManager}`);
  }

  // Common parsing logic
  lines.forEach((line) => {
    if (line.startsWith(packagePrefix)) {
      name = line.substring(packagePrefix.length).trim();
    } else if (line.startsWith(versionPrefix)) {
      version = line.substring(versionPrefix.length).trim();
    }
  });

  return { name, version };
}

/**
 * Compares two package versions
 * @param {string} a - First version
 * @param {string} b - Second version
 * @param {string} packageManager - Package manager type ('apt' or 'apk')
 * @returns {number} -1 if a < b, 0 if a == b, 1 if a > b
 * @throws {Error} If an unsupported package manager is specified
 */
function compareVersions(a, b, packageManager = 'apt') {
  if (packageManager !== 'apt' && packageManager !== 'apk') {
    throw new Error(`Unsupported package manager: ${packageManager}`);
  }

  try {
    if (packageManager === 'apt') {
      return debVersionCompare(a, b);
    }

    // packageManager === 'apk'
    return apkCompare.compareVersions(a, b);
  } catch (error) {
    console.warn(`Failed to compare versions ${a} and ${b} with ${packageManager}: ${error.message}`);
    return 0;
  }
}

/**
 * Finds latest versions of required packages from repository indexes
 * @param {string[]} packageIndexUrls - URLs of package index files
 * @param {Set<string>} requiredPackages - Set of package names to find
 * @param {string} packageManager - Package manager type ('apt' or 'apk')
 * @returns {Promise<Map<string, string>>} Map of package names to latest versions
 */
async function findLatestPackageVersions(packageIndexUrls, requiredPackages, packageManager) {
  const packageVersions = new Map();

  const fetchPromises = packageIndexUrls.map(async (indexUrl) => {
    try {
      console.log(`Fetching package index: ${indexUrl}`);
      const response = await fetch(indexUrl);
      if (!response.ok) {
        console.warn(`Failed to fetch ${indexUrl}: ${response.status} ${response.statusText}`);
        return null;
      }

      // Get the compressed content as a Buffer
      const compressedContent = await response.arrayBuffer();

      // Decompress the gzipped content
      const content = zlib.gunzipSync(compressedContent).toString('utf8');

      const packages = content.split('\n\n');
      const foundPackages = new Map();

      packages.forEach((pkg) => {
        const { name, version } = parsePackageEntry(pkg, packageManager);

        if (name && version && requiredPackages.has(name)) {
          if (!foundPackages.has(name)
              || compareVersions(version, foundPackages.get(name), packageManager) > 0) {
            foundPackages.set(name, version);
          }
        }
      });

      return foundPackages;
    } catch (error) {
      console.warn(`Failed to fetch package index ${indexUrl}: ${error.message}`);
      return null;
    }
  });

  const results = await Promise.allSettled(fetchPromises);

  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      result.value.forEach((version, name) => {
        if (!packageVersions.has(name)
            || compareVersions(version, packageVersions.get(name), packageManager) > 0) {
          packageVersions.set(name, version);
        }
      });
    }
  });

  if (packageVersions.size === requiredPackages.size) {
    console.log('Found all required packages, stopping early');
  }

  return packageVersions;
}

/**
 * Gets the latest version for a package name
 * @param {string} packageName - Name of the package
 * @param {Map<string, string>} packageVersions - Map of package names to versions
 * @returns {string|null} Latest version or null if not found
 */
function getLatestVersion(packageName, packageVersions) {
  return packageVersions.get(packageName) || null;
}

/**
 * Processes package updates and returns updated packages and list of changed packages
 * @param {Object} currentPackages - Current package name to version mapping
 * @param {Map<string, string>} latestVersions - Map of package names to latest versions
 * @returns {{updatedPackages: Object, updatedPackageNames: string[]}} Updated packages and changed package names
 */
function processPackageUpdates(currentPackages, latestVersions) {
  const updatedPackages = {};
  const updatedPackageNames = [];

  Object.entries(currentPackages).forEach(([packageName, currentVersion]) => {
    console.log(`Checking ${packageName} (current: ${currentVersion})`);

    const latestVersion = getLatestVersion(packageName, latestVersions);

    if (latestVersion) {
      updatedPackages[packageName] = latestVersion;
      if (latestVersion !== currentVersion) {
        console.log(`Updated ${packageName}: ${currentVersion} -> ${latestVersion}`);
        updatedPackageNames.push(packageName);
      } else {
        console.log(`${packageName} is up to date`);
      }
    } else {
      console.warn(`Could not find package ${packageName}, keeping current version`);
      updatedPackages[packageName] = currentVersion;
    }
  });

  return { updatedPackages, updatedPackageNames };
}

/**
 * Reads and validates a YAML configuration file
 * @param {string} filePath - Path to the YAML file
 * @param {string} topKey - Name of the top-level key in the YAML file
 * @param {string} packageManager - Name of the package manager
 * @returns {Object} Parsed and validated configuration object
 * @throws {Error} If file doesn't exist or has invalid format
 */
function loadAndValidateConfig(filePath, topKey, packageManager) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const config = yaml.load(fileContent);

  if (!config || typeof config !== 'object') {
    throw new Error('Invalid YAML format. Could not parse configuration.');
  }

  if (!config[topKey] || typeof config[topKey] !== 'object') {
    throw new Error(`Invalid YAML format. Expected ${topKey} field to be an object.`);
  }

  if (!config[topKey][packageManager] || typeof config[topKey][packageManager] !== 'object') {
    throw new Error(`Invalid YAML format. Expected ${topKey}.${packageManager} field to be an object.`);
  }

  const repoConfig = config[topKey][packageManager];

  if (!repoConfig.repository || !repoConfig.distribution || !repoConfig.arch || !repoConfig.components
      || !repoConfig.packages || !Array.isArray(repoConfig.components)) {
    throw new Error(
      'Invalid YAML format. '
        + `Expected repository, distribution, arch, components, and packages fields under ${packageManager} key.`,
    );
  }

  return repoConfig;
}

/**
 * Updates YAML file with new package versions
 * @param {string} filePath - Path to the YAML file
 * @param {Object} config - Configuration object with updated packages
 * @param {string} topKey - Name of the top-level key in the YAML file
 * @param {string} packageManager - Name of the package manager
 * @returns {void}
 */
function updateYamlFile(filePath, config, topKey, packageManager) {
  // Read the existing YAML file
  const existingContent = fs.readFileSync(filePath, 'utf8');
  const existingConfig = yaml.load(existingContent) || {};

  // Deep clone to avoid modifying the original object
  const updatedConfig = JSON.parse(JSON.stringify(existingConfig));

  // Only update the packages property
  updatedConfig[topKey][packageManager].packages = config.packages;

  // Write the updated YAML back to the file
  const updatedYaml = yaml.dump(updatedConfig, { lineWidth: -1 });
  fs.writeFileSync(filePath, updatedYaml);
}

async function main() {
  try {
    const filePath = core.getInput('file');
    const topKey = core.getInput('key');
    const packageManager = core.getInput('package-manager');
    const config = loadAndValidateConfig(filePath, topKey, packageManager);

    console.log(`Updating packages from ${config.repository} for ${config.arch}`);

    const packageIndexUrls = fetchPackageList(
      packageManager,
      config.repository,
      config.distribution,
      config.arch,
      config.components,
    );

    const requiredPackages = new Set(Object.keys(config.packages));
    const packageVersions = await findLatestPackageVersions(packageIndexUrls, requiredPackages, packageManager);

    const { updatedPackages, updatedPackageNames } = processPackageUpdates(config.packages, packageVersions);

    config.packages = updatedPackages;

    updateYamlFile(filePath, config, topKey, packageManager);

    console.log(updatedPackageNames)
    console.log('!!!')
    console.log(JSON.stringify(updatedPackageNames))

    core.setOutput('updated', updatedPackageNames.length > 0 ? 'true' : 'false');
    core.setOutput('updated-packages', JSON.stringify(updatedPackageNames));

    console.log(`Updated ${filePath} successfully`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

// Export functions for testing
module.exports = {
  fetchPackageList,
  parsePackageEntry,
  findLatestPackageVersions,
  getLatestVersion,
  compareVersions,
  processPackageUpdates,
  loadAndValidateConfig,
  updateYamlFile,
  main,
};

// Only run main if this file is executed directly
if (require.main === module) {
  main();
}
