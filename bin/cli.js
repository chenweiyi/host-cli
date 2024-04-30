#!/usr/bin/env node
import process from 'node:process';
import { exec } from 'node:child_process';
import { chmodSync } from 'node:fs';
// @ts-expect-error no type
import minimist from 'minimist';
// @ts-expect-error no type
import _Hosts from 'hosts-so-easy';
const Hosts = _Hosts.default || _Hosts;
function getPathOfSystemHostsPath() {
    return process.platform === 'win32'
        ? `${process.env.windir || 'C:\\WINDOWS'}\\system32\\drivers\\etc\\hosts`
        : '/etc/hosts';
}
const hostInstance = new Hosts({
    debounceTime: 50,
    hostsFile: getPathOfSystemHostsPath(),
});
const castArray = (val) => {
    if (Array.isArray(val))
        return val;
    return [val];
};
export default function main() {
    const argv = minimist(process.argv.slice(2));
    const key = argv._;
    if (key.length === 0 || argv.help) {
        console.log('hello');
        return;
    }
    if (key.includes('add')) {
        addHost(castArray(argv.ip)[0], castArray(argv.host)[0]);
    }
    else if (key.includes('rm')) {
        removeHost(castArray(argv.ip)[0], castArray(argv.host)[0]);
    }
}
export async function addHost(ip, host) {
    if (process.platform !== 'win32')
        chmodSync(getPathOfSystemHostsPath(), 0o777);
    hostInstance.add('127.0.0.1', 'localhost');
    hostInstance.add(ip, host);
    if (ip === 'localhost')
        hostInstance.add('127.0.0.1', host);
    await hostInstance.updateFinish();
    return await syncHost();
}
export async function removeHost(ip, host) {
    if (process.platform !== 'win32')
        chmodSync(getPathOfSystemHostsPath(), 0o777);
    console.log(ip, host);
    hostInstance.remove(ip, host);
    if (ip === 'localhost')
        hostInstance.remove('127.0.0.1', host);
    await hostInstance.updateFinish();
    return await syncHost();
}
async function syncHost() {
    return new Promise((resolve, reject) => {
        exec(process.platform === 'win32'
            ? 'ipconfig /flushdns'
            : 'sudo -E killall -HUP mDNSResponder', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return resolve(false);
            }
            return resolve(true);
        });
    });
}
main();
