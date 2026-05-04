import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StatusPillComponent } from './components/status-pill/status-pill.component';
import { MetricCardComponent } from './components/metric-card/metric-card.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';

@NgModule({
  declarations: [StatusPillComponent, MetricCardComponent, SectionHeaderComponent],
  imports: [CommonModule],
  exports: [CommonModule, StatusPillComponent, MetricCardComponent, SectionHeaderComponent]
})
export class SharedModule {}
