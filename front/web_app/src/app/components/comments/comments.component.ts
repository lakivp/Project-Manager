import { AfterViewInit, Component , OnInit } from '@angular/core';
import { Router,Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GetTaskService } from '../../services/get-task.service';
import { SettingsServService } from '../../services/settings-serv.service';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService } from 'primeng/api';
import { data } from 'jquery';
import { HTML } from 'ngx-editor/lib/trustedTypesUtil';
import { HostListener } from '@angular/core'; 
import e from 'express';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})


export class CommentsComponent  implements OnInit {
getFormattedText(arg0: any) {
  return arg0.replace(/\n/g, '<br>');

}

  UserDataAll:any;
  comments: any[]=[];
  numComments: number; //broj komentara
  odg=0;
  brojKom=0;
  heartUrl="../../../../assets/images/heart.png";
  TextReply="";
  textValue="";
  userName:any;
  userImage: any;
  userFirst:any;
  userLast:any;
  userId:any
  colorStat:any;
  taskId:any;
  StvariOdgSve:any=[];
  UradiTo=0;

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private taskService: 
    GetTaskService,private location:Location, 
    private settingServ: SettingsServService,private auth: AuthService,
    private confirm:ConfirmationService) {}

  ngOnInit() {
      const userData = this.auth.getUserInfo();
      let id=userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']  
      this.userId = id;
      
      this.route.params.subscribe(params => {   ////////////////////////////////////
          this.taskId = params['taskId'];  if(this.taskId==undefined || isNaN(Number(this.taskId)))  this.taskId='1';
          this.VratiSve();
        }
      )
      this.numComments=this.comments.length;
      this.auth.getUser(id).subscribe(
        (data) =>{
          this.userFirst=data['ime']
          this.userName=data.username;
          this.userLast=data['prezime']
          this.settingServ.getSettingsById(this.userId+"").subscribe(
            (datRat)=>{
              this.colorStat=this.settingServ.ColorStatusReturn(datRat[0]['status'])
            }
          )
          this.taskService.getPictureOfUser(data.username).subscribe((data2)=>{
            this.userImage = this.taskService.decodeMethod(data2)
  
        }
      )})
    }

    VratiSve(){
      this.brojKom=0; this.odg=0;
      this.comments=[];
      this.taskService.getComments(this.taskId,this.userId).subscribe(
        (data) =>{
          console.log(data,"ovo je to");
          this.comments=data
          this.comments = data.filter(item => item['parentId'] === 0);
          for(let i =0;i<this.comments.length;i++){
            this.brojKom++;
            this.auth.getUser(this.comments[i]['autorId']).subscribe(
              (dat) =>{
                this.comments[i]['ime'] = dat['ime']+" "+dat['prezime'];
                this.comments[i]['brOd']=0;
                if(this.UradiTo==0) this.StvariOdgSve.push(0);
                this.vratiOdgovore(i,0);
                
                
                this.comments[i]['prikazOdgovora']=0; 
                this.comments[i]['redBr']=i; 
                this.comments[i]['zaOdg']=false;
                if(this.comments[i]['liked_by_user'])
                  this.comments[i]['bojaSrca']="red"
                else
                  this.comments[i]['bojaSrca']="gray"
                this.settingServ.getSettingsById(this.comments[i]['autorId']).subscribe(
                  (rat)=>{ this.comments[i]['boja']=this.settingServ.ColorStatusReturn(rat[0]['status']);         }
                )
                this.taskService.getPictureOfUser(dat['username']).subscribe(
                  (sat) =>{ this.comments[i]["slika"] = this.taskService.decodeMethod(sat);      }
                )
              }
            )
          }
        }
      )
    }

    vratiOdgovore(i:any,o:any){ console.log(this.userId);
      this.taskService.getrepliesComments(this.comments[i]['id'],this.userId).subscribe(
        (datSatRat) =>{   
          this.comments[i]['odgovori']=datSatRat;   
          for(let j=0;j<this.comments[i]['odgovori'].length;j++)
          {  
            this.comments[i]['brOd']++;
            if(o==0) this.odg++;
            this.auth.getUser(this.comments[i]['odgovori'][j]['autorId']).subscribe(
              (dat2) =>{
                this.comments[i]['odgovori'][j]['ime'] = dat2['ime']+" "+dat2['prezime'];

                if(this.comments[i]['odgovori'][j]['liked_by_user'])
                  this.comments[i]['odgovori'][j]['bojaSrca']="red"
                else
                  this.comments[i]['odgovori'][j]['bojaSrca']="gray"
                this.settingServ.getSettingsById(this.comments[i]['odgovori'][j]['autorId']).subscribe(
                  (rat)=>{ this.comments[i]['odgovori'][j]['boja']=this.settingServ.ColorStatusReturn(rat[0]['status']);         }
                )
                this.taskService.getPictureOfUser(dat2['username']).subscribe(
                  (sat) =>{ this.comments[i]['odgovori'][j]["slika"] = this.taskService.decodeMethod(sat);      }
                )
              }
            )
          }

        }
      )
    }
    change(num:string){
      let num2=parseInt(num);
      if(this.comments[num2][3]=="../../../../assets/images/heart.png")
      this.comments[num2][3]="../../../../assets/images/heartFull.png";
      else
      this.comments[num2][3]="../../../../assets/images/heart.png";
    }
    PushText(){
      if(this.textValue=="") return;
      this.UradiTo++;
      this.taskService.postComment(this.textValue,this.userId,this.taskId,0).subscribe(
        (dat2:any) =>{  
          console.log(dat2,this.comments);
          this.brojKom++;
          dat2['boja'] = this.colorStat;
          dat2['bojaSrca'] = "gray";
          dat2['ime'] = this.userFirst+" "+this.userLast;
          dat2['liked_by_user'] = false;
          dat2['likes'] = 0;
          dat2['odgovori'] = [];
          dat2['prikazOdgovora'] = 0;
          dat2['slika'] = this.userImage;
          dat2['zaOdg'] = false
          dat2['redBr'] = this.comments.length
          dat2['brOd'] = 0;
 
          
          this.comments.push(dat2);
          this.textValue="";
          //window.location.reload();
          //this.VratiSve();
        }
        
      )
      this.textValue="";
      

    }
    hideShow(num: Number){
      let oo:any = num;
      this.comments[oo][8]=false; console.log(this.comments[oo]['prikazOdgovora'],"34")
      if(this.comments[oo]['prikazOdgovora']==1)
        this.comments[oo]['prikazOdgovora']=0
      else
        this.comments[oo]['prikazOdgovora']=1

    }
    OpenReply(num:Number){
      for(let i=0;i<this.comments.length;i++) this.comments[i]['zaOdg']=false
      this.hideShow(num);
      let oo:any = num
      this.comments[oo]['prikazOdgovora']=1

      this.comments[oo]['zaOdg']=true;
    

    }
    closeReply(num:Number){
      for(let i=0;i<this.comments.length;i++) {
        this.comments[i]['zaOdg']=true
        this.hideShow(i);
        this.comments[i]['prikazOdgovora']=0

        this.comments[i]['zaOdg']=false;
      }

    }
    PushReply(num:Number,brOdg:any){
      if(this.TextReply=="") return;
      let broj: any = num;
      console.log(broj)
      this.taskService.postComment(this.TextReply,this.userId,this.taskId,broj).subscribe(
        (dat2:any) =>{  
          
          console.log(dat2,this.comments);

          dat2['boja'] = this.colorStat;
          dat2['bojaSrca'] = "gray";
          dat2['ime'] = this.userFirst+" "+this.userLast;
          dat2['liked_by_user'] = false;
          dat2['likes'] = 0;
          dat2['odgovori'] = [];
          dat2['prikazOdgovora'] = 0;
          dat2['slika'] = this.userImage;
          dat2['zaOdg'] = false
          dat2['redBr'] = this.comments.length
          dat2['brOd'] = 0;
          this.comments[brOdg]['brOd']++;
          
          this.comments[brOdg]['odgovori'].push(dat2);
          this.TextReply=""


          //this.vratiOdgovore(brOdg,1);
          //window.location.reload();
         }
      )
      this.TextReply=""
      this.odg++;
    }
    vratiBoju(){
      return 'lightgray';
    }
    brisiKomentar(id:any,parentId:any,brOdg:any){
      this.taskService.deleteComment(id).subscribe(
        (data)=>{
          /*if(parentId==0)
            this.VratiSve(); 
          
          else
          {
            this.vratiOdgovore(brOdg,1);
            this.odg--;
          }*/
          window.location.reload();
        }
      )
    }
    menjaj(id:any,parentId:any,brOdg:any){
      this.taskService.updateComment(id,(document.getElementById('myTextarea'+id) as HTMLTextAreaElement).value).subscribe(
        (data:any)=>{
          if(document.getElementById("comentEditDa"+id))  (document.getElementById("comentEditDa"+id) as HTMLElement).style.display="None";
          if(document.getElementById("comentNormal"+id))  (document.getElementById("comentNormal"+id) as HTMLElement).style.display="block";
          if(parentId==0){
            let foundItem = this.comments.find(item => item.id === id); 
            foundItem.text=(document.getElementById('myTextarea'+id) as HTMLTextAreaElement).value
          }
          else{
            let foundItem = this.comments.find(item => item.id === parentId);
            foundItem['odgovori'][brOdg]['text']=(document.getElementById('myTextarea'+id) as HTMLTextAreaElement).value
          }

        }
      )
    }
    menjajOrigin(id:any,parentId:any,brOdg:any,text:any){
      if(document.getElementById("comentEditDa"+id))  (document.getElementById("comentEditDa"+id) as HTMLElement).style.display="block";
      if(document.getElementById("comentNormal"+id))  (document.getElementById("comentNormal"+id) as HTMLElement).style.display="None";
      if(document.getElementById('myTextarea'+id) as HTMLTextAreaElement)  (document.getElementById('myTextarea'+id) as HTMLTextAreaElement).value=text;
    }  
    vratiOrigin(id:any,parentId:any,brOdg:any){
      if(document.getElementById("comentEditDa"+id))  (document.getElementById("comentEditDa"+id) as HTMLElement).style.display="None";
      if(document.getElementById("comentNormal"+id))  (document.getElementById("comentNormal"+id) as HTMLElement).style.display="block";
    }  

    DodajSrce(id:any,parentId:any,brOdg:any,br:any){
      this.taskService.ToogleLike(id,this.userId).subscribe(
        (data) =>{
          if(data=='true'){

            if(parentId==0){
              let foundItem = this.comments.find(item => item.id === id);
              foundItem.bojaSrca="red"
              foundItem['liked_by_user']=true;
              foundItem['likes']++;
            }
            else{
              let foundItem = this.comments.find(item => item.id === parentId); 
              foundItem['odgovori'][br].bojaSrca="red"
              foundItem['odgovori'][br]['liked_by_user']=true;
              foundItem['odgovori'][br]['likes']++;
            }

          }
          else{
            if(parentId==0){
              let foundItem = this.comments.find(item => item.id === id);
              foundItem.bojaSrca="gray"
              foundItem['liked_by_user']=false;
              foundItem['likes']--;
            }
            else{
              let foundItem = this.comments.find(item => item.id === parentId);
              foundItem['odgovori'][br].bojaSrca="gray"
              foundItem['odgovori'][br]['liked_by_user']=false;
              foundItem['odgovori'][br]['likes']--;
            }
          }
        }
      )

      
    }

} 
