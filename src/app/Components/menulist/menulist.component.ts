import { Component, Input, OnInit } from '@angular/core';
import { Logger } from 'serilogger';
import { Menu } from 'src/app/Config/Config';

@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrls: ['./menulist.component.scss']
})
export class MenulistComponent implements OnInit {

  @Input() Items : Menu[] | null = [];

  private log : Logger;
  constructor(log : Logger)
  {
    this.log = log.createChild({Context:'MenulistComponent'});
    this.log.verbose("Constructor");
  }

  ngOnInit(): void {
    this.log.verbose("ngOnInit");
  }

}
