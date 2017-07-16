import * as Dockerode from "dockerode";

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
        dockerode.pull(imageName, (pullError: any, stream: any) => {
            if (pullError) {
                throw pullError;
            }
            dockerode.modem.followProgress(stream, (error: any, output: any) => {
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
 * Exec a command
 * @param container - dockerode.container
 * @param cmd - command to execute
 */
export const exec = (dockerode: Dockerode.Container, cmd: string[]) => {
    // execute a command
};
