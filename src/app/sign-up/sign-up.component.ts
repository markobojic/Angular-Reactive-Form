import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
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

  // Reactive approach for validation messages ( Refactor later )
  emailMessage: string;
  private validationMessages = {
    required: 'Please enter your email address',
    email: 'Please enter a valid email address'
  }
  // Reactive approach for validation messages

  get addresses(): FormArray {
    return <FormArray>this.signupForm.get('addresses');
  }

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
      sendCatalog: true,
      addresses: this.fb.array([ this.buildAddress()])
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

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    })
  }

  addAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  onSubmit() {
    console.log(this.signupForm);
    console.log(`Saved ${JSON.stringify(this.signupForm.value)}`);
  }

  onSuperUser() {
    this.signupForm.patchValue({
      firstname: 'Marko',
      lastname: 'Bojic',
      emailGroup: {
        email: 'bojic.marko021@gmail.com',
        confirmEmail: 'bojic.marko021@gmail.com'
      },
      rating: 5
    });
    const addressGroup = this.fb.group({
      addressType: 'home',
      street1: 'ZJ 16',
      street2: 'VM 64',
      city: 'Novi Sad',
      state: 'SR',
      zip: '21000'
    })
    this.signupForm.setControl('addresses', this.fb.array([addressGroup]));
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
