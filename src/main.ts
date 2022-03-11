import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LoggerEmitJoin } from './app/Config/StaticJoinNumbers';
declare var CrComLib: typeof import('@crestron/ch5-crcomlib');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => {
    console.error(err);
    CrComLib.publishEvent(LoggerEmitJoin.Type,LoggerEmitJoin.Number,`Tp Error:${err}`);
  });