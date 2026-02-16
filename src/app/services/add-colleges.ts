import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment  } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CollegeService {

  private url = environment.apiUrl;
  private apiUrl = `${ this.url }/university/addCollege`;
  constructor(private http: HttpClient) {}

   addCollege(collegeData: any): Observable<any> {
    return this.http.post(this.apiUrl, collegeData, {
      //responseType: 'text',      //
      withCredentials: true      //cookie/session send 
    });
  }
}
