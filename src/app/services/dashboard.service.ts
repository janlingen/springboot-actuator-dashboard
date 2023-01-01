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
        console.log(data);
      });
  }

  createAllTraces(data: any) {}
}
