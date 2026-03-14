import { Component, Renderer2, ElementRef, Input } from '@angular/core';
import { GetTaskService } from '../../services/get-task.service';
import { OnInit } from '@angular/core';
import { Router, Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Auth1Service } from '../../services/auth1.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { error } from 'console';
import { NgModel } from '@angular/forms';
import { checkNgInput } from '../helpers/inputValidator';
import { NgxSpinnerService } from 'ngx-spinner';
import { Editor, Toolbar } from 'ngx-editor';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent implements OnInit {
  username: string | null = null;
  id: any;
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
  ];
  spinner: boolean = false;
  subscription: Subscription;
  @Input() type: string;
  public projects: any[] = [];
  public zavrseni: number;
  public neZavrseni: number;
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private TaskGet: GetTaskService,
    private route: ActivatedRoute,
    private router: Router,
    private auth1Service: Auth1Service,
    private msg: MessageService,
    private translate:TranslateService,
    public primeNGConfig: PrimeNGConfig,
  ) {
          this.subscription = this.translate.stream('primeng').subscribe(data => {
          this.primeNGConfig.setTranslation(data);
        });      
    
    }

  labels: any[];
  tasks: any[];
  assignesTheeseGoods: any[] = [];
  NotIn: any[];

  desc: string = '';
  taskPar: any;
  Lab: any;

  projectName: any;
  priority: any;
  dateBeginning: any;
  dateEnd: any;
  DONE = 1;
  date1: any;
  date2: any;
  add = '../../../assets/images/addTaskPlus.png';

  formSubmitted: boolean = false;
  hide = 1;
  /*
  reveal(){
    try{
      var x = document.getElementById("OvoJeZaCircleDok");
      if(this.hide == 0){
          x?.setAttribute("style", "display:None");
          this.hide=1;
          this.add="../../../assets/images/addTaskPlus.png";
      }
      else{
        x?.setAttribute("style", "display:inline");
        this.hide=0;
        this.add="../../../assets/images/disableGiving.png";
      }
      
    }
    catch{}
  }*/
  projectBeggin:any;
  projectEnd:any
  AddAssigne(n: any) {
    this.assignesTheeseGoods.push(this.NotIn[n['i']]);
    this.NotIn.splice(n['i'], 1);
  }
  removeAssigne(n: any) {
    console.log(n['i'], '---');
    this.NotIn.push(this.assignesTheeseGoods[n['i']]);
    this.assignesTheeseGoods.splice(n['i'], 1);
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.username = this.auth1Service.getUsernameFromToken();
    this.route.params.subscribe((params) => {
      //OVDE JE ZA DODAVANJE PARAMETRA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!--------------------------------------------------------------
      this.id = +params['id'];
      let id = +params['id'];

      this.getTasksOfProject();
      this.getLabels();
      this.getUsersOnProject();

      this.TaskGet.getProject(id+"").subscribe(
        (data: any)=>{
          this.projectBeggin=new Date(data['pocetak'][6]+""+data['pocetak'][7]+""+data['pocetak'][8]+""+data['pocetak'][9]+"-"+data['pocetak'][3]+""+data['pocetak'][4]+'-'+data['pocetak'][0]+""+data['pocetak'][1]);
          this.projectEnd=new Date(data['kraj'][6]+""+data['kraj'][7]+""+data['kraj'][8]+""+data['kraj'][9]+"-"+data['kraj'][3]+""+data['kraj'][4]+'-'+data['kraj'][0]+""+data['kraj'][1]);
          this.flgBeggin = this.projectBeggin;
          this.flgEnd = this.projectEnd;
        }
      )
      this.taskPar = 0;
    });
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  getTasksOfProject() {
    console.log('id', this.id);
    this.TaskGet.getTasksOfProject(this.id).subscribe(
      (data: any[]) => {
        this.tasks = data;
        this.tasks = this.tasks.filter((item) => item.status !== 0);
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }
  getLabels() {
    console.log('labels', this.id);
    this.TaskGet.getLabels().subscribe(
      (data: any[]) => {
        this.labels = data;
        console.log(this.labels);
        this.labels = this.labels.filter(
          (item) => item.idProjekat + '' === this.id + ''
        );
        this.Lab = this.labels[0]['id'];
        console.log(this.labels);
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }
  getUsersOnProject() {
    this.TaskGet.getProjectMembers(this.id).subscribe(
      (data: any[]) => {
        this.NotIn = data;
        for (let i = 0; i < this.NotIn.length; i++) {
          this.TaskGet.getPictureOfUser(this.NotIn[i]['username']).subscribe(
            (data2) => {
              this.NotIn[i]['slika'] = this.TaskGet.decodeMethod(data2);
            }
          );
        }
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
    console.log(this.NotIn);
  }
  CreateTaskNew() {
    console.log(this.assignesTheeseGoods);
    console.log(this.dateBeginning, this.dateEnd);
    let DoIt = 0;
    this.formSubmitted = true;
    if (this.projectName == '' || this.projectName == undefined) {
      DoIt++;
    }

 /*   if (this.desc == '' || this.desc == undefined) {
//      DoIt++;
    }*/

    if (this.priority == undefined) {
      DoIt++;
    }

    if (this.dateBeginning == undefined || this.dateEnd == undefined) {
      // this.msg.add({
      //   severity: 'error',
      //   summary: this.translate.instant('error'),
      //   detail:  this.translate.instant('datesDefined'),
      // });
      DoIt++;
      return;
    }

    if (this.dateBeginning > this.dateEnd) {
      this.msg.add({
        severity: 'error',
        summary: this.translate.instant('error'),
        detail: this.translate.instant('endEarlier'),
      });
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
    if (this.DONE == 1 && DoIt == 0) {
      this.spinner = true;
      this.TaskGet.CreateTask(
        this.projectName,
        this.desc,
        this.priority,
        this.date1,
        this.date2,
        this.taskPar,
        this.id,
        this.Lab
      ).subscribe(
        (data) => {
          document
            .getElementById('cancel2')
            ?.setAttribute('style', 'cursor:wait');
          document
            .getElementById('addTask')
            ?.setAttribute('style', 'cursor:wait');
          const elements = this.elementRef.nativeElement.querySelectorAll('*');
          elements.forEach((element: HTMLElement) => {
            this.renderer.setStyle(element, 'cursor', 'wait');
          });
          this.DONE = 0;
          const jsonObject = JSON.parse(data);
          const idTask = jsonObject.id;
          let lengtic = this.assignesTheeseGoods.length;

          if (this.assignesTheeseGoods.length != 0)
            this.TaskGet.getAllIds().subscribe(
              (all) => {
                for (let i = 0; i < this.assignesTheeseGoods.length; i++) {
                  let idUser = '0';

                  for (let j = 0; j < all.length; j++)
                    if (
                      all[j]['username'] ==
                      this.assignesTheeseGoods[i]['username']
                    ) {
                      idUser = all[j]['id'];
                      console.log(idUser, idTask, '++++');
                      break;
                    }
                  console.log(idUser, idTask);
                  this.TaskGet.AddTaskMembers(idUser, idTask).subscribe(
                    (data) => {
                      lengtic--;
                      console.log(lengtic);
                      if (lengtic == 0) location.reload();
                    },
                    (error) => {}
                  );
                }
              },
              (error) => {}
            );
          else location.reload();
        },
        (error) => {}
      );
    }
  }
  checkName(event: any, ngModel: NgModel) {
    const reg = new RegExp('^.+$');
    checkNgInput(reg, event.target.value, ngModel);
  }
  resetForm(){
    this.projectName="";
    this.priority="";
    this.dateBeginning="";
    this.dateEnd="";
    this.DONE=0;
    this.date1="";
    this.date2="";
    this.formSubmitted= false;
  }
  prazni(){
    if(this.taskPar==0)
      {
        this.projectBeggin=this.flgBeggin;
        this.projectEnd=this.flgEnd;
        this.dateBeginning="";
        this.dateEnd="";
        return;
      }
    this.TaskGet.getTask(this.taskPar).subscribe(
      (data:any)=>{
        this.projectBeggin=new Date(data['pocetak'][6]+""+data['pocetak'][7]+""+data['pocetak'][8]+""+data['pocetak'][9]+"-"+data['pocetak'][3]+""+data['pocetak'][4]+'-'+data['pocetak'][0]+""+data['pocetak'][1]);
        this.projectEnd=new Date(data['kraj'][6]+""+data['kraj'][7]+""+data['kraj'][8]+""+data['kraj'][9]+"-"+data['kraj'][3]+""+data['kraj'][4]+'-'+data['kraj'][0]+""+data['kraj'][1]);
        this.dateBeginning="";
        this.dateEnd="";
      }
    )

  }
  flgBeggin:any
  flgEnd:any
}
