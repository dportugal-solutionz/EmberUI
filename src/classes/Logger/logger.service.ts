import { Injectable } from '@angular/core';
import { LogEvent } from './LogEvent';
import { LogLevel } from './LogLevels';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {LogToControlSystemJoin} from '../StaticJoinNumbers';
declare var CrComLib: typeof import('@crestron/ch5-crcomlib');


@Injectable({
    providedIn: 'root'
})
export class LogStorageSink {
    private items : LogEvent[] = [];
    get length(): number {
        return this.items.length;
    }
    Add(event: LogEvent){
        this.items.push(event);
    }
    Clear()
    {
        this.items = [];
    }
    RemoveAt(index: number)
    {
        if (index < this.items.length)
            this.items.splice(index,1);
    }
    GetAt(index: number) : LogEvent | null
    {
        if (index < this.items.length)
            return this.items[index];
        return null;
    }
    GetCollection() : LogEvent[] {
        return this.items;
    }
}

@Injectable({
    providedIn: 'root'
})
export class Logger {
    Context : any[] | null = null;
    httpClient : HttpClient;
    Entries : LogStorageSink;
    constructor(private client : HttpClient , storage: LogStorageSink)
    {
        this.Entries = storage;
        this.httpClient = client;
        this.Context = [];
    }

    /**
     * Generates an LogEvent with log level info
     * @param msg, a message format or template to output
     * @param args, arguments for the message template
     */
    info(messageTemplate :string, ... args: any[]): void
    {
        var event = new LogEvent( LogLevel.Information, messageTemplate, null, ... args);
        this.SendToSinks(event);
    }

    verbose(messageTemplate :string, ... args: any[]): void
    {
        var event = new LogEvent( LogLevel.Verbose, messageTemplate, null, ... args);
        this.SendToSinks(event);
    }

    debug(messageTemplate :string, ... args: any[]): void
    {
        var event = new LogEvent( LogLevel.Debug, messageTemplate, null, ... args);
        this.SendToSinks(event);
    }

    warn(messageTemplate :string, ... args: any[]): void
    {
        var event = new LogEvent( LogLevel.Warning, messageTemplate, null, ... args);
        this.SendToSinks(event);
    }

    error(messageTemplate :string, ... args: any[]): void
    {
        var event = new LogEvent( LogLevel.Error, messageTemplate, null, ... args);
        this.SendToSinks(event);
    }

    fatal(messageTemplate :string, ... args: any[]): void
    {
        var event = new LogEvent( LogLevel.Fatal, messageTemplate, null, ... args);
        this.SendToSinks(event);
    }

    exception(ex: any, messageTemplate: string, ... args: any[]): void
    {
        var event = new LogEvent(LogLevel.Error, messageTemplate, ex, ... args);
        this.SendToSinks(event);
    }


    /**
     * Sends the event to all Sinks
     * @param event
     */
    SendToSinks(event: LogEvent)
    {
        //store
        this.Entries.Add(event);
        console.log("Log Entries",this.Entries.length);

        //send to console
        console.log(this.Render(event));

        //to crestron control system
        var str = `!!BEGINJSON!!${JSON.stringify(event)}!!ENDJSON!!`;
        CrComLib.publishEvent(LogToControlSystemJoin.Type,LogToControlSystemJoin.Number,str);

        //send to seq server on a separate thread..
        setTimeout( () => {this.SendToSeq(event)} , 10);
    }


    /**
     * Sends to seq server
     * @param event
     */
    SendToSeq(event:LogEvent)
    {
        try
        {
            var options = {
                headers: new HttpHeaders({
                    'Content-Type':'application/vnd.serilog.clef',
                    'X-Seq-ApiKey':'frUTgBIgb4yxh8HdpUiM'
                })
            };

            //uses Angular's HttpClient module.. doesn't work. maybe missing something..
            //var body = this.EventToSeqJson(event);
            //var observer = this.client.post('http://172.16.17.111:5341/api/events/raw?clef',body, options);
            //observer.subscribe(
            //    //successful
            //    (response) => {
            //        console.log("post response",response);
            //    },
            //    //onerror
            //    (err) => {
            //        console.log("post error",err);
            //    },
            //    //oncompletion
            //    () => {
            //        console.log("post completion");
            //    }
            //);

            //direct Javascript XMLHttp... This Works!
            var request = new XMLHttpRequest();
            var path = "http://172.16.17.76:5341/api/events/raw?clef"; // enter your server ip and port number
            request.open("POST", path, true); // true = asynchronous
            request.setRequestHeader("Content-Type", "application/vnd.serilog.clef; charset=UTF-8");
            request.setRequestHeader("X-Seq-ApiKey", "frUTgBIgb4yxh8HdpUiM");
            var seqString = this.EventToSeqJson(event);
            console.log("seq string",seqString);
            request.send(seqString);
        }
        catch(e)
        {
            console.error(e);
        }
    }


