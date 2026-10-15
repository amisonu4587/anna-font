import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { ToastrService } from '@relynn/ngx-toastr';
import { Pagination } from '../../../../sheared/common/pagination/pagination';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RoleResponse } from '../../../role/models/RoleResponse';
import * as XLSX from 'xlsx-js-style';
@Component({
  imports: [RouterLink, Pagination, ReactiveFormsModule],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export class UserList {
  filterForm!: FormGroup;
  currentPage: number = 1;
  totalData: number = 0;
  pageSize: number = 10;
  filterText: string = "";
  status: string = "";
  sortingBy: string = "";
  ascendingOrder: boolean = true;

  allUsers = signal<any[]>([]);
  loading = signal<boolean>(true);

  includeSuperAdmin = false;

  allRoles = signal<any[]>([]);
  isExporting = signal(false);




  constructor(private userSer: UserService, private router: Router, private toastr: ToastrService, private fb: FormBuilder) { }


  ngOnInit(): void {

    this.includeSuperAdmin =
      sessionStorage.getItem('role') === 'superadmin';
    this.filterForm = this.fb.group({
      name: [''],
      email: [''],
      roleId: [''],
      status: ['']
    });
    this.getUserList();
    this.getRoles();
  }
  searchUsers(): void {
    this.loading.set(true);
    this.currentPage = 1;
    this.getUserList();
  }


  getUserList(): void {

    const formValue = this.filterForm.getRawValue();
    const request = {
      name: formValue.name || '',
      email: formValue.email || '',
      roleId: Number(formValue.roleId) || 0,
      status: formValue.status || '',
      filterDto: {
        sortingBy: this.sortingBy,
        ascendingOrder: this.ascendingOrder,
        currentPage: this.currentPage,
        recordsPerPage: this.pageSize
      }
    };

    this.userSer.userList(request).subscribe((res: any) => {
      if (res.isSuccess == true) {
        this.currentPage = res.result.currentPage;
        this.totalData = res.result.totalRecords;
        this.pageSize = res.result.recordsPerPage;
        this.allUsers.set(res.result.userSearchResultDto);
        // this.toastr.success(res.message);
        this.loading.set(false);

      } else {
        this.toastr.error(res.message);
        console.log(res.message);
        this.loading.set(false);
      }

    })
  }


  changePageSize(event: Event): void {
    this.loading.set(true);

    const select = event.target as HTMLSelectElement;

    this.pageSize = Number(select.value);
    this.currentPage = 1;

    this.getUserList();
  }


  loadData(page: number): void {
    this.loading.set(true);

    this.currentPage = page;
    this.getUserList();
    console.log('Loading page:', page);
  }

  clearFormData() {
    this.filterForm.reset();
  }




  getRoles(): void {
    this.userSer.getRole(this.includeSuperAdmin).subscribe({
      next: (res: RoleResponse) => {
        if (res.isSuccess == true) {
          this.allRoles.set(res.result ?? []);
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




  exportToExcel(): void {
    this.isExporting.set(true);

    try {
      const data = this.allUsers().map((user: any) => ({
        Name: user.name,
        Email: user.email,
        Role: user.role,
        CellPhone: user.cellPhone,
        WorkPhone: user.workPhone,
        Status: user.status,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);

      worksheet['!cols'] = [
        { wch: 20 }, // Name
        { wch: 30 }, // Email
        { wch: 20 }, // Role
        { wch: 18 }, // CellPhone
        { wch: 18 }, // WorkPhone
        { wch: 15 }, // Status
      ];

      // Make heading row bold
      const headers = Object.keys(data[0] ?? {});

      headers.forEach((header, index) => {
        const cell = XLSX.utils.encode_cell({ r: 0, c: index });

        if (worksheet[cell]) {
          worksheet[cell].s = {
            font: { bold: true },
          };
        }
      });

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

      XLSX.writeFile(workbook, 'users.xlsx');
    } catch (error) {
      console.error('Excel export failed:', error);
    } finally {
      this.isExporting.set(false);
    }
  }

  sortUsers(column: string): void {
  if (this.sortingBy === column) {
    // Toggle ascending / descending
    console.log(column);


    this.ascendingOrder = !this.ascendingOrder;
  } else {
    // New column starts with ascending order
    this.sortingBy = column;
    this.ascendingOrder = true;
  }

  this.currentPage = 1;
  this.loading.set(true);
  this.getUserList();
}


  userStatusChange(id: number, status: string) {
  console.log(id, status);

  this.userSer.userStatusChange({ status: status }, id).subscribe({
    next: (res: any) => {
      if (res.isSuccess === true) {
        this.toastr.success(res.message);
        this.loading.set(true);

        this.getUserList();
      } else {
        this.toastr.error(res.message);
      }
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Unable to update user status');
    }
  });
}



}
