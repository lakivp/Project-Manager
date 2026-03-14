import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectTableService } from '../../services/project-table.service';
import { Chart } from 'chart.js';
import { registerables } from 'chart.js';
import { Auth1Service } from '../../services/auth1.service';
import { AuthIduserService } from '../../services/auth-iduser.service';
import { CreateProjectService } from '../../services/create-project.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service'
import { Renderer2 ,ElementRef } from '@angular/core';
import { SettingsServService } from '../../services/settings-serv.service';
import { error } from 'console';
import { checkNgInput } from '../helpers/inputValidator';
import { NgModel } from '@angular/forms';
import { GetTaskService } from '../../services/get-task.service';
import { ViewChild } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { ChartComponent } from '../chart/chart.component';
import { Modal } from 'bootstrap';
import { ProjectTableComponent } from '../project-table/project-table.component';
import { SignalRService } from '../../services/signalr.service';
import { SharedService } from '../../services/home-body-shared.service';
import { ProjectService } from '../../services/project.service';
import { SharedService3 } from '../../services/navbar-home-shared.service';
import { Editor, Toolbar } from 'ngx-editor';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('calendarComponentRef') innerComponent: CalendarComponent;
  @ViewChild('projectTableComponentRef') projectTable: ProjectTableComponent;
  @ViewChild('chartCompRef') innerComponent2: ChartComponent;
  invokeChangeTasksProject() {
    this.innerComponent.projectsYes=!this.innerComponent.projectsYes;
    this.innerComponent.popupVisible=false;
    this.isProjectRight=!this.isProjectRight;
    this.innerComponent2.ChangeTaskProject();
  }
  signal:boolean=false;
  username: string | null = null;
  id: any;
  public projects: any[] = [];
  public zavrseni: number;
  public neZavrseni: number;
  isProjectManager:boolean;
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
  ];

  projectName: any;
  opis: string="";
  priority: any;
  dateBeginning: any;
  dateEnd: any;
  DONE: number;
  date1: any;
  date2: any;
  spinner:boolean=false;
  formSubmitted: boolean = false;
  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private auth1Service: Auth1Service,
    private msg: MessageService,
    private idAuth: AuthIduserService,
    private createProject: CreateProjectService,
    private renderer: Renderer2,
    private authService:AuthService, 
    private settingServ: SettingsServService,
    private sharedService:SharedService3,
    private tsk: GetTaskService,
    private projectService:ProjectService )
  {
  }
  tasks:any;
  zavrseni2=0;
  neZavrseni2=0;
  isProjectRight=true;
  userData:any;
  formOpen:boolean=false;
  ngOnInit() {
    this.editor = new Editor();
    this.isProjectRight=true;
    this.isProjectManager = this.auth1Service.getRoleProjectManagerFromToken();
    this.username = this.auth1Service.getUsernameFromToken();
    this.userData = this.authService.getUserInfo();
    this.settingServ.renderer=this.renderer;     this.settingServ.ColorElements(this.userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
    this.getInformation();
    this.sharedService.project$.subscribe((id:number) => {
      this.getNewProject(id);
    });

  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  getNewProject(id:number){
    console.log("ID", id);
    this.projectService.getProjectById(id).subscribe((data)=>{
      console.log(data);
      console.log(this.projects.indexOf(data));
      const newProjects = [...this.projects, data];
      this.projects=newProjects;
      if (data['status'] == 1) {
        const newNum =this.neZavrseni+1;
        console.log(data['status'], newNum);
        this.neZavrseni=newNum;
      }
      else {
        const newNum =this.zavrseni+1;
        console.log(data['status'], newNum);
        this.zavrseni=newNum;
      }
      console.log(this.zavrseni, this.neZavrseni);
      this.projectTable.getAllProjects(this.userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
      this.innerComponent2.getProjects(data);
    })
  }

  closeForm(){
    this.formOpen=false;
    this.resetForm();
  }

  getInformation(){
    console.log("usaaoo");
    this.userData = this.authService.getUserInfo();
    console.log('Fetching projects...');
    this.idAuth.getProjectsById(this.userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']).subscribe(
      (data: any[]) => {
        console.log(" eee ", data)
        this.projects = data;
        this.zavrseni = 0;
        this.neZavrseni = 0;
        for (let i = 0; i < this.projects.length; i++) {
          if (this.projects[i]['status'] == 1) this.neZavrseni=this.neZavrseni+1;
          else this.zavrseni=this.zavrseni+1;
        }
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  
    this.tsk.getUserTasks(this.userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']).subscribe(
      (data: any[]) => {
        this.tasks = data;
        this.zavrseni2 = 0;
        this.neZavrseni2 = 0;

        for (let i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i]['status'] == 1) this.neZavrseni2++;
          else this.zavrseni2++;
        }
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }
  openForm(){
    console.log("otvaram");
    this.formOpen=true;
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
  
  CreateProjectNew() {
      
    let DoIt = 0;
    this.formSubmitted = true;
    if (this.projectName == '' || this.projectName == undefined) {
      DoIt++;
    }

    if (this.priority == undefined) {
      DoIt++;
    }

    if (this.dateBeginning == undefined || this.dateEnd == undefined) {
      DoIt++;
      return;
    }

    if (this.dateBeginning > this.dateEnd) {
      DoIt++;
      return;
    }

    let dan1, dan2, mesec1, mesec2;
    if (this.dateBeginning.getDate() < 10)
      dan1 = '0' + this.dateBeginning.getDate();
    else dan1 = this.dateBeginning.getDate();

    if (this.dateEnd.getDate() < 10) dan2 = '0' + this.dateEnd.getDate();
    else dan2 = this.dateEnd.getDate();

    if (this.dateBeginning.getMonth() + 1 < 10)
      mesec1 = '0' + (this.dateBeginning.getMonth() + 1);
    else mesec1 = this.dateBeginning.getMonth() + 1;

    if (this.dateEnd.getMonth() + 1 < 10)
      mesec2 = '0' + (this.dateEnd.getMonth() + 1);
    else mesec2 = this.dateEnd.getMonth() + 1;

    this.date1 = dan1 + '.' + mesec1 + '.' + this.dateBeginning.getFullYear();
    this.date2 = dan2 + '.' + mesec2 + '.' + this.dateEnd.getFullYear();

    if (DoIt == 0){
      this.spinner=true;
      this.createProject
        .add(this.projectName, this.opis, this.priority, this.date1, this.date2)
        .subscribe(
          (data) => {
            document
              .getElementById('cancel')
            document
              .getElementById('addProject')
            const elements =
              this.elementRef.nativeElement.querySelectorAll('*');

            const jsonObject = JSON.parse(data);
            const idPro = jsonObject.id;
            console.log(idPro);
            this.DONE = 0;
            const idKor = this.idAuth.getUserId();

            const idKor2 = idKor + '';
            console.log(idKor2, idPro);
            this.createProject.addInMembers(parseInt(idKor2), idPro).subscribe(
              (data) => {
                const newProject = {id:idPro, naziv:this.projectName, pocetak:this.dateBeginning, prioritet:this.priority, role:data.ulogaId, status:1};
                const newProjects=[...this.projects, newProject];
                this.projects=newProjects;
                this.projectTable.getAllProjects(this.userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
                this.spinner=false;
                DoIt = 0;
                this.resetForm();
                this.formOpen=false;
              },
              (error) => {
                this.spinner=false;
                console.log(error);
              }
            );
          },
          (error) => {
            console.log(error);
          }
        );
      }
      //
  }
  checkName(event: any, ngModel: NgModel) {
    const reg = new RegExp('^.+$');
    checkNgInput(reg, event.target.value, ngModel);
  }
  checkDate(event: any, ngModel: NgModel) {
    console.log(event.target.value);
    const reg = new RegExp('^.+$');
    checkNgInput(reg, event.target.value, ngModel);
  }
  resetForm(){
    this.projectName="";
    this.opis="";
    this.priority="";
    this.dateBeginning="";
    this.dateEnd="";
    this.DONE=0;
    this.date1="";
    this.date2="";
    this.formSubmitted= false;
  }
}
