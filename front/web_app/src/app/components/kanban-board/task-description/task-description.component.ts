import { AfterViewInit, Component , OnInit } from '@angular/core';
import { Router,Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GetTaskService } from '../../../services/get-task.service';
import { SettingsServService } from '../../../services/settings-serv.service';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Edit, Wind } from 'lucide-angular';
import {Editor, Toolbar} from 'ngx-editor';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadService } from '../../../services/file-upload.service';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-task-description',
  templateUrl: './task-description.component.html',
  styleUrl: './task-description.component.css'
})

export class TaskDescriptionComponent  implements OnInit,AfterViewInit{


    task: any;
    parTask:any="none";
    parTaskName:any="none"
    name: string;
    taskId: string;
    priority: string;
    color:string;
    color2:string;
    color3:string;
    colorStat:string
    imageUrl: string;
    progress: string;
    userName:any;
    userImage: any;
    userFirst:any;
    userLast:any;
    OpenClose:0;

    date1 :string;
    date2 :string;
    asiggne:string[][];
    realAssignees:string[][];
    creators: string[][];
    assigneToAdd: any[][]=[];
    assigneToAddAdded:any[][]=[];
    description: string="";
    stat=0;
    userId=0;
    toDelete:any[][]=[];

    EndZa=0;
    BegZa=0;

