import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from '@relynn/ngx-toastr';
import { ForgotPasswordService } from '../../services/forgot-password-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-forgot-password',
  styleUrl: './forgot-password.css',
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  loading = signal(false);

  constructor(private frogotser:ForgotPasswordService,private router:Router,private toastr: ToastrService){}

  forgotPassword = new FormGroup({
    email: new FormControl('', Validators.required),
    notRobot: new FormControl(false),

  });


  forgotPasswordSubmit(){
     this.loading.set(true);

    const data = this.forgotPassword.value;
     if (this.forgotPassword.invalid) {
      this.forgotPassword.markAllAsTouched();
        this.loading.set(false);

      return;
    }

    if (!data.notRobot) {
      this.toastr.error('Please verify that you are not a robot.');
        this.loading.set(false);
      return;
    }


    this.frogotser.submitForgotPassword({email: this.forgotPassword.value.email}).subscribe((res: any) => {
      // console.log(res);
      if(res.isSuccess == true){
        this.toastr.success(res.message);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        this.loading.set(false);

      }else{
        this.toastr.error(res.message);
        this.loading.set(false);

      }
    });



  }



  get f() {
    return this.forgotPassword.controls;
  }


}
