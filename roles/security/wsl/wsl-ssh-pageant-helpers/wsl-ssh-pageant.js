const cp = require('child_process');
const cpp = require('child-process-promise');
const fs = require('fs');

async function ignoreAsyncErrors(promise)
{
    try {
        await promise;
    }
    catch {}
}

async function run()
{
    // Don't start wsl-ssh-pageant before the gpg-agent is running.  That makes things not work.  Ignore any errors so
    // we can still try to start the bridge, but, in all likelihood, we're in trouble
    const gpgConnectAgent = ignoreAsyncErrors(cpp.spawn("gpg-connect-agent", ["/bye"], {detached: true} ));

    // Don't attempt to start the bridge if there is still an old socket.
    const unlink = ignoreAsyncErrors(fs.promises.unlink("c:/Users/pumbaasdad/wsl/wsl-ssh-pageant/ssh-agent.sock"));

    await Promise.all([gpgConnectAgent, unlink]);

    cp.spawn(
        'C:/Users/pumbaasdad/wsl/bin/wsl-ssh-pageant-amd64.exe',
        ['--wsl', 'c:/Users/pumbaasdad/wsl/wsl-ssh-pageant/ssh-agent.sock', '--systray'],
        {detached: true});

    process.exit();
}

run();
