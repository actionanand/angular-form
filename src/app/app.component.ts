import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';

import { TemplateDrivenComponent } from './template-driven/login/login.component';
import { LoginComponent } from './reactive/login/login.component';
import { SignupComponent } from './reactive/signup/signup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [TemplateDrivenComponent, NgStyle, LoginComponent, SignupComponent],
})
export class AppComponent {
  formNumber = 0;

  get formTitle() {
    if (this.formNumber === 0) {
      return 'Angular Forms - Template Driven';
    } else if (this.formNumber === 1) {
      return 'Angular Forms - Reactive simple';
    } else {
      return 'Angular Forms - Reactive Adv.';
    }
  }

  selectedForm = {
    TD_LOGIN: 0,
    RF_LOGIN: 1,
    RF_SIGNUP: 2,
  };

  onChangeForm() {
    if (this.formNumber < 2) {
      this.formNumber++;
    } else {
      this.formNumber = 0;
    }
  }
}
