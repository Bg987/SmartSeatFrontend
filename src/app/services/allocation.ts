// services/allocation.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface ExamSubject {
  id: number;
  subjectId: string;
  subjectName: string;
  examDate: string;
  completed: boolean;
  batchId: string;
  branch: string | null;
  semester: number | null;
  allocated: boolean;
}

@Injectable({ providedIn: 'root' })
export class AllocationService {
  private base = `${environment.apiUrl}/university`;

  constructor(private http: HttpClient) { }

  getIncompleteExams(): Observable<ExamSubject[]> {
    return this.http.get<ExamSubject[]>(`${this.base}/getIncompleteExam`, {
      withCredentials: true
    });
  }

  startAllocation(examId: number | string): Observable<string> {
    const url = `${this.base}/main/${examId}`;
    // We pass null as the body and set responseType to 'text'
    return this.http.post(url, null, {
      responseType: 'text',
      withCredentials: true
     });
  }

  // This is the trigger for allocation
  triggerAllocation(id: number): Observable<string> {
    return this.http.get(`${this.base}/main/${id}`, { responseType: 'text' });
  }
}