    editor: Editor;
    toolbar: Toolbar = [
      ['bold', 'italic'],
      ['underline', 'strike'],
      ['code', 'blockquote'],
      ['ordered_list', 'bullet_list'],
      [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
      ['link', 'image'],
    ];
    files:any[]=[];
    loadedFiles:any[]=[];

    UserDataAll:any;
    constructor(private route: ActivatedRoute,
      private router: Router, 
      private taskService: 
      GetTaskService,private location:Location, 
      private settingServ: SettingsServService,private auth: AuthService,
      private msg:MessageService,
      private translate:TranslateService,
      private fileUpload:FileUploadService,
      private confirm:ConfirmationService) {}
    clickToTask() 
    {
      this.location.back();
    }
    ngAfterViewInit(){

      this.highlightDisabledDates()
    }
    ngOnInit() {
      this.editor=new Editor();
      this.auth.getUser(this.auth.getUserInfo()['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']).subscribe(
        (sta) =>{
            this.UserDataAll = sta
          }
        );
      
      this.route.params.subscribe(params => {   ////////////////////////////////////
        this.taskId = params['taskId'];
        if(this.taskId==undefined || isNaN(Number(this.taskId))) 
          this.taskId='1';


        this.taskService.getTask(this.taskId)   //////////////////////////////////
        .subscribe((data: any[]) => {
          this.task = data; 
          this.OpenClose = this.task["status"];  this.stat = this.task["status"];
          if(document.getElementById("closedTaskYes") && (document.getElementById("NazivTogDa")) && this.task["status"]==0) {
            (document.getElementById("closedTaskYes") as HTMLElement).style.display="inline";
            (document.getElementById("NazivTogDa") as HTMLElement).style.textDecoration="line-through"
          }
          else {
            (document.getElementById("closedTaskYes") as HTMLElement).style.display="none";
            (document.getElementById("NazivTogDa") as HTMLElement).style.textDecoration="none"

          }
          this.parTask=this.task['idParent']
          if(this.task['idParent']!=0){
            this.taskService.getTask(this.task['idParent']).subscribe(
              data=>{
                let oo:any = data;
                this.parTaskName=oo['naziv']
              }
            )

            
          }

          this.fileUpload.getFiles(this.taskId).subscribe((data)=>{
            console.log(data);
            this.loadedFiles=data;
          })

          this.makePage();
          this.settingServ.ColorElements(0);
          },
          (error) => {
            console.error('Error fetching projects', error);
          }
        )

        
      });



    }

    isOwner: boolean;
  makePage(){

      this.description=this.task['opis'];
      this.priority =this.task['prioritet'];
      this.date1 =this.task['pocetak'];
      this.date2 =this.task['kraj'];
      this.name = this.task['naziv'];
      

      this.description2 = this.description;
      this.priority2=this.priority;
      this.date12 = this.date1;
      this.date22 = this.date2;
      this.name2=this.name;
      this.userName = this.taskService.getUsernameFromToken();
      
      this.taskService.getAllIds()    ///////////////////////////////////
      .subscribe((data3: any) => {
        
        for(let i=0;i<data3.length;i++)
          if(data3[i]['username']==this.userName)
            {
              this.userImage = data3[i]['imageURL'];
              this.userId=data3[i]['id']
              this.settingServ.getSettingsById(this.userId+"").subscribe(
                (datRat)=>{
                  this.colorStat=this.settingServ.ColorStatusReturn(datRat[0]['status'])
                  this.jezik=(datRat[0]['jezik']) 
                }
              )
            }
        },
        (error) => {}
      )   
      const userData = this.auth.getUserInfo();
      let id=userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']  

      this.auth.getUser(id).subscribe(
        (data) =>{
          this.userFirst=data['ime']
          this.userName=data.username;
          this.userLast=data['prezime']
          this.taskService.getPictureOfUser(data.username).subscribe((data2)=>{
            this.userImage = this.taskService.decodeMethod(data2)

        }
      )})

      if(this.priority=="Medium")       this.color = "orange";
      else if(this.priority=="High")    this.color = "red";      
      else if(this.priority=="Low")     this.color = "green";    
      else  this.color = "gray";   
               

      this.imageUrl="../../../../assets/images/"+this.color+".png";

      this.taskService.getLabelName(this.task['idLabel'])    ///////////////////////////////////
      .subscribe((data2: any) => {

        
        this.progress=data2['naziv'];
        if(this.progress=="In Progress")        {    this.color2="red";            this.color3="rgb(255, 180, 180)";            }
        else if(this.progress=="Completed")     {    this.color2="green";          this.color3="rgb(163, 255, 186)";            }
        else if(this.progress=="To-Do")         {    this.color2="orange";          this.color3="yellow";            }
        else                                    {    this.color2="black";          this.color3="gray";            }
        },
        (error) => {}
      )       

        

      this.asiggne=[];

      this.creators=[["../../../../assets/pfp.jpg","Pera Peric"]];

      this.taskService.getTaskAsignUsers(this.taskId)
      .subscribe((data: any[]) => {
        this.taskService.getAllIds().subscribe(
          (data4)=>{
            let ok:any=data4;
            for(let i=0;i<data.length;i++){
              for(let j=0;j<ok.length;j++){
                if(ok[j]['username']==data[i]["username"])
                  {
                    this.taskService.getPictureOfUser(data[i]["username"]).subscribe((data2)=>{
                      data[i]["imageURL"] = this.taskService.decodeMethod(data2);
                      this.asiggne.push([data[i]["imageURL"],data[i]["username"],ok[j]['id'],data[i]['ime'],data[i]['prezime']]);
                    });
                  }
              }
            }
            this.realAssignees=this.asiggne;
          }
        );

        },
        (error) => {
          console.error('Error fetching projects', error);
        }
      )
      this.taskService.getProjectMembers(this.task.idProjekat).subscribe(
        data=>{
          for(let i=0;i<data.length;i++){
            if(data[i].username==this.userName){

              if(data[i].uloga!="Owner" && data[i].uloga!="Maintainer")
                {
                  if((document.getElementById("MatIkPenc") as HTMLElement)) (document.getElementById("MatIkPenc") as HTMLElement).style.display="none";
                }
            }

            
        }
      }
      )

      if(this.task.idParent==0)
        this.taskService.getProject(this.task.idProjekat).subscribe(
          (data: any)=>{
            let d=data['kraj']; console.log(d);
            this.projectBeggin=new Date(data['pocetak'][6]+""+data['pocetak'][7]+""+data['pocetak'][8]+""+data['pocetak'][9]+"-"+data['pocetak'][3]+""+data['pocetak'][4]+'-'+data['pocetak'][0]+""+data['pocetak'][1]);
            this.projectEnd=new Date(data['kraj'][6]+""+data['kraj'][7]+""+data['kraj'][8]+""+data['kraj'][9]+"-"+data['kraj'][3]+""+data['kraj'][4]+'-'+data['kraj'][0]+""+data['kraj'][1]);
          }
        )
      else
        this.taskService.getTask(this.task.idParent).subscribe(
          (data: any)=>{
            let d=data['kraj']; console.log(d);
            this.projectBeggin=new Date(data['pocetak'][6]+""+data['pocetak'][7]+""+data['pocetak'][8]+""+data['pocetak'][9]+"-"+data['pocetak'][3]+""+data['pocetak'][4]+'-'+data['pocetak'][0]+""+data['pocetak'][1]);
            this.projectEnd=new Date(data['kraj'][6]+""+data['kraj'][7]+""+data['kraj'][8]+""+data['kraj'][9]+"-"+data['kraj'][3]+""+data['kraj'][4]+'-'+data['kraj'][0]+""+data['kraj'][1]);
          }
        )
      
    }
    jezik:any;
    projectBeggin:any;
    projectEnd:any
    dataIsReady=false;
    EditYesNo=true
    pocetakZaAsignToAdd=0;
    ShowEdit(n:number){
      if(this.pocetakZaAsignToAdd==0)
        this.taskService.getProjectMembers(this.task.idProjekat).subscribe(
          data=>{
            for(let i=0;i<data.length;i++){ this.pocetakZaAsignToAdd++;
              if(data[i].username==this.userName){

                if(data[i].uloga!="Owner" && data[i].uloga!="Maintainer")
                  {
                    if((document.getElementById("MatIkPenc") as HTMLElement)) (document.getElementById("MatIkPenc") as HTMLElement).style.display="none";
                  }
              }
              let k =0;
              for(let j=0;j<this.asiggne.length;j++){
                if(this.asiggne[j][1]==data[i]['username'])
                  k++;
              
              }

              if(k==0) this.taskService.getPictureOfUser(data[i]["username"]).subscribe((data2)=>{
                data[i]["imageURL"] = this.taskService.decodeMethod(data2);
                this.taskService.getAllIds().subscribe(
                  (data33)=>{
                    for(let z=0;z<data33.length;z++)
                      if(data[i]['username']==data33[z]['username'])
                        this.assigneToAdd.push([data[i]["imageURL"],data[i]["username"],data33[z]['id'],data[i]['ime'],data[i]['prezime']]); 
                  }
                )
              });
            }
              
          }
        )
      

      this.dataIsReady=true;
      if(this.EditYesNo)
        {
          if((document.getElementById("tabelaEdit") as HTMLElement)) (document.getElementById("tabelaEdit") as HTMLElement).style.display="block";
          if((document.getElementById("tabela") as HTMLElement)) (document.getElementById("tabela") as HTMLElement).style.display="none";
          if((document.getElementById("MatIkPenc") as HTMLElement)) (document.getElementById("MatIkPenc") as HTMLElement).style.display="none";
          //if((document.getElementById("MatIkPenc") as HTMLElement)) (document.getElementById("MatIkPenc2") as HTMLElement).style.display="block";
          this.EditYesNo=false;
        }
      else{
        if((document.getElementById("tabelaEdit") as HTMLElement)) (document.getElementById("tabelaEdit") as HTMLElement).style.display="none";
        if((document.getElementById("tabela") as HTMLElement)) (document.getElementById("tabela") as HTMLElement).style.display="block";
        if((document.getElementById("MatIkPenc") as HTMLElement)) (document.getElementById("MatIkPenc") as HTMLElement).style.display="block";
        //if((document.getElementById("MatIkPenc") as HTMLElement)) (document.getElementById("MatIkPenc2") as HTMLElement).style.display="none"
        this.EditYesNo=true;
      }
      console.log(this.assigneToAdd)
      

    }
    
    description2:string = '';
    priority2=""
    date12 = ""
    date22 = ""
    name2=""
    spinner=false;
    MenjajKraj() {
      this.EndZa++
    }
    MenjajPoc() {
      this.BegZa++;
    } 
    asiggneToAdd:string[][];
    SaveTask(){

          let dan1, dan2, mesec1, mesec2;
          let datumZaPoc=new Date(this.date12)
          let DatumZaKraj = new Date(this.date22)

          if (new Date(datumZaPoc).getDate() < 10)
            dan1 = '0' + datumZaPoc.getDate();
          else dan1 = datumZaPoc.getDate();
      
          if (DatumZaKraj.getDate() < 10) dan2 = '0' + DatumZaKraj.getDate();
          else dan2 = DatumZaKraj.getDate();
      
          if (datumZaPoc.getMonth() + 1 < 10)
            mesec1 = '0' + (datumZaPoc.getMonth() + 1);
          else mesec1 = datumZaPoc.getMonth() + 1;
      
          if (DatumZaKraj.getMonth() + 1 < 10)
            mesec2 = '0' + (DatumZaKraj.getMonth() + 1);
          else mesec2 = DatumZaKraj.getMonth() + 1;
      
          let datePoc = dan1 + '.' + mesec1+ '.'+datumZaPoc.getFullYear()
          let dateZad = dan2 + '.' + mesec2+ '.'+DatumZaKraj.getFullYear()

          if(this.BegZa==0) datePoc=this.date1;
          if(this.EndZa==0) dateZad=this.date2;

          let prov1 = new Date(datePoc[6]+datePoc[7]+datePoc[8]+datePoc[9]+"-"+datePoc[3]+datePoc[4]+"-"+datePoc[0]+datePoc[1]);
          let prov2  = new Date(dateZad[6]+dateZad[7]+dateZad[8]+dateZad[9]+"-"+dateZad[3]+dateZad[4]+"-"+dateZad[0]+dateZad[1]);
          
          if(prov1>prov2)
            {
              this.msg.add({
                severity: 'error',
                summary: this.translate.instant('error'),
                detail:  this.translate.instant('datesDefined'),
              });
              return;
            }
        
          if(this.name2=="") this.name2=this.name;

          let head="Update Task" ; let tex1 = "You've changed the start and/or end date. This action may cause inconsistencies within child tasks. Do you want to save the changes?"
          if(this.jezik=="sr"){
             head="Promeni Task" ;  tex1 = "Promenili ste datum početka i/ili završetka. Ova radnja može izazvati nedoslednosti u podzadacima. Da li želite da sačuvate promene?"
          }
          if(this.jezik=="fr"){
             head="Tâche de mise à jour" ;  tex1 = "Vous avez modifié la date de début et/ou de fin. Cette action peut provoquer des incohérences dans les sous-tâches. Voulez-vous enregistrer les modifications?"
          }

          if(this.BegZa!=0 || this.EndZa!=0)
              this.confirm.confirm({
                header: head,
                message: tex1,
                accept: () => {
                  this.taskService.updateTask(this.taskId,this.name2,this.description2,this.priority2,datePoc,dateZad,this.task['idParent'],this.task['idProjekat'],this.task['idLabel'],this.task['status']).subscribe(
                    (dat)=>{
                      let broj=0;
                      this.spinner=true;
                      console.log(this.assigneToAddAdded.length)
                      for(let i=0;i<this.assigneToAddAdded.length;i++)
                      {
                        if(!this.realAssignees.includes(this.assigneToAddAdded[i])){
                          this.taskService.AddTaskMembers(this.assigneToAddAdded[i][2],this.taskId).subscribe(
                            (rat)=>{
                              broj++; console.log(broj,this.assigneToAddAdded.length,2)
                            }
                          )
                        }
                      }
                      for(let i=0;i<this.toDelete.length;i++){
                        console.log(this.toDelete[i]);
                        this.taskService.deleteMember(parseInt(this.taskId), this.toDelete[i][2]).subscribe(
                          (dat)=>{
                          }
                        );
                      }
                      for(let file of this.files){
                        this.fileUpload.addFiles(this.taskId,file).subscribe((data:any)=>{
                          console.log("Dodao fajlove.");
                        })
                      }
                      window.location.reload();
                    }
                  )
                }
              });
          else
            this.taskService.updateTask(this.taskId,this.name2,this.description2,this.priority2,datePoc,dateZad,this.task['idParent'],this.task['idProjekat'],this.task['idLabel'],this.task['status']).subscribe(
              (dat)=>{
                let broj=0;
                this.spinner=true;
                console.log(this.assigneToAddAdded.length)
                for(let i=0;i<this.assigneToAddAdded.length;i++)
                {
                  if(!this.realAssignees.includes(this.assigneToAddAdded[i])){
                    this.taskService.AddTaskMembers(this.assigneToAddAdded[i][2],this.taskId).subscribe(
                      (rat)=>{
                        broj++; console.log(broj,this.assigneToAddAdded.length,2)
                      }
                    )
                  }
                }
                console.log(this.toDelete);
                for(let i=0;i<this.toDelete.length;i++){
                  console.log(this.toDelete[i]);
                  this.taskService.deleteMember(parseInt(this.taskId), this.toDelete[i][2]).subscribe(
                    (dat)=>{
                    }
                  );
                }
                for(let file of this.files){
                  this.fileUpload.addFiles(this.taskId,file).subscribe((data:any)=>{
                    console.log("Dodao fajlove.");
                  })
                }
               window.location.reload();
                
              }
            )
        
        
    }

    addMember(user:any){
      console.log(this.asiggne, user);
      
        this.assigneToAddAdded.push(user);
        this.assigneToAdd = this.assigneToAdd.filter(innerArray => innerArray[1] !== user[1]);
    }    
//delete funk

    deleteMember(user:any){
      this.assigneToAdd.push(user);
      this.assigneToAddAdded = this.assigneToAddAdded.filter(innerArray => innerArray[1] !== user[1]);
      this.toDelete.push(user);
      this.asiggne=this.asiggne.filter(assignee=>assignee[1]!=user[1]);
      console.log(this.toDelete);
    }
// this.translate.instant('taskCloseDiag'),
    CloseTask(){
      let head="Close task"
      let head2='Reopen task'
      let tex1 ='Are you sure you want to Close this task?'
      let tex2='Are you sure you want to Reopen this task?'

      if(this.jezik=="sr"){
        head="Zatvori task"
        head2='Ponovo otvori task'
        tex1 ='Jeste sigurni da želite da Zatvorite task?'
        tex2='Jeste sigurni da želite da Ponovo otvorite task?'
      }
      if(this.jezik=="fr"){
        head="Fermez la tâche"
        head2='Rouvrez la tâche'
        tex1 ='Êtes-vous sûr de vouloir Fermer la tâche?'
        tex2='Êtes-vous sûr de vouloir Rouvrir la tâche?'
      }
      if(this.OpenClose)
        this.confirm.confirm({
          header: head,
          message: tex1,
          accept: () => {
            this.taskService.closeTask(this.taskId).subscribe(
              (rad)=>{
                window.location.reload();
              }
            )
          }
        });
      else{
        this.confirm.confirm({
          header: head2, 
          message: tex2,
          accept: () => {
            this.taskService.openTask(this.taskId).subscribe(
              (rad)=>{
                window.location.reload();
              }
            )
          }
        });
      }
    }
    numOfLast=0;
    isDivOnNewLine(){
      this.numOfLast++;
      if(this.numOfLast==3){
        this.numOfLast=0;
         // return true;
      }

      return false;
    }

    highlightDisabledDates() {
      const datePickers = document.querySelectorAll('.ui-calendar .ui-datepicker td:not(.ui-datepicker-other-month)');
      datePickers.forEach(td => {
        const dateText = td.querySelector('.ui-state-default')?.textContent;
        const monthYear = document.querySelector('.ui-calendar .ui-datepicker-title')?.textContent;
        const [monthText, yearText] = monthYear?.split(' ') ?? [];
        const month = new Date(Date.parse(monthText + " 1, 2024")).getMonth();
        const year = parseInt(yearText);
        const date = new Date(year, month, parseInt(dateText ?? "0"));
  
        if (date < this.projectBeggin || date > this.projectEnd) {
          td.classList.add('out-of-range');
        } else {
          td.classList.remove('out-of-range');
        }
      });
    }

    onFileDropped(event:any){
      for(const item of event){
        this.files=[...this.files,item];
      }
      console.log(this.files);
    }
    fileBrowseHandler(event:any){
      const files = event.target.files;
      for(let file of files){
        this.files=[...this.files,file];
      }
    }

    deleteFile(file1:any){
      console.log("usao",file1,this.files);
      const newFiles = this.files.filter(file=>file.name!=file1.name);
      this.files=newFiles;
    }

    downloadFile(file:any){
      this.fileUpload.downloadFiles(file.id).subscribe((data:any)=>{
        saveAs(data, file.title);
      });
    }
}
