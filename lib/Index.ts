import { Buffer } from "buffer";
import * as Dockerode from "dockerode";
import { flatMap } from "lodash";
import { Stream } from "stream";
import { StringDecoder } from "string_decoder";

type OnProgress = (event: any) => void;

/**
 * Pull docker image and wait for it if you need
 * @param dockerode - dockerode
 * @param imageName - name of image to pull
 * @param onProgress - on progress hook
 * @returns Dockerode.Image
 */
export const pullImageAsync = (dockerode: Dockerode, imageName: string, onProgress?: OnProgress): Promise<Dockerode.Image> => {
    return new Promise(async (resolve, reject) => {
        const imageNameWithTag = (imageName.indexOf(":") > 0)
            ? imageName
            : `${imageName}:latest`;

        if (await imageExists(dockerode, imageNameWithTag)) {
            return dockerode.getImage(imageNameWithTag);
        }

        dockerode.pull(imageNameWithTag, (pullError: any, stream: Stream) => {

            if (pullError) {
                reject(pullError);
            }

            if (!stream) {
                throw new Error(`Image '${imageNameWithTag}' doesn't exists`);
            }

            dockerode.modem.followProgress(stream, (error: any, output: any) => {
                // onFinished
                if (error) {
                    reject(error);
                }

                resolve(dockerode.getImage(imageNameWithTag));
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
export const containerExec = (container: Dockerode.Container, cmd: string[]): Promise<string[]> => {
    // TODO: add detach (don't use stream nor wait for output) options. Useful for daemons
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
    return new Promise<boolean>((resolve, reject) => {
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
            } else {
                reject(`cannot attach 'readable' event on container's stream`);
            }
        });
    });
};

/**
 * Is docker image exists ?
 * @param dockerode
 * @param imageNames - names of images
 * @return true if image with imageName exists otherwise false
 */
export const imageExists = async (dockerode: Dockerode, imageNames: string | string[]) => {
    const imageNamesArr: string[] = (typeof imageNames === "string")
        ? [imageNames]
        : imageNames;
    const images = await dockerode.listImages({ filters: { reference: imageNamesArr } });
    return (images.length > 0);
};
