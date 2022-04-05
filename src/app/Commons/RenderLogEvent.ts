/*
By Daniel Portugal
*/

import {LogEventLevel} from 'serilogger';

/**
 * Renders log event as a string.
 * @param event
 * @returns
 */
export function RenderLogEvent(event : any)
{
    //modified from https://github.com/davisb10/serilogger/blob/master/src/consoleSink.ts
    let level = 'unknown'
    switch(event.level)
    {
        case LogEventLevel.fatal:
            level = 'FATAL';
            break;

        case LogEventLevel.error:
            level = 'ERROR';
            break;

        case LogEventLevel.warning:
            level = 'Warning';
            break;

        case LogEventLevel.information:
            level = 'Information';
            break;

        case LogEventLevel.debug:
            level = 'Debug';
            break;

        case LogEventLevel.verbose:
            level = 'Verbose';
            break;

        default:
            level = 'Log';
            break;
    }

    //since information is the longest..
    level = level.padEnd('Information'.length,'.');

    let context = '';
    //console.log('LogEvent Properties',event.properties);
    for (var key in event.properties)
    {
        if (event.properties.hasOwnProperty(key))
        {
            if (key == 'Context')
            {
                //get the value of property 'Context'
                if (context.length > 0)
                    context += `.${event.properties[key]}`; //prefix it with a period
                else
                    context = event.properties[key];
            }
        }
    }
   let msg = event.messageTemplate.render(event.properties);

    let out = `[${event.timestamp} ${level}]`;
    if (context.length > 0)
        out+=` ${context}`;
    out += ` ${msg}`
    if (event.error instanceof Error)
        out+= ` ${event.error}`;

    return out;
}