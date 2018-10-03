import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { User } from './user.model';
import * as CustomValidators from './custom-validators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  user = new User();

  // Reactive approach for validation messages ( Refactor later )
  emailMessage: string;
  private validationMessages = {
    required: 'Please enter your email address',
    email: 'Please enter a valid email address'
  }
  // Reactive approach for validation messages

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.maxLength(30)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required]
      }, { validator: CustomValidators.emailMatcher }),
      phone: '',
      notification: 'email',
      rating: ['', CustomValidators.ratingRange(1, 5)],
      sendCatalog: true
    });

    this.signupForm
      .get('notification')
      .valueChanges
      .subscribe((value: string) => this.setNotification(value));

  // Reactive approach for validation messages for email Control ( Refactor later for other controls)
    const emailControl = this.signupForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(debounceTime(1000))
      .subscribe((value) => this.setMessage(emailControl));
  }

  onSubmit() {
    console.log(this.signupForm);
    console.log(`Saved ${JSON.stringify(this.signupForm.value)}`);
  }

  onSuperUser() {
    this.signupForm.setValue({
      firstname: 'Marko',
      lastname: 'Bojic',
      emailGroup: {
        email: 'bojic.marko021@gmail.com',
        confirmEmail: 'bojic.marko021@gmail.com'
      },
      phone: '',
      notification: 'email',
      rating: '',
      sendCatalog: false,
    })
  }

  onSetDefaultName() {
    this.signupForm.patchValue({
      firstname: 'Jedi'
    })
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.signupForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  // Reactive approach for setting validation messages for email Control ( Refactor later for other controls )
  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      console.log(c.errors);
      this.emailMessage = Object.keys(c.errors).map(key =>
        this.validationMessages[key]).join(' ');
    }
  }

}
