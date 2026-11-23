import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VerificationService } from '../../services/verification-service';
import { ToastrService } from '@relynn/ngx-toastr';

@Component({
  imports: [RouterLink],
  selector: 'app-verification-component',
  styleUrl: './verification-component.css',
  templateUrl: './verification-component.html',
})
export class VerificationComponent {

   permit_type_id = signal<number>(0);
   code = signal<string>('');
   id = signal<string>('');
   message = signal<string>('');


constructor(private verifyser: VerificationService, private route: ActivatedRoute, private toastr: ToastrService) { }


 ngOnInit(): void {
   this.id.set(this.route.snapshot.paramMap.get('id') ?? '');
   this.verifyEmailLink();

 }

 verifyEmailLink(){
    this.verifyser.verificationEmailLink(this.id()).subscribe((res:any)=>{
        // console.log(res);
        if(res.isSuccess){

          this.permit_type_id.set(res.result.applicationForId);
          this.code.set(res.result.applicationCode ?? '');
          this.id.set(res.result.applicationId ?? '');
          this.message.set(res.message ?? '');
          // console.log('Permit Type:', this.permit_type_id());
          // console.log('Code:', this.code());
          // console.log('Application ID:', this.id());
          // console.log('Message:', this.message());
        }
    })
 }









}
