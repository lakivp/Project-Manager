import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Project } from '../../../types';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GetTaskService } from '../../services/get-task.service';
import { NgModel } from '@angular/forms';
import { checkNgInput } from '../helpers/inputValidator';
import { ProjectService } from '../../services/project.service';
import { SettingsServService } from '../../services/settings-serv.service';
import { ProfileService } from '../../services/profile.service';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { Editor, Toolbar } from 'ngx-editor';
import { GanttTaskService } from '../../services/gantt-task.service';
import { AddProjectMemberService } from '../../services/add-project-member.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from 'primeng/api';
import { SharedService } from '../../services/add-member-project-overview-shared.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../interfaces/auth';
import { timingSafeEqual } from 'crypto';
@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.css',
})
export class ProjectOverviewComponent implements OnInit {
  @Output("projectNameChange") projectNameChange:EventEmitter<any> = new EventEmitter<any>();
  project: any;
  assignees: any[];
  edit: boolean;
  description: string = '';
  currentPriority: string;
  priorities: string[] = ['High', 'Medium', 'Low'];
  dateBeginning: any;
  dateEnd: any;
  participants: boolean = false;
  korisnici: any[] = [];
  ulogaId: number = 2;
  ownerId:number;
  ownerData:User;
  ime:string;
  prezime:string;
  slika:string;
  id: number;
  isOwner: boolean;
  username: string | null = null;
  projectName:string;
  editorContent: string = '';
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
  ];
  spinner2:boolean=false;
  toDeleteUsers:any[]=[];
  korisnikId: string;
  ucitavanje: boolean = false;
  spinner:boolean=false;

  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private projectTaskGeter: GetTaskService,
    private projectService: ProjectService,
    private setting: SettingsServService,
    private profileServ: ProfileService,
    private taskService: GanttTaskService,
    private projectMemberService: AddProjectMemberService,
    public dialog: MatDialog,
    private confirm: ConfirmationService
    ,private sett:SettingsServService,
    private cdr:ChangeDetectorRef,
    private addMemberService: AddProjectMemberService,
    private location: Location,
    private translate:TranslateService
  ) {}

  ngOnInit(): void {
    
    this.edit = false;
    this.project = {
      id: -1,
      naziv: '',
      opis: '',
      prioritet: '',
      pocetak: '',
      kraj: '',
      status: 0,
    };
    this.assignees = [];
    this.editor = new Editor();

    this.route.params.subscribe((params) => {
      let id = +params['id'];
      this.id=id;
      this.projectTaskGeter.getProject(id + '').subscribe((data: any) => {
        this.project = data;
        this.currentPriority = data.prioritet;
        this.dateBeginning = data.pocetak;
        this.dateEnd = data.kraj;
        this.description = data.opis;
        this.editorContent = data.opis;
        this.projectName = data.naziv;
        this.projectTaskGeter
          .getProjectMembers(id.toString())
          .subscribe((data1) => {
            this.assignees = data1;
            for (let i = 0; i < this.assignees.length; i++) {
              this.profileServ
                .getPictureOfUser(this.assignees[i]['username'])
                .subscribe((data2) => {
                  this.assignees[i]['slika'] =
                    this.profileServ.decodeMethod(data2);
                });
            }

            console.log(data1);
            this.setting.ColorElements(0);
          });
      });
      this.loadUsers();
      this.getProject();
    });

    //ZABRANA KORISNIKU KOJI NIJE OWNER DA EDITUJE PROJEKAT
   

    this.getusername();
    this.getProjectMembers().subscribe(
      (isUserInMembers) => {
        console.log(isUserInMembers);
        if (isUserInMembers) {
          this.isOwner = true;
          console.log('JESTE OWNER');
        } else {
          this.isOwner = false;
          console.log('NIJE OWNER');
        }
      },
      (error) => {
        console.error('Greška prilikom dobijanja članova projekta:', error);
      }
    );
  }
  toggleSpinner(){
    this.spinner2=true;
  }
  getMembers(newMember:any){
    console.log("NEW ",newMember);
    const newAssignees=[...this.assignees, newMember];
    console.log(this.assignees);
    this.assignees=newAssignees;
    this.profileServ
    .getPictureOfUser(this.assignees[this.assignees.length-1]['username'])
    .subscribe((data2) => {
      this.assignees[this.assignees.length-1]['slika'] = this.profileServ.decodeMethod(data2);
        this.spinner2=false;
        console.log("DODATI",this.assignees);
    });
      this.setting.ColorElements(0);
  }
  resetFilters(): void {
    if(this.korisnici.length>0){
      this.korisnikId = this.korisnici[0].username;
    }
    this.ulogaId = 2;
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  onModalBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.resetFilters();
    }
  }
  changeEdit() {
    this.edit = !this.edit;
    this.setting.ColorElements(0);
  }
  checkDate(event: any, ngModel: NgModel) {
    console.log(event.target.value);
    const reg = new RegExp('^.+$');
    checkNgInput(reg, event.target.value, ngModel);
  }
  openDialog(): void {
    this.dialog.open(this.deleteDialog);
  }


  removeMember(user: any, project_id: number) {
    if (user.uloga == 'Owner') {
      this.openDialog();
      return;
    }
    this.confirm.confirm({
      message: this.translate.instant("deleteMember"),
      header: this.translate.instant("confirmDeletion"),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant("yes"),
      rejectLabel: this.translate.instant("no"),
      accept: () => {
        console.log("before",this.toDeleteUsers);
        this.toDeleteUsers=[...this.toDeleteUsers,user];
        console.log("after",this.toDeleteUsers);
        const newAssignees = this.assignees.filter(assignee=> assignee.id!=user.id);
        console.log("newAssignes", newAssignees);
        this.assignees=newAssignees;
        this.korisnici=[...this.korisnici, user];
        console.log(this.korisnici);
        if(this.korisnici.length==1){
          console.log("usaooo");
          this.korisnikId=this.korisnici[0].username;
        }
        console.log(this.korisnikId);
      },
      reject: () => {
        // Reject action
      }
    });
  }
  changeKorisnikId(username:string){
    this.korisnikId=username
  }
  containsObject(obj:any) {
    var i;
    for (i = 0; i < this.toDeleteUsers.length; i++) {
        if (this.toDeleteUsers[i] === obj) {
            return true;
        }
    }

    return false;
  }
  saveProject() {
   
    if(this.toDeleteUsers.length>0){
      this.toDeleteUsers.map((user:any)=>{
        this.projectMemberService
        .removeProjectMember(this.id, user.id)
        .subscribe((data) => {
          let newAssignees = this.assignees.filter(
            (assignee) => assignee.id != user.id
          );
          this.assignees = newAssignees;
        });
      })
    }
    this.changeEdit();
    // this.sharedService.notifyAddUsers(this.assignees);
    let date1, date2;
    let dan1, dan2, mesec1, mesec2;
    if (this.dateBeginning != this.project.pocetak) {
      if (this.dateBeginning.getDate() < 10)
        dan1 = '0' + this.dateBeginning.getDate();
      else dan1 = this.dateBeginning.getDate();

      if (this.dateBeginning.getMonth() + 1 < 10)
        mesec1 = '0' + (this.dateBeginning.getMonth() + 1);
      else mesec1 = this.dateBeginning.getMonth() + 1;

      date1 = dan1 + '.' + mesec1 + '.' + this.dateBeginning.getFullYear();
    }
    if (this.dateEnd != this.project.kraj) {
      if (this.dateEnd.getDate() < 10) dan2 = '0' + this.dateEnd.getDate();
      else dan2 = this.dateEnd.getDate();
      if (this.dateEnd.getMonth() + 1 < 10)
        mesec2 = '0' + (this.dateEnd.getMonth() + 1);
      else mesec2 = this.dateEnd.getMonth() + 1;

      date2 = dan2 + '.' + mesec2 + '.' + this.dateEnd.getFullYear();
    }

    const newProject = {
      id: this.project.id,
      naziv: this.projectName,
      opis: this.editorContent,
      prioritet: this.currentPriority,
      pocetak: date1 ? date1 : this.dateBeginning,
      kraj: date2 ? date2 : this.dateEnd,
      status: 1,
    };
    console.log('save', this.editorContent);
    this.projectService.updateProject(newProject).subscribe((data) => {
      this.projectNameChange.emit(this.projectName);
      this.project = newProject;
      this.setting.ColorElements(0);
    });
    this.addUsers();
    // location.reload();
  }
  showAllMembersTable:boolean=false
