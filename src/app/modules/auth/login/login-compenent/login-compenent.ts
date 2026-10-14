import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../service/login-service';
import { Router } from '@angular/router';
import { ToastrService } from '@relynn/ngx-toastr';
import { LoginResponse } from '../models/LoginResponse';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login-compenent',
  styleUrl: './login-compenent.css',
  templateUrl: './login-compenent.html',
})
export class LoginCompenent {

  loading = signal(false);

  constructor(private loginser:LoginService,private router:Router,private toastr: ToastrService){}

  login = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });


   Login(){
    console.log(this.login.value);

     this.loading.set(true);
      this.loginser.loginSubmit(this.login.value).subscribe((res:LoginResponse)=>{
      // console.log(res);
      if (res.isSuccess === true) {
        this.toastr.success(res.message);

        localStorage.setItem('token', res.result.token);
        localStorage.setItem('name', res.result.name);
        localStorage.setItem('userId', String(res.result.userId));
        localStorage.setItem('role', res.result.role);
        this.router.navigate(['/dashboard']);
        this.loading.set(false);


      } else {
        // alert(res.message);
        this.toastr.error(res.message);
        this.loading.set(false);

        this.router.navigate(['/login']);
        console.log(this.loading);

      }
    })
  }


  get f() {
    return this.login.controls;
  }

}
