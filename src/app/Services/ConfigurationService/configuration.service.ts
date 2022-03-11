import { Injectable } from '@angular/core';
import { Logger } from 'serilogger';
import { ControlSystemOnlineService } from '../ControlSystemOnlineService/control-system-online.service';
import { ConfigJoin } from '../../Config/StaticJoinNumbers';
import { BehaviorSubject, Observable } from 'rxjs';
import Config from 'src/app/Config/Config';
import { HttpClient, HttpHeaders, HttpXhrBackend } from '@angular/common/http';

declare var CrComLib: typeof import('@crestron/ch5-crcomlib');

/*
    A service that receives the JSON Configuration from the Crestron Processor
*/
@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    private config : BehaviorSubject<string> = new BehaviorSubject<string>('');
    public readonly Config : Observable<string> = this.config.asObservable();

    private data : string = '';
    private successfulstring : string = '';
    ConfigAsAnObject : Config | null = null;

    private StartRx : boolean = false;
    private Completed : boolean = false;
    private SubscriptionId : string = '';
    private log : Logger;

    constructor(log: Logger, private systemOnline: ControlSystemOnlineService, private http : HttpClient)
    {
        this.log = log.createChild({Context:'ConfigurationService'});
        this.systemOnline.IsOnline.subscribe({
            next: (state) => {
                this.log.verbose("System Online State Received {state}",state);
                if (state)
                {
                    this.data = '';
                    this.successfulstring = '';
                    this.ConfigAsAnObject = null;
                    this.StartRx = false;
                    this.Completed = false;
                    //try a Cws Get
                    //let url = "http://172.16.48.12/cws/api/config"
                    //this.http.get<any>(url,{
                    //    headers : {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'},
                    //    responseType : 'json'
                    //}).subscribe({
                    //    next: (response : any) =>
                    //    {
                    //        this.log.verbose("http response {response}",response.content);
                    //    },
                    //    error: (error) =>
                    //    {
                    //        this.log.verbose("http error {error}",error.message);
                    //    },
                    //    complete: () => {
                    //        this.log.verbose("http complete");
                    //    }
                    //})


                }
                else
                {
                    this.Completed = false;
                    this.StartRx = false;
                    this.data = '';
                    this.successfulstring = '';
                }
            }
        }); //end of IsOnline.subscribe

        if (this.SubscriptionId === '')
        {
            this.SubscriptionId = CrComLib.subscribeState(ConfigJoin.Type,ConfigJoin.Number,(value:any) => {
                if (value)
                {
                    this.log.verbose("Received Config Data Length {length}",value.length);
                    this.config.next(value.length);

                    if (!this.StartRx && value.indexOf('!!CONFIG-START!!') >= 0)
                    {
                        this.log.verbose('config start received');
                        this.StartRx = true;
                        this.data = value;
                    }
                    else if (this.StartRx && value.indexOf('!!CONFIG-END!!') >= 0)
                    {
                        this.data += value;
                        this.log.verbose('config end received');
                        this.StartRx = false;
                        let pattern = /!!CONFIG-START!!([\s|\S]*)!!CONFIG-END!!/
                        this.log.verbose("data {data}",`${this.data.slice(0,10)}...${this.data.slice(this.data.length-10,this.data.length)}`);
                        let rx = pattern.exec(this.data);
                        this.log.verbose("regex result {rx}",rx);
                        if (rx)
                        {
                            if (rx[1])
                            {
                                try
                                {
                                    this.successfulstring = rx[1];
                                    this.log.verbose("parsing data of length {length}",this.successfulstring.length);
                                    this.ConfigAsAnObject = JSON.parse(this.successfulstring);
                                    this.data = '';
                                    this.log.verbose("Config Received Completed");
                                    this.config.complete();
                                }
                                catch(e)
                                {
                                    this.log.error("Parsing Error {error}",e);
                                }
                            }
                            else
                                this.log.error("Regex Pattern Successful, but missing json");
                        }
                        else
                            this.log.error("Regex unsucessful");
                    }
                    else if (this.StartRx)
                    {
                        this.log.verbose('config data added. total {total}',this.data.length);
                        this.data += value;
                    }
                    else
                    {
                        this.log.verbose('Started {start}',this.StartRx);
                        this.log.verbose('data len {length}',this.data.length);
                    }
                }
            }); //end of CrComLib.subscribeState
        }
        else
        {
            this.log.verbose("already subscribed to serial join");
        }
    }
}