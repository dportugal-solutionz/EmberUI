import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LogEvent } from 'serilogger';
import { ControlSystemOnlineService } from '../ControlSystemOnlineService/control-system-online.service';


/**
 * A service that stores Log Events
 */
@Injectable({
  providedIn: 'root'
})
export class LogStorageService {

  private maxEntries : number = 1000;
  private storage : LogEvent[] = [];
  private entries : BehaviorSubject<LogEvent[]> = new BehaviorSubject<LogEvent[]>([]);
  public Entries : Observable<LogEvent[]> = this.entries.asObservable();

  constructor(private cso : ControlSystemOnlineService) {
    this.cso.IsOnline.subscribe({
      next: (state) => {
        if (state)
          this.Clear();
      }
    })
  }

  SetMax(count : number) : void
  {
    this.maxEntries = count;
  }

  Add(event : LogEvent) : void
  {
    if (this.storage.length > (this.maxEntries + 1))
    {
      console.log("max reached");
      this.storage.pop();
    }
    console.log("LogStorageService Adding an event");
    let len = this.storage.unshift(event);
    console.log("total entries",len);
    this.entries.next(this.storage);
  }
  Clear() : void {
    this.storage = [];
    this.entries.next(this.storage);
  }
}
