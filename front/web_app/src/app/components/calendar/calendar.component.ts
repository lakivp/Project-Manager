import { Component,ViewChild,ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProjectTableService } from '../../services/project-table.service';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import { GetTaskService } from '../../services/get-task.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  @ViewChild('container') container: ElementRef;
  date: Date[] | undefined;
  dateTemplate:any;
  invalidDates=[new Date(2024,5,2)]
  projects:any=[];

  subscription: Subscription;

  checkDateForHoliday(date:any){
    var calendarDate = new Date(date.year,date.month,date.day);
    calendarDate.setHours(0,0,0,0);
    return this.isInArray(calendarDate);
  }
  projectsYes=true;
  constructor(private auth:ProjectTableService,
    private auth2:AuthService,
    public dialog: MatDialog,
    public tsk: GetTaskService,
    public translate: TranslateService, 
    public primeNGConfig: PrimeNGConfig,
  )
  {
      this.subscription = this.translate.stream('primeng').subscribe(data => {
        this.primeNGConfig.setTranslation(data);
    });      
    this.projectsYes=true;
    this.auth.getProjects(this.auth2.getUserInfo()['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']).subscribe(
      (data: any[]) => {
        let projects:any = data;


        for (let i = 0; i < projects.length; i++) {

          if (projects[i]['status'] == 1) {
            let [day, month, year] = projects[i]['kraj'].split(".");
            month=Number(month)-1;
            const date2 = new Date(`${year}-${month}-${day}`);

            this.specialDates.push(date2)
            this.projects.push([projects[i]['id'],projects[i]['naziv'],projects[i]['kraj']])
          }
          
        }
      }
    )
    this.tsk.getUserTasks(this.auth2.getUserInfo()['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']).subscribe(
      (data: any[]) => {
        let tasks:any = data;
         

        for (let i = 0; i < tasks.length; i++) {

          if (tasks[i]['status'] == 1) {
            let [day, month, year] = tasks[i]['kraj'].split(".");
            month=Number(month)-1;
            const date2 = new Date(`${year}-${month}-${day}`);

            this.specialDates2.push(date2)
            this.tasks.push([tasks[i]['id'],tasks[i]['naziv'],tasks[i]['kraj']])
          }
          
        }
      }
    )
  }
  
  specialDates: Date[] = []; 
  specialDates2: Date[] = []; 
  isSpecialDate(date: any): boolean {
      const currentDate = new Date(date.year, date.month - 1, date.day); 
      return this.specialDates.some(specialDate => this.areDatesEqual(currentDate, specialDate)); 
  }
  isSpecialDate2(date: any): boolean {
    const currentDate = new Date(date.year, date.month - 1, date.day); 
    return this.specialDates2.some(specialDate => this.areDatesEqual(currentDate, specialDate)); 
}
  areDatesEqual(date1: Date, date2: Date): boolean {
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate();
  }
  isInArray(value:Date) {
    return !!this.invalidDates.find(item => {
      return item.getTime() == value.getTime()});
  }
  projectsAll:any=[];
  tasksAll:any=[];
  tasks:any=[]
  popupVisible: boolean = false;
  selectedDate: any;
  popupPositionX: number = 320;
  popupPositionY: number = 10;
  showPopup(date: any): void {
    if(!this.projectsYes) return;
    if(!this.isSpecialDate(date)){this.popupVisible=false; return;}
    this.popupVisible=true;
    this.projectsAll=[];
    for(let i=0;i<this.projects.length;i++){
      let [day, month, year] = this.projects[i][2].split(".");
      month=Number(month)-1;
      const date2 = new Date(`${year}-${month}-${day}`);

      if(date.year==year && date.month==month && date.day==day)
        this.projectsAll.push(this.projects[i]);
    }
    
    if (this.popupVisible) {


    }
  }
  showPopup2(date: any): void {
    if(this.projectsYes) return; 
    if(!this.isSpecialDate2(date)){this.popupVisible=false; return;}
    this.popupVisible=true;
    this.tasksAll=[]
    for(let i=0;i<this.tasks.length;i++){
      let [day, month, year] = this.tasks[i][2].split(".");
      month=Number(month)-1;
      const date2 = new Date(`${year}-${month}-${day}`);

      if(date.year==year && date.month==month && date.day==day)
        this.tasksAll.push(this.tasks[i]);
    }
    if (this.popupVisible) {


    }
  }
  hidePopup(){
    this.popupVisible=false
    this.tasksAll=[]
    this.projectsAll=[]

  }

}
