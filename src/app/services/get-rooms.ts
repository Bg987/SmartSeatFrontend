import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetRooms{
  private url = environment.apiUrl;
    private apiUrl = `${ this.url }/colleges/rooms`;


  constructor(private http: HttpClient) { }

  getRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}`,
      {
        withCredentials:true
      }
    );
  }


  }



