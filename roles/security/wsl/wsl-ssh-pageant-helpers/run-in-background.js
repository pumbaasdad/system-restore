const cp = require('child_process');

cp.spawn(
    'node',
    ['c:/Users/akowpak/wsl/wsl-ssh-pageant/wsl-ssh-pageant.js'],
    {detached: true});

process.exit();
