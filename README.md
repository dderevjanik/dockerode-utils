# Dockerode Utils

![travis-badge](https://travis-ci.org/dderevjanik/dockerode-utils.svg?branch=master)

Set of useful functions for working with [dockerode](https://github.com/apocas/dockerode).

## TOC

- [Installation](#installation)
- [API](#api)
    - [pullImageAsync](#pullimageasyncdockerode-imagename-onprogress) pull docker image and wait to finish download. You can track progress.
    - [execCommand](#execcommandcontainer-cmd) execute shell command inside a running container, returns output.
    - [waitForOutput](#waitforoutputcontainer-predicate-timeout--15000) wait for specific string to appear in running container's `stdout`.
    - [imageExists](#imageexistsdockerode-imagenames) check if image with imageName already exists.
- [Contribution](#contribution)

## Installation

npm

```bash
npm install dockerode-utils --save
```

yarn

```bash
yarn add dockerode-utils
```

## API

### `pullImageAsync(dockerode, imageName, onProgress?)`

```typescript
pullImageAsync(dockerode: Dockerode, imageName: string, onProgress?: (output: string) => void): void
```

Will pull docker image, you can wait for finish or track a progress. If you forget to specify
`:tag`, it'll download `:latest`

```javascript
/**
 * Example how to pull alpine:latest image from dockerhub
 */
import * as Dockerode from 'dockerode';
import { pullImageAsync } from 'dockerode-utils';

const dockerode = new Dockerode();
await pullImageAsync(dockerode, 'alpine:latest');
```

### `execCommand(container, cmd)`

```typescript
execCommand(container: Dockerode.Container, cmd: string[]): string[]
```

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
const envList2 = execCommand(alpineContainer, ['env', '--help']);
console.log(envList2);
```

### `waitForOutput(container, predicate, timeout = 15000)`

```typescript
waitForOutput(container: Dockerode.Container, predicate: (output: string) => boolean, timeout: number = 15000)
```

Wait for specific output from container. Useful, when you're working
with container, in which is running daemon and you have to wait for specific output/line to appears in container.

```javascript
/**
 * Example with waiting for specific output.
 * Here, we're waiting for 'InnoDB: 5.7.18 started' to appears in mysql container
 * only after that, we know that mysql container is fully initialized and we can
 * continue executing commands
 */
 import * as Dockerode from 'dockerode';
 import { waitForOutput } from 'dockerode-utils';

const dockerode = new Dockerode();
const mysqlContainer = await dockerode.run('mysql:5.7.18', [], {}, null);

await waitForOutput(mysqlContainer, (line) => line === 'InnoDB: 5.7.18 started');
console.log('MySql db started');
```

### `imageExists(dockerode, ...imageNames)`

```typescript
imageExists(dockerode: Dockerode, ...imageNames: string | string[]): boolean
```

Check if images with `imageNames` exist. You can check more than one image at once, like `imageExists(dockerode, ['mongo', 'mysql'])` or only one `imageExists(dockerode, 'mongo')`. In case, you won't define `:tag` it'll check if any image with `imageName` prefix exists.

## Contribution

Feel free to contribute with useful function that you're using daily and it can be helpful for others.
