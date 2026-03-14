import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/evnironment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  baseUrl = `${environment.apiUrl}/Dokumentacija/issue-documentation/`;
  constructor(private http:HttpClient) { }

  addFiles(id:any, file:any): Observable<any[]> {
    let formParams = new FormData();

    formParams.append('files', file);

    return this.http.post<any>(
      this.baseUrl + id,
      formParams,
      {
        responseType: 'json',
      }
    );
  }

  getFiles(id:any): Observable<any[]> {
    console.log(this.baseUrl + "get-titles/"+ id);
    return this.http.get<any>(
      this.baseUrl + "get-titles/"+ id,
    );
  }

  downloadFiles(id:number):Observable<Blob> {
    return this.http.get(
      this.baseUrl + id +"/download", { responseType: 'blob' }
    );
  }
}
