import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output,ChangeDetectorRef } from '@angular/core';
import { Logger } from 'serilogger';
import { ButtonStates } from 'src/app/Commons/ButtonStates';
import { LogAddContext } from 'src/app/Commons/LogAddContext';
import { ButtonStateProperties } from './ButtonStateProperties';

/**
 * A button with an Image and Label
 *  note no communication with the control system happens in this component.
 *  communication with the control system should be handled by the parent component of this button.
 * State is changed before OnAction
 */
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  private propIdle : ButtonStateProperties;
  private propPressed : ButtonStateProperties;
  private propSelected : ButtonStateProperties;

  /**
   * Props of the button, index 0 is Idle, 1 is pressed, 2 is selected. Assigned at constructor
   */
  Props : ButtonStateProperties[];

  private data : any;
  /**
   * any data to associate with this button. ButtonActionEventArgs will contain this data
   */
  @Input() set Data(value: any) {
    this.log.verbose('assigning Data {value}',value);
    this.data = value;
  }

  /**
   * Sets Icon for all button states
   */
  @Input() set Icon (value: string){
    this.log.verbose("assigning Icon {value}",value);
    this.Props.forEach( prop => prop.Icon = value );
  }

  /**
   * Sets the Label for all button states
   */
  @Input() set Label (value: string){
    this.log.verbose("assigning Label {value}",value);
    this.Props.forEach( prop => prop.Label = value);
  }

  /**
   * Sets the Background Image for all button states
   */
  @Input() set BackgroundImage (value: string) {
    this.log.verbose("assigning BackgroundImage {value}",value);
    this.Props.forEach( prop => prop.BackgroundImage = value);
  }

  /**
   * Sets the Idle state properties
   */
  @Input() set IdleButtonProperties( value: ButtonStateProperties) {
    this.Props[0] = value;
  }

  /**
   * Sets the Pressed state properties
   */
  @Input() set PressedButtonProperties( value: ButtonStateProperties) {
    this.Props[1] = value;
  }

  /**
   * Sets the Selected state properties
   */
  @Input() set SelectedButtonProperties( value: ButtonStateProperties) {
    this.Props[2] = value;
  }

  /**
   * OnAction is emitted when the button is pressed or released.
   */
  @Output() OnAction : EventEmitter<ButtonActionEventArgs> = new EventEmitter<ButtonActionEventArgs>();

  /**
   * OnStateChanged is emitted when the button's state changes (i.e. Idle, Pressed, Released, Selected)
   */
  @Output() OnStateChanged : EventEmitter<ButtonStates> = new EventEmitter<ButtonStates>();

  private log : Logger;
  constructor(log: Logger, private changeDetectorRef :ChangeDetectorRef){
    this.log = LogAddContext(log,"ButtonComponent");
    //this.log = log.createChild({Context:'ButtonComponnent'});
    this.log.verbose("Constructor");

    //default values;
    this.propIdle = ButtonStateProperties.DefaultIdle();
    this.propPressed = ButtonStateProperties.DefaultPressed();
    this.propSelected = ButtonStateProperties.DefaultSelected();
    this.Props = [this.propIdle, this.propPressed, this.propSelected]
    this.CurrentProp = this.propIdle;
  }

  ngOnInit(): void {
    this.log.verbose("ngOnInit {label}",this.CurrentProp.Label);
  }

  MouseDown(event: any) : void {
    this.log.verbose("MouseDown {event}",event);
    this.isPressed = true;
    this.CurrentProp = this.propPressed;
    this.State = ButtonStates.Pressed;
    this.OnAction.emit(new ButtonActionEventArgs(this.Data, this.State));
  }

  MouseUp(event: any) : void {
    this.log.verbose("MouseUp {event}",event);
    this.isPressed = false;

    if (this.State !== this.nextState)
    {
      this.log.verbose("updating state to {nextState}",this.nextState);
      this.State = this.nextState;
    }

    switch(this.State)
    {
      case ButtonStates.Selected:
        this.log.verbose("setting current prop to selected");
        this.CurrentProp = this.propSelected;
        break;
      case ButtonStates.Idle:
        this.log.verbose("setting current prop to idle");
        this.CurrentProp = this.propIdle;
        break;
    }

    this.OnAction.emit(new ButtonActionEventArgs(this.Data,this.State));
  }

  //a holder for the next state in the event button is currently pressed,
  //when button releases this nextState will be set.
  private nextState : ButtonStates = ButtonStates.Idle;

  /**
   * set accessor for State
   */
  @Input() set State( newState : ButtonStates) {

    if (this.isPressed)
    {
      this.log.verbose("currently Pressed. nextState set {value}",newState);
      this.nextState = newState;
      return;
    }

    if (newState !== this.state)
    {
      this.log.verbose("State changed to {value}",newState);
      this.state = newState;
      this.nextState = newState;
      this.OnStateChanged.emit(this.state);
      switch(this.state)
      {
        case ButtonStates.Idle:
          this.CurrentProp = this.propIdle;
          break;
        case ButtonStates.Pressed:
          this.CurrentProp = this.propPressed;
          break;
        case ButtonStates.Selected:
          this.CurrentProp = this.propSelected;
          break;
      }
      this.Rerender();
    }
  }

  /**
   * get accessor for State
   */
  get State() : ButtonStates {
    return this.state;
  }

  /**
   * state variable holder for the the State member.
   */
  private state : ButtonStates = ButtonStates.Idle;




  /**
   * retuns true if button is Idle
   */
  get IsIdle() : boolean {
    return this.State == ButtonStates.Idle;
  }

  /**
   * returns true if the button is Pressed
   */
  get IsPressed() : boolean { return this.isPressed };
  private isPressed = false;


  /**
   * returns true if button is Selected
   */
  get IsSelected() : boolean {
    return this.State == ButtonStates.Selected;
  }


  /**
   * HTML databound properties
   */
  CurrentProp : ButtonStateProperties;

  get HasIcon() : boolean {
    if (this.CurrentProp == undefined)
      return false;
    return this.CurrentProp.Icon?.length > 0;
  }
  get HasLabel() : boolean {
    if (this.CurrentProp == undefined)
      return false;
    return this.CurrentProp.Label?.length > 0;
  }
  get HasBackgroundImage() : boolean {
    if (this.CurrentProp == undefined)
      return false;
    return this.BackgroundImage?.length > 0;
  }

  /**
     * Rerenders this component
  */
  Rerender()
  {
      this.log.verbose('Rerender');
      this.renderValue = 1;
      this.changeDetectorRef.detectChanges();
      this.renderValue = 0;
  }
  private renderValue : number = 0;
}

export class ButtonActionEventArgs {
  Data : any;
  State : ButtonStates;
  constructor(data : any, state : ButtonStates)
  {
    this.Data = data;
    this.State = state;
  }
}