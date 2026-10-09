import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { ToastrService } from '@relynn/ngx-toastr';
import { Pagination } from '../../../../sheared/common/pagination/pagination';
import { NgClass } from '@angular/common';

@Component({
  imports: [RouterLink,Pagination],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export class UserList {

  currentPage: number = 1;
  totalData: number = 0;
  pageSize: number = 1;
  filterText: string = "";
  status: string = "";
  sortingBy: string = "";
  ascendingOrder: boolean = true;

  allUsers = signal<any[]>([]);
  loading = signal<boolean>(true);




  constructor(private userSer:UserService,private router:Router,private toastr: ToastrService){}


  ngOnInit(): void {
    this.getUserList();
  }


  getUserList(): void {
    const request = {
      filterText: this.filterText,
      status: this.status,
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


   loadData(page: number): void {
    this.loading.set(true);

    this.currentPage = page;
    this.getUserList();
    console.log('Loading page:', page);



  }



}
