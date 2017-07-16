import * as Dockerode from 'dockerode';
import { pullImageAsync } from '../lib/Index';

const dockerode = new Dockerode();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

describe('Utils', () => {

    describe(pullImageAsync.name, () => {

        it('should pull alpine image', async (done) => {
            console.log('downloading image')
            const output = await pullImageAsync(dockerode, 'alpine');
            expect(output).toBeDefined();
            done();
        });

        it('should throws an error while trying to download unknown image', async (done) => {
            done();
        });

    });

});

