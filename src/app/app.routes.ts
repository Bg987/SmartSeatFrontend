import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login';
import { StudentDashboardComponent } from './Components/Dashboard/student-dashboard/student-dashboard';
import { CollegeDashboardComponent } from './Components/Dashboard/college-dashboard/college-dashboard';
import { UniversityDashboardComponent } from './Components/Dashboard/university-dashboard/university-dashboard';

export const routes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'college-dashboard', component: CollegeDashboardComponent },
  { path: 'university-dashboard', component: UniversityDashboardComponent }
];
