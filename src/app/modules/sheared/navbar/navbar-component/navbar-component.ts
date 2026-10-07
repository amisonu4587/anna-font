import { Component } from '@angular/core';
import { NavbarService } from '../service/navbar-service';
import { LogoutResponse } from '../models/NavBar';
import { Router } from '@angular/router';
import { ToastrService } from '@relynn/ngx-toastr';

@Component({
  imports: [],
  selector: 'app-navbar-component',
  styleUrl: './navbar-component.css',
  templateUrl: './navbar-component.html',
})
export class NavbarComponent {

  constructor(private navser:NavbarService,private router:Router,private toastr: ToastrService) { }

  roleName:string = "";
  name:string = "";

  logOutClick(){
    this.navser.logout().subscribe((res:LogoutResponse)=>{
      if(res.isSuccess === true){

        this.toastr.success(res.message);


        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        localStorage.removeItem('role');

        this.router.navigate(['/login']);

      }else{
        this.toastr.success(res.message);
      }

    })
  }

   ngOnInit(): void {

     this.name = localStorage.getItem('name') ?? '';
     this.roleName = localStorage.getItem('role') ?? '';


   }


}
