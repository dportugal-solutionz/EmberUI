import { Logger } from '../Logger/logger.service';
import { CrestronJoinType } from './CrestronJoinType';
declare var CrComLib: typeof import('@crestron/ch5-crcomlib');
import {SubEvent} from 'sub-events';
import { ChangeDetectorRef } from '@angular/core';

/**
 * CrestronJoin an object that will subcribe and unsubscribe to the join number.
 * @Type set to 'b', 'n', or 's' for Digital/Boolean, Analog/Number, or Serial/String
 * @Number the number of the join number.
 * @Value the value of the join number
 */

export interface IOnValueChange {};

export class CrestronJoin
{
    Type : any;
    Number : any;           //should be a string but CrComLib.subscribeState and getState methods require TSignalNonStandardTypeName we'll set it to any.
    private value:any = 'not set';
    get Value() : any
    {
        return this.value;
    }
    set Value(newValue : any)
    {
        this.value = newValue;
        this.OnValueChange.emit(this.Value);
    }
    private log : Logger | undefined;
    private isSub : boolean = false;
    get IsSubscribed() : boolean{
        return this.isSub;
    }
    private subscriptionKey: any;

    private changeDetector : ChangeDetectorRef | undefined;

    //event
    public OnValueChange: SubEvent<any> = new SubEvent();

    constructor(joinType: CrestronJoinType, joinNumber: any, log?: Logger, cdetect?: ChangeDetectorRef)
    {
        this.changeDetector = cdetect;
        this.Type = joinType;
        this.Number= joinNumber;
        this.log = log?.ForContext(`CrestronJoin-${this.Type}-${this.Number.toString().padStart(5,'0')}`);
        this.log?.verbose("Constructor");
        this.Get();
        this.Subscribe();
    }

    toString()
    {
        return this.Value;
    }

    Subscribe()
    {
        this.log?.info("Subscribe");
        try
        {
            this.subscriptionKey = CrComLib.subscribeState(this.Type, this.Number, (value:any) =>
                {
                    if (value)
                    {
                        this.log?.info("Subscription Received {type} {number} {value}",this.Type,this.Number,value);
                        this.Value = value;
                        this.Rerender();
                    }
                });
            this.isSub = true;
        }
        catch(e)
        {
            this.log?.exception(e,"Subscription Exception {msg}",e);
        }
    }
    UnSubscribe()
    {

        this.log?.info("UnSubscribe");
        try
        {
            this.isSub = false;
            CrComLib.unsubscribeState(this.Type,this.Number,this.subscriptionKey);
        }
        catch(e)
        {
            this.log?.exception(e,"UnSubscribe Exception {msg}",e);
        }
    }
    Get()
    {
        this.log?.info("Get");
        try
        {
            this.Value = CrComLib.getState(this.Type,this.Number);
            this.Rerender();
        }
        catch(e)
        {
            this.log?.exception(e,"Get Exception {msg}",e);
        }
    }

    RerenderTemp : string = '';
    Rerender()
    {
        this.RerenderTemp = '1';
        this.changeDetector?.detectChanges();
        this.RerenderTemp = '';
    }
}