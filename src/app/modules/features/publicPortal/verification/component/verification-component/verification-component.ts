import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-verification-component',
  styleUrl: './verification-component.css',
  templateUrl: './verification-component.html',
})
export class VerificationComponent {

  permit_type_id:number = 1;
  code:string = 'RF';
  id:string = 'ADEEsdfd343SSF242452234';



}
