# Dockerode Utils

## API

### `pullImageAsync(dockerode: Dockerode, imageName: string, onProgress?: (output: string) => void)`

Will pull docker image, you can wait for finish or track a progress. Don't forget
to add `:tag` to image, otherwise it'll download unnecessary images.

```javascript
/**
 * Example how to pull alpine:latest image from dockerhub
 */
import * as Dockerode from 'dockerode';
import { pullImageAsync } from 'dockerode-utils';

const dockerode = new Dockerode();
await pullImageAsync(dockerode, 'alpine:latest');
```

### `execCommand(container: Dockerode.Container, cmd: string[]): string[]`

Execute shell command in container and returns output as `string[]`.

```javascript
/**
 * Print list of env from docker container
 */
import * as Dockerode from 'dockerode';
import { execCommand } from 'dockerode-utils';

// first, we need to create a container
const dockerode = new Dockerode();
const alpineContainer = await dockerode.run('alpine', [], {}, null);

const envList = execCommand(alpineContainer, ['env']);
console.log(envList);

// command with argument
const envList2 = execCommand(alpineContainer, ['env', '--help]);
console.log(envList2);
```

### `waitForOutput(container: Dockerode.Container, predicate: (output: string) => boolean, timeout: number = 15000)`

Wait for specific output from container. Useful, when you're working
with container, in which is running daemon and you have to wait for specific output/line to appears in container.

```javascript
/**
 * Example with waiting for specific output
 */
```
