import { Buffer } from "buffer";
import * as Dockerode from "dockerode";
import { Stream } from "stream";
import { StringDecoder } from "string_decoder";

type OnProgress = (event: any) => void;

/**
 * Pull docker image asynchronously
 * @param dockerode - dockerode
 * @param imageName - name of image to pull
 * @param onProgress - on progress hook
 * @returns output
 */
export const pullImageAsync = (dockerode: Dockerode, imageName: string, onProgress?: OnProgress) => {
    return new Promise((resolve, rej) => {
        dockerode.pull(imageName, (pullError: any, stream: Stream) => {
            if (pullError) {
                rej(pullError);
            }
            dockerode.modem.followProgress(stream, (error: any, output: any) => {
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
export const containerExec = (container: Dockerode.Container, cmd: string[]) => {
    return new Promise((resolve, error) => {
        container.exec({ Cmd: cmd, AttachStdout: true, AttachStderr: true }, (cErr: any, exec: any) => {
            if (cErr) {
                error(cErr);
            }

            exec.start({ hijack: true }, (sErr: any, stream: Stream) => {
                const output: string[] = [];
                const decoder = new StringDecoder("utf8");
                if (sErr) {
                    error(sErr);
                }

                stream.on("data", (chunk: Buffer) => {
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

type WaitPredicate = (line: string) => boolean;

/**
 * Will wait until container produces specific stdout(console) log.
 * @desc If you're creating and then starting a container, sometimes, you need to wait until a service
 * is fully functional (eg. you can get response from container's exposed port) so you can continue executing code
 * @param container - container
 * @param timeout - how much time (in ms) to wait until it'll throw a error
 */
export const waitForOutput = (container: Dockerode.Container, predicate: WaitPredicate, timeout: number = 30000) => {
    return new Promise<boolean>((resolve, error) => {
        const currTimeout = setTimeout(() => {
            error(`waiting for container excited timeout ${timeout} (default 10s)`);
        }, timeout);
        container.attach({ stream: true, stdout: true, stderr: true }, (err, res) => {
            if (err) {
                error(err);
            }
            if (res) {
                res.on("readable", () => {
                    const line = res.read();
                    if (line && predicate(line.toString())) {
                        resolve();
                    }
                });
            } else {
                error(`cannot attach 'readable' event on container's stream`);
            }
        });
    });
};
