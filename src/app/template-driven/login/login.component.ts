import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-template-driven',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class TemplateDrivenComponent {
  minPassLength = 5;
  private formObj = viewChild.required<NgForm>('formEl');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const localFormVal = localStorage.getItem('saved-login-form');

      if (localFormVal) {
        const savedFormEmail = JSON.parse(localFormVal).email;

        /* // to set value for whole form

        setTimeout(() => {
          this.formObj().setValue({
            emailField: savedFormEmail,
            passField: '',
          });
        }, 1); */

        setTimeout(() => {
          this.formObj().controls['emailField'].setValue(savedFormEmail);
        }, 1);
      }

      const formSub = this.formObj()
        .valueChanges?.pipe(debounceTime(1000))
        .subscribe({
          next: form => {
            localStorage.setItem('saved-login-form', JSON.stringify({ email: form.emailField }));
          },
        });

      this.destroyRef.onDestroy(() => formSub?.unsubscribe());
    });
  }

  onSubmit(formEl: NgForm) {
    if (formEl.form.invalid) {
      return;
    }

    console.log('Form Obj(NgForm) : ', formEl);

    console.log("formEl.form.controls['emailField'] => ", formEl.form.controls['emailField']);
    console.log("formEl.form.controls['emailField'].value => ", formEl.form.controls['emailField'].value);
    console.log("formEl.form.value['emailField'] => ", formEl.form.value['emailField']);

    formEl.form.reset();
  }
}
