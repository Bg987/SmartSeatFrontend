import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs'; // Make sure this is imported
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

  logout(): Observable<any> {
    return this.http.post(
      `${this.url}/auth/logout`,
      {},
      { withCredentials: true, responseType: 'text' }
    ).pipe(
      // 2. Use tap to run your logic without destroying the Observable
      tap({
        next: () => this.clearAndRedirect(),
        error: () => this.clearAndRedirect()
      })
    );
  }  

  clearAndRedirect() {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    sessionStorage.clear();
    window.location.href = '/';
  }

  passwordchange(passwordData: any) {
  return this.http.patch(`${this.BASE}/changePassword`, passwordData, {
    withCredentials: true,
    responseType: 'text' // Since the backend returns ResponseEntity, 'text' helps handle non-JSON strings
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
