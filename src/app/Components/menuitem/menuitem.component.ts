import { Component, Input, OnInit } from '@angular/core';
import { Logger } from 'serilogger';
import { Menu } from '../../Config/Config';

@Component({
  selector: 'app-menuitem',
  templateUrl: './menuitem.component.html',
  styleUrls: ['./menuitem.component.scss']
})
export class MenuitemComponent implements OnInit {
  @Input('Menu') Menu: Menu = {
    Id: 0,
    Visible: true,
    Label: "menu label",
    Icon: '',
    Description: '',
    Source: 0,
    Password: ''
  };

  private log : Logger;
  constructor(log : Logger) {
    this.log = log.createChild({Context:'MenuitemComponent'});
    this.log.verbose("Constructor");
  }

  ngOnInit(): void {
    this.log.verbose("ngOnInit");
  }

}
