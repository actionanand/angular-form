/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.less',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
})
export class RatingComponent implements ControlValueAccessor {
  protected readonly ratings = [
    {
      stars: 1,
      text: 'Feeling Sad 😔',
    },
    {
      stars: 2,
      text: 'Feeling Meh ☹️',
    },
    {
      stars: 3,
      text: 'Feeling Ok 🙂',
    },
    {
      stars: 4,
      text: 'Feeling Good 😀',
    },
    {
      stars: 5,
      text: 'Feeling Awesome 😍',
    },
  ];

  disabled = false;
  ratingText = '';
  displayText = '';
  starVal!: number;

  private onChanged: any = () => {};
  private onTouched: any = () => {};

  writeValue(val: number) {
    this.starVal = val;
  }

  registerOnChange(fn: any) {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setRating(star: { stars: number; text: string }) {
    if (!this.disabled) {
      this.starVal = star.stars;
      this.ratingText = star.text;
      this.onChanged(star.stars);
      this.onTouched();
    }
  }
}
