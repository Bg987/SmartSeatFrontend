import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.BASE}/login`, data, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  checkStudent() {
    return this.http.get(`${this.BASE}/student`, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  checkCollege() {
    return this.http.get(`${this.BASE}/college`, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  checkUniversity() {
    return this.http.get(`${this.BASE}/university`, {
      withCredentials: true,
      responseType: 'text'
    });
  }
}
