import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { registerables } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { ProjectTableService } from '../../services/project-table.service';
import { AuthIduserService } from '../../services/auth-iduser.service';
import { GetTaskService } from '../../services/get-task.service';
import { SettingsServService } from '../../services/settings-serv.service';
import { TranslateService } from '@ngx-translate/core';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  public high: number;
  public medium: number;
  public low: number;
  public high2: number;
  public medium2: number;
  public low2: number;

  public projects: any[] = [];
  public tasks: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private authIdProjects: AuthIduserService,
    private Set: SettingsServService,
    private translate:TranslateService
  ) {
    this.high = 0;
    this.medium = 0;
    this.low = 0;

    this.high2 = 0;
    this.medium2 = 0;
    this.low2 = 0;
  }
  ctx: any;
  config: any;
  config2: any;
  chartData: number[] = [];
  chartDataLabels: any[] = [];
  segmentColors: string[] = ['red', 'yellow', 'green', 'gray'];
  chart: any;

  thisType: string;
  thisDesc: string;
  thisAnti: string;
  vratiSve() { console.log(this.projects)
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i]['status'] == 1) {
        if (this.projects[i]['prioritet'] == 'High') this.high++;
        else if (this.projects[i]['prioritet'] == 'Low') this.low++;
        else this.medium++;
      }
    }

    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i]['status'] == 1) {
        if (this.tasks[i]['prioritet'] == 'High') this.high2++;
        else if (this.tasks[i]['prioritet'] == 'Low') this.low2++;
        else this.medium2++;
      }
    }
  }

  NapraviChart(h: number, m: number, l: number) {
    this.chartData = [];
    this.chartData.push(h);
    this.chartData.push(m);
    this.chartData.push(l);

    this.konfiguracija();

    try {
      this.ctx = document.getElementById('myChart');
      this.chart = new Chart(this.ctx, this.config);
    } catch {}
    this.ChangeTaskProject();
  }

  boolsheet = false;
  public async ChangeTaskProject() {
    if (this.Set.FunctionForWhenToChangeColor(this.Set.innerColor))
      this.chart.options.plugins.legend.labels.color = 'white';
    else this.chart.options.plugins.legend.labels.color = 'black';
    if (this.boolsheet) {
      this.thisType = this.translate.instant('task'); //Task
      this.thisDesc = this.translate.instant('tasksChart'); //tasks
      this.thisAnti = this.translate.instant('projects'); //Projects
      if (document.getElementsByClassName('settButtonChart')[0])
        (
          document.getElementsByClassName('settButtonChart')[0] as HTMLElement
        ).style.color = 'black';
      if (document.getElementsByClassName('settButtonChart')[0])
        (
          document.getElementsByClassName('settButtonChart')[0] as HTMLElement
        ).style.backgroundColor = 'white';
      if (document.getElementsByClassName('settButtonChart')[1])
        (
          document.getElementsByClassName('settButtonChart')[1] as HTMLElement
        ).style.color = 'white';
      if (document.getElementsByClassName('settButtonChart')[1])
        (
          document.getElementsByClassName('settButtonChart')[1] as HTMLElement
        ).style.backgroundColor = 'black';
      if (this.high2 + this.low2 + this.medium2 != 0) {
        this.chart.data.datasets[0].data[0] = this.high2;
        this.chart.data.datasets[0].data[1] = this.medium2;
        this.chart.data.datasets[0].data[2] = this.low2;
        this.chart.data.datasets[0].backgroundColor = this.segmentColors;
        this.chart.data.labels = this.chartDataLabels;
        this.chart.options.plugins.legend.labels.font.size = 20;
      } else {
        this.chart.data.labels = ['No Priority'];
        this.chart.data.datasets[0].data = [1];
        this.chart.data.datasets[0].backgroundColor = ['gray'];
        this.chart.options.plugins.legend.labels.font.size = 24;
      }
    } else {
      this.thisType = this.translate.instant('project'); //Project
      this.thisDesc = this.translate.instant('projectsChart'); //projects
      this.thisAnti = this.translate.instant('tasks'); //Tasks
      if (document.getElementsByClassName('settButtonChart')[0])
        (
          document.getElementsByClassName('settButtonChart')[0] as HTMLElement
        ).style.color = 'white';
      if (document.getElementsByClassName('settButtonChart')[0])
        (
          document.getElementsByClassName('settButtonChart')[0] as HTMLElement
        ).style.backgroundColor = 'black';
      if (document.getElementsByClassName('settButtonChart')[1])
        (
          document.getElementsByClassName('settButtonChart')[1] as HTMLElement
        ).style.color = 'black';
      if (document.getElementsByClassName('settButtonChart')[1])
        (
          document.getElementsByClassName('settButtonChart')[1] as HTMLElement
        ).style.backgroundColor = 'white';
      if (this.high + this.low + this.medium != 0) {
        (this.chart.data.labels = this.chartDataLabels),
          (this.chart.data.datasets[0].data[0] = this.high);
        this.chart.data.datasets[0].data[1] = this.medium;
        this.chart.data.datasets[0].data[2] = this.low;
        this.chart.data.datasets[0].backgroundColor = this.segmentColors;
        this.chart.options.plugins.legend.labels.font.size = 20;
      } else {
        this.chart.data.labels = ['No Priority'];
        this.chart.data.datasets[0].data = [1];
        this.chart.data.datasets[0].backgroundColor = ['gray'];
        this.chart.options.plugins.legend.labels.font.size = 24;
      }
    }

    this.boolsheet = !this.boolsheet;

    this.chart.update();
    if (this.forThatColor) {
      this.forThatColor = false;
      await this.wait(1);
      if (this.Set.FunctionForWhenToChangeColor(this.Set.innerColor))
        this.chart.options.plugins.legend.labels.color = 'white';
      else this.chart.options.plugins.legend.labels.color = 'black';
      this.chart.update();
    }
  }
  forThatColor = true;
  wait(seconds: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 100); // Convert seconds to milliseconds
    });
  }
  ngOnInit() {
    const userData = this.authService.getUserInfo();

    this.authIdProjects
      .getProjectsById(
        userData[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ]
      )
      .subscribe(
        (data: any[]) => {
          this.projects = data;
          this.authIdProjects.getAllTasks().subscribe((data: any[]) => {
            this.tasks = data;
            this.vratiSve();
            this.chartDataLabels.push('High                      ');
            this.chartDataLabels.push(
              'Medium                                                         '
            );
            this.chartDataLabels.push('Low                       ');
            this.NapraviChart(this.high, this.medium, this.low);
          });

        },
        (error) => {
          console.error('Error fetching projects', error);
        }
      );

  }

  getProjects(data:any){
    console.log("usao");
    this.projects=[...this.projects, data];
    this.vratiSve();
    this.boolsheet=false;
    this.NapraviChart(this.high, this.medium, this.low);
    this.authIdProjects.getAllTasks().subscribe((data: any[]) => {
      this.tasks = data;
      this.vratiSve();
    });
  }

  konfiguracija() {
    this.config = {
      type: 'doughnut',
      options: {
        elements: {
          arc: {
            //borderWidth: 1,  borderColor: 'black'
          },
        },
        plugins: {
          legend: {
            position: 'left',
            labels: {
              display: true,
              usePointStyle: true,
              //pointStyle: 'rect',
              color: 'white',
              borderColor: 'white',
              background: 'red',
              font: {
                size: 20,
              },
              padding: 20,
            },
            layout: {
              padding: {
                left: 1,
                right: 2,
                top: 3,
                bottom: 4,
              },
            },
          },
        },
        datalabels: {
          font: {
            size: 46, // Change the font size here
          },
        },
      },
      data: {
        labels: this.chartDataLabels,
        datasets: [
          {
            label: 'Priority',
            data: this.chartData,
            backgroundColor: this.segmentColors,
            borderColor: 'white',
          },
        ],
      },
    };
  }
}
