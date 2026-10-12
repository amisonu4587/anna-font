import { Component, signal } from '@angular/core';
import { ToastrService } from '@relynn/ngx-toastr';
import { UserService } from '../../services/user-service';
import { RoleResponse } from '../../../role/models/RoleResponse';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  imports: [RouterLink,ReactiveFormsModule,NgxMaskDirective],
  selector: 'app-user-create',
  styleUrl: './user-create.css',
  templateUrl: './user-create.html',
})
export class UserCreate {
  includeSuperAdmin = false;
  userForm!: FormGroup;


  allRoles = signal<any[]>([]);

    constructor(
    private userser: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router:Router
  ) {}


  ngOnInit(): void {
    console.log('RoleComponent initialized');



    this.includeSuperAdmin =
      localStorage.getItem('role') === 'superadmin';


      this.userForm = this.fb.group({
        id: [0],
        roleId: ['', Validators.required],
        name: ['', Validators.required],
        cellphone: [''],
        workPhone: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        isActive: [true]
      });

    this.getRoles();
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



}
