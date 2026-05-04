import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css']
})
export class MetricCardComponent {
  @Input() title = '';
  @Input() value: string | number = 0;
  @Input() caption = '';
  @Input() tone: 'cool' | 'warm' = 'cool';
}
