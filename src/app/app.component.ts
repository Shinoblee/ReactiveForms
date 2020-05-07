import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { forbiddenNameValidator } from "./shared/username.validator";
import { passwordValidator } from "./shared/password.validator";
import { RegistrationService } from "./registration.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService
  ) {}

  registrationForm: FormGroup;

  ngOnInit() {
    this.registrationForm = this.fb.group(
      {
        username: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            forbiddenNameValidator(/password/),
          ],
        ],
        email: [""],
        promotional: [false],
        password: [""],
        confirmPassword: [""],
        address: this.fb.group({
          city: [""],
          state: [""],
          postalCode: [""],
        }),
        alternateEmails: this.fb.array([]),
      },
      { validator: passwordValidator }
    );

    this.registrationForm
      .get("promotional")
      .valueChanges.subscribe((checkedValue) => {
        const email = this.registrationForm.get("email");
        if (checkedValue) {
          email.setValidators(Validators.required);
        } else {
          email.clearValidators();
        }
        email.updateValueAndValidity();
      });
  }

  loadApiData() {
    this.registrationForm.patchValue({
      username: "Bruce",
      password: "test",
      confirmPassword: "test",
      // address: {
      //   city: "City",
      //   state: "Columbus",
      //   postalCode: "43228",
      // },
    });
  }

  addAlternateEmail() {
    this.alternateEmails.push(this.fb.control(""));
  }

  onSubmit() {
    console.log(this.registrationForm.value);
    this.registrationService.register(this.registrationForm.value).subscribe(
      (response) => console.log("Success", response),
      (error) => console.error("Error", error)
    );
  }

  get username() {
    return this.registrationForm.get("username");
  }

  get email() {
    return this.registrationForm.get("email");
  }

  get alternateEmails() {
    return this.registrationForm.get("alternateEmails") as FormArray;
  }
}
