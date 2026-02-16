import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddStudent {
  
  private url = environment.apiUrl;
  private apiUrl = `${ this.url }/colleges/addStudents`;
  constructor(private http: HttpClient) {}

   addStudent(studentData: any): Observable<any> {
    return this.http.post(this.apiUrl, studentData, {
      responseType: 'text',      // backend String return kar raha hai
      withCredentials: true      //cookie/session send hogi
    });
  }
}
