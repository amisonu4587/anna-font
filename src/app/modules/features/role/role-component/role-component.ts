import {Component,OnInit,signal} from '@angular/core';
import { Pagination } from '../../../sheared/common/pagination/pagination';

import { RoleService } from '../service/role-service';
import { ToastrService } from '@relynn/ngx-toastr';
import { RouterLink } from '@angular/router';
import { RoleResponse } from '../models/RoleResponse';

@Component({
  selector: 'app-role-component',
  standalone: true,
  imports: [Pagination],
  templateUrl: './role-component.html',
  styleUrl: './role-component.css'
})
export class RoleComponent implements OnInit {

  includeSuperAdmin = false;

  allRoles = signal<any[]>([]);
  loading = signal<boolean>(true);

  currentPage = 1;
  totalData = 0;
  pageSize = 10;

  constructor(private roleser: RoleService,private toastr: ToastrService) {}

  ngOnInit(): void {
    // console.log('RoleComponent initialized');
    this.includeSuperAdmin = localStorage.getItem('role') === 'superadmin';
    this.getRoles();
  }

  getRoles(): void {
    this.loading.set(true);
    this.roleser.getRole(this.includeSuperAdmin).subscribe({
      next: (res: RoleResponse) => {
        if(res.isSuccess == true){
          this.allRoles.set(res.result ?? []);
          this.totalData = res.result.length;
          console.log(res);
          this.loading.set(false);
        }else{
          this.toastr.success(res.message);
        }
      },
      error: (err) => {
        console.error('ROLE API ERROR:', err);
        this.loading.set(false);
        this.toastr.error('Unable to load roles');
      }
    });
  }

 loadData(page: number): void {

    this.currentPage = page;

    console.log('Loading page:', page);



  }

}

