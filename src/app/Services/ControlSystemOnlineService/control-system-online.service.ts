import { Injectable } from '@angular/core';
import { TpOfflineJoin, TpOnlineJoin } from '../../Config/StaticJoinNumbers';
import { BehaviorSubject, Observable } from 'rxjs';
import { Logger } from 'serilogger';
import { LogAddContext } from 'src/app/Commons/LogAddContext';
declare var CrComLib: typeof import('@crestron/ch5-crcomlib');


//Read this to understand Observable Data Service
//https://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/


/*
	A service that provides an Observable<boolean> IsOnline to indicate if the touch panel is online with the control system.
*/

@Injectable({
    providedIn: 'root'
})
export class ControlSystemOnlineService {

    private isOnline : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public readonly IsOnline : Observable<boolean> = this.isOnline.asObservable();


    private OnlineSubscriptionId : string = '';
    private OfflineSubscriptionId : string = '';

	private log : Logger;
    constructor(log : Logger)
    {
		//this.log = log.createChild({Context:'ControlSystemOnlineService'});
		this.log = LogAddContext(log,"ControlSystemOnlineService");
		//we cannot use ./classes/Logger/Logger.Serivce.ts here since it would create a circular dependency.
        this.log.verbose("Constructor");


        this.OnlineSubscriptionId = CrComLib.subscribeState(TpOnlineJoin.Type, TpOnlineJoin.Number, (value : any) =>
        {
			this.log.verbose("Online State {value}",value);
			if (value)
				this.isOnline.next(true);
			else
				this.isOnline.next(false);
		});

		this.OfflineSubscriptionId = CrComLib.subscribeState(TpOfflineJoin.Type, TpOfflineJoin.Number, (value: any) =>
		{
			this.log.verbose("Offline State {value}",value);
			if (value)
				this.isOnline.next(false);
		});
    }
}