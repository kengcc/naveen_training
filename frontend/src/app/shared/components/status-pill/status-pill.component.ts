import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-pill',
  templateUrl: './status-pill.component.html',
  styleUrls: ['./status-pill.component.css']
})
export class StatusPillComponent {
  @Input() status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled' | string = 'pending';
}
