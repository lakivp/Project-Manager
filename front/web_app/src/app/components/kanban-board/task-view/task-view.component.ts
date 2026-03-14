import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { SettingsServService } from '../../../services/settings-serv.service';
import { MatIconModule } from '@angular/material/icon';
import { Label, Project, Task } from '../../../../types';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { TasksService } from '../../../services/tasks.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { Auth1Service } from '../../../services/auth1.service';
import { Observable, catchError, map, of } from 'rxjs';
import { GanttTaskService } from '../../../services/gantt-task.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css'],
})
export class TaskViewComponent {
  @Input('project') project: Project;
  @Input('route') routeURL: string;
  labels: any;
  tasksRows: any;
  connectedTo: string[] = [];
  changeState: boolean = false;
  insertingStage: boolean = false;
  taskSortingModal: boolean = false;
  filterModalOpen: boolean = false;
  newTask: boolean = false;
  nonFilteredData:any;
  projectId: number;
  objectKeys = Object.keys;
  objectValues = Object.values;
  labelEdit: { [key: string]: boolean } = {};
  labelName: { [key: string]: string } = {};
  userRole: any;
  startDate: string;
  endDate: string;
  filterName: string = '';
  username: string | null = null;
  isOwner: boolean;
  confirmHeader: string;
  acceptLabel: string;
  rejectLabel: string;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  
  // Filter properties
  priority: string = '';
  priorities: string[] = ['High', 'Medium', 'Low']; // Example statuses

