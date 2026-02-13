import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubjectDTO {
  subjectId: string;
  subjectName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddSubjectService {

  private apiUrl = 'http://localhost:8080/api/university/addSubject';

  constructor(private http: HttpClient) {}

  addSubject(subject: SubjectDTO): Observable<any> {
    return this.http.post(this.apiUrl, subject,{ responseType: 'text' });
  }

  getAllSubjects() {
  return this.http.get<any[]>(
    'http://localhost:8080/api/university/getAllSubjects',
    { withCredentials: true }
  );
}

uploadSubjectFile(data: FormData) {
  return this.http.post("http://localhost:8080/api/university/uploadSubjects", data,{withCredentials:true});
}



}
