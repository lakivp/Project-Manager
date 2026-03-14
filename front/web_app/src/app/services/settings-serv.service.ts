import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../environments/evnironment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SettingsServService {
  public renderer: Renderer2;
  currentRoute : string;
  constructor(private router: Router,rendererFactory: RendererFactory2,private authService:AuthService,private http: HttpClient) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  private apiUrl: any;  
  navBroj=0;
  async changeNavbarColor(id:any){
    await new Promise(f => setTimeout(f, 100));   

    //this.navBroj++;
    if(this.navBroj>1 && id!=333) return;
    let nav=document.getElementsByClassName("sidenav")[0] as HTMLElement  ;
    if(nav)  nav.style.backgroundColor = this.navColor;  
    if(document.getElementsByClassName("logo")[0])   (document.getElementsByClassName("logo")[0] as HTMLElement).style.backgroundColor='transparent' ;
    console.log(this.navColor)
    if(!this.FunctionForWhenToChangeColor(this.navColor))
      {
          for(let i=0;i<(document.getElementsByClassName("sidenav-link-icon")).length;i++)
            {
              if((document.getElementsByClassName("sidenav-link-text")[i]))      (document.getElementsByClassName("sidenav-link-text")[i] as HTMLElement).style.color="black";
              if((document.getElementsByClassName("sidenav-link-icon")[i]))      (document.getElementsByClassName("sidenav-link-icon")[i] as HTMLElement).style.color="black";
            }
          if(document.getElementsByClassName("logo")[0])   (document.getElementsByClassName("logo")[0] as HTMLElement).style.color="black";  
          if(document.getElementsByClassName("logo-text")[0])   (document.getElementsByClassName("logo-text")[0] as HTMLElement).style.color="black";
          if(document.getElementsByClassName("circleProf")[0])  (document.getElementsByClassName("circleProf")[0]  as HTMLElement).style.border="2px solid black";
          if(document.getElementById("NovaSlikaProfilDaJa"))  (document.getElementById("NovaSlikaProfilDaJa")  as HTMLElement).style.border="2px solid black";
          await new Promise(f => setTimeout(f, 100));  
          if(document.getElementById("logoPoly"))  (document.getElementById("logoPoly")  as HTMLElement).style.filter="invert(100%)";
          
            
      
        }

    if(this.router.url.indexOf("/settings") === -1) this.renderer.setStyle(document.body, 'background-color',this.outerColor);
  }


  FunctionForWhenToChangeColor(color:string){
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;


    return luminance > 0.5 ? false : true;

  }

  public navColor="#1E1E1E"; //263238
  public outerColor="#ffffff"; //#000000
  public innerColor="#ffffff";

  async ColorElements(ida:any){

    let id:any=await  this.authService.getUserInfo()["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    this.changeNavbarColor(333);
    this.getSettingsById(id).subscribe(
      (data) => {
        let thi:any=data;
        if(thi[0]['temaId']==null || this.authService.getUserInfo()["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]=='admin' )
        {
          this.navColor="#1e1e1e"; //263238
          this.outerColor="white"; //#000000
          this.innerColor="white";
          
          this.everything(id);
        }
        else{
          this.getThemeByNo(thi[0]['temaId']).subscribe(
            (data2) => {
              let thi2:any=data2;
              this.navColor=thi2['navBar'];
              this.outerColor=thi2['outer'];
              this.innerColor=thi2['inner'];
              this.everything(id);
          })
          
        }
      })
  }

  everything(id:any){
    this.renderer.setStyle(document.body, 'background-color',this.outerColor);
    (document.getElementById("container") as HTMLElement).style.backgroundColor=this.outerColor; 
    if(document.getElementsByClassName("container")[0])     (document.getElementsByClassName("container")[0] as HTMLElement).style.border="1px solid white" ;

    for(let i=0;i<document.getElementsByClassName("mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label").length;i++)
      (document.getElementsByClassName("mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label")[i] as HTMLElement).style.backgroundColor="white";   
    for(let i=0;i<document.getElementsByClassName("mat-mdc-paginator-icon").length;i++)
      {
        (document.getElementsByClassName("mat-mdc-paginator-icon")[i] as HTMLElement).style.backgroundColor="white";  
        (document.getElementsByClassName("mat-mdc-paginator-icon")[i] as HTMLElement).style.border="3px solid "+this.innerColor;  
      }
      

    this.MethodForHome();
    this.MethodForProfile(3);
    this.MethodForTaskview();
    this.MethodForSettings();
    this.MethodForProjectView();
    this.MethodTaskDesc();
    this.changeNavbarColor(id);
    this.renderer.setStyle(document.body, 'background-color',this.outerColor);
  }

  async SetStatus(){
    let id:any=await  this.authService.getUserInfo()["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    this.getSettingsById(id).subscribe(
      (data) => {
        let thi:any=data;
        console.log(thi[0])
        let boja='green';
        if(thi[0]['status']=='active') boja= 'green';
        else if(thi[0]['status']=='idle') boja=  'yellow'
        else if(thi[0]['status']=='do not disturb') boja=  'red'
        else if(thi[0]['status']=='inactive') boja=  'gray'

        for(let i=0;i<document.getElementsByClassName("circle").length;i++)
          (document.getElementsByClassName("circle")[i] as HTMLElement).style.backgroundColor=boja;
        }
    )    
  }
  async SetStatusByUser(id:any){
    await new Promise(f => setTimeout(f, 100)); 
    this.getSettingsById(id).subscribe(
      (data) => {
        let thi:any=data;
        let boja='green';
        if(thi[0]['status']=='active') boja= 'green';
        else if(thi[0]['status']=='idle') boja=  'yellow'
        else if(thi[0]['status']=='do not disturb') boja=  'red'
        else if(thi[0]['status']=='inactive') boja=  'gray'
        
        for(let i=0;i<document.getElementsByClassName("circle").length;i++)
          (document.getElementsByClassName("circle")[i] as HTMLElement).style.backgroundColor=boja;
        

      }
    )    
  }
  async SetStatusByUserKorGlav(id:any){
    await new Promise(f => setTimeout(f, 100)); 
    this.getSettingsById(id).subscribe(
      (data) => {
        let thi:any=data;
        let boja='green';
        if(thi[0]['status']=='active') boja= 'green';
        else if(thi[0]['status']=='idle') boja=  'yellow'
        else if(thi[0]['status']=='do not disturb') boja=  'red'
        else if(thi[0]['status']=='inactive') boja=  'gray'
        

        for(let i=0;i<document.getElementsByClassName("circleProf").length;i++)
          (document.getElementsByClassName("circleProf")[i] as HTMLElement).style.backgroundColor=boja;
      }
    )    
  }
  ColorStatusReturn(l:any){
    let boja='green'
    if(l=='active') boja= 'green';
    else if(l=='idle') boja=  'yellow'
    else if(l=='do not disturb') boja=  'red'
    else if(l=='inactive') boja=  'gray'
    return boja;
  }

  getAllThemes(){
    this.apiUrl = environment.apiUrl + '/Tema/GetAllThemes';
    return this.http.get<any[]>(this.apiUrl);
  }

  getSettingsById(id:string){
    {
      this.apiUrl = environment.apiUrl + '/Podesavanja/GetSettingsByKorisnikId'+id;
      return this.http.get<any[]>(this.apiUrl);
    }
  } 
  getTheme(id:string){
    {
      this.apiUrl = environment.apiUrl + '/Tema/GetThemesByKorisnikId'+id;
      return this.http.get<any[]>(this.apiUrl);
    }
  } 
  getThemeByNo(id:string){
    {
      this.apiUrl = environment.apiUrl + '/Tema/GetThemeById'+id;
      return this.http.get<any[]>(this.apiUrl);
    }
  } 
  updateTheme(id:any,naz:any,oute:any,inn:any,nav:any){
    this.apiUrl = environment.apiUrl+'/Tema/UpdateTheme';
    const dataToSend = {
      id: id,
      naziv: naz,
      outer: oute,
      inner: inn,
      navBar: nav

    };
    return this.http.put<any>(this.apiUrl, dataToSend);
  }
  createTheme(id:any,naz:any,oute:any,inn:any,nav:any){
    this.apiUrl = environment.apiUrl+'/Tema/AddTheme';
    const dataToSend = {
      naziv: naz,
      outer: oute,
      inner: inn,
      navBar: nav,
      korisnikId: id 
    };
    return this.http.post<any>(this.apiUrl, dataToSend);
  }
  updatePayload(id2:any,language:any,notify:boolean,thing:any,thing2:any,thing3:any,thing4:any,thing5:any,thing6:any,thing7:any){
    console.log(thing2,thing3,thing4,thing5,thing6)
    this.apiUrl = environment.apiUrl+'/Podesavanja/UpdateSettings';
    const dataToSend = {
      id: id2,
      jezik: language,
      notifikacija: notify,
      status: thing,
      homeHK: thing2,
      profileHK: thing3,
      tasksHK: thing4,
      settingsHK: thing5,
      logoutHK: thing6,
      temaId: thing7

    };
    return this.http.put<any>(this.apiUrl, dataToSend);
  }



  async MethodTaskDesc(){
    if(this.router.url.indexOf("/taskDescription") !== -1){
      await new Promise(f => setTimeout(f, 100));   
      //if((document.getElementById("tabela1") as HTMLElement)) (document.getElementById("tabela1") as HTMLElement).style.backgroundColor=this.innerColor; 
      if((document.getElementById("tabela") as HTMLElement)) (document.getElementById("tabela") as HTMLElement).style.backgroundColor=this.innerColor;
      if((document.getElementById("tabelaEdit") as HTMLElement)) (document.getElementById("tabelaEdit") as HTMLElement).style.backgroundColor=this.innerColor;
      if(this.FunctionForWhenToChangeColor(this.innerColor) && this.innerColor!="white")
      { //await new Promise(f => setTimeout(f, 100));   
        if((document.getElementById("tabela") as HTMLElement)) (document.getElementById("tabela") as HTMLElement).style.color="white";
        if((document.getElementById("tabelaEdit") as HTMLElement)) (document.getElementById("tabela") as HTMLElement).style.color="white";
        for(let i=0;i<document.getElementsByClassName('button').length;i++)
        {
          (document.getElementsByClassName("button")[i] as HTMLElement).style.backgroundColor="white" ;
          (document.getElementsByClassName("button")[i] as HTMLElement).style.color="black" ;
        }
      } 
      if(this.FunctionForWhenToChangeColor(this.outerColor) && this.outerColor!="white")
      {
        if((document.getElementById("MatIkPenc") as HTMLElement)) (document.getElementById("MatIkPenc") as HTMLElement).style.color="white";
        if((document.getElementById("MatIkPenc2") as HTMLElement)) (document.getElementById("MatIkPenc2") as HTMLElement).style.color="white";

        if((document.getElementById("taskSettMain") as HTMLElement)) (document.getElementById("taskSettMain") as HTMLElement).style.color="white";
        if((document.getElementById("back") as HTMLElement)) (document.getElementById("back") as HTMLElement).style.filter="invert(100%)";

      }
    }
  } 
  async MethodForProjectView(){
    if(this.router.url.indexOf("/projectView") !== -1){
      if((document.getElementById("tabela1") as HTMLElement)) (document.getElementById("tabela1") as HTMLElement).style.backgroundColor=this.innerColor; 
      
      for(let i=0;i<document.getElementsByClassName("rowForColor").length;i++)
        (document.getElementsByClassName("rowForColor")[i] as HTMLElement).style.backgroundColor="white" ;
      for(let i=0;i<document.getElementsByClassName("ClassForSettOver").length;i++)
        (document.getElementsByClassName("ClassForSettOver")[i] as HTMLElement).style.backgroundColor=this.innerColor;      
      for(let i=0;i<document.getElementsByClassName("prikazProjekta").length;i++)
        (document.getElementsByClassName("prikazProjekta")[i] as HTMLElement).style.border="1px solid white";          
      

        
      
      if(this.FunctionForWhenToChangeColor(this.innerColor) && this.innerColor!="white")
      { 
        await new Promise(f => setTimeout(f, 100));   
        for(let i=0;i<document.getElementsByClassName("ClassForSettOver").length;i++)
          (document.getElementsByClassName("ClassForSettOver")[i] as HTMLElement).style.backgroundColor=this.innerColor;    

        if((document.getElementById("tabela1") as HTMLElement)) (document.getElementById("tabela1") as HTMLElement).style.border="1px solid white"; 
        for(let i=0;i<document.getElementsByClassName("ClassForSettOver").length;i++)
          (document.getElementsByClassName("ClassForSettOver")[i] as HTMLElement).style.color="white";   
        for(let i=0;i<document.getElementsByClassName("innerCircle").length;i++)
          (document.getElementsByClassName("innerCircle")[i] as HTMLElement).style.color="black";  
        for(let i=0;i<document.getElementsByClassName("button").length;i++)
          {
            (document.getElementsByClassName("button")[i] as HTMLElement).style.color="black";
            (document.getElementsByClassName("button")[i] as HTMLElement).style.backgroundColor="white";
          }
          if((document.getElementById("dugmeZaKreiranje") as HTMLElement)) (document.getElementById("dugmeZaKreiranje") as HTMLElement).style.backgroundColor="#D9D9D9";   
          if((document.getElementById("dugmeZaKreiranje") as HTMLElement)) (document.getElementById("dugmeZaKreiranje") as HTMLElement).style.color="#a3a3a3";  
      } 
      if(this.FunctionForWhenToChangeColor(this.outerColor) && this.outerColor!="white")
      {
        for(let i=0;i<document.getElementsByClassName("sortBtn").length;i++)
            (document.getElementsByClassName("sortBtn")[i] as HTMLElement).style.color="white";
        if(document.getElementById("titleDateSett"))        (document.getElementById("titleDateSett") as HTMLElement).style.color="white"; 
        if(document.getElementById("colDateSett"))          (document.getElementById("colDateSett") as HTMLElement).style.color="white"; 
        if(document.getElementById("buttonforCreatiing"))   (document.getElementById("buttonforCreatiing") as HTMLElement).style.color="black"; 
        if(document.getElementById("buttonforCreatiing"))   (document.getElementById("buttonforCreatiing") as HTMLElement).style.backgroundColor="white"; 
        
        for(let i=0;i<document.getElementsByClassName("filterBtn").length;i++)
          (document.getElementsByClassName("filterBtn")[i] as HTMLElement).style.color="white";         
        
        if(document.getElementById("projectmemberform")  )  (document.getElementById("projectmemberform") as HTMLElement).style.color="black"; 
        if(document.getElementById("projectmemberform") )   (document.getElementById("projectmemberform") as HTMLElement).style.backgroundColor="white"; 
        for(let i=0;i<document.getElementsByClassName("notDa").length;i++)
          (document.getElementsByClassName("notDa")[i] as HTMLElement).style.color="white";  
        for(let i=0;i<document.getElementsByClassName("settingClassPages").length;i++)
          (document.getElementsByClassName("settingClassPages")[i] as HTMLElement).style.color="white";   
        for(let i=0;i<document.getElementsByClassName("taskList").length;i++)
          (document.getElementsByClassName("taskList")[i] as HTMLElement).style.border="1px solid white"; 
        for(let i=0;i<document.getElementsByClassName("taskList").length;i++)
          (document.getElementsByClassName("taskList")[i] as HTMLElement).style.backgroundColor=this.innerColor;    
      }
      await new Promise(f => setTimeout(f, 100));   
      for(let i=0;i<document.getElementsByClassName("ClassForSettOver").length;i++)
        (document.getElementsByClassName("ClassForSettOver")[i] as HTMLElement).style.backgroundColor=this.innerColor;
      for(let i=0;i<document.getElementsByClassName("taskRows").length;i++)
        {
          (document.getElementsByClassName("taskRows")[i] as HTMLElement).style.backgroundColor=this.innerColor;   
        }    
        
        console.log("MENJAJ BRE",(document.getElementsByClassName("ClassForSettOver") ))  ;


    }
  }
  specSet(){
    for(let i=0;i<document.getElementsByClassName("hover-pointer").length;i++) 
      (document.getElementsByClassName("hover-pointer")[i] as HTMLElement).style.filter="invert(100%)"
  }
  async MethodForTaskview(){
    if(this.router.url.indexOf("/taskView") !== -1 || this.router.url.indexOf("/projectView") !== -1 ){
      if((document.getElementById("tabela1") as HTMLElement)) (document.getElementById("tabela1") as HTMLElement).style.backgroundColor=this.innerColor;  
      if( this.router.url.indexOf("/projectView") !== -1 )  
      for(let i=0;i<document.getElementsByClassName("taskList").length;i++)
      {
        if(this.innerColor!="#ffffff" && this.innerColor!="white") (document.getElementsByClassName("taskList")[i] as HTMLElement).style.backgroundColor=this.innerColor ;
        (document.getElementsByClassName("taskList")[i] as HTMLElement).style.boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px "

      }
      if(document.getElementsByClassName("container")[0])     (document.getElementsByClassName("container")[0] as HTMLElement).style.border="1px solid white" ;
      if(this.FunctionForWhenToChangeColor(this.innerColor) && this.innerColor!="white")
        {
          for(let i=0;i<document.getElementsByClassName("taskList").length;i++)
            (document.getElementsByClassName("taskList")[i] as HTMLElement).style.border="1px solid white"

        } 

      if(this.FunctionForWhenToChangeColor(this.outerColor) && this.outerColor!="white")
      {
        if(document.getElementById("tabela1"))     (document.getElementById("tabela1") as HTMLElement).style.border="1px solid white" ;
        if(document.getElementsByClassName("titleAndDesc")[0])   (document.getElementsByClassName("titleAndDesc")[0] as HTMLElement).style.color="white";

        for(let i=0;i<document.getElementsByClassName("notDa").length;i++)
          (document.getElementsByClassName("notDa")[i] as HTMLElement).style.color="white";  
        for(let i=0;i<document.getElementsByClassName("settingClassPages").length;i++)
          (document.getElementsByClassName("settingClassPages")[i] as HTMLElement).style.color="white";   

      } 
      await new Promise(f => setTimeout(f, 100));   
      for(let i=0;i<document.getElementsByClassName("rowForColor").length;i++) 
        (document.getElementsByClassName("rowForColor")[i] as HTMLElement).style.backgroundColor="white" ;
      for(let i=0;i<document.getElementsByClassName("rowSettDa").length;i++)
        (document.getElementsByClassName("rowSettDa")[i] as HTMLElement).style.backgroundColor="white";
      
    }
  }

  async MethodForHome()
  {

    if(this.router.url.indexOf("/home") !== -1){
      if(document.getElementsByClassName("progCompl")[0])   (document.getElementsByClassName("progCompl")[0] as HTMLElement).style.backgroundColor=this.innerColor ;
      if(document.getElementsByClassName("progCompl")[1])   (document.getElementsByClassName("progCompl")[1] as HTMLElement).style.backgroundColor=this.innerColor ;
      if(document.getElementById("cont"))                (document.getElementById("cont") as HTMLElement).style.backgroundColor=this.innerColor ;
      if(document.getElementById("tabela1"))             (document.getElementById("tabela1") as HTMLElement).style.backgroundColor=this.innerColor ;
      if(document.getElementById("settTab"))             (document.getElementById("settTab") as HTMLElement).style.backgroundColor=this.innerColor ;

        
      if(this.FunctionForWhenToChangeColor(this.innerColor) && this.innerColor!="white")
        {
          //if(document.getElementById("settTab"))                                (document.getElementById("settTab") as HTMLElement).style.color="white";
          if(document.getElementsByClassName("projects")[0])                    (document.getElementsByClassName("projects")[0] as HTMLElement).style.color="white";       
          if(document.getElementById("status"))                                 (document.getElementById("status") as HTMLElement).style.color="white";
          if(document.getElementsByClassName("settButtonChart")[0])              (document.getElementsByClassName("settButtonChart")[0] as HTMLElement).style.border="1px solid white";
          if(document.getElementsByClassName("settButtonChart")[1])              (document.getElementsByClassName("settButtonChart")[1] as HTMLElement).style.color="1px solid white";
          await new Promise(f => setTimeout(f, 100));   
          if(document.getElementsByClassName("header")[0])                    (document.getElementsByClassName("header")[0] as HTMLElement).style.color="black";
          if(document.getElementsByClassName("header")[1])                      (document.getElementsByClassName("header")[1] as HTMLElement).style.color="black";
          if(document.getElementsByClassName("header")[2])                      (document.getElementsByClassName("header")[2] as HTMLElement).style.color="black";
          if(document.getElementsByClassName("header")[3])                      (document.getElementsByClassName("header")[3] as HTMLElement).style.color="black";
          if(document.getElementsByClassName("header")[4])                      (document.getElementsByClassName("header")[4] as HTMLElement).style.color="black";
          if(document.getElementsByClassName("header")[5])                      (document.getElementsByClassName("header")[5] as HTMLElement).style.color="black";
          if(document.getElementsByClassName("notificationsContainer")[0])                     (document.getElementsByClassName("notificationsContainer"));

          if(document.getElementById("ForColorId") )(document.getElementById("ForColorId") as HTMLElement).style.color="Black" ;
          if(document.getElementById("tabela1"))             (document.getElementById("tabela1") as HTMLElement).style.border="1px solid white";
        } 

      if(this.FunctionForWhenToChangeColor(this.outerColor) && this.outerColor!="white")
      {
        for(let i=0;i<document.getElementsByClassName("settingClassPages").length;i++)
          (document.getElementsByClassName("settingClassPages")[i] as HTMLElement).style.color="white";   
        if(document.getElementById("ForColorId"))  (        document.getElementById("ForColorId") as HTMLElement).style.color="white" ;
        if(document.getElementById("buttonforCreatiing"))   (document.getElementById("buttonforCreatiing") as HTMLElement).style.color="black" ;
        if(document.getElementById("buttonforCreatiing"))     (document.getElementById("buttonforCreatiing") as HTMLElement).style.backgroundColor="white" ;

      } 
    }
  }
  async MethodForProfile(br:number){
    if(this.router.url.indexOf("/profile") !== -1){

      await new Promise(f => setTimeout(f, 100));   
      if(document.getElementsByClassName("containerEdit")[0])          (document.getElementsByClassName("containerEdit")[0] as HTMLElement).style.border="1px solid white"; 
      if(document.getElementsByClassName("containerEdit")[0])       (document.getElementsByClassName("containerEdit")[0] as HTMLElement).style.backgroundColor=this.innerColor;
      if(this.router.url[this.router.url.length-1]=="1" || br==1) (document.getElementsByClassName("detail role")[0] as HTMLElement).style.backgroundColor="white";
      for(let i=0;i<document.getElementsByClassName("personalInfoView").length;i++)
            if(document.getElementsByClassName("containerEdit")[0])   (document.getElementsByClassName("personalInfoView")[i] as HTMLElement).style.backgroundColor="white" ;

      if(this.FunctionForWhenToChangeColor(this.innerColor) && this.innerColor!="white")
        {
            if(this.router.url[this.router.url.length-1]=="0" || br==0)
            {
              if(document.getElementsByClassName("editButtonView")[0])   (document.getElementsByClassName("editButtonView")[0] as HTMLElement).style.filter="invert(100%)";
              if(document.getElementsByClassName("font-bold text-lg")[0])   (document.getElementsByClassName("font-bold text-lg")[0] as HTMLElement).style.filter="invert(100%)";
            }
            if(this.router.url[this.router.url.length-1]=="1" || br==1)
            {
              if(document.getElementsByClassName("changePfp")[0])   (document.getElementsByClassName("changePfp")[0] as HTMLElement).style.filter="invert(50%)";
              if(document.getElementById("SaveBut"))                (document.getElementById("SaveBut") as HTMLElement).style.backgroundColor="white" ;
              if(document.getElementById("SaveBut"))                (document.getElementById("SaveBut") as HTMLElement).style.color="black" ;
              if(document.getElementById("CancBut"))                (document.getElementById("CancBut") as HTMLElement).style.backgroundColor="darkgray" ;
            }
        } 
      if(this.FunctionForWhenToChangeColor(this.outerColor) && this.outerColor!="white")
      {
        (document.getElementsByClassName("header")[0] as HTMLElement).style.color="white";
        if(document.getElementsByClassName("container")[0])     (document.getElementsByClassName("container")[0] as HTMLElement).style.border="1px solid white" ;
      }
    }
  }
  async MethodForSettings(){
    if(this.router.url.indexOf("/settings") !== -1){
      //await new Promise(f => setTimeout(f, 100));   

      if(document.getElementById("tabela"))    (document.getElementById("tabela") as HTMLElement).style.backgroundColor=this.innerColor ;
      this.renderer.setStyle(document.body, 'background-color',this.outerColor);
      (document.getElementById("container") as HTMLElement).style.backgroundColor=this.outerColor; 
      
      if(this.FunctionForWhenToChangeColor(this.innerColor) && this.innerColor!="white")
      {
        if(document.getElementById("picSett")) (document.getElementById("picSett") as HTMLElement).style.filter="invert(100%)";
        if(document.getElementById("picSett2")) (document.getElementById("picSett2") as HTMLElement).style.filter="invert(100%)";
        if(document.getElementsByClassName("dok")[0])     (document.getElementsByClassName("dok")[0] as HTMLElement).style.background="white";
        if(document.getElementsByClassName("dok")[1])     (document.getElementsByClassName("dok")[1] as HTMLElement).style.background="white";
        if(document.getElementsByClassName("dok")[0])     (document.getElementsByClassName("dok")[0] as HTMLElement).style.color="black";
        if(document.getElementsByClassName("dok")[1])     (document.getElementsByClassName("dok")[1] as HTMLElement).style.color="black";
        if(document.getElementById("tabela"))     (document.getElementById("tabela") as HTMLElement).style.color = 'white';
        if(document.getElementsByClassName("removeIcon")[0])     (document.getElementsByClassName("removeIcon")[0] as HTMLElement).style.backgroundColor="red";
      } 
      if(this.FunctionForWhenToChangeColor(this.outerColor) && this.outerColor!="white")
        if(document.getElementsByName("OuterTitle")[0] )    (document.getElementsByName("OuterTitle")[0] as HTMLElement).style.color="white";
    }
  }



}