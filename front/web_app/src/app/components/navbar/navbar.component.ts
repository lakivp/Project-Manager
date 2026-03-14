import { Component, EventEmitter,HostListener,OnInit,Output, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { navbarData, navbarDataAdmin } from './nav-data';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { navbarData1 } from './nav-data1';
import { Router } from '@angular/router';
import { User } from '../../interfaces/auth';
import { SettingsServService } from '../../services/settings-serv.service';
import { ProfileService } from '../../services/profile.service';
import { SignalRService } from '../../services/signalr.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { SharedService2 } from '../../services/navbar-notification-shared.service';
import { SharedService3 } from '../../services/navbar-home-shared.service';

interface SideNavToggle{
  screenWidth: number;
  collapsed:boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations:[
    trigger('fadeInOut',[
        transition(':enter',[
            style({opacity:0}),
            animate('350ms',
                style({opacity:1})
            )
        ]),
        transition(':leave',[
            style({opacity:1}),
            animate('0ms',
                style({opacity:0})
            )
        ])
    ]),
    trigger('rotate',[
         transition(':enter',[
             animate('900ms',
                keyframes ([
                     style({transform:'rotate(0deg)',offset:'0'}),
                     style({transform:'rotate(1turn)',offset:'1'}),
                 ])
             )
         ])
     ]),
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
export class NavbarComponent implements OnInit {

  @Output() onToggleSideNav:EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed=true;
  screenWidth = 0;
  navData=navbarData;
  navData1=navbarData1;
  user:User;
  navDataAdmin=navbarDataAdmin;
  picture:any;
  name=""
  message:string;
  id:number;

  @HostListener('window:resize',['$event'])
  onResize(event:any){
    this.screenWidth = window.innerWidth;
    if( this.screenWidth <= 768 )
    {
        this.collapsed = false;
    } 

  }


  ngOnInit(): void {
    console.log(navbarData);
    const userData = this.authService.getUserInfo();
    const userId = userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    this.id=userId;
    this.authService.getUser(userId).subscribe((data)=>{
      this.user=data;
      this.name=this.user.username
      
      this.profil.getPictureOfUser(data.username).subscribe((data) => {
        this.picture = this.profil.decodeMethod(data);
        this.SettingsServ.SetStatusByUserKorGlav(userId);
      });

    })
    if (isPlatformBrowser(this.platformId))
    {
      this.screenWidth = window.innerWidth;
      this.onToggleSideNav.emit({collapsed:this.collapsed,screenWidth:this.screenWidth});

      if (this.authService.isAuthenticated()) {
        this.collapsed = true; // Ako je korisnik prijavljen, postavi collapsed na false
      }
    }
    
      this.signalR.startConnection();
      this.signalR.addNotificationListener();
      this.signalR.notificationReceived.subscribe((message: string) => {
        if(!message.includes("Connected users:")){
          this.message=message; 
          let lastId=-1;
          this.notificationService.getNotifications(this.id.toString()).subscribe((data)=>{
            lastId=data[data.length-1].id;
            console.log(data[data.length-1]);
          });
          const d = new Date();
          let date = d.toISOString();
          const newNotification = {id:lastId+1, text:this.message.substr(0, this.message.lastIndexOf(" ")), isRead:0, dateCreated:date};
          console.log(newNotification);
          this.showAlertComponentForInterval();
          const id = message.split(" ")[5];
          this.sharedService3.notifyNewProject(parseInt(id));
          this.sharedService2.getNotifications(newNotification);
        }
    });

  }

  constructor(private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router:Router,
    public SettingsServ:SettingsServService,
    public profil:ProfileService,
    public signalR:SignalRService,
    private notificationService: NotificationService,
    private sharedService2:SharedService2,
    private sharedService3:SharedService3,
  ){
  }
  showAlertComponentForInterval() {
    if(this.message){
      setTimeout(() => {
        this.message = "";
      }, 3500);
    }
  }
  isLoginPage():boolean{
    return this.authService.isLoginPage();
  }

  isRegisterPage():boolean{
    return this.authService.isRegisterPage();
  }
  toggleCollapse():void{  
    this.collapsed=!this.collapsed;
    this.onToggleSideNav.emit({collapsed:this.collapsed,screenWidth:this.screenWidth}); this.SettingsServ.changeNavbarColor(333);
  }
  closeSidenav():void{ 
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed:this.collapsed,screenWidth:this.screenWidth}); this.SettingsServ.changeNavbarColor(0);
  }

  logOut() {
    this.closeSidenav();
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('lang');
    this.router.navigateByUrl('/login');
    this.signalR.closeConnection();
    location.reload();
  }
}
