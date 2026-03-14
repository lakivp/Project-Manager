import { Component, Input, ViewChild, viewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsServService } from '../../services/settings-serv.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgxEditorComponent } from 'ngx-editor';
import { SignalRService } from '../../services/signalr.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HomeComponent } from '../home/home.component';
import { SharedService } from '../../services/home-body-shared.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NotificationService } from '../../services/notification.service';
import { Auth1Service } from '../../services/auth1.service';
@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.css',
  animations: [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class BodyComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  @ViewChild('notificationRef') notificationComponent : NotificationsComponent;
  admin = 2;
  login: boolean = false;
  id:number;
  constructor(
    private router: Router,
    private auth: AuthService,
    private setting: SettingsServService,
    private auth1:Auth1Service
  ) {
    const userData = this.auth.getUserInfo();
    if (userData) {
      let id =
        userData[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ];
        this.id=id;
      if (id)
        this.auth.getUser(id).subscribe((sta) => {
          this.admin = sta['idUlogeAplikacija'];
        });
    }
  }

  ngOnInit() {
    if (this.auth.isLoginPage()) {
      this.login = true;
    }
    else{
      this.login = false;
    }
  }

  isLoginPage():boolean{
    return this.auth.isLoginPage();
  }
  
  isResetPage():boolean{
    return this.auth.isResetPage();
  }

  isAdmin():boolean{
    return this.auth1.getRoleAdminFromToken();
  }
  
  getBodyClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (
      this.collapsed &&
      this.screenWidth <= 768 &&
      this.screenWidth > 0
    ) {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }
  stat = 0;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      (event.target as Element).classList[1] == 'NgxEditor__Content'
    ) {
      return;
    }
    // if (event.key === '3')  {  localStorage.removeItem('jwt');  this.router.navigateByUrl('/login');   return  }
    /*   if(event.key === '5' && this.stat==0) this.stat++;    else this.stat=0;  
    if(event.key === 'o' && this.stat==1) this.stat++;    else this.stat=0;                    
    if(event.key === 'k' && this.stat==2) this.stat++;    else this.stat=0;   
    if(event.key === 'a' && this.stat==3) this.stat++;    else this.stat=0;   
    if(event.key === 'd' && this.stat==4) this.stat++;    else this.stat=0;   
    console.log(this.stat)
    if(this.stat==5){
      localStorage.removeItem('jwt');  this.router.navigateByUrl('/login');
    }*/

    const userData = this.auth.getUserInfo();
    let id =
      userData[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];
    this.setting.getSettingsById(id).subscribe((data) => {
      let ovo: any = data;
      console.log('body-usao');
      if (event.key === ovo[0]['homeHK']) this.router.navigateByUrl('/home');
      if (event.key === ovo[0]['profileHK'] && this.admin != 1)
        this.router.navigateByUrl('/profile/' + id + '/0');
      if (event.key === ovo[0]['tasksHK'] && this.admin != 1)
        this.router.navigateByUrl('/taskView');
      if (event.key === ovo[0]['settingsHK'])
        this.router.navigateByUrl('/settings');
      if (event.key === ovo[0]['logoutHK']) {
       
        sessionStorage.removeItem('jwt');
        sessionStorage.removeItem('lang');
        this.router.navigateByUrl('/login');
        location.reload();
      }
    });
  }
}
