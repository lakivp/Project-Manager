import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllTasksTableService } from '../../services/all-tasks-table.service';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { SettingsServService } from '../../services/settings-serv.service';

@Component({
  selector: 'app-all-tasks-table',
  templateUrl: './all-tasks-table.component.html',
  styleUrl: './all-tasks-table.component.css'
})
export class AllTasksTableComponent {
  tasks: any[] = [];
  startDate:string;
  endDate:string;
  filterName:string='';
  selectedPriority:string='';
  selectedLabel:string='';
  @Input() link:string="";

  constructor(
    private allTasksTableService: AllTasksTableService,
    private authService: AuthService,
    private profileService: ProfileService,
    private sett:SettingsServService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.sett.ColorElements(0);
  }
   
  
  loadTasks(): void {
    const userData = this.authService.getUserInfo();
  const userId = userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
   
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
  
    // Postavljamo početni i krajnji datum u formatu koji očekuje API
    if (this.startDate) {
      filterStatus0.pocetak = this.formatDate(this.startDate);
    }
    if (this.endDate) {
      filterStatus0.kraj = this.formatDate(this.endDate);
    }
    
    this.allTasksTableService.filterTasks(filterStatus0,userId).subscribe(
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
        this.sett.ColorElements(0);
        // Postavljamo početni i krajnji datum u formatu koji očekuje API
        if (this.startDate) {
          filterStatus1.pocetak = this.formatDate(this.startDate);
        }
        if (this.endDate) {
          filterStatus1.kraj = this.formatDate(this.endDate);
        }
  
        this.allTasksTableService.filterTasks(filterStatus1, userId).subscribe(
          (filteredTasksStatus1: any[]) => {
            // Kombinujemo filtrirane zadatke sa oba statusa
            this.tasks = [...filteredTasksStatus0, ...filteredTasksStatus1];
            
            // Ažuriranje filteredOptions
            this.filteredOptions = [];
            if (this.filterName) {
              this.filteredOptions.push(`Name: ${this.filterName}`);
            }
            if (this.startDate && this.endDate) {
              this.filteredOptions.push(`Start Date: ${this.startDate} - End Date: ${this.endDate}`);
            }
            if (this.selectedLabel) {
              this.filteredOptions.push(`Label: ${this.selectedLabel}`);
            }
            if (this.selectedPriority) {
              this.filteredOptions.push(`Priority: ${this.selectedPriority}`);
            } this.sett.ColorElements(0);
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
    );
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
    this.sett.ColorElements(0);
    this.tasks.sort((a, b) => {
      const dateA = this.parseDate(a[field]);
      const dateB = this.parseDate(b[field]);
      this.sett.ColorElements(0);
      return (dateA.getTime() - dateB.getTime()) * this.sortOrder1;
    });
  }
  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.'); this.sett.ColorElements(0);
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();  this.sett.ColorElements(0);// Godina sa četiri cifre 
    return `${day}.${month}.${year}`; 
  }

  applyFilter(): void {
    console.log('Usao u apply filter!!!!!'); this.sett.ColorElements(0);
    // Prvo primenjujemo filter na zadatke sa statusom 0
    const userData = this.authService.getUserInfo();
    const userId = userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    const filterStatus0 = {
        naziv: this.filterName.trim(),
        prioritet: this.selectedPriority,
        pocetak: "",
        kraj: "",
        status: 0,
        labelNaziv: this.selectedLabel,
        projekatNaziv: "",
        page_number: 0,
        page_size: 0
    };

    // Postavljamo početni i krajnji datum u formatu koji očekuje API
    if (this.startDate) {
        filterStatus0.pocetak = this.formatDate(this.startDate);
    }
    if (this.endDate) {
        filterStatus0.kraj = this.formatDate(this.endDate);
    }

    this.allTasksTableService.filterTasks(filterStatus0, userId).subscribe(
        (filteredTasksStatus0: any[]) => {
            const filterStatus1 = {
                naziv: this.filterName.trim(),
                prioritet: this.selectedPriority,
                pocetak: "",
                kraj: "",
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

            this.allTasksTableService.filterTasks(filterStatus1, userId).subscribe(
                (filteredTasksStatus1: any[]) => {
                    this.tasks = [...filteredTasksStatus0, ...filteredTasksStatus1];

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
                    }
                    if (this.selectedPriority) {
                      this.filteredOptions.push(`Priority: ${this.selectedPriority}`);
                  }
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
    );
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
    this.sett.ColorElements(0);
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
    this.sett.ColorElements(0);
    // Uklanjanje filtera iz niza appliedFilters
    this.filteredOptions.splice(index, 1);
  
    // Filtriramo prazne filtere pre ispisivanja
    const nonEmptyFilters = this.  filteredOptions.filter(filter => !!filter);
    console.log('Applying filters:', nonEmptyFilters);
  
    // Ponovo primenjujemo filtere na projekte
    this.applyFilter(); this.sett.ColorElements(0);
  }
  currentPage:number=0;
  pageSize: number = 18; 
  get pagedTasks() {
    const startIndex = this.currentPage * this.pageSize;
    return this.tasks.slice(startIndex, startIndex + this.pageSize); 
  }
// Metoda koja se poziva kada se promeni stranica
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex; this.sett.ColorElements(0);
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
