import { Component,EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ProjectTableService } from '../../services/project-table.service';
import { data } from 'jquery';
import { error } from 'console';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/auth';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { SettingsServService } from '../../services/settings-serv.service';
import { ConfirmationService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';
import { Auth1Service } from '../../services/auth1.service';
@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrl: './project-table.component.css'
})

export class ProjectTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() tableExpanded: EventEmitter<boolean> = new EventEmitter<boolean>();
  public user: User;
  projects:any[];
  sortField: string = '';
  sortOrder: number = 1;
  sortField1: string = '';
  sortOrder1: number = 1;
  startDate: string;
  endDate: string;
  filterName: string = '';
  highPriorityChecked: boolean = false;
  lowPriorityChecked: boolean = false;
  normalPriorityChecked: boolean = false;
  greaterThan50Checked : boolean = false;
  lessThan50Checked: boolean = false;
  selectedRole: string = '';
  originalProjects: any[] = [];
  isProjectManager: boolean;
  constructor(
    private projectSevice: ProjectTableService,
    private authService: AuthService,
    private msgService: MessageService,
    private http: HttpClient,
    private settingServ: SettingsServService,
    private confirmationService: ConfirmationService,
    private cdRef: ChangeDetectorRef,
    private auth1Service:Auth1Service

  ) {
    this.user = {
      id: "",
      username: "",
      ime: "",
      prezime: "",
      email: "",
      idUlogeAplikacija: 0,
      status: 0,
      passwordHash: "",
      passwordSalt: "",
      imageURL: "",
      phoneNumber: "",
      specijalizacija: "",
      opis: ""
    }
   } 

   ngOnInit(): void {
    this.isProjectManager = this.auth1Service.getRoleProjectManagerFromToken();
    const userData = this.authService.getUserInfo();
    const userId = userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    this.getAllProjects(userId);
  }

  public getAllProjects(userId:number){
    console.log("aloooo");
    this.projectSevice.getProjects(userId)
      .subscribe((data: any[]) => {
        // Filtrirajte projekte kako biste izbjegli one čiji je status 0
        this.resetFilters();
        this.projects = data.filter(project => project.status != 0);
        this.originalProjects = [...this.projects]; this.settingServ.ColorElements(userId) // Ažurirajte originalne projekte 
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString(); // Godina sa četiri cifre
    return `${day}.${month}.${year}`;
  }

  filterProjects1(): void {
    
    const userData = this.authService.getUserInfo();
    const userId = userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    // Postavljamo granice procenta u zavisnosti od čekiranih opcija
    let progressGreaterThan = this.greaterThan50Checked ? 50 : 0;
    let progressLesserThan = this.lessThan50Checked ? 50 : 100;

    const filterParams: any = {
        user_id: userId,
        naziv: this.filterName.trim(),
        prioritet: this.getSelectedPriorities(),
        pocetak: "",
        kraj: "",
        status: 1,
        role: this.selectedRole,
        progress_greater_than: progressGreaterThan,
        progress_lesser_than: progressLesserThan,
        progress_filter_as_union: true,
        page_number: 0,
        page_size: 0
    };

    if (this.startDate) {
      filterParams.pocetak = this.formatDate(this.startDate);
    }
    
    if (this.endDate) {
        filterParams.kraj = this.formatDate(this.endDate);
    }
  
  

    this.appliedFilters = [];

    this.projectSevice.filtriranjeProjekata(filterParams).subscribe(
        (data: any[]) => {
            if (data) {
                this.projects = data.filter(project => 
                    project.status !== 0 &&
                    ((this.greaterThan50Checked && this.lessThan50Checked) ? project.progress_percentage === 50 :
                        (this.greaterThan50Checked ? project.progress_percentage > 50 : true) &&
                        (this.lessThan50Checked ? project.progress_percentage < 50 : true)
                    )
                );
                this.originalProjects = [...this.projects];

                if (this.filterName.trim() !== '') {
                    this.appliedFilters.push('Name: ' + this.filterName.trim());
                }
                if (this.highPriorityChecked) {
                    this.appliedFilters.push('Priority: High');
                }
                if (this.normalPriorityChecked) {
                    this.appliedFilters.push('Priority: Medium');
                }
                if (this.lowPriorityChecked) {
                    this.appliedFilters.push('Priority: Low');
                }
                if (this.startDate) {
                    const formattedStartDate = this.formatDate(this.startDate);
                    this.appliedFilters.push('Start Date: ' + formattedStartDate);
                }
                
                if (this.endDate) {
                    const formattedEndDate = this.formatDate(this.endDate);
                    this.appliedFilters.push('End Date: ' + formattedEndDate);
                }
                if (this.greaterThan50Checked) {
                    this.appliedFilters.push('Progress: >50%');
                }
                if (this.lessThan50Checked) {
                    this.appliedFilters.push('Progress: <50%');
                }
                if (this.selectedRole !== '') {
                    this.appliedFilters.push('Role: ' + this.selectedRole);
                }
            } else {
                this.projects = [];
                this.originalProjects = [];
            }
            console.log('Applying filters:', this.appliedFilters);
        },
        (error) => {
            console.error('Greška pri dobavljanju projekata', error);
        }
    );
}
removeFilter(index: number): void {
  const filterToRemove = this.appliedFilters[index];
  if (filterToRemove.includes('High')) {
    this.highPriorityChecked = false;
  } else if (filterToRemove.includes('Medium')) {
    this.normalPriorityChecked = false;
  } else if (filterToRemove.includes('Low')) {
    this.lowPriorityChecked = false;
  } else if (filterToRemove.includes('Progress')) { // Provera za bilo koji filter progresa
    // Proveravamo da li je veći od 50% progresa uključen i isključujemo ga ako jeste
    if (this.greaterThan50Checked && filterToRemove.includes('>50%')) {
      this.greaterThan50Checked = false;
    }
    // Proveravamo da li je manji od 50% progresa uključen i isključujemo ga ako jeste
    if (this.lessThan50Checked && filterToRemove.includes('<50%')) {
      this.lessThan50Checked = false;
    }
  } else if (filterToRemove.includes('Name')) {
    this.filterName = '';
  } else if (filterToRemove.includes('Start Date')) {
    this.startDate = '';
  } else if (filterToRemove.includes('End Date')) {
    this.endDate = '';
  } else if (filterToRemove.includes('Role')) {
    this.selectedRole = '';
  }
  // Uklanjamo filter iz niza primenjenih filtera
  this.appliedFilters.splice(index, 1);

  // Ponovno primenjujemo preostale filtere na projekte
  this.filterProjects1();
}





  getSelectedPriorities(): string[] {
    const priorities: string[] = [];
    if (this.highPriorityChecked) {
      priorities.push('High');
    }
    if (this.normalPriorityChecked) {
      priorities.push('Medium');
    }
    if (this.lowPriorityChecked) {
      priorities.push('Low');
    }
    return priorities;
  }
  

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortOrder *= -1;
    } else {
      this.sortField = field;
      this.sortOrder = 1;
    }

    this.projects.sort((a, b) => {
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

  /*loadProjects(): void {
    this.projectSevice.getProjects(userId)
      .subscribe((data: any[]) => {
        this.projects = data;
        this.originalProjects = [...data];
      },
        (error) => {
          console.error('Error fetching projects', error);
        }
      )
  };*/

  
  appliedFilters: string[] = [];
  

  resetFilters(event?: Event): void {
    this.filterName = '';
    this.highPriorityChecked = false;
    this.lowPriorityChecked = false;
    this.normalPriorityChecked = false;
    this.greaterThan50Checked = false;
    this.lessThan50Checked = false;
    this.selectedRole = '';
    this.startDate ="";
    this.endDate = "";
    
    if (event) {
        event.stopPropagation(); 
    }
    
    this.filterProjects1();
  }

  sortByDate(field: string): void {
    if (this.sortField1 === field) {
      this.sortOrder1 *= -1;
    } else {
      this.sortField1 = field;
      this.sortOrder1 = 1;
    }

    this.projects.sort((a, b) => {
      const dateA = this.parseDate(a[field]);
      const dateB = this.parseDate(b[field]);

      return (dateA.getTime() - dateB.getTime()) * this.sortOrder1;
    });
  }

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.');
    const fullYear = `20${year}`; // Dodaj '20' ispred godine za format 'dd.mm.yy'
    return new Date(parseInt(fullYear), parseInt(month) - 1, parseInt(day));
}

  getRoleColor(role: string): string {
    switch (role) {
      case 'Owner':
        return 'red';
      case 'Maintainer':
        return 'orange';
      case 'Developer':
        return 'blue';
      case 'Guest':
        return 'green';
      default:
        return 'black';
    }
  }

  sortByRole(): void {
    if (this.sortField === 'role') {
      this.sortOrder *= -1;
    } else {
      this.sortField = 'role';
      this.sortOrder = 1;
    }
  
    this.projects.sort((a, b) => {
      const roleA = a.role.toUpperCase();
      const roleB = b.role.toUpperCase();
  
      if (roleA < roleB) {
        return -1 * this.sortOrder;
      }
      if (roleA > roleB) {
        return 1 * this.sortOrder;
      }
      return 0;
    });
  }

  /*currentPage: number = 1;
  pageSize: number = 7;
  get pagedTasks() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.projects.slice(startIndex, startIndex + this.pageSize);
    }

    get totalPages() {
      return Math.ceil(this.projects.length / this.pageSize);
    }
    changePage(page: number) {
    this.currentPage = page;
  }*/
  showAdditionalButtons: boolean = false;
  toggleAdditionalButtons(project: any) {
    project.showAdditionalButtons = !project.showAdditionalButtons;
}
  confirmDelete(projectId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the project?',
      accept: () => {
        this.deleteProject(projectId);
      }
    });
  }
  
  deleteProject(projectId: number) {
    this.projectSevice.deleteProjectLink(projectId).subscribe(
      response => {
        console.log("Projekat uspešno obrisan:", response);
        this.refreshTableAndReload();
      },
      error => {
        console.error("Greška prilikom brisanja projekta:", error);
      }
    );
  }


  refreshTableAndReload(): void {
    const userData = this.authService.getUserInfo();
    const userId = userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    this.projectSevice.getProjects(userId)
      .subscribe((data: any[]) => {
        this.projects = data.filter(project => project.status != 0);
        this.originalProjects = [...this.projects]; 
        location.reload(); 
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }
  isTableExpanded: boolean = false;
  toggleTableSize() {
    const table = document.getElementById('tabela1');
  
    if (table) {
      this.isTableExpanded = !this.isTableExpanded;
  
      if (this.isTableExpanded) {
        table.style.height = '775px';
        if (document.getElementById('iznad1')) 
          (document.getElementById('iznad1') as HTMLElement).style.display="none"
        this.togglePageSize(true);
        this.currentPage = 0; 
      } else {
        table.style.height = '';
        if (document.getElementById('iznad1')) 
          (document.getElementById('iznad1') as HTMLElement).style.display="block"
        this.togglePageSize(false); // kada se tabela skupi
        this.currentPage = 0;
        this.pageSize = 10;
      }
      this.paginator.length = this.projects.length;
      this.paginator.firstPage();
    }
  }
  
  
  
  currentPage:number=0;
  pageSize: number =10;
  togglePageSize(isExpanded: boolean): void {
    if (isExpanded) {
      this.pageSize = 19; 
    } else {
      this.pageSize = 10; 
    }
  }
  
get pagedProjects() {
  const startIndex = this.currentPage * this.pageSize;
  if(this.projects){
    return this.projects.slice(startIndex, startIndex + this.pageSize);
  }
  return [];
}

onPageChange(event: PageEvent) {
  this.currentPage = event.pageIndex;
}

}
