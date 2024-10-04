import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  formObj = new FormGroup({
    email: new FormControl(''),
    passwords: new FormGroup({
      password: new FormControl(''),
      confirmPass: new FormControl(''),
    }),
  });

  onSubmit() {
    console.log(this.formObj.value);
  }

  onReset() {
    this.formObj.reset();
  }
}
