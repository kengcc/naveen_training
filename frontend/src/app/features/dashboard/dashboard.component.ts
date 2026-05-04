import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { HolidayRequestService } from '../../core/services/holiday-request.service';
import { DashboardSummary } from '../../core/models/dashboard-summary.model';
import { HolidayRequest } from '../../core/models/holiday-request.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  summary$!: Observable<DashboardSummary>;
  upcomingRequests$!: Observable<HolidayRequest[]>;
  teamRequests$!: Observable<HolidayRequest[]>;

  constructor(
    private readonly authService: AuthService,
    private readonly holidayRequestService: HolidayRequestService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserSnapshot()?.id ?? 'u-100';
    this.summary$ = this.holidayRequestService.getDashboardSummary(userId);
    this.upcomingRequests$ = this.holidayRequestService.listRequestsForUser(userId);
    this.teamRequests$ = this.holidayRequestService.getTeamAbsences('Platform');
  }
}
