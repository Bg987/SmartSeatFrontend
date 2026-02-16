import { HttpInterceptorFn, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const http = inject(HttpClient); // Inject HttpClient to call the logout API
  const Url = environment.apiUrl; // Your ngrok URL

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log("Interceptor caught error: ", error);

      if (error.status === 401) {
        // 1. Clear local storage
        localStorage.clear();

        // 2. Call the logout API (withCredentials ensures the ngrok cookie is sent to be cleared)
        http.post(`${Url}/auth/logout`, { 
          withCredentials: true, 
          responseType: 'text'}).subscribe({
            //next: (res) => //console.log("Backend session cleared:", res),
            //error: (err) => //console.error("Backend logout failed", err)
          });

        //Redirect to login
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};