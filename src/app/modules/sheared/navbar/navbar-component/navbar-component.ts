import { Component } from '@angular/core';
import { NavbarService } from '../service/navbar-service';
import { LogoutResponse } from '../models/NavBar';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from '@relynn/ngx-toastr';

@Component({
  imports: [RouterLink],
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


        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('role');

        this.router.navigate(['/application/online-application']);

      }else{
        this.toastr.success(res.message);
      }

    })
  }

   ngOnInit(): void {

    console.log('Stored name:', sessionStorage.getItem('name'));

     this.name = sessionStorage.getItem('name') ?? '';
     this.roleName = sessionStorage.getItem('role') ?? '';


   }


}
