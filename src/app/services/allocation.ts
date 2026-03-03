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
export interface User {
  userId: number;
  name: string;
  mobileNumber: string;
  mail: string;
  role: string;
}
export interface College {
  collegeId: number;
  name: string;
  address: string;
  department: string | null;
  user: User;
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

  getCompleteExams(): Observable<ExamSubject[]> {
    return this.http.get<ExamSubject[]>(`${this.base}/getCompleteExam`, {
      withCredentials: true
    });
  }

  getCollegeDetailsForExam(examId: number): Observable<College[]> {
    return this.http.get<College[]>(`${this.base}/getCollegeDetailsForExam/${examId}`, {
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