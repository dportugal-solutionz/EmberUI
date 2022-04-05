import { ErrorHandler, Injectable } from "@angular/core";
import { Logger } from "serilogger";
import { LogAddContext } from "./LogAddContext";


@Injectable()
export class CustomErrorHandler implements ErrorHandler{
    handleError(error: any): void {
        this.log.error(error);
    }

    private log : Logger;
    constructor(log : Logger)
    {
        this.log = LogAddContext(log,"CustomErrorHandler");
    }

}