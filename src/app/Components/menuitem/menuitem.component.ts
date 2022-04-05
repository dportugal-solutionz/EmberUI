import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Logger } from 'serilogger';
import { Menu } from '../../Config/Config';
import { ButtonStates } from 'src/app/Commons/ButtonStates';
import { LogAddContext } from 'src/app/Commons/LogAddContext';
import { ButtonActionEventArgs } from '../button/button.component';

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


  @Input() set Selected (value : boolean) {
    this.log.verbose("Selected set {value}",value);
    if (value)
      this.SelectedState = ButtonStates.Selected;
    else
      this.SelectedState = ButtonStates.Idle;
  }
  SelectedState : ButtonStates = ButtonStates.Idle;

  @Output() OnPress = new EventEmitter<Menu>();
  @Output() OnRelease = new EventEmitter<Menu>();

  private log : Logger;
  constructor(log : Logger) {
    this.log = log;
    //this.log = LogAddContext(log,`MenuItemComponent-${this.Menu.Id}-${this.Menu.Label}`);
    //this.log = log.createChild({Context:'MenuitemComponent'});
    this.log.verbose("Constructor");
  }

  ngOnInit(): void {
    this.log = LogAddContext(this.log,`MenuItemComponent-${this.Menu.Id}`);
    this.log.verbose("ngOnInit {id} {label}",this.Menu.Id, this.Menu.Label);
  }

  ButtonAction(event : ButtonActionEventArgs) : void {
    this.log.verbose("ButtonAction {data} {state}",event.Data, event.State);
    if (event.State == ButtonStates.Pressed){
      this.OnPress.emit(this.Menu);
    }
    else if (event.State == ButtonStates.Idle){
      this.OnRelease.emit(this.Menu);
    }
  }

  ButtonStateChanged(event : ButtonStates) : void {
    this.log.verbose("ButtonStateChanged {event}",event);
  }
}