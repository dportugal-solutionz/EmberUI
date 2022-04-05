import { Component, Input, OnInit } from '@angular/core';
import { Logger } from 'serilogger';
import { LogAddContext } from 'src/app/Commons/LogAddContext';
import { Menu } from 'src/app/Config/Config';

@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrls: ['./menulist.component.scss']
})
export class MenuListComponent implements OnInit {

  @Input() Items : Menu[] = [];

  private log : Logger;
  constructor(log : Logger)
  {
    this.log = LogAddContext(log,"MenuListComponent");
    //this.log = log.createChild({Context:'MenulistComponent'});
    this.log.verbose("Constructor");
  }

  ngOnInit(): void {
    this.log.verbose("ngOnInit");
    var count = 0;
    this.Items?.forEach( i => count += (i.Visible) ? 1 : 0);
    this.log.verbose("Menu Items Visible {count}",count);
  }

  ItemPressed(menu : Menu):void{
    this.log.verbose("ItemPresed {menu}",menu);
  }
  ItemReleased(menu : Menu):void{
    this.log.verbose("ItemPresed {menu}",menu);
  }

  //IsVisible(index: number) : boolean {
  //  return this.Items[index].Visible;
  //}

  //GetItem(index: number) : Menu {
  //  return this.Items[index];
  //}
}
