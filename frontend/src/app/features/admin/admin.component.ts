import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HolidayRequestService } from '../../core/services/holiday-request.service';
import { AuditLog } from '../../core/models/audit-log.model';
import { Notification } from '../../core/models/notification.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  auditLogs$!: Observable<AuditLog[]>;
  notifications$!: Observable<Notification[]>;

  constructor(private readonly holidayRequestService: HolidayRequestService) {}

  ngOnInit(): void {
    this.auditLogs$ = this.holidayRequestService.auditLogs$;
    this.notifications$ = this.holidayRequestService.notifications$;
  }
}
