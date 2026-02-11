import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login';
import { StudentDashboardComponent } from './Components/Dashboard/student-dashboard/student-dashboard';
import { CollegeDashboardComponent } from './Components/Dashboard/college-dashboard/college-dashboard';
import { UniversityLayoutComponent } from './Components/Dashboard/university-dashboard/university-layout/university-layout';
import { UniversityHomeComponent } from './Components/Dashboard/university-dashboard/university-home/university-home';
import { AddCollegeComponent } from './Components/add-colleges-component/add-colleges-component';

export const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'college-dashboard', component: CollegeDashboardComponent },

  {
    path: 'university-dashboard',
    component: UniversityLayoutComponent,
    children: [
      { path: 'dashboard', component: UniversityHomeComponent },
      { path: 'addCollege', component: AddCollegeComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }

];
