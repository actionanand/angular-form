# Rating Component and ControlValueAccessor

This document explains how the rating component works and how it connects to Angular forms through `ControlValueAccessor`.

Component file:

```text
src/app/control-value-accessor/rating/rating.component.ts
```

Template file:

```text
src/app/control-value-accessor/rating/rating.component.html
```

## What The Component Does

`RatingComponent` is a custom form control. It displays five clickable SVG stars and lets the user select a rating value from `1` to `5`.

Angular forms already know how to work with native controls such as:

```html
<input />
<select></select>
<textarea></textarea>
```

But this rating UI is not a native form element. Angular does not automatically know:

- how to write a form value into the stars
- how to read the selected star value
- when the control has been touched
- when the control should become disabled

That is why the component implements `ControlValueAccessor`.

## How It Is Used

In a reactive form, the component is used like this:

```html
<app-rating formControlName="rating" />
```

The reactive form defines the matching control:

```ts
rating: new FormControl(null),
```

In a template-driven form, it is used like this:

```html
<app-rating name="rating" ngModel #rating="ngModel" />
```

In both cases, Angular treats `<app-rating>` like a normal form control because the component registers itself as a value accessor.

## The Provider Configuration

The component has this provider:

```ts
providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RatingComponent),
    multi: true,
  },
],
```

This tells Angular:

"`RatingComponent` knows how to behave like a form control. Use this component whenever Angular forms need a value accessor for `<app-rating>`."

### `NG_VALUE_ACCESSOR`

`NG_VALUE_ACCESSOR` is Angular's injection token for value accessors.

A value accessor is the bridge between Angular forms and the UI element. For example, Angular has built-in value accessors for native inputs. Your rating component provides a custom one.

When Angular sees this:

```html
<app-rating formControlName="rating" />
```

it looks for a `NG_VALUE_ACCESSOR` provider on `app-rating`. Because this component provides one, Angular can connect the form control to the component.

### `useExisting`

This line:

```ts
useExisting: forwardRef(() => RatingComponent)
```

means:

"Use the already-created instance of `RatingComponent` as the value accessor."

This is important. The component itself implements `ControlValueAccessor`, so Angular should use the current component instance.

If `useClass` were used instead, Angular would create a separate instance of the class, which is not what we want. The form should talk to the same component instance that is rendering the stars.

### `forwardRef`

`forwardRef` lets Angular refer to `RatingComponent` before the class is fully defined.

The provider metadata is evaluated while the decorator is being processed, but the class declaration is still in progress. This can create a timing problem when the decorator needs to refer to the class itself.

This solves that:

```ts
forwardRef(() => RatingComponent)
```

Instead of using `RatingComponent` immediately, Angular stores a function and resolves the class later.

So this:

```ts
useExisting: forwardRef(() => RatingComponent)
```

means:

"Later, when Angular needs this provider, use the existing `RatingComponent` instance."

### `multi: true`

`NG_VALUE_ACCESSOR` is a multi-provider token. Angular can have many value accessors registered in the application.

This line:

```ts
multi: true
```

means:

"Add this provider to the existing list of value accessors."

Without `multi: true`, this provider could replace other value accessors registered for the same token, which would break form behavior elsewhere.

## The ControlValueAccessor Interface

The component implements:

```ts
export class RatingComponent implements ControlValueAccessor
```

`ControlValueAccessor` requires the component to provide these methods:

```ts
writeValue(value: any): void
registerOnChange(fn: any): void
registerOnTouched(fn: any): void
setDisabledState?(isDisabled: boolean): void
```

These methods define the communication contract between Angular forms and the custom component.

## Direction 1: Angular Form To Component

When the form value changes from outside the component, Angular calls `writeValue`.

In this component:

```ts
writeValue(val: number) {
  this.starVal = val;
}
```

Example:

```ts
this.formObj.patchValue({
  rating: 4,
});
```

Angular calls:

```ts
ratingComponent.writeValue(4);
```

Then the component stores:

```ts
this.starVal = 4;
```

The template uses `starVal` to mark selected stars:

```html
[ngClass]="{ selected: star.stars <= starVal }"
```

So if `starVal` is `4`, stars `1`, `2`, `3`, and `4` receive the `selected` class.

## Direction 2: Component To Angular Form

When the user clicks a star, the template calls:

```html
(click)="setRating(star)"
```

The component method is:

```ts
setRating(star: { stars: number; text: string }) {
  if (!this.disabled) {
    this.starVal = star.stars;
    this.ratingText = star.text;
    this.onChanged(star.stars);
    this.onTouched();
  }
}
```

This method does four important things.

First, it updates the component's own selected value:

```ts
this.starVal = star.stars;
```

Second, it stores the label text for the selected rating:

```ts
this.ratingText = star.text;
```

Third, it tells Angular forms that the value changed:

```ts
this.onChanged(star.stars);
```

Fourth, it tells Angular forms that the control was touched:

```ts
this.onTouched();
```

This is the main reason `ControlValueAccessor` exists. The component updates its own UI, then notifies Angular forms about the new value.

## `registerOnChange`

Angular calls this method and passes in a callback function:

```ts
registerOnChange(fn: any) {
  this.onChanged = fn;
}
```

The component stores that callback in:

```ts
private onChanged: any = () => {};
```

Later, when the user selects a star, the component calls:

```ts
this.onChanged(star.stars);
```

That sends the selected value back to Angular's form model.

For example, after clicking the fifth star:

```ts
this.onChanged(5);
```

Angular updates the form value:

```ts
rating: 5
```

