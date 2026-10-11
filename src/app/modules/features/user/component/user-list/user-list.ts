import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { ToastrService } from '@relynn/ngx-toastr';
import { Pagination } from '../../../../sheared/common/pagination/pagination';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  imports: [RouterLink,Pagination,ReactiveFormsModule],
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




  constructor(private userSer:UserService,private router:Router,private toastr: ToastrService,private fb: FormBuilder){}


  ngOnInit(): void {
    this.filterForm = this.fb.group({
      name: [''],
      email: [''],
      roleId: [0],
      status: ['']
    });
    this.getUserList();
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

    this.userSer.userList(request).subscribe((res:any)=>{

        if(res.isSuccess == true){
          this.currentPage = res.result.currentPage;
          this.totalData = res.result.totalRecords;
          this.pageSize = res.result.recordsPerPage;


          this.allUsers.set(res.result.userSearchResultDto);


          // this.toastr.success(res.message);
          this.loading.set(false);

        }else{
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



}
