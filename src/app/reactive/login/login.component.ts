/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { debounceTime, of } from 'rxjs';

const reqSymbol = '?';
const reservedEmail = 'ar@example.com';

function isPasswordContainReqChar(control: AbstractControl) {
  if (control.value?.includes(reqSymbol)) {
    return null;
  } else {
    return { PassNotHaveSymbol: true };
  }
}

function isEmailValidAsync(control: AbstractControl) {
  if (control.value !== reservedEmail) {
    return of(null);
  } else {
    return of({ isReservedEmailUsed: true });
  }
}

@Component({
  selector: 'app-login2',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent2 implements OnInit {
  minLength = 5;
  reqSymbolVal = reqSymbol;
  reservedEmailVal = reservedEmail;

  private destroyRef = inject(DestroyRef);

  formObj = new FormGroup({
    emailField: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [isEmailValidAsync],
    }),
    passField: new FormControl('', [
      Validators.required,
      Validators.minLength(this.minLength),
      isPasswordContainReqChar,
    ]),
  });

  ngOnInit(): void {
    const localFormVal = localStorage.getItem('saved-login-form');

    if (localFormVal) {
      const savedEmail = JSON.parse(localFormVal).email;

      this.formObj.patchValue({
        emailField: savedEmail,
      });
    }

    const formSub = this.formObj.valueChanges.pipe(debounceTime(1000)).subscribe({
      next: value => {
        localStorage.setItem('saved-login-form', JSON.stringify({ email: value.emailField }));
      },
    });

    this.destroyRef.onDestroy(() => formSub.unsubscribe());
  }

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
    if (this.formObj.invalid) {
      return;
    }

    // this.formObj.controls.emailField.addValidators
    console.log('this.formObj.controls.emailField => ', this.formObj.controls.emailField);
    console.log('this.formObj.value => ', this.formObj.value);

    this.formObj.reset();
  }
}
