import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from '@relynn/ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';
import { InitialApplicationService } from '../../services/initial-application-service';
import { ApplicationResponse, PermitTypeResponse } from '../../models/initialApplicationModel';

@Component({
  imports: [ReactiveFormsModule, NgxMaskDirective],
  selector: 'app-initial-application-component',
  styleUrl: './initial-application-component.css',
  templateUrl: './initial-application-component.html',
})
export class InitialApplicationComponent {

  allApplicationFor = signal<any[]>([]);
  applicationForm!: FormGroup;
  isLoading = signal<boolean>(false);
  pageLoder = signal<boolean>(false);

  constructor(private initialAppSer: InitialApplicationService, private router: Router, private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.applicationForm = this.fb.group({
      applicationForId: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      contactNumber: ['', Validators.required],
    });

    this.getInitialApp();
  }

  get f() {
    return this.applicationForm.controls;
  }

  getInitialApp(): void {
    this.pageLoder.set(true);
    this.initialAppSer.getApplicationFor().subscribe({
      next: (res: PermitTypeResponse) => {
        console.log(res);
        if (res.isSuccess == true) {
          this.allApplicationFor.set(res.result ?? []);
          this.pageLoder.set(false);
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

  submitApplication() {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const formData = {
      ...this.applicationForm.value,
      contactNumber: this.applicationForm.value.contactNumber?.replace(/\D/g, '')
    };

    this.initialAppSer.submitInitialApplication(formData).subscribe({
      next: (res: ApplicationResponse) => {
        console.log(res);
        this.isLoading.set(false);
        if (res.isSuccess) {
          this.toastr.info(res.message);
          this.applicationForm.reset();
          this.getInitialApp();
        } else {
          this.toastr.error('Something Went Wrong. Please Try Later !!');
        }

      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastr.error('Something Went Wrong. Please Try Later !!');
        console.error(err);
      }

    });
  }


}
