/// <reference types="dockerode" />
import * as Dockerode from "dockerode";
/**
 * Pull docker image asynchronously
 * @param dockerode - dockerode
 * @param imageName - name of image to pull
 * @param onProgress - on progress hook
 * @returns output
 */
export declare const pullImageAsync: (dockerode: Dockerode, imageName: string, onProgress?: ((event: any) => void) | undefined) => Promise<{}>;
/**
 * Execute a command
 * @param container - dockerode.container
 * @param cmd - command to execute
 * @returns result
 */
export declare const containerExec: (container: Dockerode.Container, cmd: string[]) => Promise<string[]>;
/**
 * Will wait until container produces specific stdout(console) log.
 * @desc If you're creating and then starting a container, sometimes, you need to wait until a service
 * is fully functional (eg. you can get response from container's exposed port) so you can continue executing code
 * @param container - container
 * @param timeout - how much time (in ms) to wait until it'll throw a error
 */
export declare const waitForOutput: (container: Dockerode.Container, predicate: (line: string) => boolean, timeout?: number) => Promise<boolean>;
