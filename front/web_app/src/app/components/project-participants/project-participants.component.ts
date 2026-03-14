import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../environments/evnironment';
import { ProjectParticipantsService } from '../../services/project-participants.service';
import { ActivatedRoute } from '@angular/router';
import { GetTaskService } from '../../services/get-task.service';
import { SettingsServService } from '../../services/settings-serv.service';

@Component({
  selector: 'app-project-participants',
  templateUrl: './project-participants.component.html',
  styleUrl: './project-participants.component.css'
})
export class ProjectParticipantsComponent {
  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();
  participants: any[] = [];
  projectId: number;
  constructor(private http: HttpClient,
     private projectParticipantsService: ProjectParticipantsService,
      private route: ActivatedRoute,
       private getTskPic: GetTaskService,
       public set: SettingsServService
      ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
    });
    this.getParticipants();
  }

  close() {
    console.log("ovd");
    this.closeModal.emit();
  }

  getParticipants(): void {
    this.projectParticipantsService.getData(this.projectId).subscribe(
      (data) => {
        this.participants = data;
        for (let i = 0; i < this.participants.length; i++)
        {
          this.getTskPic.getPictureOfUser(this.participants[i]['username']).subscribe((data2) => {
            this.participants[i]["slika"] = this.getTskPic.decodeMethod(data2);
            this.set.getSettingsById(this.participants[i]['id']).subscribe(
              (datRar)=>{
                this.participants[i]['status']=this.set.ColorStatusReturn(datRar[0]['status'])
                
              }
            )
          })          
        }
      },
      (error) => {
        console.error('Error fetching participants:', error);
      }
    );
  }

}
