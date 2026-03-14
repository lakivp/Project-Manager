import {
  Component,
  ElementRef,
  ViewChild,
  Renderer2,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormsModule,
  FormBuilder,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthService } from '../../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ProfileService } from '../../services/profile.service';
import { MessageService } from 'primeng/api';
import { User } from '../../interfaces/auth';
import { PFP } from '../../interfaces/profilePicture';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, Task } from '../../../types';
import {
  ImageCroppedEvent,
  LoadedImage,
  ImageCropperModule,
} from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminService } from '../../services/admin.service';
import { SettingsServService } from '../../services/settings-serv.service';
import { SharedService } from '../../services/admin-profile-shared.service';
import { Auth1Service } from '../../services/auth1.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  isEdit:boolean;
  public profileForm: FormGroup;
  public user: User;
  private formBuilder: FormBuilder;
  private file: File | null = null;
  public edit: number = 0;
  public tasks: Task[];
  public projects: any[];
  public roles: string[] = ['User', 'Guest', 'Project Manager'];
  public viewer: User;
  public userPositions: any[];
  @ViewChild('containerProfile') container: ElementRef;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropTitle: string = 'Crop picture:';
  @Output() setUsers: EventEmitter<any> = new EventEmitter<any>();

  routeUserId: number; // ID iz rute
  loggedInUserId: number; // ID logovanog korisnika

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
      event.objectUrl + ''
    );
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    let butt2: any = document.getElementById('SaveCropElse');
    this.cropTitle = 'Picture was not selected.';
    butt2.style.display = 'None';
  }
  openCrop() {
    let element: any = document.getElementById('butCrop');
    console.log(element);
    element.style.display = 'block';

    let element2: any = document.getElementById('containerProfile');
    element2.style.filter = 'blur(5px)';

    let butt1: any = document.getElementById('SaveBut');
    let butt2: any = document.getElementById('CancBut');

    butt1.disabled = true;
    butt2.disabled = true;

    let butt3: any = document.getElementById('SaveCropElse');
    butt3.style.display = 'inline';
  }
  submitNewPicture() {
    let element: any = document.getElementById('butCrop');
    element.style.display = 'none';

    let element2: any = document.getElementById('containerProfile');
    element2.style.filter = 'none';

    let butt1: any = document.getElementById('SaveBut');
    let butt2: any = document.getElementById('CancBut');

    butt1.disabled = false;
    butt2.disabled = false;

    this.cropTitle = 'Crop picture:';
    this.changeProfilePicture();
  }
  closeCrop2() {
    let element: any = document.getElementById('butCrop');
    element.style.display = 'none';

    let element2: any = document.getElementById('containerProfile');
    element2.style.filter = 'none';

    let butt1: any = document.getElementById('SaveBut');
    let butt2: any = document.getElementById('CancBut');

    butt1.disabled = false;
    butt2.disabled = false;
    this.cropTitle = 'Crop picture:';
  }
  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private profileService: ProfileService,
    private msgService: MessageService,
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private adminService: AdminService,
    public settingServ: SettingsServService,
    private sharedService: SharedService,
    private auth1Service: Auth1Service,
    private translate:TranslateService

  ) {
    this.user = {
      id: '',
      username: '',
      ime: '',
      prezime: '',
      email: '',
      idUlogeAplikacija: 0,
      status: 0,
      passwordHash: '',
      passwordSalt: '',
      imageURL: '',
      phoneNumber: '',
      specijalizacija: '',
      opis: '',
    };
    this.formBuilder = builder;
    this.profileForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      role: [''],
      description: [''],
      phoneNumber: [''],
      specialisation: ['', Validators.required],
    });
  }
  pictureJson: any;
  imageProfileThis: any;
  imageUrlPopUp: any;
  ngOnInit() {
    const viewerId =
      this.authService.getUserInfo()[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];
    this.authService.getUser(viewerId).subscribe((data) => {
      console.log('viewer', data);
      this.viewer = data;
    });

    this.route.params.subscribe((params) => {
      let id = +params['id'];
      let isEdit = +params['edit'];
      this.edit = isEdit;
      this.profileService.getUserInfo(id).subscribe((data) => {
        console.log(data);
        if (!data) {
          this.user = data;
          return;
        }
        this.profileService
          .getPictureOfUser(data.username)
          .subscribe((data) => {
            this.imageProfileThis = this.profileService.decodeMethod(data);
          });
        this.user = data;
        this.profileForm.setValue({
          username: data.username,
          email: data.email,
          first_name: data.ime,
          last_name: data.prezime,
          role:
            data.idUlogeAplikacija == 1
              ? 'Admin'
              : data.idUlogeAplikacija == 2
              ? 'User'
              : data.idUlogeAplikacija == 3
              ? 'Guest'
              : 'Project Manager',
          description: data.opis,
          phoneNumber: data.phoneNumber,
          specialisation: data.specijalizacija,
        });
      });
      this.settingServ.SetStatusByUser(id);
      // this.profileService.getUserPositions(id)
      this.profileService.getUserTasks(id).subscribe((data)=>{
        this.tasks=data;
      });
      this.profileService.getUserProjects(id).subscribe((data)=>{
        this.projects=data;
      });
    });    
    this.settingServ.ColorElements(viewerId.id);

    this.routeUserId = +this.route.snapshot.params['id']; // Pretvori ID iz rute u broj
    const loggedInUserIdString = this.auth1Service.getIdFromToken();
    if (loggedInUserIdString !== null) {
      this.loggedInUserId = +loggedInUserIdString; // Pretvori ID prijavljenog korisnika u broj
    }
    this.checkEdit();
  }

  onSubmit(): void {
    const newUser: User = {
      ...this.user,
      ime: this.profileForm.value.first_name,
      prezime: this.profileForm.value.last_name,
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      opis: this.profileForm.value.description,
      phoneNumber: this.profileForm.value.phoneNumber,
      specijalizacija: this.profileForm.value.specialisation,
    };
    const newUserInfo = {
      id: this.user.id,
      ime: this.profileForm.value.first_name,
      prezime: this.profileForm.value.last_name,
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      imageURl: this.user.imageURL,
      opis: this.profileForm.value.description,
      phoneNumber: this.profileForm.value.phoneNumber,
      specijalizacija: this.profileForm.value.specialisation,
    };
    console.log(newUserInfo);
    if(document.getElementById("NovaSlikaProfilDaJa2"))  (document.getElementById("NovaSlikaProfilDaJa2") as HTMLElement).innerHTML= this.profileForm.value.first_name+" "+this.profileForm.value.last_name;
    this.profileService.changeUserInfo(newUserInfo).subscribe({
      next: (data) => {
        this.user = {
          ...this.user,
          ime: this.profileForm.value.first_name,
          prezime: this.profileForm.value.last_name,
          username: this.profileForm.value.username,
          email: this.profileForm.value.email,
          imageURL: this.user.imageURL,
          opis: newUserInfo.opis,
          phoneNumber: this.profileForm.value.phoneNumber,
          specijalizacija: this.profileForm.value.specialisation,
        };
        this.msgService.add({
          severity: 'success',
          summary:  this.translate.instant("success"),
          detail: this.translate.instant("infoSuccess")
        });
        this.settingServ.ColorElements(0);
        const newRole =
          this.profileForm.value.role == 'Admin'
            ? 1
            : this.profileForm.value.role == 'User'
            ? 2
            : this.profileForm.value.role == 'Guest'
            ? 3
            : 4;
        this.adminService
          .changeUserRole(this.user.id, newRole)
          .subscribe((data) => {
            this.user = data;
            if (this.viewer.idUlogeAplikacija !== 1) {
              this.viewer = data;
            }
            this.sharedService.notifyProfileChange(data);
            console.log(data);
          });
      },
      error: (response) => {
        this.msgService.add({
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: response.error,
        });
      },
    });

    this.edit = 0;
    if (this.viewer.idUlogeAplikacija === 1) {
      this.router.navigateByUrl('/accessibility');
    } else {
      this.router.navigateByUrl('/profile/' + this.user.id + '/' + 0);
    }
  }

  onFilechange(event: any) {
    this.file = event.target.files[0];
    this.settingServ.ColorElements(0);
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageUrlPopUp = e.target?.result;
    };
    reader.readAsDataURL(event.target.files[0]);

    try {
      this.imageChangedEvent = event;
    } catch (error) {
      console.log('greska');
    }

    this.openCrop();
  }
  async blobURLtoBlob(blobURL: string): Promise<Blob> {
    const response = await fetch(blobURL);
    return await response.blob();
  }

  async createFileFromBlobURL(
    blobURL: string,
    filename: string
  ): Promise<File> {
    const blob = await this.blobURLtoBlob(blobURL);
    return new File([blob], filename);
  }
  blobToFile(blob: Blob, filename: string): File {
    const file = new File([blob], filename, { type: blob.type });
    return file;
  }

  async uploadImageFromBlobURL(blobURL: string) {
    const blob = await this.blobURLtoBlob(blobURL);
    return this.blobToFile(blob, 'image.png');
    // return this.changeUserPfp(id, file);
  }
  async changeProfilePicture() {
    console.log(
      this.croppedImage['changingThisBreaksApplicationSecurity'],
      '---------',
      this.croppedImage
    );

    //this.downloadImage(this.croppedImage['changingThisBreaksApplicationSecurity']);
    if (this.file) {
      let file2 = await this.uploadImageFromBlobURL(
        this.croppedImage['changingThisBreaksApplicationSecurity']
      );

      this.profileService.changeUserPfp(this.user.id, file2).subscribe({
        next: (data: PFP) => {
          this.msgService.add({
            severity: 'success',
            summary: this.translate.instant('success'),
            detail: this.translate.instant('pictSuccess')
          });
          this.profileService
            .getPictureOfUser(this.user.username)
            .subscribe((data2) => {
              this.imageProfileThis = this.profileService.decodeMethod(data2);
              if(document.getElementById("NovaSlikaProfilDaJa"))  (document.getElementById("NovaSlikaProfilDaJa") as HTMLImageElement).src=this.imageProfileThis;
            });
        },
        error: (response) => {
          this.msgService.add({
            severity: 'error',
            summary: this.translate.instant('error'),
            detail: response.error,
          });
        },
      });

      console.log(this.file.name);
    } else {
      alert('Please select a file first');
    }
  }

  cancelEdit() {
    this.profileForm.setValue({
      username: this.user.username,
      email: this.user.email,
      first_name: this.user.ime,
      last_name: this.user.prezime,
      role:
        this.user.idUlogeAplikacija == 1
          ? 'Admin'
          : this.user.idUlogeAplikacija == 2
          ? 'Maintener'
          : this.user.idUlogeAplikacija == 3
          ? 'Developer'
          : 'Guest',
      description: this.user.opis,
      phoneNumber: this.user.phoneNumber,
      specialisation: this.user.specijalizacija,
    });
    this.edit = 0;
    if (this.user.idUlogeAplikacija === 1) {
      this.router.navigateByUrl('/accessibility');
    } else {
      this.router.navigateByUrl('/profile/' + this.user.id + '/' + 0);
      this.settingServ.MethodForProfile(0);
    }
  }

  checkEdit(): void {
    this.isEdit = this.routeUserId === this.loggedInUserId || this.auth1Service.getRoleAdminFromToken();
    console.log(this.isEdit);
  }

  

}
