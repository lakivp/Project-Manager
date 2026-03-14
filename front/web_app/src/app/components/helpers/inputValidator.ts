import { FormGroup, NgModel } from '@angular/forms';

export function checkInput(pattern: RegExp, form: FormGroup, type: string) {
  let inputValue = form.get(type)?.value;
  console.log(inputValue, form, type);
  if (!pattern.test(inputValue)) {
    form.get(type)?.setErrors({ invalidInput: true });
  } else {
    form.get(type)?.setErrors(null);
  }
}

export function checkNgInput(
  pattern: RegExp,
  inputValue: string,
  ngModel: NgModel
) {
  console.log(inputValue, ngModel);
  if (!pattern.test(inputValue)) {
    ngModel.control.setErrors({ invalidInput: true });
  } else {
    ngModel.control.setErrors(null);
  }
}
