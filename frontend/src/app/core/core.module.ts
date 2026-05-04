import { NgModule } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HolidayRequestService } from './services/holiday-request.service';

@NgModule({
  providers: [AuthService, HolidayRequestService]
})
export class CoreModule {}