## `registerOnTouched`

Angular calls this method and passes in another callback:

```ts
registerOnTouched(fn: any) {
  this.onTouched = fn;
}
```

The component stores it in:

```ts
private onTouched: any = () => {};
```

When the user interacts with the rating control, the component calls:

```ts
this.onTouched();
```

That tells Angular that the control has been touched. This matters for validation and UI states such as:

- `touched`
- `untouched`
- showing validation messages only after interaction

## `writeValue`

`writeValue` is called by Angular when Angular wants to push a value into the component.

```ts
writeValue(val: number) {
  this.starVal = val;
}
```

Common situations where Angular may call `writeValue`:

- the form is initialized with a value
- `setValue` is called
- `patchValue` is called
- the form is reset
- template-driven `ngModel` writes a model value into the component

Important detail: `writeValue` should update the UI, but it should not call `onChanged`.

Why? Because `writeValue` means Angular is already writing a value into the component. Calling `onChanged` from inside `writeValue` could create unnecessary loops.

## `setDisabledState`

Angular calls this method when the form control is enabled or disabled.

```ts
setDisabledState(isDisabled: boolean): void {
  this.disabled = isDisabled;
}
```

The template uses `disabled` here:

```html
<div class="stars" [ngClass]="{ disabled: disabled }">
```

The click handler also checks it:

```ts
if (!this.disabled) {
  ...
}
```

So when the form disables the control, the rating component:

- applies disabled styling
- prevents rating changes
- prevents calling `onChanged`
- prevents calling `onTouched`

Example:

```ts
this.formObj.controls.rating.disable();
```

Angular calls:

```ts
setDisabledState(true);
```

Then the component stops accepting star clicks.

## Template Behavior

The template loops over the available ratings:

```html
@for (star of ratings; track star.stars) {
  ...
}
```

Each item in `ratings` has:

```ts
{
  stars: number;
  text: string;
}
```

For each rating, the template renders one SVG star.

The selected stars are controlled by:

```html
[ngClass]="{ selected: star.stars <= starVal }"
```

If the current value is `3`, then:

- star 1 is selected
- star 2 is selected
- star 3 is selected
- star 4 is not selected
- star 5 is not selected

The hover text is controlled by:

```html
(mouseover)="displayText = !disabled ? star.text : ''"
(mouseout)="displayText = ratingText ? ratingText : ''"
```

On mouse over, the component temporarily displays the text for the hovered star.

On mouse out, it returns to the selected rating text if one exists.

The selected rating is handled by:

```html
(click)="setRating(star)"
```

## Complete Flow When User Clicks A Star

Suppose the user clicks the fourth star.

1. The template calls `setRating(star)`.
2. `star.stars` is `4`.
3. The component checks that it is not disabled.
4. The component sets `this.starVal = 4`.
5. The component sets `this.ratingText` to the matching text.
6. The component calls `this.onChanged(4)`.
7. Angular updates the form control value to `4`.
8. The component calls `this.onTouched()`.
9. Angular marks the form control as touched.
10. The template updates the selected star classes.

## Complete Flow When Form Writes A Value

Suppose the parent form writes a value:

```ts
this.formObj.patchValue({
  rating: 2,
});
```

The flow is:

1. Angular finds the `rating` form control.
2. Angular finds the `RatingComponent` value accessor through `NG_VALUE_ACCESSOR`.
3. Angular calls `writeValue(2)`.
4. The component sets `this.starVal = 2`.
5. The template marks stars `1` and `2` as selected.

In this direction, the component does not call `onChanged`, because the value already came from Angular.

## Important Internal Properties

```ts
protected readonly ratings = [...]
```

Stores the list of star options displayed by the template.

```ts
disabled = false;
```

Tracks whether the control is disabled by the Angular form.

```ts
ratingText = '';
```

Stores the selected rating label.

```ts
displayText = '';
```

Stores the text currently displayed in the template. It changes on hover.

```ts
starVal!: number;
```

Stores the selected numeric rating.

```ts
private onChanged: any = () => {};
private onTouched: any = () => {};
```

Store the callbacks that Angular forms provides through `registerOnChange` and `registerOnTouched`.

The default empty functions prevent errors if the component calls them before Angular registers the real callbacks.

## Why This Component Works With Both Form Types

The same `ControlValueAccessor` implementation works with:

```html
<app-rating formControlName="rating" />
```

and:

```html
<app-rating name="rating" ngModel />
```

because both reactive forms and template-driven forms use the same value accessor mechanism internally.

The parent form syntax changes, but the component contract stays the same:

- Angular writes values using `writeValue`
- Angular registers change handling using `registerOnChange`
- Angular registers touched handling using `registerOnTouched`
- Angular controls disabled state using `setDisabledState`
- the component sends user changes back using `onChanged`
- the component sends user interaction state back using `onTouched`

## Summary

`RatingComponent` is a custom form control because it implements `ControlValueAccessor` and provides itself through `NG_VALUE_ACCESSOR`.

`forwardRef(() => RatingComponent)` lets Angular refer to the component class from inside its own decorator metadata.

`useExisting` makes Angular use the same component instance that is already on the page.

`multi: true` safely adds this accessor to Angular's list of value accessors.

The key idea is that `ControlValueAccessor` creates a two-way bridge:

```text
Angular form value -> writeValue -> RatingComponent UI
RatingComponent click -> onChanged -> Angular form value
RatingComponent interaction -> onTouched -> Angular form touched state
Angular disabled state -> setDisabledState -> RatingComponent disabled UI
```