openMembersTable() {
  this.showAllMembersTable = true;
}

closeMembersTable() {
  this.showAllMembersTable = false;
  this.sett.MethodForProjectView();
}

discardChanges() {

  this.ngOnInit();
  this.edit = false;
  this.spinner2 = false; 
  this.closeMembersTable(); 
}

  openModal() {
    this.participants = true;
    this.setting.ColorElements(0);
  }
  closeParticipantsView() {
    console.log('ovde');
    this.participants = false;
    this.setting.ColorElements(0);
  }

  getProjectMembers(): Observable<boolean> {
    return this.taskService.getProjectMember(this.id).pipe(
      map((members: any[]) => {
        // Pronađi vlasnika i sačuvaj njegov ID
        const owner = members.find((member) => member.uloga === 'Owner');
        if (owner) {
          this.ownerId = owner.id;
          this.gethOwnerData(this.ownerId);
        }

        // Proveri da li je trenutni korisnik vlasnik ili održavač
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
  
  getProjectName(id: number): Observable<string> {
    return this.addMemberService.getProject(id).pipe(
      map((project: any) => project['naziv']),
      catchError((error) => {
        console.error('Greška pri dobijanju imena projekta:', error);
        return 'Greskaa';
      })
    );
  }

  getProject(): void {
    this.route.params.subscribe((params) => {
      let id = +params['id'];
      this.getProjectName(id).subscribe(
        (projectName: string) => {
          this.projectName = projectName;
        },
        (error) => {
          console.error('Error fetching project name', error);
        }
      );
    });
  }


  public loadUsers() {
    console.log("usaooo");
    this.addMemberService.getAllUsers().subscribe(
      (allUsers) => {
        this.addMemberService.getAllUsersOnProject(this.id).subscribe(
          (usersOnProject) => {
            const usersNotOnProject = allUsers.filter(
              (user) =>
                !usersOnProject.some(
                  (projectUser) =>
                    projectUser.id == user.id || user.idUlogeAplikacija == 1
                )
            );
            this.assignees=usersOnProject;
            this.korisnici = usersNotOnProject;
            if (usersNotOnProject.length > 0 && this.korisnici.length==1)
              this.korisnikId = usersNotOnProject[0].username;
          },
          (error) => {
            console.error('Greška pri dobijanju korisnika na projektu:', error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // loadProjects() {
  //   this.addMemberService.getAllProjects().subscribe(
  //     (users) => {
  //       this.projekti = users;
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
  addUsers(){
    console.log("SAVE",this.assignees);
    this.addMemberService.getAllUsersOnProject(this.id).subscribe(
      (usersOnProject) => {
        const usersNotOnProject = this.assignees.filter(
          (user) =>
            !usersOnProject.some(
              (projectUser) =>
                projectUser.id == user.id || user.idUlogeAplikacija == 1
            )
        );
        usersNotOnProject.map(assignee=>{
          console.log("USER", assignee);
          this.addMemberService
          .addProjectMembers(assignee.id, this.id, this.ulogaId)
          .subscribe(
            (response) => {
              console.log(response);
              this.ucitavanje = false;
              this.sett.MethodForProjectView();
            },
            (error) => {
              console.log(error);
              this.ucitavanje = false;
              this.spinner=false;
            }
          );
        })
        // location.reload();
      },
      (error) => {
        console.error('Greška pri dobijanju korisnika na projektu:', error);
      }
    );
    
  }
    addMember() {
      this.ucitavanje = true;
      console.log("KORISNICI", this.korisnici, this.korisnikId);
      const korisnik = this.korisnici.find(korisnik=>korisnik.username==this.korisnikId);
      const newKorisnici = this.korisnici.filter(k=>k.username!=this.korisnikId);
      this.korisnici=newKorisnici;
      
      this.profileServ
      .getPictureOfUser(korisnik['username'])
      .subscribe((data2) => {
        korisnik['slika'] = this.profileServ.decodeMethod(data2);
        this.spinner2=false;
    });
      this.assignees=[...this.assignees, korisnik];
      console.log("ID korisniak", this.korisnikId)
      const newDeletedUsers=this.toDeleteUsers.filter(user=>this.korisnikId!=user.username);
      this.toDeleteUsers=newDeletedUsers;
      console.log("nakon dodavanja", this.toDeleteUsers);
      console.log("KORISNICI2", this.korisnici);
      console.log("after add ",this.assignees);
      if(newKorisnici.length==1){
        this.korisnikId=newKorisnici[0].username;
      }
    }

    gethOwnerData(id:number) {
      this.authService.getUser(id).subscribe(
        (data: User) => {
          this.ime = data.ime;
          this.prezime = data.prezime;
          this.profileServ
                .getPictureOfUser(data.username)
                .subscribe((data2) => {
                  this.slika =
                    this.profileServ.decodeMethod(data2);
                });
          console.log("IME",this.ime,this.prezime);
        },
        (error) => {
          console.error('Greška prilikom dobijanja podataka o vlasniku:', error);
        }
      );
    }

}
