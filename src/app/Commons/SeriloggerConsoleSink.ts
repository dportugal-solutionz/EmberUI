import { LogEvent,LogEventLevel, Sink } from 'serilogger';
import { RenderLogEvent } from './RenderLogEvent';

declare var CrComLib: typeof import('@crestron/ch5-crcomlib');

/* Modified from SeriloggerCrestronSink to use the same string as rendered on the screen format */
export class SeriloggerConsoleSink implements Sink
{
    constructor() {

    }

    emit(events: LogEvent[]) {


        events.forEach( event => {
            switch (event.level) {
                case LogEventLevel.fatal:
                    console.error(RenderLogEvent(event));
                    break;

                case LogEventLevel.error:
                    console.error(RenderLogEvent(event));
                    break;

                case LogEventLevel.warning:
                    console.warn(RenderLogEvent(event));
                    break;

                case LogEventLevel.information:
                    console.info(RenderLogEvent(event));
                    break;

                case LogEventLevel.debug:
                    console.debug(RenderLogEvent(event));
                    break;

                case LogEventLevel.verbose:
                    console.debug(RenderLogEvent(event));
                    break;

                default:
                    console.log(RenderLogEvent(event));
                    break;
            }
        });
    }

    flush(): Promise<any> {
        return Promise.resolve();
    }

}