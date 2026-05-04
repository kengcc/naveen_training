import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly navigation = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Requests', path: '/requests' },
    { label: 'Calendar', path: '/calendar' },
    { label: 'Admin', path: '/admin' }
  ];

  constructor(public readonly authService: AuthService) {}
}
