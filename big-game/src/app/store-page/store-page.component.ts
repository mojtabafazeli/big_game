import { Equipment } from './../equipment';
import { SaddlesService } from './../services/saddles.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TackService } from '../services/tack.service';
import { HorseTack } from '../horse-tack';
import { UserDataService } from '../services/user-data.service';
import { map } from 'rxjs/operators';
import { UserData } from '../user-data';

@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.css']
})

export class StorePageComponent implements OnInit {
  selectTack: FormGroup;
  horse_id: string = this.authService.getHorseId();
  UId: string = this.authService.getUId();
  id: string;
  cost: number;
  public equipment: Equipment;
  tackList: HorseTack[];
  user: any;

constructor(private authService: AuthService,
    private saddlesService: SaddlesService,
    private tackService: TackService,
    private userService: UserDataService) { }

  ngOnInit(): void {
    this.getHorseTack();
    this.userService.getUserByID(this.UId).subscribe((result) => {
      this.user=result as UserData;
    });
  }

  getHorseTack() {
    this.tackService.getTackByHorse(this.horse_id).subscribe(res => {
        this.tackList = res.map(tack =>
          tack.payload.doc.data() as HorseTack
        );  
        console.log('horse_tack', this.tackList);
        for (let i = 0; i < this.tackList.length; i++ ) {
          this.saddlesService.getHorseSaddlesNames(this.tackList[i].saddle_id).then(
            tack => 
            this.tackList[i].saddle_id = tack.data()['name']
          )}
      })
    this.saddlesService.getHorseSaddlesIds(this.horse_id);
  }

  selectItem(id: string, cost: number) {
    this.id = id;
    this.cost = cost/2;
    console.log('select', this.id, this.cost)
  }

  deleteItems() {
    this.tackService.sellTack(this.id);
  }

  sellTackItem() {
    this.deleteItems();
    this.userService.addEquus(this.UId, this.user.equus, this.cost);
  }

}
