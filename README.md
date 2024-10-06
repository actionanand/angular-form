# Angular Forms- Deep Dive

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.3.

## Cloning Guide

1.  Clone only the remote primary HEAD (default: origin/master)

```bash
git clone <url> --single-branch
```

2. Only specific branch

```bash
git clone <url> --branch <branch> --single-branch [<folder>]
```

```bash
git clone <url> --branch <branch>
```

3. Cloning repositories using degit

   - master branch is default.

```bash
npx degit github:user/repo#branch-name <folder-name>
```

4. Cloning this project with skeleton

```bash
git clone https://github.com/actionanand/angular-form.git --branch 1-skeleton angular-proj-name
```

```bash
npx degit github:actionanand/angular-form#1-skeleton angular-proj-name
```

## Automate using `Prettier`, `Es Lint` and `Husky`

1. Install the compatible node version

```bash
  nvm install v20.13.1
```

2. Install and Configure Prettier

   - Install prettier as below:

   ```bash
     yarn add prettier -D
   ```

   - Create a `.prettierrc` file and write down the format as below: - [online ref](https://prettier.io/docs/en/options.html)

   ```yml
   trailingComma: 'all'
   tabWidth: 2
   useTabs: false
   semi: true
   singleQuote: true
   bracketSpacing: true
   bracketSameLine: true
   arrowParens: 'avoid'
   printWidth: 120
   overrides:
     - files:
         - '*.js'
         - '*.jsx'
       options:
         bracketSpacing: true
         jsxSingleQuote: true
         semi: true
         singleQuote: true
         tabWidth: 2
         useTabs: false
     - files:
         - '*.ts'
       options:
         tabWidth: 2
   ```

   - Create a `.prettierignore` file and write as below(sample)

   ```gitignore
   # Ignore artifacts:
   build
   coverage
   e2e
   node_modules
   dist
   dest
   reports

   # Ignore files
   *.lock
   package-lock.json
   yarn.lock
   ```

3. Install `Es Lint`, if not installed

```bash
ng add @angular-eslint/schematics
```

if error comes, use the below command

```shell
ng add @angular-eslint/schematics@next
```

4. Configure pre-commit hooks

Pre-commit hooks are a nice way to run certain checks to ensure clean code. This can be used to format staged files if for some reason they weren’t automatically formatted during editing. [husky](https://github.com/typicode/husky) can be used to easily configure git hooks to prevent bad commits. We will use this along with [pretty-quick](https://github.com/azz/pretty-quick) to run Prettier on our changed files. Install these packages, along with [npm-run-all](https://github.com/mysticatea/npm-run-all), which will make it easier for us to run npm scripts:

```bash
yarn add husky pretty-quick npm-run-all -D
```

To configure the pre-commit hook, simply add a `precommit` npm script. We want to first run Prettier, then run TSLint on the formatted files. To make our scripts cleaner, I am using the npm-run-all package, which gives you two commands, `run-s` to run scripts in sequence, and `run-p` to run scripts in parallel:

```json
  "precommit": "run-s format:fix lint",
  "format:fix": "pretty-quick --staged",
  "format:check": "prettier --config ./.prettierrc --list-different \"src/{app,environments,assets}/**/*{.ts,.js,.json,.css,.scss}\"",
  "format:all": "prettier --config ./.prettierrc --write \"src/{app,environments,assets}/**/*{.ts,.js,.json,.css,.scss}\"",
  "lint": "ng lint",
```

5. Initialize husky

   - Run it once

   ```bash
     npm pkg set scripts.prepare="husky install"
     npm run prepare
   ```

   - Add a hook

   ```bash
     npx husky add .husky/pre-commit "yarn run precommit"
     npx husky add .husky/pre-commit "yarn test"
     git add .husky/pre-commit
   ```

   - Make a commit

   ```bash
     git commit -m "Keep calm and commit"
     # `yarn run precommit and yarn test` will run every time you commit
   ```

6. How to skip prettier format only in particular file

   1. JS

   ```js
   matrix(1, 0, 0, 0, 1, 0, 0, 0, 1);

   // prettier-ignore
   matrix(
       1, 0, 0,
       0, 1, 0,
       0, 0, 1
     )
   ```

   2. JSX

   ```jsx
   <div>
     {/* prettier-ignore */}
     <span     ugly  format=''   />
   </div>
   ```

   3. HTML

   ```html
   <!-- prettier-ignore -->
   <div         class="x"       >hello world</div            >

   <!-- prettier-ignore-attribute -->
   <div (mousedown)="       onStart    (    )         " (mouseup)="         onEnd      (    )         "></div>

   <!-- prettier-ignore-attribute (mouseup) -->
   <div (mousedown)="onStart()" (mouseup)="         onEnd      (    )         "></div>
   ```

   4. CSS

   ```css
   /* prettier-ignore */
   .my    ugly rule
     {
   
     }
   ```

   5. Markdown

   ```md
     <!-- prettier-ignore -->

   Do not format this
   ```

   6. YAML

   ```yml
   # prettier-ignore
   key  : value
     hello: world
   ```

   7. For more, please [check](https://prettier.io/docs/en/ignore.html)

## Resources

- [GitHub Actions for Angular](https://github.com/rodrigokamada/angular-github-actions)
- [Angular 16 - milestone release](https://github.com/actionanand/ng16-signal-milestone-release)
- [Adding custom validators to template-driven forms - Official](https://angular.dev/guide/forms/form-validation#adding-custom-validators-to-template-driven-forms)
- [Angular form github - my proj1](https://github.com/actionanand/ng-rough-work)
- [Angular form github - my proj2](https://github.com/actionanand/Angular-study-routing)

## Issue with `Template driven` form

If you try to update (say email value when app loads) template driven form programmatically using `setValue` on `NgForm`, it'll throw the error as below
![image](https://github.com/user-attachments/assets/6cbfe931-7b7e-4f19-892b-df7ad3b1e967)

We have to use `setTimeout` to fix the issue as below:

```ts
// to set value for whole form

setTimeout(() => {
  this.formData().setValue({
    email: 'anand@ar.com',
    password: '',
  });
}, 1);
```

If you try to update (say email value when app loads) template driven form programmatically using `setValue` on the `controls` of `NgForm`, it'll throw the error as below
![image](https://github.com/user-attachments/assets/b865d5cc-8fd6-4781-aacc-4989bd40b8dd)

We have to use `setTimeout` to fix the issue as below:

```ts
setTimeout(() => {
  this.formData().controls['emailField'].setValue('anand@ar.com');
}, 1);
```

See the code in this project [here](https://github.com/actionanand/angular-form/blob/master/src/app/auth/login/login.component.ts)

## Wiki

### Custom Form Controls `ControlValueAccessor`:

This interface lets you create custom input components that integrate seamlessly with Angular forms. You can define how your component reads and writes values to the form control, as well as how it handles validation and change detection.

### FormArrays:

Manage lists of form controls that can be added or removed dynamically.

### FormGroup:

Create nested form groups to represent complex data structures.

### Observables:

1. `valueChanges`: Use the valueChanges observable to track changes to form controls or the entire form.
2. `patchValue` and `setValue`: Update form control values programmatically.

### onSubmit:

Handle form submission events and process the form data.

### `ControlValueAccessor` (CVA) - Explanation

1. `NG_VALUE_ACCESSOR`: This provider tells Angular that your component can act as a CVA.
2. `writeValue`: This method is called by Angular when the form control's value changes.
3. `registerOnChange`: This method is called by Angular to register a callback function that will be called when the component's value changes.
4. `registerOnTouched`: This method is called by Angular to register a callback function that will be called when the component is touched.

The `NG_VALUE_ACCESSOR` is binding things to component's `:host` and linking to methods (`ControlValueAccessor` methods) there. Your module does not have any of those form methods (like `writeValue`, `registerOnTouched` etc). Your form element does. So providing at component level binds this for that specific element. Additionally, providing so deep down means each form control has it's own control value accessor and not a shared one.

Angular Form controls and its API is not the same as the DOM form controls. What angular does is binds to the inputs/outputs of the dom element and provides you with the results. Now, with your custom control, you must provide the same bindings there. By implementing `ControlValueAccessor` and providing `NG_VALUE_ACCESSOR`, you are telling Angular's Forms API how it can read and write values from/to your custom form control. - [Source](https://stackoverflow.com/questions/48085713/why-do-i-need-to-provide-ng-value-accessor-at-the-component-level)

`NG_VALUE_ACCESSOR` is just an injection token for ControlValueAccessor. You can refer the below one:

```ts
const NG_VALUE_ACCESSOR: InjectionToken<readonly ControlValueAccessor[]>;
```

### The expanded provider configuration is an object literal with two properties:

- The `provide` property holds the token that serves as the key for consuming the dependency value.
- The second property is a provider definition object, which tells the injector how to create the dependency value. The provider-definition can be one of the following:
  1. `useClass` - this option tells Angular DI to instantiate a provided class when a dependency is injected
  2. `useExisting` - allows you to alias a token and reference any existing one.
  3. `useFactory` - allows you to define a function that constructs a dependency.
  4. `useValue` - provides a static value that should be used as a dependency.

## Sources

1. [How to PROPERLY implement ControlValueAccessor - Angular Form](https://blog.woodies11.dev/how-to-properly-implement-controlvalueaccessor/)
2. [CSS Previous sibling selectors and how to fake them](https://medium.com/free-code-camp/how-to-make-the-impossible-possible-in-css-with-a-little-creativity-bd96bb42b29d)
