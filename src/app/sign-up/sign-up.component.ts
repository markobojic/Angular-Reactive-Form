import { Component, OnInit } from '@angular/core';
import { User } from './user.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  user = new User();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstname: '',
      lastname: '',
      email: '',
      sendCatalog: true,
    })
  }

  onSubmit() {
    console.log(this.signupForm);
    console.log(`Saved ${JSON.stringify(this.signupForm.value)}`);
  }

  onSuperUser() {
    this.signupForm.setValue({
      firstname: 'Marko',
      lastname: 'Bojic',
      email: 'bojic.marko021@gmail.com',
      sendCatalog: false,
    })
  }

  onSetDefaultName() {
    this.signupForm.patchValue({
      firstname: 'Marko'
    })
  }

}
