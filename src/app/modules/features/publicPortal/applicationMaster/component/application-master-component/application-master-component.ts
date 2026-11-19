import { Component } from '@angular/core';
import { OnlineFoodComponent } from '../../../applications/component/online-food-component/online-food-component';
import { OnlineMobileFoodComponent } from '../../../applications/component/online-mobile-food-component/online-mobile-food-component';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [OnlineFoodComponent,OnlineMobileFoodComponent],
  selector: 'app-application-master-component',
  styleUrl: './application-master-component.css',
  templateUrl: './application-master-component.html',
})
export class ApplicationMasterComponent {

  constructor(private route: ActivatedRoute) {}

  permit_type_id: number = 0;
  code: string = '';

  ngOnInit() {
    this.permit_type_id = Number(this.route.snapshot.paramMap.get('typeId')) || 0;
}


}
