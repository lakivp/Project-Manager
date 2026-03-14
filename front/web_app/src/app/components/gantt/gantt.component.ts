import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Task, gantt } from 'dhtmlx-gantt';
import { GanttTaskService } from '../../services/gantt-task.service';
import { GanttTask } from '../../interfaces/ganttTask.model';
import { Observable, catchError, map, of } from 'rxjs';
import { addDays } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';
import { GanttTaskLink } from '../../interfaces/ganttTaskLink.model';
import { GanttTaskLinkService } from '../../services/gantt-task-link.service';
import { TranslateService } from '@ngx-translate/core';
import { ProjectService } from '../../services/project.service';
import { Auth1Service } from '../../services/auth1.service';
import { SettingsServService } from '../../services/settings-serv.service';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MessageService } from 'primeng/api';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-gantt',
  template: `<a class="prikazGrid" (click)=toggleGrid()>{{'showGrid' | translate}}</a><a class="prikazGrid" (click)="scrollToday()" id="todayBtn">Idi na današnji dan</a><button mat-button (click)="openFilterDialog()"><img src="assets/images/filter.png" width="22" height="22" class="hover-pointer"  /></button><br><div #gantt_here class='gantt-chart'></div>`,
  styleUrl: './gantt.component.css'
})
export class GanttComponent implements OnInit  {
  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;
  

  constructor(private msgService: MessageService,private dialog: MatDialog,private auth1Service:Auth1Service,private settingServ:SettingsServService,private projectService:ProjectService,private renderer:Renderer2,private router:Router,private translate:TranslateService,private taskService: GanttTaskService,private route:ActivatedRoute, private taskLinkService:GanttTaskLinkService ) {}

