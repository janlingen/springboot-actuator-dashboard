import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from './services/dashboard.service';
import { Trace } from './services/trace.model';
import { Chart } from 'node_modules/chart.js/auto';
import { R3TargetBinder } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  traces: Trace[] = [];
  private tracesChanged: Subscription;
  systemHealth: String = 'DOWN';
  private systemHeatlhChanged: Subscription;
  systemUptime: number = 0;
  private systemUptimeChanged: Subscription;
  systemSpace: number = 0;
  private systemSpaceChanged: Subscription;
  systemCpu: number = 0;
  private systemCpuChanged: Subscription;
  errorOccured: number[] = [0, 0, 0, 0];
  private errorOccuredChanged: Subscription;

  constructor(private dashboardService: DashboardService) {
    this.tracesChanged = this.dashboardService.tracesChanged.subscribe(
      (traces: Trace[]) => (this.traces = traces)
    );
    this.systemHeatlhChanged =
      this.dashboardService.systemHealthChanged.subscribe(
        (systemHeatlh: String) => (this.systemHealth = systemHeatlh)
      );
    this.systemUptimeChanged =
      this.dashboardService.systemUptimeChanged.subscribe(
        (systemUptime: number) => (this.systemUptime = systemUptime)
      );
    this.systemSpaceChanged =
      this.dashboardService.systemSpaceChanged.subscribe(
        (systemSpace: number) => (this.systemSpace = systemSpace)
      );
    this.systemCpuChanged = this.dashboardService.systemCpuChanged.subscribe(
      (systemCpu: number) => (this.systemCpu = systemCpu)
    );
    this.errorOccuredChanged =
      this.dashboardService.errorOccuredChanged.subscribe(
        (errorOccured: number[]) => {
          this.errorOccured = errorOccured;
          this.createBarChart();
        }
      );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.tracesChanged.unsubscribe();
    this.systemHeatlhChanged.unsubscribe();
    this.systemUptimeChanged.unsubscribe();
    this.systemSpaceChanged.unsubscribe();
    this.systemCpuChanged.unsubscribe();
    this.errorOccuredChanged.unsubscribe()
  }

  public createBarChart() {
    new Chart('myBarChart', {
      type: 'bar',
      data: {
        labels: ['200', '400', '404', '500'],
        datasets: [
          {
            label: 'error incidents',
            data: this.errorOccured,
            backgroundColor: ['green', 'red', 'red', 'red'],
          },
        ],
      },
      options: {
        scales: {
          y: { 
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  public refreshPage() {
    window.location.reload();
  }
}
