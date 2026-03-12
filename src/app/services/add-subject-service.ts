import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface SubjectDTO {
  subjectId: string;
  subjectName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddSubjectService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addSubject(subject: SubjectDTO): Observable<any> {
    return this.http.post(`${this.url}/university/addSubject`, subject,{ responseType: 'text',withCredentials:true });
  }

  getAllSubjects() {
  return this.http.get<any[]>(
    `${this.url}/university/getAllSubjects`,
    { withCredentials: true }
  );
}

uploadSubjectFile(data: FormData) {
  return this.http.post(`${this.url}/university/uploadSubjects`, data, {
    withCredentials: true,
  }, );
}



}
