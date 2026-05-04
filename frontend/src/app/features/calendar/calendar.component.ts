import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HolidayRequestService } from '../../core/services/holiday-request.service';
import { HolidayRequest } from '../../core/models/holiday-request.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  platformAbsences$!: Observable<HolidayRequest[]>;

  constructor(private readonly holidayRequestService: HolidayRequestService) {}

  ngOnInit(): void {
    this.platformAbsences$ = this.holidayRequestService.getTeamAbsences('Platform');
  }
}
