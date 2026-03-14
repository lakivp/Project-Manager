import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticatedGuard } from './guards/auth.guard';
import { ProjectViewComponent } from './components/project-view/project-view.component';
import { TaskViewComponent } from './components/kanban-board/task-view/task-view.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProjectTableComponent } from './components/project-table/project-table.component';
import { TaskDescriptionComponent } from './components/kanban-board/task-description/task-description.component';
import { UnauthenticatedGuard } from './guards/unauth.guard';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TaskTableComponent } from './components/task-table/task-table.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminGuard } from './guards/admin.guard';
import { GanttComponent } from './components/gantt/gantt.component';
import { UserGuard } from './guards/user.guard';
import { User } from './interfaces/auth';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { ProfileGuard } from './guards/profile.guard';
import { ProjectGuard } from './guards/project.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthenticatedGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate:[AdminGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'projectView/:id',
    component: ProjectViewComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'taskView',
    component: TaskViewComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'taskDescription', //Zadatak 34 nova ruta za taskove.
    component: TaskDescriptionComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'profile/:id/:edit',
    component: ProfileComponent,
    canActivate: [AuthenticatedGuard,ProfileGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'kanban',
    component: TaskViewComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
    canActivate: [UnauthenticatedGuard]
  },
  {
    path: 'accessibility',
    component: AdminPageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  user:User;

  ngOnInit(){

  }
}
