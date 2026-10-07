import { Component, signal } from '@angular/core';
import { ToastrService } from '@relynn/ngx-toastr';
import { UserService } from '../../services/user-service';
import { RoleResponse } from '../../../role/models/RoleResponse';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-user-create',
  styleUrl: './user-create.css',
  templateUrl: './user-create.html',
})
export class UserCreate {
  includeSuperAdmin = false;

  allRoles = signal<any[]>([]);

    constructor(
    private userser: UserService,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    console.log('RoleComponent initialized');

    this.includeSuperAdmin =
      localStorage.getItem('role') === 'superadmin';

    this.getRoles();
  }


  getRoles(): void {
    this.userser.getRole(this.includeSuperAdmin).subscribe({
      next: (res: RoleResponse) => {
        if(res.isSuccess == true){
          this.allRoles.set(res.result ?? []);
          // console.log(res);
          // this.toastr.success(res.message);
        }else{
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
