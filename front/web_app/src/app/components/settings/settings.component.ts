import { Component,ElementRef } from '@angular/core';
import { OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon'
import { Location } from '@angular/common';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsServService } from '../../services/settings-serv.service';
import { AuthService } from '../../services/auth.service';
import { Auth1Service } from '../../services/auth1.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  allThemes:any[] = [];
  all:any;
  userId:any;
  lang:string = '';
  
  colorPick = "#ffffff"
  colorPick2 = "#ffffff"
  colorPick3 = "#263238";
  picture="../../../../assets/images/settings/notify.png";
  menu="w"
  menu2="a"
  menu3="s"
  menu4="d"
  menu5="x"
  selectedRad:any;
  idOfCustomTheme=0;
  statusWhat='Active'
  jezikSett="en"
  korisnikId: string | null = null;
  constructor(private auth1Service:Auth1Service,private location: Location,private router:Router, private renderer:Renderer2,private elementRef: ElementRef, private translateService:TranslateService, private settingServ: SettingsServService,private authService:AuthService ) {  }

  colorPickName="Color: "+this.colorPick;

  ngOnInit():void{
    //this.lang = localStorage.getItem('lang') || 'en';
    //this.translateService.use(this.lang); 
    this.korisnikId = this.auth1Service.getIdFromToken();
    if(this.korisnikId){
      this.settingServ.getSettingsById(this.korisnikId)
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
            this.translateService.use(languages[0] || 'en');
          }
          
          
          // Možete dalje raditi sa ovim nizom jezika kako vam odgovara
        }, error => {
          console.error('Greška pri dobijanju postavki:', error);
        });
    }
    // Dodajte slušača za promene u local storage-u
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    this.settingServ.ColorElements(0);
    
    this.userId =this.authService.getUserInfo()["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    this.authService.getUser(this.userId).subscribe(
      (sta) =>{
        if(sta['idUlogeAplikacija']==1){
          document.getElementById("col")?.setAttribute("style", "display:none");   
          document.getElementById("hotkeyProfile")?.setAttribute("style", "display:none"); 
          document.getElementById("hotkeyTasks")?.setAttribute("style", "display:none"); 
          document.getElementById("HideHotKeyGet")?.setAttribute("style", "display:none"); 
          document.getElementById("HideHotKeyGet2")?.setAttribute("style", "display:inline;  transform: scale(2); position:relative; top:5px"); 
        }
      }
    );

    this.settingServ.getAllThemes().subscribe(
      (sat) =>{
        for(let i=0;i<sat.length;i++)
        {
          if(sat[i]['korisnikId']==null || sat[i]['korisnikId']==this.userId)
            this.allThemes.push(sat[i]);
          if(sat[i]['korisnikId']==this.userId)
          {
            this.idOfCustomTheme=sat[i]['id']
            this.colorPick=sat[i]['outer']
            this.colorPick2=sat[i]['inner']
            this.colorPick3=sat[i]['navBar']
          }
        }
        this.settingServ.getSettingsById(this.userId).subscribe(
          (data) => {
            this.all=data;
            this.selectedRad= this.all[0]["temaId"];
            this.settingServ.getThemeByNo(this.all[0]["temaId"]).subscribe(
                (data3) =>{
                  let an:any =data3



                }
              )
            this.menu=this.all[0]["homeHK"]
            this.menu2=this.all[0]["profileHK"]
            this.menu3=this.all[0]["tasksHK"]
            this.menu4=this.all[0]["settingsHK"]
            this.menu5=this.all[0]["logoutHK"]
            this.jezikSett=this.all[0]['jezik']; if(this.all[0]['jezik']=='english') this,this.jezikSett='en';
            if(this.all[0]['notifikacija']==1)
              this.picture="../../../../assets/images/settings/notify.png";
            else
              this.picture="../../../../assets/images/settings/noNotify.png";
            
            if(this.all[0]['status']=='active' || this.all[0]['status']=='Active')               document.getElementById("green-circle")?.setAttribute("style", "border:3px solid blue; filter:none");   
            else if(this.all[0]['status']=='do not disturb')  document.getElementById("red-circle")?.setAttribute("style", "border:3px solid blue; filter:none");   
            else if(this.all[0]['status']=='idle')            document.getElementById("yellow-circle")?.setAttribute("style", "border:3px solid blue; filter:none");   
            else if(this.all[0]['status']=='inactive')        document.getElementById("gray-circle")?.setAttribute("style", "border:3px solid blue; filter:none");   

            this.statusWhat=this.all[0]['status'];

        })
      })
      
    }

  

  save() {
    let odgovor=true;
    if(this.picture=="../../../../assets/images/settings/notify.png")
      odgovor=true;
    else
      odgovor=false;

    if(this.idOfCustomTheme==0)
    {
      this.settingServ.createTheme(this.userId,"ss",this.colorPick,this.colorPick2,this.colorPick3).subscribe(
        (dat5) => {

          if(this.selectedRad==0)
            this.settingServ.updatePayload(this.all[0]['id'],this.jezikSett,odgovor,this.statusWhat,this.menu,this.menu2,this.menu3,this.menu4,this.menu5,dat5['id']).subscribe(
              (dat2) => {
                location.reload();
      
              }
            )

          else
            this.settingServ.updatePayload(this.all[0]['id'],this.jezikSett,odgovor,this.statusWhat,this.menu,this.menu2,this.menu3,this.menu4,this.menu5,this.selectedRad).subscribe(
              (dat2) => {
                location.reload();
                
              }
            )
        }
      )
    }
    else
    {
      this.settingServ.updateTheme(this.idOfCustomTheme,"aj",this.colorPick,this.colorPick2,this.colorPick3).subscribe(
        (dat3) => {
          this.settingServ.updatePayload(this.all[0]['id'],this.jezikSett,odgovor,this.statusWhat,this.menu,this.menu2,this.menu3,this.menu4,this.menu5,this.selectedRad).subscribe(
            (dat2) => {
    
              location.reload();
            }
          )
          
        })
    }
  }


  
  ChangeNotify(){
    if(this.picture=="../../../../assets/images/settings/notify.png")
      this.picture="../../../../assets/images/settings/noNotify.png";
    else
      this.picture="../../../../assets/images/settings/notify.png"
  }

  selectStatus(s :string){
    try{
      document.getElementById("green-circle")?.setAttribute("style", "border:none");    
      
      document.getElementById("red-circle")?.setAttribute("style", "border:1px solid white; filter:none");     
      document.getElementById("yellow-circle")?.setAttribute("style", "border:1px solid white; filter:none");   
      document.getElementById("gray-circle")?.setAttribute("style", "border:1px solid white; filter:none");     
      document.getElementById("green-circle")?.setAttribute("style", "border:1px solid white; filter:none");    

      document.getElementById(s)?.setAttribute("style", "border:3px solid blue");


      if(s=="green-circle") this.statusWhat="active"
      else if(s=="red-circle") this.statusWhat="do not disturb"
      else if(s=="yellow-circle") this.statusWhat="idle"
      else if(s=="gray-circle") this.statusWhat="inactive"
    }
    catch{}
  }
  
  changeColor(){

    this.selectedRad=this.idOfCustomTheme;
    
    this.renderer.setStyle(document.body, 'background-color',this.colorPick);
    (document.getElementById("container") as HTMLElement).style.backgroundColor=this.colorPick; 
    const d=document.getElementsByName("OuterTitle")
    if(this.FunctionForWhenToChangeColor(this.colorPick)  )
      for(let i=0;i<d.length;i++){
        const title = d[i] as HTMLElement;
        title.style.color = 'white'; 
      }
    else
      for(let i=0;i<d.length;i++){
        const title = d[i] as HTMLElement;
        title.style.color = 'black'; 
      }
  }
  changeColor2(){
    this.selectedRad=this.idOfCustomTheme;
    const d=document.getElementById("tabela")
    const sidenav = d as HTMLElement;
    sidenav.style.backgroundColor = this.colorPick2;

    if(this.FunctionForWhenToChangeColor(this.colorPick2) )
    {
      (document.getElementById("picSett") as HTMLElement).style.filter="invert(100%)";
      (document.getElementById("picSett2") as HTMLElement).style.filter="invert(100%)";
      (document.getElementsByClassName("dok")[0] as HTMLElement).style.background="white";
      (document.getElementsByClassName("dok")[0] as HTMLElement).style.color="black";

      sidenav.style.color = 'white'; 
    }
      
    else
    {
      (document.getElementById("picSett") as HTMLElement).style.filter="invert(0%)";
      (document.getElementById("picSett2") as HTMLElement).style.filter="invert(0%)";
      (document.getElementsByClassName("dok")[0] as HTMLElement).style.background="black";
      (document.getElementsByClassName("dok")[0] as HTMLElement).style.color="white";

      sidenav.style.color = 'black'; 
    }
  }
  changeColor3(){
    let nav=document.getElementsByClassName("sidenav")[0] as HTMLElement  ;
    if(nav)  nav.style.backgroundColor = this.colorPick3;
    
    if(document.getElementsByClassName("logo")[0])   (document.getElementsByClassName("logo")[0] as HTMLElement).style.backgroundColor='transparent' ;
      if(!this.FunctionForWhenToChangeColor(this.colorPick3))
      {
          for(let i=0;i<(document.getElementsByClassName("sidenav-link-icon")).length;i++)
            {
              if((document.getElementsByClassName("sidenav-link-text")[i]))      (document.getElementsByClassName("sidenav-link-text")[i] as HTMLElement).style.color="black";
              if((document.getElementsByClassName("sidenav-link-icon")[i]))      (document.getElementsByClassName("sidenav-link-icon")[i] as HTMLElement).style.color="black";
            }
          if(document.getElementsByClassName("logo")[0])   (document.getElementsByClassName("logo")[0] as HTMLElement).style.color="black";  
          if(document.getElementsByClassName("logo-text")[0])   (document.getElementsByClassName("logo-text")[0] as HTMLElement).style.color="black";
          if(document.getElementById("logoPoly"))  (document.getElementById("logoPoly")  as HTMLElement).style.filter="invert(100%)";
      }
      else{
        for(let i=0;i<(document.getElementsByClassName("sidenav-link-icon")).length;i++)
          {
            if((document.getElementsByClassName("sidenav-link-text")[i]))      (document.getElementsByClassName("sidenav-link-text")[i] as HTMLElement).style.color="gray";
            if((document.getElementsByClassName("sidenav-link-icon")[i]))      (document.getElementsByClassName("sidenav-link-icon")[i] as HTMLElement).style.color="gray";
          }
        if(document.getElementsByClassName("logo")[0])   (document.getElementsByClassName("logo")[0] as HTMLElement).style.color="gray";  
        if(document.getElementsByClassName("logo-text")[0])   (document.getElementsByClassName("logo-text")[0] as HTMLElement).style.color="gray";
        if(document.getElementById("logoPoly"))  (document.getElementById("logoPoly")  as HTMLElement).style.filter="invert(60%)";
      }
    if(this.router.url.indexOf("/settings") === -1) this.renderer.setStyle(document.body, 'background-color',this.colorPick3);
  } 
  changeLang(lang:any){
    const selecetedLanguage = lang.target.value;
    console.log(this.jezikSett)
    sessionStorage.setItem('lang', selecetedLanguage);

    this.translateService.use(selecetedLanguage);
  }
  handleStorageChange(event: StorageEvent) {
    if (event.key === 'lang') {
        this.lang = event.newValue || 'en'; // Ažurirajte trenutni jezik
        this.translateService.use(this.lang); // Ažurirajte jezik u aplikaciji
    }
  }
  FunctionForWhenToChangeColor(color:string){
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;


    return luminance > 0.5 ? false : true;

  }
  
  ChangeFuncBack(){
    console.log(this.selectedRad)
    if(this.selectedRad<5)
      this.settingServ.getThemeByNo(this.selectedRad).subscribe(
        (data3) =>{
          let sat:any=data3; 
          this.changeColorSolid(sat['outer'])
          this.changeColor2Solid(sat['inner'])
          this.changeColor3Solid(sat['navBar'])


        }
      )

    else{this.changeColor();this.changeColor2(),this.changeColor3()}
  }

  changeColorSolid(col:string){


    
    this.renderer.setStyle(document.body, 'background-color',col);
    (document.getElementById("container") as HTMLElement).style.backgroundColor=col; 
    const d=document.getElementsByName("OuterTitle")
    if(this.FunctionForWhenToChangeColor(col)  )
      for(let i=0;i<d.length;i++){
        const title = d[i] as HTMLElement;
        title.style.color = 'white'; 
      }
    else
      for(let i=0;i<d.length;i++){
        const title = d[i] as HTMLElement;
        title.style.color = 'black'; 
      }
  }
  changeColor2Solid(col:string){

    const d=document.getElementById("tabela")
    const sidenav = d as HTMLElement;
    sidenav.style.backgroundColor = col;

    if(this.FunctionForWhenToChangeColor(col) )
    {
      (document.getElementById("picSett") as HTMLElement).style.filter="invert(100%)";
      (document.getElementById("picSett2") as HTMLElement).style.filter="invert(100%)";
      (document.getElementsByClassName("dok")[0] as HTMLElement).style.background="white";
      (document.getElementsByClassName("dok")[0] as HTMLElement).style.color="black";

      sidenav.style.color = 'white'; 
    }
      
    else
    {
      (document.getElementById("picSett") as HTMLElement).style.filter="invert(0%)";
      (document.getElementById("picSett2") as HTMLElement).style.filter="invert(0%)";
      (document.getElementsByClassName("dok")[0] as HTMLElement).style.background="black";
      (document.getElementsByClassName("dok")[0] as HTMLElement).style.color="white";

      sidenav.style.color = 'black'; 
    }
  }
  changeColor3Solid(col:string){
    let nav=document.getElementsByClassName("sidenav")[0] as HTMLElement  ;
    if(nav)  nav.style.backgroundColor = col;
    if(document.getElementsByClassName("logo")[0])   (document.getElementsByClassName("logo")[0] as HTMLElement).style.backgroundColor='transparent' ;
      if(!this.FunctionForWhenToChangeColor(col))
      {
          for(let i=0;i<(document.getElementsByClassName("sidenav-link-icon")).length;i++)
            {
              if((document.getElementsByClassName("sidenav-link-text")[i]))      (document.getElementsByClassName("sidenav-link-text")[i] as HTMLElement).style.color="black";
              if((document.getElementsByClassName("sidenav-link-icon")[i]))      (document.getElementsByClassName("sidenav-link-icon")[i] as HTMLElement).style.color="black";
            }
          if(document.getElementsByClassName("logo")[0])   (document.getElementsByClassName("logo")[0] as HTMLElement).style.color="black";  
          if(document.getElementsByClassName("logo-text")[0])   (document.getElementsByClassName("logo-text")[0] as HTMLElement).style.color="black";
          if(document.getElementById("logoPoly"))  (document.getElementById("logoPoly")  as HTMLElement).style.filter="invert(100%)";
      }
      else{
        for(let i=0;i<(document.getElementsByClassName("sidenav-link-icon")).length;i++)
          {
            if((document.getElementsByClassName("sidenav-link-text")[i]))      (document.getElementsByClassName("sidenav-link-text")[i] as HTMLElement).style.color="gray";
            if((document.getElementsByClassName("sidenav-link-icon")[i]))      (document.getElementsByClassName("sidenav-link-icon")[i] as HTMLElement).style.color="gray";
          }
        if(document.getElementsByClassName("logo")[0])   (document.getElementsByClassName("logo")[0] as HTMLElement).style.color="gray";  
        if(document.getElementsByClassName("logo-text")[0])   (document.getElementsByClassName("logo-text")[0] as HTMLElement).style.color="gray";
        if(document.getElementById("logoPoly"))  (document.getElementById("logoPoly")  as HTMLElement).style.filter="invert(60%)";
      }
    if(this.router.url.indexOf("/settings") === -1) this.renderer.setStyle(document.body, 'background-color',col);
  } 

  isAdmin():boolean{
    return this.auth1Service.getRoleAdminFromToken();
  }
  

}
