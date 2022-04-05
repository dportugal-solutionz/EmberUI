import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Logger, LogEvent, LogEventLevel } from 'serilogger';
import { Menu } from './Config/Config';
import {
        TpIpAddressJoin
        ,TpMacAddressJoin
        ,TpRoomNameJoin
        ,TpIpTableEntry1
        ,TpIpTableEntry2
        ,TpIpTableEntry3
        ,TpIpTableEntry4
    } from './Config/StaticJoinNumbers';

import { ControlSystemOnlineService } from './Services/ControlSystemOnlineService/control-system-online.service';
import { ConfigurationService } from './Services/ConfigurationService/configuration.service';
import { LogStorageService } from './Services/LogStorageService/log-storage.service';
import { RenderLogEvent } from './Commons/RenderLogEvent';
import { LogAddContext } from './Commons/LogAddContext';
declare var CrComLib: typeof import('@crestron/ch5-crcomlib');

@Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
    title = 'EmberUI';

    MyIpAddress         : any;
    MyMacAddress        : any;
    MyRoomName          : any;
    LogEntries          : any[] = [];
    MenuItems           : Menu[] = [];

    NavigatorInformation : any = {
        userAgent:`${navigator.userAgent}`,
        maxTouchPoints:`${navigator.maxTouchPoints}`,
        online:`${navigator.onLine}`,
        vendor: `${navigator.vendor}`,
        outer: `${window.outerWidth} x ${window.outerHeight} `,
        inner : `${window.innerWidth} x ${window.innerHeight}`,
        screen : `${window.screen.width} x ${window.screen.height}`
    };


    private SystemIsOnline : boolean = false;
    get ControlSystemOnline() : boolean { return this.SystemIsOnline; }
    get ControlSystemOffline(): boolean { return !this.SystemIsOnline; }

    IpTableEntry        : any[] = [];
    ConfigString        : any;
    ConfigParsingSuccessful: boolean = false;

    private changeDetectorRef : ChangeDetectorRef

    private log: Logger;
    private logList : LogStorageService
    private csoService : ControlSystemOnlineService;
    private configService : ConfigurationService;
    constructor(
        log: Logger,
        logList : LogStorageService,
        cdetect: ChangeDetectorRef,
        cso: ControlSystemOnlineService,
        configService: ConfigurationService)
    {
        //this.log = log.createChild({Context:'AppComponent'});
        this.log = LogAddContext(log,"AppComponent");
        this.log.info("Constructor");

        this.csoService = cso;
        this.csoService.IsOnline.subscribe({next: (state) => {
                this.log.verbose("System Online State Received {state}",state);
                this.SystemIsOnline = state;
                // this.MenuItems = [
                //     {
                //         Id: 32,
                //         Visible: true,
                //         Label: "Item 32",
                //         Icon: "https://i.ibb.co/0YjSpPy/Windows-Dark.png",
                //         Description: '',
                //         Source: -1,
                //         Password: ''
                //     },
                //     {
                //         Id: 33,
                //         Visible: true,
                //         Label: "Item 33",
                //         Icon: "",
                //         Description: '',
                //         Source: -1,
                //         Password: ''
                //     },
                //     {
                //         Id: 34,
                //         Visible: true,
                //         Label: "Item 34 has a really long text label",
                //         Icon: "https://i.ibb.co/grQ4vb1/Wireless-Device-Dark.png",
                //         Description: '',
                //         Source: -1,
                //         Password: ''
                //     }
                // ];
        }});
        this.logList = logList;
        this.logList.Entries.subscribe({
            next : (entries) => {
                this.LogEntries = entries;
            }
        })
        this.configService = configService;
        this.changeDetectorRef = cdetect;
        this.IpTableEntry = [];

        this.configService.Config.subscribe({
            next: (bytesreceived) => {
                //if (bytesreceived)
                //    this.log.verbose("Config Received {bytesreceived}",bytesreceived);
            },
            error: (error) => {
                this.log.verbose("Config Error {err}",error);
                this.ConfigString = `Error ${error}`;
            },
            complete: () => {
                this.ConfigParsingSuccessful = true;
                this.log.verbose("Config Completed.");
                this.ConfigString = "Parsing Successful"; //JSON.stringify(this.configService.ConfigAsAnObject);
                if (this.configService.ConfigAsAnObject)
                    this.MenuItems = this.configService.ConfigAsAnObject.Touchpanels[0].Menus;
                this.MenuItems.push({
                    Id: this.MenuItems.length+1,
                    Visible: true,
                    Label: "Shutdown",
                    Icon: "https://i.ibb.co/xgc4vMJ/Power-Dark.png",
                    Description: "shutdown",
                    Source: -1,
                    Password: ''
                })
                if (this.MenuItems)
                    this.log.verbose("Menus Count: {length}",this.MenuItems.length);
                this.Rerender();
            }
        })

    }


    /**
     * Initializes crestron join subscriptions used by this component
     */
    private InitCrestronSubscriptions()
    {
        CrComLib.subscribeState(TpIpAddressJoin.Type,TpIpAddressJoin.Number,
            (value: any) =>
            {
                if (value)
                {
                    this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpIpAddressJoin.Type,TpIpAddressJoin.Number,  value);
                    this.MyIpAddress = value;
                    this.Rerender();
                }

            }
        );

        CrComLib.subscribeState(TpMacAddressJoin.Type,TpMacAddressJoin.Number,
            (value: any) =>
            {
                if (value)
                {
                    this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpMacAddressJoin.Type,TpMacAddressJoin.Number,value);
                    this.MyMacAddress = value;
                    this.Rerender();
                }
            }
        );

        CrComLib.subscribeState(TpRoomNameJoin.Type,TpRoomNameJoin.Number,
            (value: any) =>
            {
                if (value)
                {
                    this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpRoomNameJoin.Type,TpRoomNameJoin.Number,    value);
                    this.MyRoomName = value;
                    this.Rerender();
                }
            }
        );

        CrComLib.subscribeState(TpIpTableEntry1.Type,TpIpTableEntry1.Number,
            (value: any) =>
            {
                if (value)
                {
                    this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpIpTableEntry1.Type,TpIpTableEntry1.Number,  value);
                    this.IpTableEntry[0] = value;
                    this.Rerender();
                }
            }
        );

        CrComLib.subscribeState(TpIpTableEntry2.Type,TpIpTableEntry2.Number,
            (value: any) =>
            {
                if (value)
                {
                    this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpIpTableEntry2.Type,TpIpTableEntry2.Number,  value);
                    this.IpTableEntry[1] = value;
                    this.Rerender();
                }
            }
        );

        CrComLib.subscribeState(TpIpTableEntry3.Type,TpIpTableEntry3.Number,
            (value: any) =>
            {
                if (value)
                {
                    this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpIpTableEntry3.Type,TpIpTableEntry3.Number,  value);
                    this.IpTableEntry[2] = value;
                    this.Rerender();
                }
            }
        );

        CrComLib.subscribeState(TpIpTableEntry4.Type,TpIpTableEntry4.Number,
            (value: any) =>
            {
                if (value)
                {
                    this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpIpTableEntry4.Type,TpIpTableEntry4.Number,  value);
                    this.IpTableEntry[3] = value;
                    this.Rerender();
                }
            }
        );
    }


    ngOnInit(): void {
        this.log.info("ngOnInit");
        this.InitCrestronSubscriptions();
    }

    /**
     * Gets entries from the logger
     * @returns entries
     */
    GetEntries() : any
    {
        return this.logList;
    }

    private renderValue: number = 0;
    /**
     * Rerenders app component
     */
    Rerender()
    {
        this.log.verbose('Rerender');
        this.renderValue = 1;
        this.changeDetectorRef.detectChanges();
        this.renderValue = 0;
    }

    RenderLogItem(item : LogEvent) : string
    {
        return RenderLogEvent(item);
    }

    /**
     * returns the class to be used by the log entry based on the LogEvent item
     * @param item the log event being rendered
     * @returns the class/style to be used
     */
    GetLogEntryClass(item: LogEvent) : string[]
    {
        let ret : string[] = ['logtext'];
        switch (item.level)
        {
            case LogEventLevel.warning :
                ret.push('warntext');
                break;
            case LogEventLevel.error :
            case LogEventLevel.fatal:
                ret.push('errtext');
                break;
        }
        return ret;
    }
}