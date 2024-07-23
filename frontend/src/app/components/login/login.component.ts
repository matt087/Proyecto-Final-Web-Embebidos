import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    email: '',
    password1: ''
  }

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailDomainValidator]],
      password1: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator]]
    });
  }

  // Validador personalizado para el dominio del email
  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const domain = email.substring(email.lastIndexOf("@") + 1);
    if (domain !== 'est.ups.edu.ec') {
      return { 'emailDomain': true };
    }
    return null;
  }

  // Validador personalizado para la fortaleza de la contraseña
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    if (!hasNumber || !hasLetter) {
      return { 'passwordStrength': true };
    }
    return null;
  }

  signIn(): void {
    if (this.loginForm.valid) {
      this.user = this.loginForm.value;
      console.log('Email:', this.user.email);
      console.log('Password:', this.user.password1);

      this.authService.signIn(this.user).subscribe(
        res => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this.router.navigate(['/']);
        },
        err => {
          console.error(err);
          if (err.status === 401) {
            alert('Credenciales incorrectas. Inténtelo de nuevo.');
          }
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}
