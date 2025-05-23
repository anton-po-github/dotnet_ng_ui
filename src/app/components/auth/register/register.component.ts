import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, finalize, map, switchMap, take } from 'rxjs';

import { AuthService, ILoginForm } from '../auth.service';
import { ThemeService } from './../../../services/theme.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
  public errors: string[] | null = null;

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  public complexPassword =
    "(?=^.{6,10}$)(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*s).*$";

  public registerForm = this.fb.group({
    userName: ['', Validators.required],
    email: [
      '',
      [Validators.required, Validators.email],
      [this.validateEmailNotTaken()]
    ],
    password: [
      '',
      [Validators.required, Validators.pattern(this.complexPassword)]
    ]
  });

  public goToLogin(): void {
    this.router.navigate(['auth/login']);
  }

  public onSubmit() {
    this.authService.register(this.registerForm.value as ILoginForm).subscribe({
      next: () => this.router.navigateByUrl('auth/login'),

      error: (error) => (this.errors = error.errors)
    });
  }

  public validateEmailNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(1000),
        take(1),
        switchMap(() => {
          return this.authService.checkEmailExists(control.value).pipe(
            map((result) => (result ? { emailExists: true } : null)),
            finalize(() => control.markAsTouched())
          );
        })
      );
    };
  }
}
