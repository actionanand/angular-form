import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';

import { LoginComponent } from './template-driven/login/login.component';
import { LoginComponent2 } from './reactive/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [LoginComponent, NgStyle, LoginComponent2],
})
export class AppComponent {
  title1 = 'Angular Forms - Template Driven';
  title2 = 'Angular Forms - Reactive';
  isTempDriven = true;

  onChangeForm() {
    this.isTempDriven = !this.isTempDriven;
  }
}
