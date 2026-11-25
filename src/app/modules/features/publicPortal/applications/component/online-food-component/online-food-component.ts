
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

// Angular Material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-online-food-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './online-food-component.html',
  styleUrl: './online-food-component.css'
})
export class OnlineFoodComponent {

  applicationForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.applicationForm = this.fb.group({

      application_type: ['online'],
      initial_applications: [''],

      application_date: [null, Validators.required],
      other_business_type: [''],
      non_profit: [0],
      tax_id_number: [''],

      // Keep this as an array if you enable multiple selection.
      special_process: [[]],
      business_type: [[]],


    });

  }

  submitApplication(): void {

    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    const formValue = this.applicationForm.getRawValue();

    // Convert the Date object to YYYY-MM-DD for the API.
    const date = formValue.application_date;

    const payload = {
      ...formValue,
      application_date: date
        ? this.formatDate(date)
        : null
    };

    console.log('Application Data:', payload);

    // Call your API service here.
  }

  private formatDate(date: Date): string {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

}
