import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Logger } from 'src/classes/Logger/logger.service';
import { LogEvent } from 'src/classes/Logger/LogEvent';
import {
        ConfigJoin
        ,TpIpAddressJoin
        ,TpMacAddressJoin
        ,TpRoomNameJoin
        ,TpOnlineJoin
        ,TpOfflineJoin
        ,TpIpTableEntry1
        ,TpIpTableEntry2
        ,TpIpTableEntry3
        ,TpIpTableEntry4
    } from '../classes/StaticJoinNumbers';
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
    private IsOnline: boolean = false;
    get ControlSystemOnline() : boolean {return this.IsOnline;}
    set ControlSystemOnline(value : any)
    {
        this.IsOnline = (value === 'true');
        this.GetIpTable();
        this.Rerender();
    }
    private IsOffline : boolean = true;
    get ControlSystemOffline(): boolean { return this.IsOffline; }
    set ControlSystemOffline(value : any)
    {
        this.IsOffline = (value === 'true');
        this.Rerender();
    }
    IpTableEntry        : any[] = [];
    ConfigString        : any;

    private changeDetectorRef : ChangeDetectorRef

    private log: Logger;
    constructor(log: Logger, cdetect: ChangeDetectorRef)
    {
        this.changeDetectorRef = cdetect;
        this.log = log.ForContext("AppComponent");
        this.log.info("Constructor");
        this.IpTableEntry = [];


        CrComLib.subscribeState(TpIpAddressJoin.Type,TpIpAddressJoin.Number,
            (value: any) => {
                this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpIpAddressJoin.Type,TpIpAddressJoin.Number,  value);
                this.MyIpAddress = value;
                if (value)
                    this.Rerender();
            });

        CrComLib.subscribeState(TpMacAddressJoin.Type,TpMacAddressJoin.Number,
            (value: any) => {
                this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpMacAddressJoin.Type,TpMacAddressJoin.Number,value);
                this.MyMacAddress = value;
                if (value)
                    this.Rerender();
            });

        CrComLib.subscribeState(TpRoomNameJoin.Type,TpRoomNameJoin.Number,
            (value: any) => {
                this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpRoomNameJoin.Type,TpRoomNameJoin.Number,    value);
                this.MyRoomName = value;
                if (value)
                    this.Rerender();
            });

        CrComLib.subscribeState(TpOnlineJoin.Type,TpOnlineJoin.Number,
            (value: any) => {
                this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpOnlineJoin.Type,TpOnlineJoin.Number,        value);
                this.ControlSystemOnline = value;
                this.Rerender();
            });

        CrComLib.subscribeState(TpOfflineJoin.Type,TpOfflineJoin.Number,
            (value: any) => {
                this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpOfflineJoin.Type,TpOfflineJoin.Number,      value);
                this.ControlSystemOffline = value;
                this.Rerender();
            });

        CrComLib.subscribeState(TpIpTableEntry1.Type,TpIpTableEntry1.Number,
            (value: any) => {
                this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpIpTableEntry1.Type,TpIpTableEntry1.Number,  value);
                this.IpTableEntry[0] = value;
                if (value)
                    this.Rerender();
            });

        CrComLib.subscribeState(TpIpTableEntry2.Type,TpIpTableEntry2.Number,
            (value: any) => {
                this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpIpTableEntry2.Type,TpIpTableEntry2.Number,  value);
                this.IpTableEntry[1] = value;
                if (value)
                    this.Rerender();
            });

        CrComLib.subscribeState(TpIpTableEntry3.Type,TpIpTableEntry3.Number,
            (value: any) => {
                this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpIpTableEntry3.Type,TpIpTableEntry3.Number,  value);
                this.IpTableEntry[2] = value;
                if (value)
                    this.Rerender();
            });

        CrComLib.subscribeState(TpIpTableEntry4.Type,TpIpTableEntry4.Number,
            (value: any) => {
                this.log.verbose("Subscription received {joinType} {joinNumber} {value}",TpIpTableEntry4.Type,TpIpTableEntry4.Number,  value);
                this.IpTableEntry[3] = value;
                if (value)
                    this.Rerender();
            });

        CrComLib.subscribeState(ConfigJoin.Type,ConfigJoin.Number,
            (value: any) => {
                var str = `${value.substring(0,20)}...${value.substring(value.length-20,20)}`
                var json = JSON.parse(str);
                this.log.verbose("Subscription received {joinType} {joinNumber} {str}",ConfigJoin.Type,ConfigJoin.Number,str);
                this.log.verbose("Json Config {json}",json);
                this.ConfigString = str;
                if (value)
                    this.Rerender();});
    }


    ngOnInit(): void {
        this.log.info("ngOnInit");

        this.MyIpAddress          = CrComLib.getState(TpIpAddressJoin.Type,TpIpAddressJoin.Number);
        this.MyMacAddress         = CrComLib.getState(TpMacAddressJoin.Type,TpMacAddressJoin.Number);
        this.MyRoomName           = CrComLib.getState(TpRoomNameJoin.Type,TpRoomNameJoin.Number);
        this.ControlSystemOnline  = CrComLib.getState(TpOnlineJoin.Type,TpOnlineJoin.Number);
        this.ControlSystemOffline = CrComLib.getState(TpOfflineJoin.Type,TpOfflineJoin.Number);
        this.IpTableEntry[0]      = CrComLib.getState(TpIpTableEntry1.Type,TpIpTableEntry1.Number);
        this.IpTableEntry[1]      = CrComLib.getState(TpIpTableEntry2.Type,TpIpTableEntry2.Number);
        this.IpTableEntry[2]      = CrComLib.getState(TpIpTableEntry3.Type,TpIpTableEntry3.Number);
        this.IpTableEntry[3]      = CrComLib.getState(TpIpTableEntry4.Type,TpIpTableEntry4.Number);
        this.ConfigString         = CrComLib.getState(ConfigJoin.Type,ConfigJoin.Number);
        this.Rerender();
    }

    GetCurrentTime():string
    {
        var current = new Date();
        return `${current.getHours().toString().padStart(2,'0')}:${current.getMinutes().toString().padStart(2,'0')}:${current.getSeconds().toString().padStart(2,'0')}.${current.getMilliseconds().toString().padStart(4,'0').substring(0,2)}`;
    }

    GetEntries() : any
    {
        return this.log.Entries.GetCollection();
    }

    SetRedrawTime(event: LogEvent){
        if (event.Drawn)
            return event.Drawn;
        else
            event.Drawn = this.GetCurrentTime();

        return event.Drawn;
    }

    RenderLogEvent(event: LogEvent) : string
    {
        return this.log.Render(event);
    }

    renderValue: number = 0;
    Rerender()
    {
        this.renderValue++;
        this.changeDetectorRef.detectChanges();
    }


    GetIpTable() : any
    {
        this.IpTableEntry[0]      = CrComLib.getState(TpIpTableEntry1.Type,TpIpTableEntry1.Number);
        this.IpTableEntry[1]      = CrComLib.getState(TpIpTableEntry2.Type,TpIpTableEntry2.Number);
        this.IpTableEntry[2]      = CrComLib.getState(TpIpTableEntry3.Type,TpIpTableEntry3.Number);
        this.IpTableEntry[3]      = CrComLib.getState(TpIpTableEntry4.Type,TpIpTableEntry4.Number);
        this.Rerender();
    }
}