// result.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private resultUrl = `${environment.apiUrl2}`;
  private studentUrl = `${environment.apiUrl}/student`;

  constructor(private http: HttpClient) {}

  // 1. Fetch exams the student has finished
  getCompletedExams(): Observable<any[]> {
      return this.http.get<any[]>(`${this.studentUrl}/getStudentComplteExam`, {
        withCredentials : true,
    });
  }

  // 2. Fetch specific marks for a selected exam
  getExamResult(examId: string): Observable<any> {
      return this.http.get<any>(`${this.resultUrl}/exam/review/${examId}`, {
        withCredentials : true,
    });
  }
}