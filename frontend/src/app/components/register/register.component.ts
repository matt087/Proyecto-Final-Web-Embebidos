import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  user = {
    nombre: '',
    email: '',
    password1: '',
    password2: '',
    isAdmin: true,
    isOperator: false
  }

  constructor(private fb: FormBuilder, private as:AuthService) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, this.noNumbersValidator]],
      email: ['', [Validators.required, Validators.email, this.emailDomainValidator]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      role: ['', [Validators.required, this.noNumbersValidator]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
  }

  submitForm(): void {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      // Aquí podrías enviar los datos del usuario al backend o realizar alguna otra acción
    } else {
      console.log('Formulario inválido');
    }
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
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

  // Validador personalizado para asegurarse de que el campo no contenga números
  noNumbersValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const hasNumber = /\d/.test(value);
    if (hasNumber) {
      return { 'noNumbers': true };
    }
    return null;
  }
}
