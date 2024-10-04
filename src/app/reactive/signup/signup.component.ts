import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type MyArray = {
  name: string;
  value: string;
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  protected readonly minPassLen = 5;

  protected readonly genderNames = [
    { name: 'Male', value: 'male' },
    { name: 'Female', value: 'female' },
    { name: 'Not prefer to tell', value: 'others' },
  ];

  protected readonly professon = [
    { name: 'Student', value: 'student' },
    { name: 'Teacher', value: 'teacher' },
    { name: 'Employee', value: 'employee' },
    { name: 'Founder', value: 'founder' },
    { name: 'Other', value: 'other' },
  ];

  protected readonly source: Array<MyArray> = [
    { name: 'Google', value: 'google' },
    { name: 'Friend', value: 'friend' },
    { name: 'Other', value: 'other' },
  ];

  protected readonly fruits: Array<MyArray> = [
    { name: 'Banana', value: 'banana' },
    { name: 'Apple', value: 'apple' },
    { name: 'Kiwi', value: 'kiwi' },
    { name: 'Papaya', value: 'papaya' },
    { name: 'Lemon', value: 'lemon' },
    { name: 'Grapes', value: 'grapes' },
    { name: 'Orange', value: 'orange' },
  ];

  // hobbyArray: string[] = null;

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
    sourceAr: new FormArray([new FormControl(false), new FormControl(false), new FormControl(false)]),
    fruitsAr: new FormArray([]),
    agree: new FormControl(false, { validators: [Validators.required] }),
  });

  onCheckedFruits(e: Event) {
    const fruitsChecked: FormArray = this.formObj.get('fruitsAr') as FormArray;
    const checkedVal = (e.target as HTMLInputElement).value;

    console.log('Fruit checked: ', e);
    console.log(e.target);

    if ((e.target as HTMLInputElement).checked) {
      // Add a new control in the FormArray
      fruitsChecked.push(new FormControl(checkedVal));
    } else {
      // find the unselected element
      let i = 0;

      fruitsChecked.controls.forEach(FrmCtrl => {
        if (FrmCtrl.value == checkedVal) {
          fruitsChecked.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

  onSubmit() {
    if (this.formObj.invalid) {
      // return;
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
