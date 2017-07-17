"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_decoder_1 = require("string_decoder");
/**
 * Pull docker image and wait for it if you need
 * @param dockerode - dockerode
 * @param imageName - name of image to pull
 * @param onProgress - on progress hook
 * @returns output
 */
exports.pullImageAsync = (dockerode, imageName, onProgress) => {
    return new Promise((resolve, reject) => {
        dockerode.pull(imageName, (pullError, stream) => {
            if (pullError) {
                reject(pullError);
            }
            dockerode.modem.followProgress(stream, (error, output) => {
                // onFinished
                if (error) {
                    reject(error);
                }
                resolve(output);
            }, onProgress);
        });
    });
};
/**
 * Execute command inside a container and get output from it, if you need
 * @param container - dockerode.container
 * @param cmd - command to execute
 * @returns result
 */
exports.containerExec = (container, cmd) => {
    // TODO: add detach (don't use stream nor wait for output) options. Useful for daemons
    return new Promise((resolve, error) => {
        container.exec({ Cmd: cmd, AttachStdout: true, AttachStderr: true }, (cErr, exec) => {
            if (cErr) {
                error(cErr);
            }
            exec.start({ hijack: true }, (sErr, stream) => {
                const output = [];
                const decoder = new string_decoder_1.StringDecoder("utf8");
                if (sErr) {
                    error(sErr);
                }
                stream.on("data", (chunk) => {
                    if (chunk) {
                        output.push(decoder.write(chunk));
                    }
                });
                stream.on("end", () => {
                    resolve(output);
                });
            });
        });
    });
};
/**
 * Will wait until container produces specific stdout(console) log.
 * @desc If you're creating and then starting a container, sometimes, you need to wait until a service
 * is fully functional (eg. you can get response from container's exposed port) so you can continue executing code
 * @param container - container
 * @param timeout - how much time (in ms) to wait until it'll throw a error
 */
exports.waitForOutput = (container, predicate, timeout = 30000) => {
    return new Promise((resolve, reject) => {
        const currTimeout = setTimeout(() => {
            reject(`waiting for container excited timeout ${timeout} (default 10s)`);
        }, timeout);
        container.attach({ stream: true, stdout: true, stderr: true }, (err, res) => {
            if (err) {
                reject(err);
            }
            if (res) {
                res.on("readable", () => {
                    const line = res.read();
                    if (line && predicate(line.toString())) {
                        resolve();
                    }
                });
            }
            else {
                reject(`cannot attach 'readable' event on container's stream`);
            }
        });
    });
};
//# sourceMappingURL=Index.js.map