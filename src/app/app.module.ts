import { APP_BASE_HREF } from '@angular/common';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import WebXPanel, {WebXPanelConfigParams, isActive} from "@crestron/ch5-webxpanel";
import { getVersion, getBuildDate} from "@crestron/ch5-webxpanel"; 
import { ControlSystemOnlineService } from './Services/ControlSystemOnlineService/control-system-online.service';
import { ConfigurationService } from './Services/ConfigurationService/configuration.service';
import { Logger, LoggerConfiguration, ConsoleSink, SeqSink } from 'serilogger';
import { SeriloggerCrestronSink } from './Commons/SeriloggerCrestronSink';
import { LogStorageSink } from './Commons/LogStorageSink';
import { LogStorageService } from './Services/LogStorageService/log-storage.service';
import { SeriloggerConsoleSink } from './Commons/SeriloggerConsoleSink';

import { MenuListComponent } from './Components/menulist/menulist.component';
import { MenuItemComponent } from './Components/menuitem/menuitem.component';
import { ButtonComponent } from './Components/button/button.component';
import { CustomErrorHandler } from './Commons/CustomErrorHandler';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*************************************************************************************************
What is this code running on
**************************************************************************************************/
//On a TSW1060 navigator.userAgent returns 'Mozilla/5.0 (Linux; Android 5.1.1; Crestron Touchpanel Build/LMY47V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Safari/537.36'
let IamATouchPanel : boolean = navigator.userAgent.indexOf("Crestron Touchpanel") >= 0;

/*************************************************************************************************
Logger
**************************************************************************************************/
//we temporarily create here since CSO needs one.
let csologger = new LoggerConfiguration()
  .writeTo(new ConsoleSink())
  .create();
const CSO = new ControlSystemOnlineService(csologger);
const logStorage = new LogStorageService(CSO);
//reconfigure the logger with additional sinks.
let logger = new LoggerConfiguration()
      .writeTo(new SeriloggerConsoleSink())
      .writeTo(new SeriloggerCrestronSink())
      .writeTo(new LogStorageSink(logStorage))
      //.writeTo(new SeqSink({
      //  url:"http://pc1693.spinitar.com:5341",
      //  apiKey:"frUTgBIgb4yxh8HdpUiM"
      //}))
      .create();

/*************************************************************************************************
Add WebXPanel
**************************************************************************************************/
console.log(`WebXPanel version: ${getVersion()}`); 
console.log(`WebXPanel build date: ${getBuildDate()}`); 

const configuration = {
  host: '172.16.48.12', // defaults to window.location.host
  ipId: '0x08'        // string representing a hex value. Might contain "0x" or not. Defaults to "0x03"
  //port: '41794'     //no longer required, use this if you have a different websocket port set on the processor
};

//check if running as a web panel before initializing the connection
const webXPanelFactory = () => () => {
  if (isActive) {
    WebXPanel.initialize(configuration);
  }
}

/*************************************************************************************************
ANGULAR
**************************************************************************************************/
@NgModule({
  declarations: [
    AppComponent,
    MenuListComponent,
    MenuItemComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: './'},
    {provide: ControlSystemOnlineService, useValue: CSO},
    {provide: Logger, useValue: logger},
    {provide: ConfigurationService, useClass: ConfigurationService},
    {provide: LogStorageService, useValue: logStorage},
    {
      provide: APP_INITIALIZER,
      useFactory: webXPanelFactory,
      multi: true
    },
    {provide: ErrorHandler, useClass: CustomErrorHandler}
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

  constructor(
    private log : Logger,
    private cso : ControlSystemOnlineService,
    private cfg : ConfigurationService,
  )
  {

  }
}