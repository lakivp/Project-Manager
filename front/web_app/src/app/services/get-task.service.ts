import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/evnironment';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class GetTaskService {

  private apiUrl: any;  
  baseUrl = `${environment.apiUrl}/Task`;

  private taskUrl = `${this.baseUrl}/Add`;
  private taskUrl23 = `${this.baseUrl}/Update`;
  private clos = `${this.baseUrl}/Close`;
  private open = `${this.baseUrl}/Open`;
  private taskAddUrl = `${this.baseUrl}/AddTaskMember`;
  private commentAdd=`${environment.apiUrl}/Komentar/AddComment`

  constructor(private http: HttpClient,private jwtHelper:JwtHelperService)
  { 
    
  }
  getUserTasks(id:any): Observable<any[]> {
    this.apiUrl = environment.apiUrl + '/Task/UserTasks'+id;
    return this.http.get<any[]>(this.apiUrl);
  }
  getTask(id:string): Observable<any[]> {
    this.apiUrl = environment.apiUrl + '/Task/Get'+id;
    return this.http.get<any[]>(this.apiUrl);
  }
  getTaskAsignUsers(id:string){
    this.apiUrl = environment.apiUrl + '/Task/TaskMembers'+id;
    return this.http.get<any[]>(this.apiUrl);
  }
  getUsernameFromToken():string | null{
    const token = sessionStorage.getItem('jwt');
    if(token)
    {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      return name || null;
    }
    else 
      return null;
  }
  getProject(id:string){
    this.apiUrl = environment.apiUrl + '/Projekat/Get'+id;
    return this.http.get<any[]>(this.apiUrl);
  }

  getProjectMembers(id:string){
    this.apiUrl = environment.apiUrl + '/Projekat/UsersOnProject'+id;
    return this.http.get<any[]>(this.apiUrl);
  } 


  getLabels(){
    this.apiUrl = environment.apiUrl + '/Label/GetLabels';
    return this.http.get<any[]>(this.apiUrl);
  }

  getTasksOfProject(id:string){
    this.apiUrl = environment.apiUrl + '/Task/ProjectTasks'+id;
    return this.http.get<any[]>(this.apiUrl);
  }
  CreateTask(ime: string, op:string, prioritet: string, pocetak: string, kraj: string, idPar:string,IdPro:string,idLab:string): Observable<string> {
    let payload = {
      id: 0,
      naziv: ime,
      opis: op,
      prioritet: prioritet,
      pocetak: pocetak,
      kraj: kraj,
      idParent: idPar,
      idProjekat: IdPro,
      idLabel: idLab,
      status: 1,
    };

    return this.http.post(this.taskUrl, payload, { responseType: 'text' });
  }
  AddTaskMembers(ime: string, task:string){    
      let payload = {
      taskId: task,
      korisnikId: ime,
    };

    return this.http.post(this.taskAddUrl, payload, { responseType: 'text' });
  }
  getAllIds(): Observable<any[]> {
    let apiUrl = environment.apiUrl + '/Korisnik/GetAll'
    return this.http.get<any[]>(apiUrl);
  }

  getLabelName(id:any){
    this.apiUrl = environment.apiUrl + '/Label/GetLabelById'+id;
    return this.http.get<any[]>(this.apiUrl);
  }
  getPictureOfUser(user:string){
    let apiUrl = environment.apiUrl + '/Image/user/'+user+'/image';
    return this.http.get<any[]>(apiUrl);
  }
  decodeMethod(pictureJson: any){
    const base64String = pictureJson['fileContents'];
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
  }
  updateTask(id:any,naziv:any,opis:any,pri:any,poc:any,kraj:any,par:any,pro:any,lab:any,stat:any){
    let payload = {
    "id": id,
    "naziv": naziv,
    "opis": opis,
    "prioritet": pri,
    "pocetak": poc,
    "kraj": kraj,
    "idParent": par,
    "idProjekat": pro,
    "idLabel": lab,
    "status": stat
    }
    return this.http.put(this.taskUrl23, payload, { responseType: 'text' });
}
  closeTask(id:any){
    let payload = {

    }
    return this.http.put(this.clos+"?id="+id, payload, { responseType: 'text' });

  }
  openTask(id:any){
    let payload = {

    }
    return this.http.put(this.open+"?id="+id, payload, { responseType: 'text' });

  }
  getComments(id:string,idUser:any){
    this.apiUrl = environment.apiUrl + '/Komentar/GetCommentsByTaskId?taskId='+id+'&userId='+idUser;
    return this.http.get<any[]>(this.apiUrl);
  } 
  getrepliesComments(id:string,idUser:any){
    this.apiUrl = environment.apiUrl + '/Komentar/GetRepliesOnComment?parentId='+id+'&userId='+idUser;
    return this.http.get<any[]>(this.apiUrl);
  } 
  postComment(text:any,autor:any,task:any,par:any)
  {
    let payload = {
      text: text,
      autorId: autor,
      taskId: task,
      parentId: par,

    };
    return this.http.post(this.commentAdd, payload, { responseType: 'json' });
  }
  deleteComment(id:any)
  {
    this.apiUrl = environment.apiUrl + '/Komentar/DeleteComment'+id;
    return this.http.delete<any[]>(this.apiUrl);
  }
  updateComment(id:any,com:any)
  {
    let payload = {
      "id": id,
      "text": com,
      }
    this.apiUrl = environment.apiUrl + '/Komentar/UpdateComment'
    return this.http.put(this.apiUrl, payload, { responseType: 'text' });
  } 
  ToogleLike(kom: any, kor:any){    
    let payload = {
    };
    this.apiUrl = environment.apiUrl + '/Komentar/LikeCommentToggle'
    return this.http.post(this.apiUrl+"?id_komentara="+kom+"&id_korisnika="+kor, payload, { responseType: 'text' });
}
  deleteMember(id:number, member_id:number){
    this.apiUrl = environment.apiUrl +"/Task/RemoveTaskMember?"
    return this.http.post<any[]>(this.apiUrl+"task_id="+id+"&user_id="+member_id,{});
  }

}
