import { LogEvent, Sink } from 'serilogger';
import { LoggerEmitJoin } from '../Config/StaticJoinNumbers';
import { RenderLogEvent } from './RenderLogEvent';
declare var CrComLib: typeof import('@crestron/ch5-crcomlib');


export class SeriloggerCrestronSink implements Sink
{
    private outputJoinNumber : string = LoggerEmitJoin.Number;
    private enableConsole : boolean = false;

    constructor(options? : SeriloggerCrestronSinkOptions) {
        if (options && options.SerialJoinNumber)
            this.outputJoinNumber = options.SerialJoinNumber;
    }

    emit(events: LogEvent[]) {
        if (this.enableConsole)
            console.log("SeriloggerCrestronSink Emit",events);

        events.forEach( event => {
            let str = RenderLogEvent(event);
            CrComLib.publishEvent('s',this.outputJoinNumber,str);
        });
    }

    flush(): Promise<any> {
        return Promise.resolve();
    }

}


export interface SeriloggerCrestronSinkOptions {

    /**
     * the serial join number to use to output to the control system.
     */
    SerialJoinNumber : string;
    EnableConsoleLog : boolean;
}