import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { HolidayRequestService } from '../../core/services/holiday-request.service';
import { HolidayRequest } from '../../core/models/holiday-request.model';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  requests$!: Observable<HolidayRequest[]>;
  form = {
    startDate: '',
    endDate: '',
    reason: ''
  };

  constructor(
    private readonly holidayRequestService: HolidayRequestService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserSnapshot()?.id ?? 'u-100';
    this.requests$ = this.holidayRequestService.listRequestsForUser(userId);
  }

  submitRequest(): void {
    const userId = this.authService.getCurrentUserSnapshot()?.id ?? 'u-100';
    this.holidayRequestService.createRequest({
      userId,
      startDate: this.form.startDate,
      endDate: this.form.endDate,
      reason: this.form.reason
    });

    this.form = {
      startDate: '',
      endDate: '',
      reason: ''
    };
    this.requests$ = this.holidayRequestService.listRequestsForUser(userId);
  }
}
