import { Component } from '@angular/core';
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



  constructor(private loginser:LoginService,private router:Router,private toastr: ToastrService){}

  login = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });


   Login(){
    console.log(this.login.value);

      this.loginser.loginSubmit(this.login.value).subscribe((res:LoginResponse)=>{
      // console.log(res);
      if (res.isSuccess === true) {
        this.toastr.success(res.message);

        localStorage.setItem('token', res.result.token);
        localStorage.setItem('name', res.result.name);
        localStorage.setItem('userId', String(res.result.userId));
        localStorage.setItem('role', res.result.role);
        this.router.navigate(['/dashboard']);
      } else {
        // alert(res.message);
        this.toastr.error(res.message);
        this.router.navigate(['/login']);
      }
    })
  }


  get f() {
    return this.login.controls;
  }

}
