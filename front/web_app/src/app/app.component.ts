import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsServService } from './services/settings-serv.service';
import { Auth1Service } from './services/auth1.service';

interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'web_app';

  isSideNavCollapsed = false;
  screenWidth =0;
  userId: string | null = null;
  
  onToggleSideNav(data:SideNavToggle):void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  showSidebar: boolean = false;

  constructor(private auth1Service:Auth1Service,private settingsService:SettingsServService ,private router: Router,private authService: AuthService,private translateService:TranslateService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showSidebar = event.url !== '/login' && authService.isAuthenticated();
      }
    });    
    this.userId = this.auth1Service.getIdFromToken();
  }

  ngOnInit(): void {
    
    
    if(this.userId){
      this.settingsService.getSettingsById(this.userId)
        .subscribe((settings: any[]) => {
          const languages = settings.map(setting => setting.jezik);
          console.log("Jezik", languages[0]);
          if(languages[0]==="english"){
            sessionStorage.setItem('lang','en');
            this.translateService.setDefaultLang('en');
            this.translateService.use('en');
          }
          else{
            sessionStorage.setItem('lang',languages[0]);
            this.translateService.setDefaultLang(languages[0] || 'en');
            this.translateService.use(languages[0]);
          }
          
          
          // Možete dalje raditi sa ovim nizom jezika kako vam odgovara
        }, error => {
          console.error('Greška pri dobijanju postavki:', error);
        });
    }
    this.translateService.setDefaultLang(sessionStorage.getItem('lang') || 'en');
    this.translateService.use(sessionStorage.getItem('lang') || 'en');
  }






}
