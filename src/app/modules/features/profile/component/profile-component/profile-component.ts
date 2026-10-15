import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { ProfileService } from '../../services/profile-service';
import { ToastrService } from '@relynn/ngx-toastr';
import { RoleResponse } from '../../../role/models/RoleResponse';
import { disabled } from '@angular/forms/signals';

@Component({
  imports: [RouterLink,ReactiveFormsModule,NgxMaskDirective],
  selector: 'app-profile-component',
  styleUrl: './profile-component.css',
  templateUrl: './profile-component.html',
})
export class ProfileComponent {

  userForm!: FormGroup;
  allRoles = signal<any[]>([]);
  includeSuperAdmin = false;
  userId!: number;



  constructor(
    private profileser: ProfileService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router:Router,
    private route: ActivatedRoute
  ) {}


    ngOnInit(): void {

    this.userId = Number(sessionStorage.getItem('userId')) || 0;

    this.includeSuperAdmin =
      sessionStorage.getItem('role') === 'superadmin';


      this.userForm = this.fb.group({
        id: [{ value: 0, disabled: true }],
        roleId: [{ value: '', disabled: true }, Validators.required],
        name: [{ value: '', disabled: true }, Validators.required],
        cellphone: [{ value: '', disabled: true }],
        workPhone: [{ value: '', disabled: true }],
        email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      });

    this.getRoles();
    this.getSingleData();


  }

  getRoles(): void {
    this.profileser.getRole(this.includeSuperAdmin).subscribe({
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

getSingleData(): void {
  this.profileser.singleUserData(null, this.userId).subscribe({
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


submitUser(){

}


get f() {
  return this.userForm.controls;
}



}
