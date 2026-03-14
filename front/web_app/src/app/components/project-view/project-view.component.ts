import { Component } from '@angular/core';
import { Task } from '../../interfaces/task.model';
import { GetTaskService } from '../../services/get-task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { SettingsServService } from '../../services/settings-serv.service';
import { GanttTaskService } from '../../services/gantt-task.service';
import { Observable, catchError, map, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css',
})
export class ProjectViewComponent implements OnInit {
  showOverview = true;
  showKanban = false;
  showTable = false;
  showGantt = false;
  project = 'Project';
  projectName: any;
  TextDate: any;
  end: any;
  colorWarning: any;
  hide = 'visible';
  SearchBar: any;
  currentView: string;
  projectId: number;
  isOwner: boolean;
  username: string | null = null;

  tasks: Task[] = [
    {
      taskId: 'Task1',
      taskName: 'Dashboard Page',
      status: 'In Progress',
    },
    {
      taskId: 'Task2',
      taskName: 'Reset Password',
      status: 'In Progress',
    },
    {
      taskId: 'Task3',
      taskName: 'Profile Page',
      status: 'To Do',
    },
    {
      taskId: 'Task4',
      taskName: 'User Registration',
      status: 'In Progress',
    },
    {
      taskId: 'Task5',
      taskName: 'Settings Page',
      status: 'Done',
    },
  ];

  /*showComponent() {
    this.showKanban = !this.showKanban;
    this.showGantt=false;
    this.showTable=false;
  }*/

  handleProjectNameChange(projectName:string){
    this.projectName=projectName;
  }

  showComponent(component: string) {
    if (component === 'overview') {
      this.showOverview = true;
      this.showKanban = false;
      this.showTable = false;
      this.showGantt = false;
    }
    if (component === 'kanban') {
      this.showOverview = false;
      this.showKanban = true;
      this.showTable = false;
      this.showGantt = false;
    } else if (component === 'task-table') {
      this.showOverview = false;
      this.showKanban = false;
      this.showTable = true;
      this.showGantt = false;
    } else if (component === 'gantt') {
      this.showOverview = false;
      this.showKanban = false;
      this.showTable = false;
      this.showGantt = true;
    }
  }

  showGanttComponent() {
    this.showOverview = false;
    this.showKanban = false;
    this.showGantt = true;
    this.showTable = false;
  }
  showOverviewComponent() {
    this.showOverview = true;
    this.showKanban = false;
    this.showGantt = false;
    this.showTable = false;
  }
  showTableComponent() {
    this.showOverview = false;
    this.showKanban = false;
    this.showGantt = false;
    this.showTable = true;
  }

  showKanbanComponent() {
    this.showOverview = false;
    this.showKanban = true;
    this.showGantt = false;
    this.showTable = false;
  }

  updateTasks(updatedTasks: Task[]): void {
    console.log('update');
    this.tasks = updatedTasks;
  }

  constructor( private router: Router,private translate: TranslateService,private taskService:GanttTaskService,private projectTaskGeter: GetTaskService, private route :ActivatedRoute,  private settingServ: SettingsServService )
  {   };

  getProject() {
    this.route.params.subscribe((params) => {
      //OVDE JE ZA DODAVANJE PARAMETRA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!--------------------------------------------------------------
      let id = +params['id'];
      this.projectTaskGeter.getProject(id + '').subscribe(
        (data: any) => {
          this.project = data;
          this.projectName = data['naziv'];
          let daysElapsed;
          this.end = data['kraj'];

          const oneDay = 24 * 60 * 60 * 1000;

          let current = new Date()
          let last = new Date(this.end[6]+this.end[7]+this.end[8]+this.end[9]+"."+this.end[3]+this.end[4]+"."+this.end[0]+this.end[1])
          let first = new Date(data['pocetak'][6]+data['pocetak'][7]+data['pocetak'][8]+data['pocetak'][9]+"."+data['pocetak'][3]+data['pocetak'][4]+"."+data['pocetak'][0]+data['pocetak'][1])
          daysElapsed = Math.round((last.getTime() - current.getTime()) / oneDay);
          let daysElapsed2 = Math.round((first.getTime() - current.getTime()) / oneDay);

          if(daysElapsed<0) { this.TextDate= this.translate.instant('deadline'); this.colorWarning="red" ;       } 
          else { this.TextDate =  daysElapsed+this.translate.instant('daysLeft');      this.colorWarning="rgb(70, 70, 70)" ;    }
          if(daysElapsed2>0)  { this.TextDate =  daysElapsed2+this.translate.instant('beginProject'); this.end=(data['pocetak']);     this.colorWarning="lightgreen" ;    }

          if (daysElapsed < 0) {
            this.TextDate = this.translate.instant('deadline');
            this.colorWarning = 'red';
          } else {
            this.TextDate = daysElapsed + this.translate.instant('daysLeft');
            this.colorWarning = 'rgb(70, 70, 70)';
          }
          if (daysElapsed2 > 0) {
            this.TextDate = daysElapsed2 + this.translate.instant('beginProject');
            this.end = data['pocetak'];
            this.colorWarning = 'lightgreen';
          }
        },
        (error) => {
          console.error('Error fetching projects', error);
        }
      );
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentView = params['view'] || 'pregled';
    });
    this.getProject();
    this.settingServ.ColorElements(0);

    this.route.params.subscribe((params) => {
      this.projectId = +params['id'];
    });

    this.getusername();
    this.getProjectMembers().subscribe(
      (isUserInMembers) => {
        if (isUserInMembers) {
          this.isOwner = true;
        } else {
          this.isOwner = false;
        }
      },
      (error) => {
        console.error('Greška prilikom dobijanja članova projekta:', error);
      }
    );
  }
  Change() {
    if (this.SearchBar === '') this.hide = 'visible';
    else this.hide = 'hidden';
  }

  getProjectMembers(): Observable<boolean> {
    return this.taskService.getProjectMember(this.projectId).pipe(
      map((members: any[]) => {
        return members.some(
          (member) =>
            member.username === this.username &&
            (member.uloga === 'Owner' || member.uloga === 'Maintainer')
        );
      }),
      catchError((error) => {
        console.error('Greška prilikom dobijanja članova projekta:', error);
        return of(false);
      })
    );
  }

  getusername() {
    this.username = this.taskService.getUsername();
  }
  showView(view: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: view },
      queryParamsHandling: 'merge' 
    });
  }
}
