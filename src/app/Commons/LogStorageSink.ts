import { LogEvent, Sink } from 'serilogger';
import { LogStorageService } from '../Services/LogStorageService/log-storage.service';
import { ControlSystemOnlineService } from '../Services/ControlSystemOnlineService/control-system-online.service';
/**
 * A Sink serilogger that keeps a number of entries in memory.
 * accesible using the property Entries
 * new log events are added to the beginning of the list
 */
export class LogStorageSink implements Sink
{
    private maxEntries : number = 1000;
    private storage : LogStorageService;
    private totalEntries : number = 0;
    /**
     * Creates an instance of log storage sink.
     * @param storage  an injectable from LogStorageService
     * @param [options]
     */
    constructor(storage: LogStorageService, options? : LogStorageSinkOptions)
    {
        this.storage = storage;

        if (options && options.MaxEntries)
            this.maxEntries = options.MaxEntries;

        this.storage.SetMax(this.maxEntries);
        this.storage.Entries.subscribe({
            next : (entries) => this.totalEntries = entries.length
        });
    }

    emit(events: LogEvent[]) {
        console.log("StorageSink adding {count} total {length}",events.length,this.totalEntries);
        events.forEach(x => this.storage.Add(x));
    }

    flush(): Promise<any> {
        return Promise.resolve();
    }

}


export interface LogStorageSinkOptions {

    /**
     * maximum number of entries to keep
     */
    MaxEntries: number;
}