import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from './services/dashboard.service';
import { Trace } from './services/trace.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
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
  }

  ngOnInit(): void {}

  public refreshPage() {
    window.location.reload();
  }
}