  projekat: any;
  tasks:GanttTask[] = [];
  links:GanttTaskLink[] = [];
  projectId:number;
  username: string | null = null;//id ulogovanog korisnika
  idEvent:string;
  startDate1:Date;
  endDate1:Date;
  idEventAdd:string;
  idEventUp:string;
  private deleteLinkEventEnabled = true;
  
  
  ngOnInit(): void {

    type LanguageCode = 'en' | 'sr' | 'fr';
    interface Dictionary {
      months: [string, string, string, string, string, string, string, string, string, string, string, string];
      days: [string, string, string, string, string, string, string];
      monthsShort: [string, string, string, string, string, string, string, string, string, string, string, string];
      daysShort: [string, string, string, string, string, string, string];
    }

    const dictionaries: Record<LanguageCode, Dictionary> = {
      en: {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      },
      sr: {
        months: ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"],
        days: ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
        daysShort: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"]
      },
      fr: {
        months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        monthsShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
        daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
      }
    };

    const currentLanguage = sessionStorage.getItem('lang') as LanguageCode || 'en';
    
    
    if (dictionaries[currentLanguage]) {
      gantt.locale.date.month_full = dictionaries[currentLanguage].months;
      gantt.locale.date.day_full = dictionaries[currentLanguage].days;
      gantt.locale.date.day_short=dictionaries[currentLanguage].daysShort;
      gantt.locale.date.month_short=dictionaries[currentLanguage].monthsShort;
    }


    //gantt.config.autosize = true;
    gantt.clearAll();
    gantt.config.links.start_to_start = "2";
    gantt.config.links.finish_to_start = "1";
    gantt.config.links.finish_to_finish = "3";
    gantt.config.links.start_to_finish = "4";
    
    let taskNameLabel!:string;
    let startDateLabel!:string;
    let priorityLabel!:string;

    const l = sessionStorage.getItem('lang') || 'en';
    
    if(l === 'en')
    {
      taskNameLabel = 'Task name';
      startDateLabel = 'Start time';
      priorityLabel = 'Priority';
      gantt.locale.labels.icon_cancel = "Cancel";
      gantt.locale.labels.icon_delete = "Delete";
      gantt.locale.labels.icon_save = "Save";
    }
    else if(l === 'sr')
    {
      taskNameLabel = 'Ime taska';
      startDateLabel = 'Početak';
      priorityLabel = 'Prioritet';
      gantt.locale.labels.icon_cancel = "Otkaži";
      gantt.locale.labels.icon_delete = "Obriši";
      gantt.locale.labels.icon_save = "Sačuvaj";
    }
    else if(l === 'fr')
    {
      taskNameLabel = 'Task';
      startDateLabel = 'Heure de début';
      priorityLabel = 'Priorité';
      gantt.locale.labels.icon_cancel = "Annuler";
      gantt.locale.labels.icon_delete = "Supprimer";
      gantt.locale.labels.icon_save = "Sauvegarder";
    }

    
    gantt.config.columns = [
      {name: "text", label:taskNameLabel, align: "left",tree: true}, 
      {name: "start_date", label: startDateLabel, align: "center"}, 
      {name: "priority", label: priorityLabel, align: "center", template: (task) => {
        return this.translate.instant(task['priority']);
      }},
    ];

    gantt.attachEvent("onAfterSort", function (field: string, direction: boolean, parent: string | number) {
      if (field === "priority") {
        const priorityMap: { [key: string]: number } = {
          "Low": 1,
          "Medium": 2,
          "High": 3
        };
          gantt.sort(function (task1, task2) { //prioritet sortiranje
            const priority1 = priorityMap[task1['priority']];
            const priority2 = priorityMap[task2['priority']];
    
            if (direction) {
              return priority2 - priority1; // opadajuce
            } else {
              return priority1 - priority2; // rastuce
            }
          });
        
      }
    });
    

    
    gantt.init(this.ganttContainer.nativeElement);
    this.route.params.subscribe(params => {
      this.projectId = +params['id']; 
    });
    this.loadTaskLinks();
    //this.loadTasksByProjectId(this.projectId);
    
     this.translate.get('deleteLinkWindowText').subscribe((translation: string) => {
       gantt.locale.labels.link = translation;
     });

    this.translate.get('cancel').subscribe((translation:string)=>{
      gantt.locale.labels.message_cancel = translation;
    })

    this.translate.get('taskName').subscribe((translation:string)=>{
      gantt.locale.labels.section_description = translation;
    })
    
    this.translate.get('timePeriod').subscribe((translation:string)=>{
      gantt.locale.labels.section_time = translation;
    })

    this.translate.get('confirmDelete').subscribe((translation:string)=>{
      gantt.locale.labels.confirm_link_deleting = translation;
    })

    this.translate.get('days').subscribe((translation:string)=>{
      gantt.locale.labels.days = translation;
    })

    this.translate.get('deleteTask').subscribe((translation:string)=>{
      gantt.locale.labels.confirm_deleting = translation;
    })
  
    this.getusername();
    this.getProjectMembers().subscribe(
      isUserInMembers => {
        if(!isUserInMembers)
        {
          gantt.config.drag_move = false; //  povlačenje taskova
          gantt.config.drag_resize = false; // promena dužine taskova
          gantt.config.drag_links = false; // povezivanje taskova
          //gantt.config.drag_progress = false; // // menjanje progresa
          gantt.config.lightbox=false;
          gantt.attachEvent("onLinkDblClick", (id, link) => {
            console.log("kliknuto na link");
            return false; // Sprečava brisanje linka
          });
        }
      },
      error => {
        console.error('Greška prilikom dobijanja članova projekta:', error);
      }
    );

    gantt.config.drag_progress = false;

    
    gantt.attachEvent("onMouseMove", function (id, e) {
      var target = e.target || e.srcElement;
      if (target.classList.contains("gantt_task_content") || target.classList.contains("gantt_cell") ) {
        target.style.cursor = "pointer";
      } else {
        target.style.cursor = "default";
      }
    });
    
      this.idEvent = gantt.attachEvent('onTaskClick', (id, e) => {
        const target = e.target || e.srcElement;
        const isColumnClick = target.classList.contains('gantt_task_cell');
        const isTreeIconClick = target.classList.contains('gantt_tree_icon');
      
        if (!isColumnClick && !isTreeIconClick) { 
          const task = gantt.getTask(id);
          const isTaskClick = target.classList.contains('gantt_task_cell') || target.classList.contains('gantt_task_content');
          if (isTaskClick && task && task.start_date) {
            const url = `/taskDescription;taskId=${id}`;
            this.router.navigateByUrl(url);
          }
        } else if (isTreeIconClick) { // Ako je kliknuto na ikonu gantt_tree_icon, otvori/zatvori podzadatke
          const task = gantt.getTask(id);
          if (task && task.$open) {
            gantt.close(id); 
          } else {
            gantt.open(id); 
          }
        }
      });


      gantt.attachEvent("onAfterTaskDrag", async (id, mode, e) => {
        try {
          const task = gantt.getTask(id);
          if (task !== null) { 
            console.log('Loaded task:', task);
            this.updateTaskInGantt(task);
          } else {
            console.error('Task not found.');
          }
        } catch (error) {
          console.error('Error loading task:', error);
        }
      });
      this.getProjekat(this.projectId);
      
        
      this.getProjekatLightbox(this.projectId).then(() => {
       this.idEventUp = gantt.attachEvent('onLightboxSave', (id: string, task: any, isNew: boolean) => {
          const parentId = task.parent;
          const taskStartDate = new Date(task.start_date);
          const taskEndDate = gantt.calculateEndDate(taskStartDate, task.duration);
    
          // Validacija za zadatke bez parenta (glavni taskovi)
          if (!parentId) {
            console.log('Validating main task dates');
            if (this.startDate1 && this.endDate1 && (taskStartDate < this.startDate1 || taskEndDate > this.endDate1)) {
              this.msgService.add({
                severity: 'error',
                summary: this.translate.instant("error"),
                detail: this.translate.instant("validDate")
              });
              return false; // Sprečava čuvanje ako datumi nisu validni
            }
          }
    
          // Validacija za podtaskove
          if (parentId) {
            console.log('Validating subtask dates');
            const parentTask = gantt.getTask(parentId);
            if (parentTask.start_date && parentTask.end_date && (taskStartDate < parentTask.start_date || taskEndDate > parentTask.end_date)) {
              this.msgService.add({
                severity: 'error',
                summary: this.translate.instant("error"),
                detail: this.translate.instant("validDate")
              });
              return false; // Sprečava čuvanje ako datumi nisu validni
            }
          }
    
          // Ažuriranje datuma children taskova
          const updateChildrenTasks = (parentTask: any) => {
            const children = gantt.getChildren(parentTask.id);
            console.log(`Updating children tasks of parent ${parentTask.id}, children: ${children.length}`);
    
            children.forEach(childId => {
              const childTask = gantt.getTask(childId) as any;
    
              // Proveravamo da li je child task već u granicama novog datuma parent taska
              if (childTask.start_date >= parentTask.start_date && childTask.end_date <= parentTask.end_date) {
                console.log(`Child task ${childTask.id} is already within the new date range of the parent task, not updating.`);
                return;
              }
    
              const duration = gantt.calculateDuration(childTask.start_date, childTask.end_date);
    
              // Postavljanje novih datuma za children taskove
              console.log(`Updating child task ${childTask.id} with new start date ${parentTask.start_date}`);
              childTask.start_date = new Date(parentTask.start_date);
              childTask.end_date = gantt.calculateEndDate(new Date(parentTask.start_date), duration);
    
              gantt.updateTask(childId);
              gantt.refreshTask(childId); // Osvežava vizuelni prikaz zadatka na ganttu
    
              // Ažuriranje zadatka u bazi
              this.updateTaskPopUp(childTask);
              console.log(`Updated child task ${childTask.id} in database`);
    
              // Rekurzivno ažuriranje children taskova
              if (gantt.hasChild(childId)) {
                updateChildrenTasks(childTask);
              }
            });
          };
    
          // Ako je parent task pomeren, ažuriraj sve children taskove
          if (gantt.hasChild(task.id)) {
            console.log(`Parent task ${task.id} has children, updating children tasks`);
            updateChildrenTasks(task);
          }
    
          // Ažuriraj parent task
          this.updateTaskPopUp(task);
          return true; // Dozvoljava čuvanje ako su datumi validni
        });
      }).catch(error => {
        console.error('Error loading project dates:', error);
      });

      gantt.attachEvent("onLightboxDelete", async (id, mode, e) => {
        try {
          const task = gantt.getTask(id);
          if (task !== null) { 
            gantt.deleteTask(id);
            this.deleteTask(id);
            gantt.hideLightbox();
          } else {
            console.error('Task not found.');
          }
        } catch (error) {
          console.error('Error loading task:', error);
        }
      });
 
      this.idEventAdd=gantt.attachEvent("onAfterLinkAdd", (id, link) => {
        this.linkAdd(id, link);
        return true;
      });
      
      gantt.attachEvent("onAfterLinkDelete", (id) => {
        if (this.deleteLinkEventEnabled) {
          this.deleteLink(id);
        }
        return true;
      });
    
      
      gantt.config.grid_elastic_columns = true;
      
      gantt.attachEvent("onTaskDrag", function(id, mode, task, original) {
        if(mode==="move"){
          var parentTaskId = task.parent;
        
          // Proverite da li zadatak ima parent task
          if (parentTaskId) {
            var parentTask = gantt.getTask(parentTaskId);
        
            if (parentTask && parentTask.start_date && parentTask.end_date) {
              if (task.start_date < parentTask.start_date) {
                task.start_date = new Date(parentTask.start_date);
              }
        
              var taskEndDate = gantt.calculateEndDate(task.start_date, task.duration);
      
              if (taskEndDate > parentTask.end_date) {
                task.start_date = gantt.calculateEndDate(parentTask.end_date, -task.duration);
              }
        
              gantt.updateTask(id);
            }
          }
        
          return true;
      }
      return false;
      });


      gantt.attachEvent('onTaskDrag', (id: string, mode: string, task: Task, original: Task) => {
        if (mode === "move" || mode === "resize") {
          if(task.end_date && Number(task.duration) === 0)
            {
                task.duration=1;
                if(original.start_date && task.start_date && (original.start_date < task.start_date)){
                  task.start_date = gantt.calculateEndDate(task.end_date, -1);
                  task.end_date = gantt.calculateEndDate(task.start_date, 1);
                }
                else if(task.start_date && original.end_date && (original.end_date > task.end_date))
                {
                  task.end_date = gantt.calculateEndDate(task.start_date, 1);
                }
            }
          const updateTasks = (currentTask: Task) => {
            const children = gantt.getChildren(currentTask.id);
            children.forEach(childId => {
              const childTask = gantt.getTask(childId) as Task;
              const newStartDate = currentTask.start_date ? new Date(currentTask.start_date) : null;
              const newEndDate = newStartDate ? gantt.calculateEndDate(newStartDate, currentTask.duration) : null;
      
              if (newStartDate && childTask.start_date && childTask.start_date < newStartDate) {
                const duration = gantt.calculateDuration(childTask.start_date, childTask.end_date);
                childTask.start_date = new Date(newStartDate);
                childTask.end_date = gantt.calculateEndDate(newStartDate, duration);
              }
      
              if (newEndDate && childTask.end_date && childTask.start_date && childTask.end_date > newEndDate) {
                const duration = gantt.calculateDuration(childTask.start_date, childTask.end_date);
                childTask.start_date = gantt.calculateEndDate(newEndDate, -duration);
                childTask.end_date = new Date(newEndDate);
              }
      
              if (childTask.start_date && currentTask.start_date) {
                const parentTaskDuration = gantt.calculateDuration(currentTask.start_date, currentTask.end_date);
                const childTaskDuration = gantt.calculateDuration(childTask.start_date, childTask.end_date);
      
                if (childTaskDuration > parentTaskDuration) {
                  childTask.end_date = gantt.calculateEndDate(childTask.start_date, parentTaskDuration);
                }
              }
      
              gantt.updateTask(childId);
              this.updateTaskInGantt(childTask);
      
              if (gantt.hasChild(childId)) {
                updateTasks(childTask);
              }
              
              // Update linked tasks of children as well
              updateLinkedTasks(childTask);
            });
          };
      
          const updateLinkedTasks = (currentTask: Task) => {
            const links = gantt.getLinks();
            
            links.forEach(link => {
              if (link.source === currentTask.id) {
                const linkedTask = gantt.getTask(link.target);
      
                const dateShift = currentTask.start_date && original.start_date ? currentTask.start_date.getTime() - original.start_date.getTime() : 0;
      
                if (Number(link.type) === 1 && currentTask.end_date) { // Finish to Start
                  linkedTask.start_date = new Date(currentTask.end_date.getTime());
                  linkedTask.end_date = gantt.calculateEndDate(linkedTask.start_date, linkedTask.duration);
                } else if (Number(link.type) === 2 && currentTask.start_date) { // Start to Start
                  linkedTask.start_date = new Date(currentTask.start_date.getTime());
                  linkedTask.end_date = gantt.calculateEndDate(linkedTask.start_date, linkedTask.duration);
                } else if (Number(link.type) === 3 && currentTask.end_date && linkedTask.start_date && linkedTask.end_date) { // Finish to Finish
                  const duration = linkedTask.end_date.getTime() - linkedTask.start_date.getTime();
                  linkedTask.end_date = new Date(currentTask.end_date.getTime());
                  linkedTask.start_date = new Date(linkedTask.end_date.getTime() - duration);
                } else if (Number(link.type) === 4 && currentTask.start_date && linkedTask.end_date && linkedTask.start_date) { // Start to Finish
                  const duration = linkedTask.end_date.getTime() - linkedTask.start_date.getTime();
                  linkedTask.end_date = new Date(currentTask.start_date.getTime());
                  linkedTask.start_date = new Date(linkedTask.end_date.getTime() - duration);
                }
      
                gantt.updateTask(link.target);
                this.updateTaskInGantt(linkedTask);
      
                // Ensure the linked task's children are updated as well
                if (gantt.hasChild(link.target)) {
                  updateTasks(linkedTask);
                }
      
                // Recursively update linked tasks
                updateLinkedTasks(linkedTask);
              }
            });
          };
      
          // Update tasks and linked tasks
          if (gantt.hasChild(task.id)) {
            updateTasks(task);
          }
      
          updateLinkedTasks(task); // Recursively update linked tasks
          return true;
        }
        return false;
      });
      
    
      gantt.attachEvent('onTaskDrag', (childId, mode, childTask, original) => {
        const parentId = childTask.parent;
        if (parentId) {
            const parentTask = gantt.getTask(parentId);
            if (parentTask && parentTask.start_date && parentTask.end_date) {
                const newStartDate = childTask.start_date;
                const newEndDate = childTask.end_date;
    
                if (newStartDate < parentTask.start_date) {
                    childTask.start_date = parentTask.start_date;
                }
    
                if (newEndDate > parentTask.end_date) {
                    childTask.end_date = parentTask.end_date;
                }
                gantt.updateTask(childId);
            }
        }
        return true;
    });
    this.settingServ.specSet();
  }

  

