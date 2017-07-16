# Dockerode Utils

## `pullImageAsync(dockerode, imageName, onProgress?)`

Will pull docker image, you can wait for finish or track a progress.

## `execCommand(container, cmd)`

Execute command in container and returns output.

## `waitForOutput(container, predicate, timeout)`

Wait for specific output from container. Useful, when you're working
with container, in which is running daemon and you have to wait for specific output/line to appears in container.
