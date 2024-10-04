import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  protected readonly minPassLen = 5;

  formObj = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(this.minPassLen)],
      }),
      confirmPass: new FormControl('', {
        validators: [Validators.required, Validators.minLength(this.minPassLen)],
      }),
    }),
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    address: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required],
      }),
      number: new FormControl('', {
        validators: [Validators.required],
      }),
      postal: new FormControl('', {
        validators: [Validators.required],
      }),
      city: new FormControl('', {
        validators: [Validators.required],
      }),
    }),
    role: new FormControl<'student' | 'teacher' | 'employee' | 'founder' | 'other'>('student', {
      validators: [Validators.required],
    }),
    gender: new FormControl<'male' | 'female' | 'others' | null>(null, {
      validators: [Validators.required],
    }),
    source: new FormArray([new FormControl(false), new FormControl(false), new FormControl(false)]),
    agree: new FormControl(false, { validators: [Validators.required] }),
  });

  onSubmit() {
    console.log('this.formObj => ', this.formObj);
    console.log('this.formObj.value => ', this.formObj.value);
  }

  onReset() {
    this.formObj.reset();
  }
}