    /**
     * Renders the event as a string [timestamp level] context message exception
     * @param event
     * @returns render
     */
    Render(event:LogEvent) : string
    {
        var context : string  = "";
        if (this.Context)
            context = ` ${this.Context.join('.')} | `;

        var ts : Date = event.Timestamp;
        var h = ts.getHours().toString().padStart(2,'0');
        var m = ts.getMinutes().toString().padStart(2,'0');
        var secs = ts.getSeconds().toString().padStart(2,'0');
        var ms = ts.getMilliseconds().toString().padStart(3,'0');
        var t = `${h}:${m}:${secs}.${ms}`;
        var strOut : string  = `[${t} ${event.Level}]${context}${this.EventMessage(event)}`;

        if (event.Exception)
            strOut += ` ${event.Exception}`;

        return strOut;
    }


    /**
     * Pushs the parameter context, onto a new Logger.Context
     * @param context
     * @returns context
     */
    ForContext(context:any) : Logger
    {
        var newLogger = new Logger(this.client,this.Entries);
        //console.log(`"context=${context}"`);
        if (this.Context)
        {
            newLogger.Context = [... this.Context];
            newLogger.Context.push(context);
            //console.log(`"new logger context=${newLogger.Context}"`);
        }
        else
        {
            newLogger.Context = [context];
            //console.log(`"new logger context=${newLogger.Context}"`);
        }
        //console.log(`"Created new logger with context ${newLogger.Context}"`);
        return newLogger;
    }


    /**
     * Gets the stuff in {} of the message template
     * @param messageTemplate
     * @returns tokens example: GetTokens("I have some info {abcde}") would return ["{abcde}"]
     */
    GetTokens(messageTemplate: string):any[] | null
    {
        var pattern = /\{@?\w+}/g;
        var tokens = messageTemplate.match(pattern);
        return tokens;
    }

    /**
     * Generates the Message string from the MessageTemplate and the Properties of the event
     * Renders the structured log/message template
     * @param event
     * @returns string (ex: event.MessageTemplate = "Hello {someone}", event.Properties=['John Doe'], then this will return 'Hello John Doe')
     */
    EventMessage(event: LogEvent) :string
    {
        var strOut = event.MessageTemplate.slice(); //copy the string

        var tokens = this.GetTokens(strOut);
        if (tokens && event.Properties)
        {
            if (tokens.length <= event.Properties.length)
            {
                for (let i = 0; i < tokens.length; i++)
                {
                    if (event.Properties)
                    {
                        if (event.Properties[i])
                            strOut = strOut.replace(tokens[i], event.Properties[i]);
                        else
                        {
                            //console.error(`"-at ${i}. Error replacing token ${tokens[i]}. No matching args"`);
                            strOut = strOut.replace(tokens[i],'null');
                        }
                    }
                    else
                        console.error("-Error replacing token. Properites is undefined.");
                }
                //console.log("-strOut",strOut);
                return strOut;
            }
            else
            {
                console.error("-token count mistmached with property count");
                return event.MessageTemplate;
            }
        }
        else
        {
            //console.log("-no tokens or no properties");
            return event.MessageTemplate;
        }
    }


    /**
     * Converts the LogEvent to a JSON string to be sent to a SeqServer
     * @param event
     * @returns to seq json
     */
    EventToSeqJson(event: LogEvent) : string {
        var obj : varObj = {};
        var mT = event.MessageTemplate.slice(); //copy the string


        obj['@t']=event.Timestamp;
        obj['@l']=event.Level;

        if (this.Context)
            obj['@@Context']=this.Context;

        if (event.Exception)
            obj['@x'] = event.Exception;

        var tokens = this.GetTokens(mT);
        if (event.Properties)
        {
            event.Properties.forEach( (element,index) =>
            {
                if (tokens && event.Properties)
                {
                    var tkn = tokens[index].replace('{','');
                    tkn = tkn.replace('}','');
                    var ndx = '@@' + tkn;
                    obj[ndx] = element;
                }
            });
        }

        var context = "";
        if (this.Context)
            context = " " + this.Context.join('.') + " ";
        var m = `"${context}${this.EventMessage(event)}"`;
        obj['@m']=m;


        return JSON.stringify(obj);
    }
}
/* allows for dynamic addition of properties to an object */
interface varObj{
    [key: string]: any
}
