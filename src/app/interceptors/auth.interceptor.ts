import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
          console.log("inter. called " + error);
        localStorage.clear();
          if (error.status === 401 || error.status === 400) {
             // alert("Cookie modified or Deleted Redirect to Login")
                router.navigate(['/login']);  
      }

      return throwError(() => error);
    })
  );
};
