"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Dockerode = require("dockerode");
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
                throw pullError;
            }
            dockerode.modem.followProgress(stream, function (error, output) {
                // onFinished
                if (error) {
                    throw error;
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
(function () { return __awaiter(_this, void 0, void 0, function () {
    var dockerode, container, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dockerode = new Dockerode();
                container = dockerode.getContainer("212f27b48b4b");
                return [4 /*yield*/, exports.containerExec(container, ["wp", "theme", "list"])];
            case 1:
                result = _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
