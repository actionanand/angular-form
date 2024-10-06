import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { debounceTime } from 'rxjs';
import { RatingComponent } from '../../control-value-accessor/rating/rating.component';

type MyArray = {
  name: string;
  value: string;
};

// factory function - function will return function
function isValueEqual(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    // we apply this validation function to 'formGroup', not to 'formControl', So value won't be available as below function
    // below commented codes will five same value as val1
    // this.formObj.controls.passwords.value.password
    // this.formObj.controls['passwords'].get('password')?.value
    // this.formObj.controls.passwords.get('password')?.value

    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    if (val1 === val2) {
      return null;
    } else {
      return { valuesNotEqual: true };
    }
  };
}

function valueMustBeTrue(control: AbstractControl) {
  const val = control.value;

  if (val === true) {
    return null;
  } else {
    return { valueNotTrue: true };
  }
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RatingComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  protected readonly minPassLen = 5;
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

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

  formObj = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(this.minPassLen)],
        }),
        confirmPass: new FormControl('', {
          validators: [Validators.required, Validators.minLength(this.minPassLen)],
        }),
      },
      {
        validators: [isValueEqual('password', 'confirmPass')],
      },
    ),
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
    hobbies: new FormArray([]),
    rating: new FormControl(null),
    terms: new FormControl(false, [Validators.required, valueMustBeTrue]),
  });

  /*
  formObj = this.fb.group({
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email]
    }),
    passwords: this.fb.group({
      password: this.fb.control('', [Validators.required, Validators.minLength(this.minPassLen)]),
      confirmPass: this.fb.control('', [Validators.required, Validators.minLength(this.minPassLen)]),
    }, {
      validators: [isValueEqual('password', 'confirmPass')],
    }),
    firstName: this.fb.control('', [Validators.required]),
    lastName: this.fb.control('', {
      validators: [Validators.required]
    }),
    address: this.fb.group({
      street: this.fb.control('', [Validators.required]),
      number: this.fb.control('', [Validators.required]),
      postal: this.fb.control('', [Validators.required]),
      city: this.fb.control('', [Validators.required]),
    }),
    role: this.fb.control<'student' | 'teacher' | 'employee' | 'founder' | 'other'>('student', {
      validators: [Validators.required]
    }),
    gender: this.fb.control<'male' | 'female' | 'others' | null>(null, [Validators.required]),
    sourceAr: this.fb.array([this.fb.control(false), this.fb.control(false), this.fb.control(false)]),
    fruitsAr: this.fb.array([]),
    hobbies: this.fb.array([]),
    rating: this.fb.control(null),
    terms: this.fb.control(false, [Validators.required, valueMustBeTrue])
  });
  */

  ngOnInit(): void {
    const formValSub = this.formObj.valueChanges.pipe(debounceTime(5000)).subscribe({
      next: value =>
        console.log('Form Changed (form value will be displayed every 5s after you stopped typing): ', value),
    });

    this.destroyRef.onDestroy(() => formValSub.unsubscribe());
  }

  get fruitsChecked() {
    return this.formObj.get('fruitsAr') as FormArray;
  }

  get hobbiesControls() {
    return <FormArray>this.formObj.get('hobbies');
  }

  onCheckedFruits(e: Event) {
    // const fruitsChecked: FormArray = this.formObj.get('fruitsAr') as FormArray;
    const checkedVal = (e.target as HTMLInputElement).value;

    console.log('Fruit checked: ', e);
    console.log(e.target);

    if ((e.target as HTMLInputElement).checked) {
      // Add a new control in the FormArray
      this.fruitsChecked.push(new FormControl(checkedVal));
    } else {
      // find the unselected element
      let i = 0;

      this.fruitsChecked.controls.forEach(FrmCtrl => {
        if (FrmCtrl.value == checkedVal) {
          this.fruitsChecked.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    this.hobbiesControls.push(control);
  }

  onRemoveHobby(index: number) {
    this.hobbiesControls.removeAt(index);
  }

  onClearAll() {
    if (confirm('Are you sure to clear your hobbies?')) {
      this.hobbiesControls.clear();
    }
  }

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
