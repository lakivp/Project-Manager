import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EmailService } from '../../services/email.service';
import { TranslateService } from '@ngx-translate/core';
import { Auth1Service } from '../../services/auth1.service';
import { SettingsServService } from '../../services/settings-serv.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  spinner: boolean = false;
  loginForm = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9_.]+$/)],
    ],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msgService: MessageService,
    private emailService: EmailService,
    private translateService: TranslateService,
    private auth1Service: Auth1Service,
    private settingsService: SettingsServService
  ) {
    document
      .getElementById('container')
      ?.setAttribute('style', 'background-color:' + 'white');
  }

  ime: string = '';
  prezime: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  idUlogeAplikacija: number = 1;
  status: number = 1;
  phoneNumber: string = '';
  specijalizacija: null;
  opis: string = '';
  userId: string | null = null;

  resetPasswordEmail: string = '';
  isValidEmail: boolean;
  isSendingEmail: boolean = false;
  loginUser() {
    this.spinner = true;
    this.authService.login(this.username, this.password).subscribe(
      (jwt) => {
        this.authService.saveJwt(jwt);
        this.userId = this.auth1Service.getIdFromToken();

        //const selectedLanguage = localStorage.getItem('lang') || 'en';
        //this.translateService.use(selectedLanguage);
        //localStorage.setItem('lang', 'en');

        if (this.userId) {
          this.settingsService.getSettingsById(this.userId).subscribe(
            (settings: any[]) => {
              const languages = settings.map((setting) => setting.jezik);
              console.log('Jezik', languages[0]);
              if (languages[0] === 'english') {
                sessionStorage.setItem('lang', 'en');
                this.translateService.setDefaultLang('en');
                this.translateService.use('en');
              } else {
                sessionStorage.setItem('lang', languages[0]);
                this.translateService.setDefaultLang(languages[0] || 'en');
                this.translateService.use(languages[0] || 'en');
              }

              // Možete dalje raditi sa ovim nizom jezika kako vam odgovara
            },
            (error) => {
              console.error('Greška pri dobijanju postavki:', error);
            }
          );
        }
        if (this.idUlogeAplikacija === 1) {
          this.router.navigateByUrl('accessibility');
        } else {
          this.router.navigateByUrl('');
        }
        this.spinner = false;
      },
      (error) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Username or Password incorrect',
        });
        this.spinner = false;
      }
    );
  }

  isLoginPage(): boolean {
    return this.authService.isLoginPage();
  }

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
      this.isSendingEmail = true;
      this.spinner = true;
      this.emailService.forgotPassword(this.resetPasswordEmail).subscribe(
        (response) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Email sent successfully',
          });
          this.isSendingEmail = false;
          this.resetPasswordEmail = '';
          const button = document.getElementById('closeBtn');
          button?.click();
          this.spinner = false;
        },
        (error) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User not found',
          });
          this.isSendingEmail = false;
          this.spinner = false;
        }
      );
    }
  }

  visible: boolean = true;
  changetype: boolean = true;

  viewPassword() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }
}
