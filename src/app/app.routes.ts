import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login';
import { StudentLayout } from './Components/Dashboard/student-dashboard/student-layout/student-layout';
import { StudentHome } from './Components/Dashboard/student-dashboard/student-home/student-home';
import {GetIncompleteExam} from './Components/Dashboard/student-dashboard/get-incomplete-exam/get-incomplete-exam'
import { UniversityLayoutComponent } from './Components/Dashboard/university-dashboard/university-layout/university-layout';
import { UniversityHomeComponent } from './Components/Dashboard/university-dashboard/university-home/university-home';
import { UploadCsvComponent } from './Components/Dashboard/university-dashboard/upload-colleges/upload-colleges';
import { AddCollegeComponent } from './Components/Dashboard/university-dashboard/add-colleges-component/add-colleges-component';
import { CollegeLayoutComponent } from './Components/Dashboard/college-dashboard/college-layout/college-layout';
import { CollegeHome } from './Components/Dashboard/college-dashboard/college-home/college-home';
import { UploadStudents } from './Components/Dashboard/college-dashboard/upload-students/upload-students';
import { AddStudents } from './Components/Dashboard/college-dashboard/add-students/add-students';
import { UploadRooms } from './Components/Dashboard/college-dashboard/upload-rooms/upload-rooms';
import { SittingPlan } from './Components/Dashboard/college-dashboard/sitting-plan/sitting-plan';
import { AddSubjects } from './Components/Dashboard/university-dashboard/add-subjects/add-subjects';
import { AddTimeTable } from './Components/Dashboard/university-dashboard/add-time-table/add-time-table';
import { changePassword } from './Components/change-password/change-password';
import { GetTimetable } from './Components/Dashboard/university-dashboard/get-timetable/get-timetable';
import {UpdateStudentImage} from './Components/Dashboard/college-dashboard/update-student-image/update-student-image'
import { ShowCollegeDetail } from './Components/Dashboard/university-dashboard/show-college-detail/show-college-detail';
import { GetTimeTableCollege } from './Components/Dashboard/college-dashboard/get-time-table-college/get-time-table-college';
import { GenSeatingPlan } from './Components/Dashboard/university-dashboard/gen-seating-plan/gen-seating-plan';
import { ViewSeatingAllocation } from './Components/Dashboard/university-dashboard/view-seating-allocation/view-seating-allocation'
import {QuestionGeneration} from './Components/Dashboard/university-dashboard/question-generation/question-generation'
import { ScheduleExam } from './Components/Dashboard/university-dashboard/schedule-exam/schedule-exam'
import { GetExamPassword } from './Components/Dashboard/college-dashboard/get-exam-password/get-exam-password';
import { StudentResult } from './Components/Dashboard/student-dashboard/student-result/student-result';
import { GenerateResult } from './Components/Dashboard/university-dashboard/generate-result/generate-result';
import {AnalyticsUniveristy} from './Components/Dashboard/university-dashboard/analytics-univeristy/analytics-univeristy'
import {CollegeAnalytics} from './Components/Dashboard/college-dashboard/college-analytics/college-analytics'

export const routes: Routes = [

  { path: '', component: LoginComponent },
  {
    path: 'student-dashboard',
    component: StudentLayout,
    children: [
      { path: '', component: StudentHome },
      { path: 'upcomingExams', component: GetIncompleteExam },
      { path: 'changePassword', component: changePassword },
      { path: 'StudentResult', component: StudentResult },
    ]    
  },
  { path: 'college-dashboard',
    component: CollegeLayoutComponent ,
     children: [
       { path: '', component: CollegeHome },
       { path: 'updateImage', component: UpdateStudentImage },
       { path: 'getPassword', component: GetExamPassword },
      { path: 'changePassword', component: changePassword },
      { path: 'uploadStudent', component: UploadStudents },
      {path:'addStudents',component:AddStudents},
      {path:'uploadRooms',component:UploadRooms},
      {path:'getTimeTable',component:GetTimeTableCollege},
      {path:'sittingPlan',component:SittingPlan},
      {path:'CollegeAnalytics',component:CollegeAnalytics},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  
  },

  {
    path: 'university-dashboard',
    component: UniversityLayoutComponent,
    children: [
      {path:'getTimetable',component:GetTimetable},
      { path: 'changePassword', component: changePassword },
      { path: 'dashboard', component: UniversityHomeComponent },
      { path: 'addCollege', component: AddCollegeComponent },
      { path: 'csv', component: UploadCsvComponent },
      { path: 'scheduleExam', component: ScheduleExam },
      {path:'addSubjects',component:AddSubjects},
      { path: 'addTimeTable', component: AddTimeTable },
      { path: 'genSeatPlan', component: GenSeatingPlan },
      {path:'viewSeatingPlan',component:ViewSeatingAllocation},
      { path: 'college-details/:userId', component: ShowCollegeDetail },
      { path: 'questionGeneration', component: QuestionGeneration },
      {path:'result',component:GenerateResult},
      {path:'analysis',component:AnalyticsUniveristy},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }

];
