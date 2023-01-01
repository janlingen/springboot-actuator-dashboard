import { Component, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(private dashboardService: DashboardService){}

  ngOnInit(): void {
    this.dashboardService.fetchHttpTraces();
  }
}
