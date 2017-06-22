import * as process from 'process';

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (value) {
        const normalizedValue = value.toLowerCase();

        if (normalizedValue === 'true') {
            return true;
        }
        else if (normalizedValue === 'false') {
            return false;
        }
        else {
            throw new Error('A boolean value must be \'true\' or \'false\'.');
        }
    }

    return defaultValue;
}

const useGlimpse = parseBoolean(process.env.SPU_GLIMPSE, false);

if (useGlimpse) {
    const glimpse = require('@glimpse/glimpse');

    glimpse.init();
}

import * as AlexaAppServer from 'alexa-app-server';
import * as debug from 'debug';

const spuServerDebug = debug('spu:server');

if (useGlimpse) {
    spuServerDebug('Glimpse is enabled.');
}

spuServerDebug('Starting Alexa app server...');

AlexaAppServer.start({
    debug: parseBoolean(process.env.SPU_DEBUG, false),
    port: process.env.PORT || 8080,
    verify: parseBoolean(process.env.SPU_VERIFY, true),
});
