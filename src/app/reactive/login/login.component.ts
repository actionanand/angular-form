/* eslint-disable @angular-eslint/component-class-suffix */
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login2',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent2 {
  minLength = 5;

  formObj = new FormGroup({
    emailField: new FormControl('', [Validators.required, Validators.email]),
    passField: new FormControl('', {
      validators: [Validators.required, Validators.minLength(this.minLength)],
    }),
  });

  get isEmailValid() {
    return (
      this.formObj.controls.emailField.touched &&
      this.formObj.controls.emailField.dirty &&
      this.formObj.controls.emailField.invalid
    );
  }

  get isPassValid() {
    return (
      this.formObj.controls.passField.touched &&
      this.formObj.controls.passField.dirty &&
      this.formObj.controls.passField.invalid
    );
  }

  onSubmit() {
    // this.formObj.controls.emailField.addValidators
  }
}
