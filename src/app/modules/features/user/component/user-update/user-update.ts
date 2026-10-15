import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { UserService } from '../../services/user-service';
import { ToastrService } from '@relynn/ngx-toastr';
import { RoleResponse } from '../../../role/models/RoleResponse';

@Component({
  imports: [RouterLink,ReactiveFormsModule,NgxMaskDirective],
  selector: 'app-user-update',
  styleUrl: './user-update.css',
  templateUrl: './user-update.html',
})
export class UserUpdate {

  includeSuperAdmin = false;
  userForm!: FormGroup;
  userId!: number;


  allRoles = signal<any[]>([]);

    constructor(
    private userser: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router:Router,
    private route: ActivatedRoute
  ) {}


   ngOnInit(): void {

    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.includeSuperAdmin =
      sessionStorage.getItem('role') === 'superadmin';


      this.userForm = this.fb.group({
        id: [0],
        roleId: ['', Validators.required],
        name: ['', Validators.required],
        cellphone: [''],
        workPhone: [''],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
      });

    this.getRoles();
    this.getSingleData();


  }


  getRoles(): void {
    this.userser.getRole(this.includeSuperAdmin).subscribe({
      next: (res: RoleResponse) => {
        console.log('Role API response:', res);

        if (res.isSuccess) {
          this.allRoles.set(res.result ?? []);
          console.log('Roles loaded:', this.allRoles());
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        console.error('ROLE API ERROR:', err);
        this.toastr.error('Unable to load roles');
      }
    });
  }


  get f() {
    return this.userForm.controls;
  }

  submitUser(){
    console.log(this.userForm.value);
    this.userser.upsertUser(this.userForm.value).subscribe((res:any)=>{
      console.log(res);
      if (res.isSuccess === true) {
        this.toastr.success(res.message);

        this.router.navigate(['/associate-data/users']);
      } else {
        this.toastr.success(res.message);
      }
    })
  }

  getSingleData(): void {
  this.userser.singleUserData(null, this.userId).subscribe({
    next: (res: any) => {
      console.log('User data:', res);

       this.userForm.patchValue({
        id: res.result.id,
        roleId: res.result.roleId,
        name: res.result.name,
        cellphone: res.result.cellPhone,
        workPhone: res.result.workPhone,
        email: res.result.email,
      });

    },
    error: (err: any) => {
      console.error('Failed to get user data:', err);
    }
  });
}

}
