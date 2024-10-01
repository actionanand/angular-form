import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  minPassLength = 5;
  private formData = viewChild.required<NgForm>('formEl');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const localFormVal = localStorage.getItem('saved-login-form');

      if (localFormVal) {
        const savedFormEmail = JSON.parse(localFormVal).email;

        this.formData().setValue({
          email: savedFormEmail,
          password: '',
        });
      }

      const formSub = this.formData()
        .valueChanges?.pipe(debounceTime(1000))
        .subscribe({
          next: form => {
            localStorage.setItem('saved-login-form', JSON.stringify({ email: form.email }));
          },
        });

      this.destroyRef.onDestroy(() => formSub?.unsubscribe());
    });
  }

  onSubmit(formEl: NgForm) {
    if (formEl.form.invalid) {
      return;
    }

    console.log(formEl);

    formEl.form.reset();
  }
}
