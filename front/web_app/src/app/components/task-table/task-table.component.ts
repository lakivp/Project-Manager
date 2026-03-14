import { Component, Input } from '@angular/core';
import { TaskTableService } from '../../services/task-table.service';
import { ActivatedRoute } from '@angular/router';
import { response } from 'express';
import { AuthService } from '../../services/auth.service';
import { SettingsServService } from '../../services/settings-serv.service';
import { ConfirmationService } from 'primeng/api';
import { GanttTaskService } from '../../services/gantt-task.service';
import { Observable, catchError, map, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.css'
})
export class TaskTableComponent {

  idprojekta: number;
  isOwner: boolean;
  username: string | null = null;

  tasks: any[] = [];
  projectId: number ;
  startDate:string;
  endDate:string;
  filterName:string='';
  selectedPriority:string='';
  selectedLabel:string='';
  @Input() link:string="";

constructor(
  private translate: TranslateService,
  private taskService:TaskTableService,
  private ganttTaskService:GanttTaskService,
  private route:ActivatedRoute,
  private authService: AuthService,
   private settingServ: SettingsServService,
   private confirmationService: ConfirmationService) {

}


  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      let id = +params['id'];
      this.projectId = id;
    });
    this.loadTasks(); this.settingServ.ColorElements(0);
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
    ); this.settingServ.ColorElements(0);
  }

  loadTasks(): void {
    if(this.projectId){
      this.taskService.getTasks(this.projectId).subscribe(
        (data: any[]) => {
          this.tasks = data;
          console.log(data); this.settingServ.ColorElements(0);
        },
        (error) => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
    else{
      this.taskService.getAllTasks().subscribe(
        (data: any[]) => {
          this.tasks = data;
          console.log(data);
        },
        (error) => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString(); // Godina sa četiri cifre
    return `${day}.${month}.${year}`;
  }

  applyFilter(): void {
    // Prvo primenjujemo filter na zadatke sa statusom 0
    const filterStatus0 = {
      naziv: this.filterName.trim(),
      prioritet: this.selectedPriority,
      pocetak:"",
      kraj:"",
      status: 0,
      labelNaziv: this.selectedLabel,
      projekatNaziv: "",
      page_number: 0,
      page_size: 0
    };
    this.settingServ.ColorElements(0);
    // Postavljamo početni i krajnji datum u formatu koji očekuje API
    if (this.startDate) {
      filterStatus0.pocetak = this.formatDate(this.startDate);
    }
    if (this.endDate) {
      filterStatus0.kraj = this.formatDate(this.endDate);
    }
    
    this.taskService.filterTasks(filterStatus0, this.projectId).subscribe(
      (filteredTasksStatus0: any[]) => {
        // Zatim primenjujemo filter na zadatke sa statusom 1
        const filterStatus1 = {
          naziv: this.filterName.trim(),
          prioritet: this.selectedPriority,
          pocetak:"",
          kraj:"",
          status: 1,
          labelNaziv: this.selectedLabel,
          projekatNaziv: ""
        };
  
        // Postavljamo početni i krajnji datum u formatu koji očekuje API
        if (this.startDate) {
          filterStatus1.pocetak = this.formatDate(this.startDate);
        }
        if (this.endDate) {
          filterStatus1.kraj = this.formatDate(this.endDate);
        }
        this.settingServ.ColorElements(0);
        this.taskService.filterTasks(filterStatus1, this.projectId).subscribe(
          (filteredTasksStatus1: any[]) => {
            // Kombinujemo filtrirane zadatke sa oba statusa
            this.tasks = [...filteredTasksStatus0, ...filteredTasksStatus1];
            
            // Ažuriranje filteredOptions
            this.filteredOptions = [];
            if (this.filterName) {
              this.filteredOptions.push(`Name: ${this.filterName}`);
            }
            if (this.startDate) {
              const formattedStartDate = this.formatDate(this.startDate);
              this.filteredOptions.push('Start Date: ' + formattedStartDate);
          }
          
          if (this.endDate) {
              const formattedEndDate = this.formatDate(this.endDate);
              this.filteredOptions.push('End Date: ' + formattedEndDate);
          }
            if (this.selectedLabel) {
              this.filteredOptions.push(`Label: ${this.selectedLabel}`);
            }
            if (this.selectedPriority) {
              this.filteredOptions.push(`Priority: ${this.selectedPriority}`);
            } this.settingServ.ColorElements(0);
          }, 
          (error) => {
            console.error('Error applying filter for status 1:', error);
          }
        );
        console.log('Applying filters:', this.filteredOptions);
      },
      (error) => {
        console.error('Error applying filter for status 0:', error);
      }
    ); this.settingServ.ColorElements(0);
  }
  
  
  removeFilter(index: number): void {
    console.log('Removing filter at index:', index);
    
    // Provera tipa filtera i brisanje
    if (this.filteredOptions[index].includes('Priority')) {
      this.selectedPriority="";
    } else if (this.filteredOptions[index].includes('Name')) {
      this.filterName = '';
    } else if (this.filteredOptions[index].includes('Start Date')) {
      this.startDate = '';
    } else if (this.filteredOptions[index].includes('End Date')) {
      this.endDate = '';
    } else if (this.filteredOptions[index].includes('Label')) {
      this.selectedLabel = '';
    } 
  
    // Uklanjanje filtera iz niza appliedFilters
    this.filteredOptions.splice(index, 1);
  
    // Filtriramo prazne filtere pre ispisivanja
    const nonEmptyFilters = this.  filteredOptions.filter(filter => !!filter);
    console.log('Applying filters:', nonEmptyFilters);
  
    // Ponovo primenjujemo filtere na projekte
    this.applyFilter(); this.settingServ.ColorElements(0);
  }

  filteredOptions: string[] = [];

  
  resetFilters(event?: Event): void {
    this.filterName = '';
    this.selectedPriority = ''; // Resetujemo izabranu prioritet
    this.startDate = '';
    this.endDate = '';
    this.selectedLabel = ''; // Resetujemo izabrani label

    if (event) {
        event.stopPropagation(); // Zaustavljamo propagaciju događaja ako postoji
    }

    this.applyFilter(); this.settingServ.ColorElements(0); // Primjenjujemo filtere
}
  

  getDaysDifference(endDate: string): number {
    const endDateObj = this.parseDate(endDate);
    const today = new Date();
    const differenceInDays = Math.ceil((endDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return differenceInDays;
  }



  getPriorityColor(role: string): string {
    switch (role) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'green';
      default:
        return 'black'; 
    }
  }

  sortField1: string = ''; // Polje za sortiranje
  sortOrder1: number = 1;
  sortByDate(field: string): void {
    if (this.sortField1 === field) {
      this.sortOrder1 *= -1;
    } else {
      this.sortField1 = field;
      this.sortOrder1 = 1;
    }

    this.tasks.sort((a, b) => {
      const dateA = this.parseDate(a[field]);
      const dateB = this.parseDate(b[field]);

      return (dateA.getTime() - dateB.getTime()) * this.sortOrder1;
    });
  }

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // navigacija stranica
  /*currentPage: number = 1;
  pageSize: number = 15;
  get pagedTasks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.tasks.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.tasks.length / this.pageSize);
  }
  changePage(page: number) {
  this.currentPage = page;
}*/

confirmDelete(taskId: number) {
  this.confirmationService.confirm({
    message: this.translate.instant('delTaskSure'),
    accept: () => {
      // Pozovite funkciju za brisanje projekta
      this.deliteTask(taskId);
    }
  });
}

deliteTask(taskId:number)
{
  this.taskService.deliteTask(taskId).subscribe(
    response=>{
      console.log("Task je uspesno obrisan:",response);
      this.refreshTableAndReload(); this.settingServ.ColorElements(0);
    },
    error => {
      console.error("Greška prilikom brisanja projekta:", error);
    }
  );
}
refreshTableAndReload(): void {
  const userData = this.authService.getUserInfo();
  const userId = userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  this.taskService.getTasks(this.projectId).subscribe(
    (data: any[]) => {
      this.tasks = data;
      location.reload();  this.settingServ.ColorElements(0);
    },
    (error) => {
      console.error('Error fetching tasks:', error);
    }
  );
}

getProjectMembers(): Observable<boolean> {
  return this.ganttTaskService.getProjectMember(this.projectId).pipe(
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
  this.username = this.ganttTaskService.getUsername();
}

  currentPage:number=0;
  pageSize: number = 16;
  get pagedTasks() {
    const startIndex = this.currentPage * this.pageSize;
    return this.tasks.slice(startIndex, startIndex + this.pageSize);
  }
// Metoda koja se poziva kada se promeni stranica
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
  }
  sortField: string = '';
  sortOrder: number = 1;
  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortOrder *= -1;
    } else {
      this.sortField = field;
      this.sortOrder = 1;
    }

    this.tasks.sort((a, b) => {
      const valueA = (typeof a[field] === 'string') ? a[field].toUpperCase() : a[field];
      const valueB = (typeof b[field] === 'string') ? b[field].toUpperCase() : b[field];

      if (valueA < valueB) {
        return -1 * this.sortOrder;
      }
      if (valueA > valueB) {
        return 1 * this.sortOrder;
      }
      return 0;
    });
  }
}
