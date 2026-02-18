import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddRoomsService {
  private url = environment.apiUrl;
    private apiUrl = `${ this.url }/colleges/addRooms`;
    private apiUrl2=`${this.url}/colleges/uploadRooms`;

  constructor(private http: HttpClient) { }

  addRoom(room: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, room,
      {
        withCredentials:true
      }
    );
  }


  uploadCSV(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl2}`, formData,
      {withCredentials:true}
    );
  }


}
