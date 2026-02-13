import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login';
import { StudentDashboardComponent } from './Components/Dashboard/student-dashboard/student-dashboard';
import { UniversityLayoutComponent } from './Components/Dashboard/university-dashboard/university-layout/university-layout';
import { UniversityHomeComponent } from './Components/Dashboard/university-dashboard/university-home/university-home';
import { UploadCsvComponent } from './Components/Dashboard/university-dashboard/upload-colleges/upload-colleges';
import { AddCollegeComponent } from './Components/add-colleges-component/add-colleges-component';
import { CollegeLayoutComponent } from './Components/Dashboard/college-dashboard/college-layout/college-layout';
import { CollegeHome } from './Components/Dashboard/college-dashboard/college-home/college-home';
import { UploadStudents } from './Components/Dashboard/college-dashboard/upload-students/upload-students';
import { AddStudents } from './Components/Dashboard/college-dashboard/add-students/add-students';
import { UploadRooms } from './Components/Dashboard/college-dashboard/upload-rooms/upload-rooms';
import { SittingPlan } from './Components/Dashboard/college-dashboard/sitting-plan/sitting-plan';
import { AddSubjects } from './Components/Dashboard/university-dashboard/add-subjects/add-subjects';

export const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },


  { path: 'college-dashboard',
    component: CollegeLayoutComponent ,
     children: [
      {path:'home',component:CollegeHome},
      { path: 'uploadStudent', component: UploadStudents },
      {path:'addStudents',component:AddStudents},
      {path:'uploadRooms',component:UploadRooms},
      {path:'sittingPlan',component:SittingPlan},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  
  },

  {
    path: 'university-dashboard',
    component: UniversityLayoutComponent,
    children: [
      { path: 'dashboard', component: UniversityHomeComponent },
      { path: 'addCollege', component: AddCollegeComponent },
      {path:'csv',component:UploadCsvComponent},
      {path:'addSubjects',component:AddSubjects},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }

];
