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
    if (this.formObj.invalid) {
      return;
    }

    console.log('this.formObj => ', this.formObj);
    console.log('this.formObj.value => ', this.formObj.value);

    console.log(
      `'this.formObj.controls.passwords' or 'this.formObj.get('passwords')' => `,
      this.formObj.controls.passwords,
    );
    console.log(
      `'this.formObj.controls.passwords.value' or 'this.formObj.get('passwords')?.value' => `,
      this.formObj.controls.passwords.value,
    );
    console.log(
      `'this.formObj.controls.passwords.value.password' or 'this.formObj.get('passwords.password').value' => `,
      this.formObj.controls.passwords.value.password,
    );
  }

  onReset() {
    this.formObj.reset();
  }
}
