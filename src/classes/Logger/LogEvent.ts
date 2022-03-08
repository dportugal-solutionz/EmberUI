import { parse } from "@messageformat/parser";
import { LogLevel } from "./LogLevels";
import  * as MessageFormat from 'messageformat';    //http://messageformat.github.io/messageformat/api/core.messageformat/
                                                    //used to parse structured logging from the message template


export class LogEvent{
    Timestamp: Date = new Date();
    Level : LogLevel = LogLevel.Debug;
    MessageTemplate : string = "";
    Exception : any | undefined | null = null;
    Properties : any[] = [];
    Drawn : string | null = null;

    constructor(logLevel: LogLevel, messageTemplate: string, exception?: any, ... args: any[])
    {
        //console.log("event args.count",args?.length);
        //console.log("args",args);
        this.Level = logLevel;
        this.MessageTemplate = messageTemplate;
        if (exception && args)
        {
            this.Exception = exception;
            this.Properties = args;
        }
        else if (args)
        {
            this.Properties = args;
        }
        else if (exception)
        {
            this.Exception = exception;
        }
        else
        {
            this.Exception = null;
        }
    }
}