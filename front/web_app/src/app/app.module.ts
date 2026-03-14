import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { ProjectViewComponent } from './components/project-view/project-view.component';
import { TaskViewComponent } from './components/kanban-board/task-view/task-view.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MatIconModule } from '@angular/material/icon';
import { TaskComponent } from './components/kanban-board/task/task.component';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import {
  AccumulationChartModule,
  PieSeriesService,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
} from '@syncfusion/ej2-angular-charts';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MessagesModule } from 'primeng/messages';
import { BodyComponent } from './components/body/body.component';
import { ProjectTableComponent } from './components/project-table/project-table.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { JwtModule, JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { CalendarModule } from 'primeng/calendar';
import { ChartComponent } from './components/chart/chart.component';
import { TaskDescriptionComponent } from './components/kanban-board/task-description/task-description.component';
import { MeterGroupModule } from 'primeng/metergroup';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TaskTableComponent } from './components/task-table/task-table.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { GanttComponent } from './components/gantt/gantt.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ProjectParticipantsComponent } from './components/project-participants/project-participants.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { AddTaskStageComponent } from './components/kanban-board/add-task-stage/add-task-stage.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import {
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { NgToggleModule } from 'ng-toggle-button';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProjectOverviewComponent } from './components/project-overview/project-overview.component';
import { CustomPaginatorIntl } from './components/project-table/custom-paginator-intl';
import {
  LucideAngularModule,
  Calendar,
  CalendarCheck,
  Flame,
  UserRound,
  UsersRound,
  Pencil,
  Text,
  X,
  CirclePlus,
  Trash2,
  Check,
  Pickaxe,
  CircleCheckBig,
  ListFilter,
  ChevronsDownUp,
  ChevronsUpDown,
  FilePenLine,
  FileCheck,
  Expand,
  Minimize,
  Maximize,
  Minimize2,
  TextSearch,
  SquareGanttChart,
  SquareKanban,
  PanelsTopLeft,
  CheckCheck,
  Info,
  Home,
  LayoutList,
  Settings,
  UserCog,
  LogOut,
  ArrowDownWideNarrow,
  Upload,
  Plus,
  File,
  CaseSensitive,
  CopyCheck,
  CalendarFold,
  CalendarClock,
  Clipboard,
} from 'lucide-angular';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { NgxEditorModule } from 'ngx-editor';
import { TextEditorComponent } from './components/project-overview/text-editor/text-editor.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SpeedDialModule } from 'primeng/speeddial';
import { MatDialogModule } from '@angular/material/dialog';
import { AllTasksTableComponent } from './components/all-tasks-table/all-tasks-table.component';
import { CommentsComponent } from './components/comments/comments.component';
import { ToastrModule } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterDialogComponent } from './components/gantt/filter-dialog/filter-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { DndDirective } from './components/directives/dnd.directive';
import { FileUploadService } from './services/file-upload.service';
import { AuthInterceptor } from './auth.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    TaskDescriptionComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProjectViewComponent,
    TaskViewComponent,
    ProfileComponent,
    SettingsComponent,
    TaskComponent,
    NavbarComponent,
    BodyComponent,
    ProjectTableComponent,
    TextInputComponent,
    CalendarComponent,
    TaskTableComponent,
    ResetPasswordComponent,
    GanttComponent,
    NotificationsComponent,
    NotificationsComponent,
    ProjectParticipantsComponent,
    NewTaskComponent,
    ProjectViewComponent,
    NewTaskComponent,
    ProjectViewComponent,
    AddTaskStageComponent,
    AdminPageComponent,
    ProjectOverviewComponent,
    TextEditorComponent,
    AllTasksTableComponent,
    CommentsComponent,
    FilterDialogComponent,
    DndDirective,
  ],
  imports: [
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgxEditorModule,
    SpeedDialModule,
    ConfirmDialogModule,
    MatProgressBarModule,
    MatPaginatorModule,
    ImageCropperModule,
    NgSelectModule,
    ColorPickerModule,
    ProgressBarModule,
    BrowserModule,
    CalendarModule,
    MeterGroupModule,
    AppRoutingModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    HttpClientModule,
    ToastModule,
    BrowserAnimationsModule,
    ImageModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    AccumulationChartModule,
    MessagesModule,
    FormsModule,
    CalendarModule,
    ReactiveFormsModule,
    NgToggleModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    LucideAngularModule.pick({
      Info,
      Calendar,
      CalendarCheck,
      Flame,
      UserRound,
      UsersRound,
      Pencil,
      Text,
      X,
      CirclePlus,
      Trash2,
      Check,
      Pickaxe,
      CircleCheckBig,
      ListFilter,
      ChevronsDownUp,
      ChevronsUpDown,
      FilePenLine,
      FileCheck,
      Expand,
      Minimize2,
      Maximize,
      TextSearch,
      SquareGanttChart,
      SquareKanban,
      PanelsTopLeft,
      CheckCheck,
      Home,
      LayoutList,
      Settings,
      UserCog,
      LogOut,
      ArrowDownWideNarrow,
      Upload,
      Plus,
      File,
      CaseSensitive,
      CopyCheck,
      CalendarFold,
      CalendarClock,
      Clipboard,
    }),
    JwtModule.forRoot({
      // ovo omogucava da se jwt u header-u dodaje automatski kako se to ne bi radilo rucno
      config: {
        tokenGetter: () => sessionStorage.getItem('jwt'),
        allowedDomains: ['localhost:5235', 'softeng.pmf.kg.ac.rs:10161'], // ne radi ako je navedena sema
      },
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    ConfirmationService,
    JwtHelperService,
    HttpClient,
    MessageService,
    AccumulationDataLabelService,
    AccumulationLegendService,
    AccumulationTooltipService,
    PieSeriesService,
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
