import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VerificationService } from '../../services/verification-service';
import { ToastrService } from '@relynn/ngx-toastr';
import { ApplicationVerificationResponse } from '../../models/verification';

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

   applicationData = signal<any>(null);


constructor(private verifyser: VerificationService, private route: ActivatedRoute, private toastr: ToastrService) { }


 ngOnInit(): void {
   this.id.set(this.route.snapshot.paramMap.get('id') ?? '');
   this.verifyEmailLink();

 }

 verifyEmailLink(){
    this.verifyser.verificationEmailLink(this.id()).subscribe((res:ApplicationVerificationResponse)=>{
        console.log(res);
        if(res.isSuccess){
          this.applicationData.set(res.result);
          this.permit_type_id.set(res.result.applicationForId);
          this.code.set(res.result.applicationCode ?? '');
          this.id.set(res.result.applicationId ?? '');
          this.message.set(res.message ?? '');
        }
    })
 }

 formatPhoneNumber(phone: string | null | undefined): string {

  if (!phone) {
    return '';
  }

  // Remove all non-numeric characters
  const digits = phone.replace(/\D/g, '');

  // US phone number must contain 10 digits
  if (digits.length !== 10) {
    return phone;
  }

  return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
}









}
