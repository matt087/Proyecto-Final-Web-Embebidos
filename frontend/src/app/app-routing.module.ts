import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StudentComponent } from './components/student/student.component';
import { ReportComponent } from './components/report/report.component';
import { AuthGuard } from './auth.guard';
import { AboutComponent } from './components/about/about.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LoginComponent},
  {path: 'list', component: AdminComponent, canActivate:[AuthGuard]},
  {path: 'dashboard', component: StudentComponent},
  {path: 'register', component: RegisterComponent, canActivate:[AuthGuard]},
  {path: 'report', component: ReportComponent, canActivate:[AuthGuard]},

  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
