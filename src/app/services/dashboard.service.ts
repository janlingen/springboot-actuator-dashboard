import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Trace } from './trace.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  traces: Trace[] = [];
  tracesChanged: Subject<Trace[]> = new Subject();
  systemHealth: String = 'DOWN';
  systemHealthChanged: Subject<String> = new Subject();
  systemUptime: number = 0;
  systemUptimeChanged: Subject<number> = new Subject();
  systemSpace: number = 0;
  systemSpaceChanged: Subject<number> = new Subject();
  systemCpu: number = 0;
  systemCpuChanged: Subject<number> = new Subject();
  errorOccured: number[] = [0, 0, 0, 0];
  errorOccuredChanged: Subject<number[]> = new Subject();

  private SERVER_URL = environment.serverUrl;

  constructor(private httpClient: HttpClient) {
    this.fetchHttpTraces();
    this.fetchSystemHealth();
    this.fetchSystemUptime();
    this.fetchSystemSpace();
    this.fetchSystemCpu();
  }

  private fetchHttpTraces() {
    this.httpClient
      .get(`${this.SERVER_URL}/httptrace`)
      .subscribe((data: any) => {
        if (data != null) {
          this.createAllTraces(data.traces);
          this.tracesChanged.next(this.traces);
        }
      });
  }

  private fetchSystemHealth() {
    this.httpClient.get(`${this.SERVER_URL}/health`).subscribe((data: any) => {
      if (data != null) {
        this.systemHealth = data.status;
        this.systemHealthChanged.next(this.systemHealth);
      }
    });
  }

  private fetchSystemUptime() {
    this.httpClient
      .get(`${this.SERVER_URL}/metrics/process.uptime`)
      .subscribe((data: any) => {
        if (data != null) {
          this.systemUptime = data.measurements[0].value;
          this.systemUptimeChanged.next(this.systemUptime);
        }
      });
  }

  private fetchSystemSpace() {
    this.httpClient
      .get(`${this.SERVER_URL}/metrics/disk.total`)
      .subscribe((data: any) => {
        if (data != null) {
          this.systemSpace = data.measurements[0].value;
          this.systemSpaceChanged.next(this.systemSpace);
        }
      });
  }

  private fetchSystemCpu() {
    this.httpClient
      .get(`${this.SERVER_URL}/metrics/system.cpu.count`)
      .subscribe((data: any) => {
        if (data != null) {
          this.systemCpu = data.measurements[0].value;
          this.systemCpuChanged.next(this.systemCpu);
        }
      });
  }

  private createAllTraces(data: any) {
    for (var trace of data) {
      if (
        !trace.request.uri.includes('http://localhost:8080/actuator/')
      ) {
        this.traces.push(
          new Trace(
            trace.timestamp,
            trace.request.method,
            trace.request.uri,
            trace.response.status,
            trace.timeTaken
          )
        );
        if (trace.response.status == '200') {
          this.errorOccured[0] += 1;
        } else if (trace.response.status == '400') {
          this.errorOccured[1] += 1;
        } else if (trace.response.status == '404') {
          this.errorOccured[2] += 1;
        } else if (trace.response.status == '500') {
          this.errorOccured[3] += 1;
        }
      }
    }
    this.errorOccuredChanged.next(this.errorOccured);
  }
}