  ngOnDestroy(): void {
    gantt.detachEvent(this.idEvent);
    gantt.detachEvent(this.idEventAdd);
    gantt.detachEvent(this.idEventUp);
  }
  

  toggleGrid() {
    gantt.config.show_grid = !gantt.config.show_grid;
    gantt.render();
  }

  loadTasksByProjectId(projectId: number): void {
    this.taskService.getTasksByProjectId(projectId).then(tasks => {
      this.tasks = tasks;
      console.log(this.tasks);
    gantt.config.scale_unit = "month";
    gantt.config.date_scale = "%F, %Y";
    gantt.config.scale_height = 50;
    gantt.config.grid_width = 450;
    gantt.config.show_errors = false;
   
    gantt.config.subscales = [
      {unit:"day",step:1,date:"%j, %D"}
    ];
    
    gantt.config.sort = true;
    gantt.config.open_tree_initially = true;
    gantt.config.date_format = '%d.%m.%Y %H:%i';
      gantt.parse (
        {
            "data": this.tasks,
            "links":this.links
        });
    });
  }

  updateTaskInGantt(task: Task) {
    this.loadTaskById(parseInt(task.id.toString())).then(myTask => {
      if (myTask) {
        if (task.start_date !== undefined) { 
          myTask.start_date = addDays(task.start_date, 1);
          if (task.duration !== undefined) { 
            myTask.duration = task.duration;
            const endDateString = addDays(task.start_date, task.duration).toISOString().slice(0, 10);
            myTask.kraj = new Date(endDateString); 
            this.taskService.updateTask(myTask).subscribe(updatedTask => {
                 console.log('Task successfully updated');
                });
          } else {
            console.error('Duration is undefined.');
          }
        } else {
          console.error('Start date is undefined.');
        }
      } else {
        console.error('Task not found.');
      }
    }).catch(error => {
      console.error('Error loading task:', error);
    });
  }