  calculateTimeLeft(dateStr: string) {
    let currentDate = new Date();
    let dateSent = new Date(dateStr);

    return Math.floor(
      (Date.UTC(
        dateSent.getFullYear(),
        dateSent.getMonth(),
        dateSent.getDate()
      ) -
        Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
  }

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private settingServ: SettingsServService,
    private confirmationService: ConfirmationService,
    public dialog: MatDialog,
    private authService: Auth1Service,
    private taskService:GanttTaskService,
    private translate:TranslateService
  ) {
    this.project = {
      projectName: 'Project Name',
      deadline: '30 March 2024',
      timeLeft: this.calculateTimeLeft('30 March 2024'),
    };
    this.translate.get('confirmDeletion').subscribe((res: string) => {
      this.confirmHeader = res;
    });
    this.translate.get('yes').subscribe((res: string) => {
      this.acceptLabel = res;
    });
    this.translate.get('no').subscribe((res: string) => {
      this.rejectLabel = res;
    });
  }

  ngOnInit() {
    const userData = this.authService.getRoleProjectManagerFromToken();
    this.userRole = userData;
    this.route.params.subscribe((params) => {
      let id = +params['id'];
      this.projectId = id;
    });
    let obj: { [key: string]: Task[] } = {};
    this.labels = this.labels ?? [];
    this.tasksService
      .getAllLabels(this.routeURL, this.projectId)
      .subscribe((data) => {
        data.map((label) => {
          this.connectedTo.push(label.id.toString());
        });
        this.labels = data;
        data.map((label: Label) => {
          if (obj[label.id] === undefined) {
            obj[label.id] = [];
            this.labelEdit[label.id] = false;
            this.labelName[label.id] = label.naziv;
          }
        });
        console.log("labeli",this.labelName);
      });
    this.tasksRows = this.tasksRows ?? {};
    console.log(this.route);
    this.tasksService
      .getTasks(this.routeURL, this.projectId)
      .subscribe((data) => {
        console.log('TASKS', data);
        data.map((task) => {
          if (obj[task.idLabel] === undefined) {
            obj[task.idLabel] = [];
          }
          obj[task.idLabel].push(task);
        });
        console.log('objekat', obj);
        this.tasksRows = obj;
        this.nonFilteredData  = JSON.parse(JSON.stringify(obj));
        console.log('++++++++', this.tasksRows);
        this.settingServ.ColorElements(0);
      });

      this.getusername();
      this.getProjectMembers().subscribe(
        isUserInMembers => {
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

  openAddStageModal() {
    this.insertingStage = true;
  }
  closeAddStageModal() {
    this.insertingStage = false;
  }
  openSortStage() {
    this.taskSortingModal = true;
  }
  closeSortStage() {
    this.taskSortingModal = false;
  }
  openFilterModal() {
    this.filterModalOpen = true;
  }
  closeFilterModal() {
    this.filterModalOpen = false;
  }
  openAddNewTask() {
    this.newTask = true;
  }
  addTaskStage(stage: any) {
    this.insertingStage = false;
    console.log(this.projectId);
    const label: Label = {
      id: 0,
      naziv: stage,
      idProjekat: this.projectId,
    };
    this.tasksService.addTaskStage(label).subscribe((data) => {
      const newLabels = this.labels;
      let newTaskRows = { ...this.tasksRows };
      if (newTaskRows[data.id] === undefined) {
        newTaskRows[data.id] = [];
        this.connectedTo.push(data.id.toString());
        this.tasksRows = newTaskRows; this.settingServ.ColorElements(0);
      }
      newLabels.push(data);
      this.labels = newLabels;
      this.labelEdit[data.id] = false;
      this.labelName[data.id] = data.naziv;
    });
  }

  drop(event: CdkDragDrop<Task[]>, tasks: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const prevData = event.previousContainer.data;
      const currData = event.container.data;

      const prevIndex = event.previousIndex;
      const currIndex = event.currentIndex;

      const labelName = event.container.element.nativeElement.id;
      const label = this.labels.filter(
        (label: Label) => label.id.toString() === labelName
      )[0];
      const difference = event.item.data;
      console.log(labelName);
      transferArrayItem(prevData, currData, prevIndex, currIndex);

      const newTask = { ...difference, idLabel: label.id };
      this.tasksService.transferTask(newTask).subscribe((data) => {
        this.tasksRows = { ...this.tasksRows, data };
        console.log(data);
      });
    }
  }

  dropSort(event: CdkDragDrop<Label[]>) {
    moveItemInArray(this.labels, event.previousIndex, event.currentIndex);
    let newOrder: string = '';
    this.labels.map((label: Label) => (newOrder += label.id + '.'));
    console.log('ORDER', newOrder);
    newOrder = newOrder.slice(0, -1);
    this.tasksService
      .sortLabels(this.projectId, newOrder)
      .subscribe((data) => {});
  }

  openLabelEdit(id: number) {
    this.labelEdit[id] = true;
  }
  changeLabelName(label: any) {
    if (this.labelName[label.id] == label.naziv || '') {
      this.labelEdit[label.id] = false;
      return;
    }
    let newLabel = { ...label, naziv: this.labelName[label.id] };
    this.tasksService.changeLabelName(newLabel).subscribe((data) => {
      let newLabels = this.labels.map((label: any) => {
        if (label.id == newLabel.id) {
          return newLabel;
        }
        return label;
      });
      this.labels = newLabels;
    });
    this.labelEdit[label.id] = false;
  }
  closeLabelEdit(id: number) {
    this.labelEdit[id] = false;
  }
  openDialog(): void {
    this.dialog.open(this.deleteDialog);
  }
  deleteLabel(labelToDelete: any) {
    if (this.tasksRows[labelToDelete.id].length > 0) {
      this.openDialog();
      return;
    }
    this.confirmationService.confirm({
      message: this.translate.instant('labelDelete'),
      accept: () => {
        this.tasksService.deleteLabel(labelToDelete).subscribe((data) => {
          let newLabels = this.labels.filter(
            (label: any) => label.id != labelToDelete.id
          );
          this.labels = newLabels;
        });
      },
    });
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString(); // Godina sa četiri cifre
    return `${day}.${month}.${year}`;
  }
  applyFilters(flag?:string) {
    this.tasksRows={...this.nonFilteredData};
    if(!this.filterName && !this.priority && !this.formatDate(this.startDate) && !this.formatDate(this.endDate)){
      this.tasksRows={...this.nonFilteredData};
    }
   Object.keys(this.tasksRows).map((key:any)=>{
        if(this.filterName){
          const newRow = this.tasksRows[key].filter((task:any)=>task.naziv.includes(this.filterName));
          this.tasksRows[key]=newRow;
        }
        if(this.priority){
          const newRow =this.tasksRows[key].filter((task:any)=>task.prioritet==this.priority);
          this.tasksRows[key]=newRow;
        }
        if(this.startDate){
          const newRow =this.tasksRows[key].filter((task:any)=>task.pocetak==this.formatDate(this.startDate));
          this.tasksRows[key]=newRow;
        }
        if(this.endDate){
          const newRow =this.tasksRows[key].filter((task:any)=>task.kraj==this.formatDate(this.endDate));
          this.tasksRows[key]=newRow;
        }
      })
    this.closeFilterModal();
  }
  resetFilters(event?: Event): void {
    this.filterName = '';
    this.priority = ''; // Resetujemo izabranu prioritet
    this.startDate = '';
    this.endDate = '';

    if (event) {
        event.stopPropagation(); 
    }

    this.applyFilters('reset'); 
}

getProjectMembers(): Observable<boolean> {
  return this.taskService.getProjectMember(this.projectId).pipe(
    map((members: any[]) => {
      console.log('Članovi projekta:', members);
      return members.some(member => member.username === this.username && (member.uloga === 'Owner' || member.uloga === 'Maintainer'));
    }),
    catchError(error => {
      console.error('Greška prilikom dobijanja članova projekta:', error);
      return of(false); 
    })
  );
}

  getusername() {
    this.username = this.taskService.getUsername();
  }
}
