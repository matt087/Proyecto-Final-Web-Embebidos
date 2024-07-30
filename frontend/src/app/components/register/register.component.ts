import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private as: UserService) {
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
      const { name, email, password, confirmPassword, role } = this.userForm.value;
      const isAdmin = role === 'admin';
      const isOperator = role === 'operator';
      
      this.as.register({
        nombre: name,
        email,
        password1: password,
        password2: confirmPassword,
        isAdmin,
        isOperator
      }).subscribe(
        response => {
          console.log('Usuario registrado exitosamente:', response);
          alert("¡Usuario registrado exitosamente!");
          this.userForm.reset();
          this.userForm.patchValue({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: ''
          });
        },
        error => {
          console.error('Error al registrar usuario:', error);
          alert("¡Error al registrar usuario!");
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const domain = email.substring(email.lastIndexOf("@") + 1);
    if (domain !== 'est.ups.edu.ec') {
      return { 'emailDomain': true };
    }
    return null;
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    if (!hasNumber || !hasLetter) {
      return { 'passwordStrength': true };
    }
    return null;
  }

  noNumbersValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const hasNumber = /\d/.test(value);
    if (hasNumber) {
      return { 'noNumbers': true };
    }
    return null;
  }
}