  updateTaskPopUp(task: Task) {
    this.loadTaskById(parseInt(task.id.toString())).then(myTask => {
      if (myTask) {
        if (task.start_date !== undefined) { 
          myTask.start_date = addDays(task.start_date, 1);
          if (task.duration !== undefined) { 
            myTask.duration = task.duration;
            const endDateString = addDays(task.start_date, task.duration).toISOString().slice(0, 10);
            myTask.kraj = new Date(endDateString); 

            myTask.text = task.text;
            this.taskService.updateTask(myTask).subscribe(updatedTask => {
                 console.log('Task successfully updated');
                });
          } else {
            console.error('Duration is undefined.');
          }
        } else {
          console.error('Start date is undefined.');
        }
      } else {
        console.error('Task not found.');
      }
    }).catch(error => {
      console.error('Error loading task:', error);
    });
  }
  
  

  loadTaskById(taskId: number): Promise<GanttTask | null> {
    return new Promise((resolve, reject) => {
      this.taskService.getTaskById(taskId).then(task => {
        resolve(task);
      }, error => {
        reject(error);
      });
    });
  }

  loadTaskLinks(): void {
    this.taskLinkService.getAllLinks().then(linkovi => {
      this.links = linkovi;
      console.log(this.links);
      this.loadTasksByProjectId(this.projectId);
    });
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
  


  linkAdd(linkId: string, link: GanttTaskLink) {
    const ganttTaskLink: GanttTaskLink = {
      id: 0,
      source: link.source,
      target: link.target,
      type: link.type
    };
  
    this.taskLinkService.addTaskLink(ganttTaskLink).subscribe(
      response => {
        if (response === null) {
          this.msgService.add({
            severity: 'error',
            summary:  this.translate.instant('error'),
            detail: this.translate.instant('linkPostoji')
          });
          // Ako dodavanje nije uspelo, obrišite link iz Gantt dijagrama
          this.deleteLinkEventEnabled = false;
          gantt.deleteLink(linkId);
          setTimeout(() => { this.deleteLinkEventEnabled = true; }, 0);
          return false;
        } else {
          // Ako je dodavanje uspelo
          const updateChildrenTasks = (parentTask: any) => {
            const children = gantt.getChildren(parentTask.id);
    
            children.forEach(childId => {
              const childTask = gantt.getTask(childId) as any;
    
              // Proveravamo da li je child task već u granicama novog datuma parent taska
              if (childTask.start_date >= parentTask.start_date && childTask.end_date <= parentTask.end_date) {
                return;
              }
    
              const duration = gantt.calculateDuration(childTask.start_date, childTask.end_date);
    
              // Postavljanje novih datuma za children taskove
              childTask.start_date = new Date(parentTask.start_date);
              childTask.end_date = gantt.calculateEndDate(new Date(parentTask.start_date), duration);
    
              gantt.updateTask(childId);
              gantt.refreshTask(childId); // Osvežava vizuelni prikaz zadatka na ganttu
    
              // Ažuriranje zadatka u bazi
              this.updateTaskPopUp(childTask);
    
              // Rekurzivno ažuriranje children taskova
              if (gantt.hasChild(childId)) {
                updateChildrenTasks(childTask);
              }
            });
          };

          const getParentEndDate = (childTaskId: string): Date | null => {
            const parentId = gantt.getParent(childTaskId);
            if (parentId) {
              const parentTask = gantt.getTask(parentId);
              if (parentTask && parentTask.end_date) {
                return parentTask.end_date;
              }
            }
            return null;
          };

          const getParentStartDate = (childTaskId: string): Date | null => {
            const parentId = gantt.getParent(childTaskId);
            if (parentId) {
              const parentTask = gantt.getTask(parentId);
              if (parentTask && parentTask.start_date) {
                return parentTask.start_date;
              }
            }
            return null;
          };
          
          // start to start
          if (Number(link.type) === 2) {
            const sourceTask = gantt.getTask(link.source);
            const targetTask = gantt.getTask(link.target);
            if (targetTask.duration && sourceTask.start_date && targetTask.start_date && sourceTask.start_date.getTime() !== targetTask.start_date.getTime()) {  
              
              const parentEnd = getParentEndDate(targetTask.id.toString());
              const parentStart = getParentStartDate(targetTask.id.toString());
              
              if(parentStart && parentEnd)
              {
                if(sourceTask.start_date < parentStart || gantt.calculateEndDate(sourceTask.start_date, targetTask.duration)>parentEnd)
                {
                  this.msgService.add({
                    severity: 'error',
                    summary:  this.translate.instant('error'),
                    detail: this.translate.instant('nemogucePovCiljni')
                  });
                  this.deleteLinkEventEnabled = false;
                  gantt.deleteLink(linkId);
                  this.deleteLink(Number(response.id));
                  setTimeout(() => { this.deleteLinkEventEnabled = true; }, 0);
                  return false;
                }
              }

              targetTask.start_date = sourceTask.start_date;
              targetTask.end_date = gantt.calculateEndDate(sourceTask.start_date, targetTask.duration);
              gantt.updateTask(targetTask.id);
              this.updateTaskInGantt(targetTask);
              updateChildrenTasks(targetTask);
            }
          }

          //finish to start 
          else if (Number(link.type) === 1) {
            const sourceTask = gantt.getTask(link.source);
            const targetTask = gantt.getTask(link.target);
            if (sourceTask.end_date && targetTask.start_date && sourceTask.end_date.getTime()  !== targetTask.start_date.getTime()) {
              
              if(gantt.calculateEndDate(sourceTask.end_date, targetTask.duration) > this.endDate1)
              {
                const parentEnd = getParentEndDate(targetTask.id.toString());
                const parentStart = getParentStartDate(targetTask.id.toString());
                if(parentStart && parentEnd)
                {
                    if(this.endDate1 > parentEnd || sourceTask.end_date < parentStart)
                    {
                      this.msgService.add({
                        severity: 'error',
                        summary:  this.translate.instant('error'),
                        detail: this.translate.instant('nemogucePovCiljni')
                      });
                      this.deleteLinkEventEnabled = false;
                      gantt.deleteLink(linkId);
                      this.deleteLink(Number(response.id));
                      setTimeout(() => { this.deleteLinkEventEnabled = true; }, 0);
                      return false;
                    }
                }

                targetTask.start_date = sourceTask.end_date;
                targetTask.end_date = this.endDate1;
                targetTask.duration = gantt.calculateDuration(targetTask.end_date,targetTask.start_date);
                gantt.updateTask(targetTask.id);
                this.updateTaskInGantt(targetTask);
                updateChildrenTasks(targetTask);
              }

              else
              {
                const parentEnd = getParentEndDate(targetTask.id.toString());
                const parentStart = getParentStartDate(targetTask.id.toString());
                if(parentStart && parentEnd)
                {
                    if(gantt.calculateEndDate(sourceTask.end_date, targetTask.duration) > parentEnd || sourceTask.end_date < parentStart)
                    {
                      this.msgService.add({
                        severity: 'error',
                        summary:  this.translate.instant('error'),
                        detail: this.translate.instant('nemogucePovCiljni')
                      });
                      this.deleteLinkEventEnabled = false;
                      gantt.deleteLink(linkId);
                      this.deleteLink(Number(response.id));
                      setTimeout(() => { this.deleteLinkEventEnabled = true; }, 0);
                      return false;
                    }
                }
                
                targetTask.start_date = sourceTask.end_date;
                targetTask.end_date = gantt.calculateEndDate(targetTask.start_date, targetTask.duration);
                gantt.updateTask(targetTask.id);
                this.updateTaskInGantt(targetTask);
                updateChildrenTasks(targetTask);
              }
              
            }
          }

          //finish to finish
          else if (Number(link.type) === 3) {
            const sourceTask = gantt.getTask(link.source);
            const targetTask = gantt.getTask(link.target);
            if (sourceTask.end_date && targetTask.start_date && targetTask.end_date && sourceTask.end_date.getTime()  !== targetTask.end_date.getTime()) {
              const durationDifference = targetTask.end_date.getTime() - targetTask.start_date.getTime();
              const parentEnd = getParentEndDate(targetTask.id.toString());
              const parentStart = getParentStartDate(targetTask.id.toString());
              if(parentStart && parentEnd)
              {
                  if(sourceTask.end_date > parentEnd || new Date(targetTask.end_date.getTime() - durationDifference) < parentStart)
                  {
                    this.msgService.add({
                      severity: 'error',
                      summary:  this.translate.instant('error'),
                      detail: this.translate.instant('nemogucePovCiljni')
                    });
                    this.deleteLinkEventEnabled = false;
                    gantt.deleteLink(linkId);
                    this.deleteLink(Number(response.id));
                    setTimeout(() => { this.deleteLinkEventEnabled = true; }, 0);
                    return false;
                  }
              }

              targetTask.end_date = sourceTask.end_date;
              targetTask.start_date = new Date(targetTask.end_date.getTime() - durationDifference);
              gantt.updateTask(targetTask.id);
              this.updateTaskInGantt(targetTask);
              updateChildrenTasks(targetTask);
            }
          }
          //start to finish 
          else if (Number(link.type) === 4) {
            const sourceTask = gantt.getTask(link.source);
            const targetTask = gantt.getTask(link.target);
            if (sourceTask.start_date && targetTask.start_date && targetTask.end_date && sourceTask.start_date.getTime()  !== targetTask.end_date.getTime()) {
              
              if(gantt.calculateEndDate(targetTask.end_date, sourceTask.duration) > this.endDate1)
              {
                
                const parentEnd = getParentEndDate(sourceTask.id.toString());
                const parentStart = getParentStartDate(sourceTask.id.toString());
                if(parentStart && parentEnd)
                {
                  if(this.endDate1 > parentEnd || targetTask.end_date < parentStart)
                  {
                    this.msgService.add({
                      severity: 'error',
                      summary:  this.translate.instant('error'),
                      detail: this.translate.instant('nemogucePovIzvorni')
                    });
                    this.deleteLinkEventEnabled = false;
                    gantt.deleteLink(linkId);
                    this.deleteLink(Number(response.id));
                    setTimeout(() => { this.deleteLinkEventEnabled = true; }, 0);
                    return false;
                  }
                }
                sourceTask.start_date = targetTask.end_date;
                sourceTask.end_date = this.endDate1;
                sourceTask.duration = gantt.calculateDuration(sourceTask.end_date,sourceTask.start_date);
                gantt.updateTask(sourceTask.id);
                this.updateTaskInGantt(sourceTask);
                updateChildrenTasks(sourceTask);
              }
              else
              {

                const parentEnd = getParentEndDate(sourceTask.id.toString());
                const parentStart = getParentStartDate(sourceTask.id.toString());
                if(parentStart && parentEnd)
                {
                  if(gantt.calculateEndDate(targetTask.end_date, sourceTask.duration) > parentEnd || targetTask.end_date < parentStart)
                  {
                    this.msgService.add({
                      severity: 'error',
                      summary:  this.translate.instant('error'),
                      detail: this.translate.instant('nemogucePovIzvorni')
                    });
                    this.deleteLinkEventEnabled = false;
                    gantt.deleteLink(linkId);
                    this.deleteLink(Number(response.id));
                    setTimeout(() => { this.deleteLinkEventEnabled = true; }, 0);
                    return false;
                  }
                }

                sourceTask.start_date = targetTask.end_date;
                sourceTask.end_date = gantt.calculateEndDate(sourceTask.start_date, sourceTask.duration);
                gantt.updateTask(sourceTask.id);
                this.updateTaskInGantt(sourceTask);
                updateChildrenTasks(sourceTask);
              }
              
          }
        }

          gantt.changeLinkId(linkId, response.id);
          this.loadTaskLinks();
          
          return true;
        }
      },
      error => {
        console.error("Error adding link:", error);
        this.msgService.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: this.translate.instant('greskaVeza')
        });
        return false;
      }
    );
  }

  deleteLink(linkId: number) {
    this.taskLinkService.deleteTaskLink(linkId).subscribe(
      response => {
        this.loadTaskLinks();
      },
      error => {
        console.error("Error deleting link:", error);
      }
    );
  }

  deleteTask(taskId: number){
    this.taskService.deleteTaskById(taskId).subscribe(
      response => {
        location.reload();
      },
      error => {
        console.error("Error deleting task:", error);
      }
    );
  }

  getProjekat(id: number): void {
    this.projectService.getProjectById(id)
      .subscribe(projekat => {
        this.projekat = projekat;
        gantt.config.start_date = this.parseDate(this.projekat.pocetak);
        gantt.config.end_date = this.parseDate(this.projekat.kraj);
        this.startDate1 = this.parseDate(this.projekat.pocetak);
        this.endDate1 = this.parseDate(this.projekat.kraj);
      });
  }

  parseDate(dateString: string): Date {
    const parts = dateString.split('.');
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }

  selectedPriorities: string[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  filteredTasks: any[] = [];


  openFilterDialog(): void {

    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '300px',
      height: '370px',
      data: {
        initialSelectedPriorities: this.selectedPriorities,
        initialStartDate: this.startDate,
        initialEndDate: this.endDate,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedPriorities = result.selectedPriorities;
        this.startDate = result.startDate;
        this.endDate = result.endDate;
        this.applyPriorityFilter();
      }
    });
  
  }

  applyPriorityFilter(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const taskStartDate = new Date(task.start_date);
      const taskEndDate = new Date(taskStartDate);
      taskEndDate.setDate(taskEndDate.getDate() + task.duration);

      const matchesPriority = this.selectedPriorities.length === 0 || this.selectedPriorities.includes(task.priority);
      const matchesStartDate = !this.startDate || taskStartDate >= this.startDate;
      const matchesEndDate = !this.endDate || taskEndDate <= this.endDate;

      return matchesPriority && matchesStartDate && matchesEndDate;
    });

    this.updateGanttChart();
  }

  updateGanttChart(): void {
    gantt.clearAll();
    gantt.parse({
      data: this.filteredTasks,
      links: this.links
    });
  }

  getProjekatLightbox(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.projectService.getProjectById(id)
        .subscribe(
          projekat => {
            this.startDate1 = this.parseDate(projekat.pocetak);
            this.endDate1 = this.parseDate(projekat.kraj);
            resolve();
          },
          error => {
            reject(error);
          }
        );
    });
  }
  scrollToday(){
    const today = new Date();
    gantt.showDate(today);
  }
}
