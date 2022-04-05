import { Logger } from "serilogger";

export function LogAddContext(logger : any, context : string) : Logger {
    var newContext : string;
    var newLogger : any;

    //determine if logger already has a Context;
    if (logger.hasOwnProperty('Context'))
    {
        //console.log("LogAddContext context already exist");
        let prefix = logger.Context;
        newContext = prefix + '.' + context;
    }
    else
    {
        //console.log("LogAddContext context does not exist");
        newContext = context;
    }
    //console.log('newContext',newContext);
    newLogger = logger.createChild({Context:newContext});
    newLogger.Context = newContext; //we are adding a new member to the object called Context.
    //console.log(newLogger);
    return newLogger;
}