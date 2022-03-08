import { Component, Input, OnInit, Output } from '@angular/core';
import { Logger } from 'src/classes/Logger/logger.service';
declare var CrComLib: typeof import('@crestron/ch5-crcomlib');

@Component({
  selector: 'app-crestron-join',
  templateUrl: './crestron-join.component.html',
  styleUrls: ['./crestron-join.component.scss']
})
export class CrestronJoinComponent implements OnInit {

  @Input() JoinNumber = 0;
  @Input() JoinType : any = '';
  get IsSubscribed(): boolean {
    return (this.SubscriptionId.length > 0);
  }
  private SubscriptionId : string = '';
  @Output() Value : any = '';

  private log: Logger;
  constructor(log: Logger)
  {
    this.log = log.ForContext(`CrestronJoinComponent-${this.JoinType}-${this.JoinNumber.toString().padStart(4,' ')}`);
    this.log.verbose('Constructor');
    this.Subscribe();
  }

  ngOnInit(): void {
  }

  Subscribe(){
    this.log.verbose('Subscribe');
    this.SubscriptionId = CrComLib.subscribeState(
      this.JoinType,
      this.JoinNumber.toString(),
      (value: any) =>
      {
        this.log.verbose("Value Received: {value}",value);
        this.Value = value;
      }
    );


  }

  Get(){
    this.log.verbose('Get');
    this.Value = CrComLib.getState(this.JoinType,this.JoinNumber.toString());
  }

  Unsubscribe(){
    this.log.verbose('Unsubscribe');
    if (this.IsSubscribed)
    {
      CrComLib.unsubscribeState(this.JoinType,this.JoinNumber.toString(),this.SubscriptionId);
      this.SubscriptionId = '';
    }
  }
}
