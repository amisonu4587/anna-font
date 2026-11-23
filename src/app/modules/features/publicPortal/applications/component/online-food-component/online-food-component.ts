import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  imports: [MatDatepickerModule,
  MatInputModule,
  MatFormFieldModule,
  MatNativeDateModule],
  selector: 'app-online-food-component',
  styleUrl: './online-food-component.css',
  templateUrl: './online-food-component.html',
})
export class OnlineFoodComponent {



  openDatePicker(input: HTMLInputElement) {
  if (typeof input.showPicker === 'function') {
    input.showPicker();
  }
}
}
