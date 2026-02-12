import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = environment.apiUrl;
  private BASE = `${ this.url }/auth`;

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
