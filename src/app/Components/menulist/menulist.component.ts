import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Logger } from 'serilogger';
import { LogAddContext } from 'src/app/Commons/LogAddContext';
import { Menu } from 'src/app/Config/Config';

@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrls: ['./menulist.component.scss']
})
export class MenuListComponent implements OnInit {

  ItemSelected : boolean[] = [];
  SelectedIndex : number = -1;
  items : Menu[] = [];
  @Input() set Items( value : Menu[]) {
    this.items = value;
    this.ItemSelected = Array(this.items.length).fill(false);
  }
  get Items() : Menu[] {
    return this.items;
  }

  private log : Logger;
  constructor(log : Logger, private changeDetectorRef : ChangeDetectorRef)
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
    this.log.verbose("ItemSelected length {length}",this.ItemSelected.length);
    //this.ItemSelected.forEach( (i,ndx) =>
    //  this.log.verbose("ItemSelected[{index}] {value}",ndx,i));
  }

  ItemPressed(menu : Menu):void {
    this.log.verbose("ItemPressed {id}",menu.Id);
    var found = this.Items.indexOf(menu);
    this.log.verbose("found {found}",found);
    if (found >= 0)
    {
      if (this.SelectedIndex >= 0)
        this.ItemSelected[this.SelectedIndex] = false;

      this.SelectedIndex = found;
      this.ItemSelected[this.SelectedIndex] = true;
      this.log.verbose("Selected Index {value}",this.SelectedIndex);
      //this.ItemSelected.forEach( (i,ndx) => this.log.verbose("ItemSelected {index} {value}",ndx,i));
      //this.Rerender();
    }
  }
  ItemReleased(menu : Menu):void {
    this.log.verbose("ItemReleased {id}",menu.Id);
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
