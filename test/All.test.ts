import * as Dockerode from "dockerode";
import { containerExec, pullImageAsync, waitForOutput } from "../lib/Index";

const dockerode = new Dockerode();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

describe("Utils", () => {

    describe(pullImageAsync.name, () => {

        it("should pull alpine image", async (done) => {
            const output = await pullImageAsync(dockerode, "alpine:latest");
            expect(output).toBeDefined();
            done();
        });

        // it("should not throw an error pulling same image again", async (done) => {
        //     console.log("pul 2");
        //     const output = await pullImageAsync(dockerode, "alpine:latest");
        //     done();
        // });

    });

    // describe(containerExec.name, () => {

    //     let container: Dockerode.Container;

    //     beforeAll(async (done) => {
    //         console.log("beforeAll");
    //         container = await dockerode.run("alpine", [], null);
    //         console.log(container);
    //         done();
    //     });

    //     it("should exec env command ", async (done) => {
    //         console.log("exec");
    //         const output = await containerExec(container, ["env"]);
    //         console.log(output);
    //         expect(output).toBeDefined();
    //         done();
    //     });

    // });

});
