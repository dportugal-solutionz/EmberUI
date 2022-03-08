import { APP_BASE_HREF } from '@angular/common';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Logger, LogStorageSink } from 'src/classes/Logger/logger.service';
import { AppComponent } from './app.component';
import {  HttpClientModule} from '@angular/common/http';
import WebXPanel, {WebXPanelConfigParams, isActive} from "@crestron/ch5-webxpanel";
import {getVersion, getBuildDate} from "@crestron/ch5-webxpanel"; 
import { CrestronJoin } from 'src/classes/CrestronJoin/CrestronJoin';
import { CrestronJoinComponent } from './crestron-join/crestron-join.component';

//let useWebPanel:boolean = true;
let WebPanelProvider = null;
//if (useWebPanel) {
  console.log(`WebXPanel version: ${getVersion()}`); 
  console.log(`WebXPanel build date: ${getBuildDate()}`); 

  const configuration = {
    host: '172.16.48.12', // defaults to window.location.host
    ipId: '0x04' // string representing a hex value. Might contain "0x" or not. Defaults to "0x03"
    //port: '41794' //no longer required, use this if you have a different websocket port set on the processor
  };

  //check if running as a web panel before initializing the connection
  const webXPanelFactory = () => () => {
    if (isActive) {
      WebXPanel.initialize(configuration);
    }
  }

  WebPanelProvider = {
    provide: APP_INITIALIZER,
    useFactory: webXPanelFactory,
    multi: true
  }
//}

@NgModule({
  declarations: [
    AppComponent,
    CrestronJoinComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: './'},
    {provide: LogStorageSink, useClass: LogStorageSink},
    {provide: Logger, useClass: Logger},
    WebPanelProvider
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  private log : Logger;
  constructor(log: Logger)
  {
    this.log = log.ForContext("AppModule");
    this.log.verbose("Constructor");
  }
}