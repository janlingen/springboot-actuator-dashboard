import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Trace } from './trace.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  traces: Trace[] = [];

  private SERVER_URL = environment.serverUrl;

  constructor(private httpClient: HttpClient) {}

  public fetchHttpTraces() {
    this.httpClient
      .get(`${this.SERVER_URL}/httptrace`)
      .subscribe((data: any) => {
        if (data != null) {
          this.createAllTraces(data.traces);
        }
      });
  }

  private createAllTraces(data: any) {
    for (var trace of data) {
      this.traces.push(
        new Trace(
          trace.timestamp,
          trace.request.method,
          trace.request.uri,
          trace.response.status,
          trace.timeTaken
        )
      );
    }
  }
}
