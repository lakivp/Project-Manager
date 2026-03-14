import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../helpers/confirm-password.validator';
import { ResetPassService } from '../../services/reset-pass.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{

  resetPassForm!: FormGroup;
  ngOnInit(): void {
    this.resetPassForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    },{
      validator: ConfirmPasswordValidator("password","confirmPassword")
    });
    
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('resetToken');
      if (token !== null) {
        this.resetToken = token;
     }
    }); 
  }

  password:string;
  confirmPassword:string;
  resetToken: string | null = null;

  constructor(private router: Router,private route: ActivatedRoute,private fb: FormBuilder,private resetPassService:ResetPassService,private msgService: MessageService){}

  resetPassword(){
    if (this.resetToken !== null){
      this.resetPassService.resetPass(this.resetToken,this.password,this.confirmPassword).subscribe(
        response => {
         this.msgService.add({
           severity: 'success',
           summary: 'Success',
           detail: 'Password reset successfully'
         });

         this.router.navigateByUrl('/login');
       },
       error => {
        console.error(error)
         this.msgService.add({
           severity: 'error',
           summary: 'Error',
           detail: 'Something went wrong'
         });
       }

     );
  }
    
  else{
      console.log("Reset token is null")
  }
  }

  visibleP:boolean=true;
  changetypeP:boolean=true;

  viewPasswordP(){
    this.visibleP =!this.visibleP;
    this.changetypeP =!this.changetypeP;
  }

  visibleC:boolean=true;
  changetypeC:boolean=true;

  viewPasswordC(){
    this.visibleC =!this.visibleC;
    this.changetypeC =!this.changetypeC;
  }

}
