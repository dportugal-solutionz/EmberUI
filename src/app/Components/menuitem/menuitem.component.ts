import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Logger } from 'serilogger';
import { Menu } from '../../Config/Config';
import { ButtonStates } from 'src/app/Commons/ButtonStates';
import { LogAddContext } from 'src/app/Commons/LogAddContext';

@Component({
  selector: 'app-menuitem',
  templateUrl: './menuitem.component.html',
  styleUrls: ['./menuitem.component.scss']
})
export class MenuItemComponent implements OnInit {
  private menu : Menu = {
    Id: 0,
    Visible: true,
    Label: "menu label",
    Icon: '',
    Description: '',
    Source: 0,
    Password: ''
  };
  @Input() set Menu(value : Menu){
    this.menu = value;
    this.log.verbose("menu set {label}",this.menu.Label);
  }
  get Menu(): Menu {return this.menu}


  @Input() set Selected (value : boolean) { }
  @Output() OnPress = new EventEmitter<Menu>();
  @Output() OnRelease = new EventEmitter<Menu>();

  private log : Logger;
  constructor(log : Logger) {
    this.log = LogAddContext(log,"MenuItemComponent");
    //this.log = log.createChild({Context:'MenuitemComponent'});
    this.log.verbose("Constructor");
  }

  ngOnInit(): void {
    this.log.verbose("ngOnInit {id} {label}",this.Menu.Id, this.Menu.Label);
  }

  Pressed(event: any): void {
    this.log.verbose("Pressed {event}",event);
    this.OnPress.emit(this.Menu);
  }

  Released(event: any): void {
    this.log.verbose("Released {event}",event);
    this.OnPress.emit(this.Menu);
  }

  ButtonAction(event : any) : void {
    this.log.verbose("ButtonAction {event}",event);
  }
}