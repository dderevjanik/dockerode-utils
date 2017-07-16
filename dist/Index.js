"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_decoder_1 = require("string_decoder");
/**
 * Pull docker image asynchronously
 * @param dockerode - dockerode
 * @param imageName - name of image to pull
 * @param onProgress - on progress hook
 * @returns output
 */
exports.pullImageAsync = function (dockerode, imageName, onProgress) {
    return new Promise(function (resolve, rej) {
        dockerode.pull(imageName, function (pullError, stream) {
            if (pullError) {
                rej(pullError);
            }
            dockerode.modem.followProgress(stream, function (error, output) {
                // onFinished
                if (error) {
                    rej(error);
                }
                resolve(output);
            }, onProgress);
        });
    });
};
/**
 * Execute a command
 * @param container - dockerode.container
 * @param cmd - command to execute
 * @returns result
 */
exports.containerExec = function (container, cmd) {
    return new Promise(function (resolve, error) {
        container.exec({ Cmd: cmd, AttachStdout: true, AttachStderr: true }, function (cErr, exec) {
            if (cErr) {
                error(cErr);
            }
            exec.start({ hijack: true }, function (sErr, stream) {
                var output = [];
                var decoder = new string_decoder_1.StringDecoder("utf8");
                if (sErr) {
                    error(sErr);
                }
                stream.on("data", function (chunk) {
                    if (chunk) {
                        output.push(decoder.write(chunk));
                    }
                });
                stream.on("end", function () {
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
exports.waitForOutput = function (container, predicate, timeout) {
    if (timeout === void 0) { timeout = 30000; }
    return new Promise(function (resolve, error) {
        var currTimeout = setTimeout(function () {
            error("waiting for container excited timeout " + timeout + " (default 10s)");
        }, timeout);
        container.attach({ stream: true, stdout: true, stderr: true }, function (err, res) {
            if (err) {
                error(err);
            }
            if (res) {
                res.on("readable", function () {
                    var line = res.read();
                    if (line && predicate(line.toString())) {
                        resolve();
                    }
                });
            }
            else {
                error("cannot attach 'readable' event on container's stream");
            }
        });
    });
};
//# sourceMappingURL=Index.js.map