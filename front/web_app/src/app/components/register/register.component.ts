import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm = this.fb.group({
    ime: ['', Validators.required],
    prezime: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9_.]+$/)],
    ],
    password: ['', Validators.required],
  });

  ime: string = '';
  prezime: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  idUlogeAplikacija: number = 1;
  status: number = 1;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msgService: MessageService
  ) {}

  registerUser() {
    this.authService
      .register(
        this.ime,
        this.prezime,
        this.username,
        this.email,
        this.password,
        this.idUlogeAplikacija,
        this.status
      )
      .subscribe(
        (jwt) => {
          this.authService.saveJwt(jwt);
          this.msgService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Register successfully',
          });

          this.router.navigateByUrl('/login');
        },
        (error) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error,
          });
        }
      );
  }
  isRegisterPage(): boolean {
    return this.authService.isRegisterPage();
  }
}
