import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { Task } from '../../../../types';
import { Router } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input('task') task: any;
  @Input('type') type: string;
  imageProfileThis:any[]=[];
  constructor(private router: Router, private profileService:ProfileService)
  { 

  }

  ngOnInit(){
    console.log(this.task);
    console.log("korisnici",this.task.korisnici);
    this.task.korisnici.map((korisnik:any)=>{
      if(korisnik){
        this.profileService.getPictureOfUser(korisnik.username).subscribe((data)=>{
          this.imageProfileThis.push(this.profileService.decodeMethod(data));
        });
      }
    })
  }
  clickToTask(x : string) 
  {
    this.router.navigate(['/taskDescription'], { queryParams: { text: x } });
  }
}
