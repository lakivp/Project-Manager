import { Observable } from 'rxjs';
import { environment } from '../environments/evnironment';
import { User } from '../interfaces/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PFP } from '../interfaces/profilePicture';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  id: number;
  baseUrl = `${environment.apiUrl}/Korisnik`;
  tasksUrl = `${environment.apiUrl}/Task/UserTasks`;
  projectsUrl = `${environment.apiUrl}/Projekat/UserProjects`;
  constructor(private http: HttpClient) { }

  getUserInfo(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/Get' + id, {
      responseType: 'json',
    });
  }

  changeUserInfo(user: any): Observable<User> {
    console.log(user);
    return this.http.put<any>(this.baseUrl + '/UpdateInfo', user, {
      responseType: 'json',
    });
  }

  getUserProjects(id:number){
    return this.http.get<any[]>(this.projectsUrl+id);
  }

  changeUserPfp(id: string, file: File): Observable<PFP> {
    console.log(file);
    let formParams = new FormData();
    formParams.append('imageFile', file);
    return this.http.post<PFP>(
      this.baseUrl + '/upload-profile-image/' + id,
      formParams,
      {
        responseType: 'json',
      }
    );
  }

  getUserTasks(id:number){
    return this.http.get<any[]>(this.tasksUrl+id);
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


}
