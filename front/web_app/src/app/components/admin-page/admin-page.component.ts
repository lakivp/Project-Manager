import { Component } from '@angular/core';
import { User } from '../../interfaces/auth';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { checkInput } from '../helpers/inputValidator';
import { SharedService } from '../../services/admin-profile-shared.service';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css',
})
export class AdminPageComponent {
  public newUserForm: FormGroup;
  private formBuilder: FormBuilder;
  phoneError: boolean = false;
  users: any[];
  adminId: any;
  newUser: boolean = false;
  public roles: string[] = ['User', 'Guest', 'Project Manager'];
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private builder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.formBuilder = builder;
    this.newUserForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      idUlogeAplikacija: ['', Validators.required],
      password: ['', Validators.required],
      specijalizacija: ['', Validators.required],
      opis: [''],
      phone_number: ['', Validators.required],
    });
  }
  ngOnInit() {
    const id =
      this.authService.getUserInfo()[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];
    this.adminId = id;
    this.adminService.getUsers().subscribe((data) => {
      this.users = data;
    });
    this.sharedService.profileChange$.subscribe((data) => {
      this.setUsers(data);
    });
  }

  setUsers(data: User) {
    const newUsers = this.users.map((user) => {
      if (user.id === data.id) {
        return data;
      }
      return user;
    });
    this.users = newUsers;
  }

  handleToggleChange(user: User) {
    if (user.status) {
      this.adminService.activateUser(user.id).subscribe((data: User) => {
        this.setUsers(data);
      });
    } else {
      this.adminService.deactivateUser(user.id).subscribe((data: User) => {
        this.setUsers(data);
      });
    }
  }
  addNewUser() {
    this.newUser = true;
  }
  close() {
    this.newUser = false;
  }
  onSubmit() {
    const newUserInfo = {
      ime: this.newUserForm.value.first_name,
      prezime: this.newUserForm.value.last_name,
      username: this.newUserForm.value.username,
      email: this.newUserForm.value.email,
      idUlogeAplikacija:
        this.newUserForm.value.idUlogeAplikacija === 'User'
          ? 2
          : this.newUserForm.value.idUlogeAplikacija === 'Guest'
          ? 3
          : 4,
      password: this.newUserForm.value.password,
      imageURl: '',
      phoneNumber: this.newUserForm.value.phone_number,
      specijalizacija: this.newUserForm.value.specijalizacija,
      opis: this.newUserForm.value.opis,
      status: 1,
    };
    console.log(newUserInfo);

    this.adminService.addNewUser(newUserInfo).subscribe((data) => {
      const newUsers = [...this.users, data];
      this.users = newUsers;
      this.newUserForm.setValue({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        idUlogeAplikacija: '',
        password: '',
        specijalizacija: '',
        opis: '',
        phone_number: '',
      });
    });
    this.newUserForm.reset();
    this.close();
  }
  cancel() {
    this.newUserForm.reset();
    this.close();
  }

  checkPhone() {
    const reg = new RegExp('^[0-9]{3}[0-9]{5,12}$');
    checkInput(reg, this.newUserForm, 'phone_number');
  }
  checkEmail() {
    const reg = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,4}$/);
    checkInput(reg, this.newUserForm, 'email');
  }
}
