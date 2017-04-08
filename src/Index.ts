import * as AlexaAppServer from 'alexa-app-server';
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

AlexaAppServer.start({
    debug: parseBoolean(process.env.SPU_DEBUG, false),
    port: process.env.PORT || 8080,
    verify: parseBoolean(process.env.SPU_VERIFY, true),
});
