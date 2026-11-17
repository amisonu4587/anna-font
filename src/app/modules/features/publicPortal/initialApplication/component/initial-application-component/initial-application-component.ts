import { Component, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '@relynn/ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';
import { InitialApplicationService } from '../../services/initial-application-service';
import { PermitTypeResponse } from '../../models/initialApplicationModel';

@Component({
  imports: [NgxMaskDirective],
  selector: 'app-initial-application-component',
  styleUrl: './initial-application-component.css',
  templateUrl: './initial-application-component.html',
})
export class InitialApplicationComponent {

  allApplicationFor = signal<any[]>([]);

  constructor(private initialAppSer: InitialApplicationService, private router: Router, private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {


    this.getInitialApp();
  }


  getInitialApp(): void {
    this.initialAppSer.getApplicationFor().subscribe({
      next: (res: PermitTypeResponse) => {

        console.log(res);
        if (res.isSuccess == true) {
          this.allApplicationFor.set(res.result ?? []);
        } else {
          this.toastr.success(res.message);
        }
      },
      error: (err) => {
        console.error('ROLE API ERROR:', err);
        this.toastr.error('Unable to load roles');
      }
    });
  }


}
