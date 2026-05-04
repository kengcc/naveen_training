import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

interface LoginCredentials {
  email: string;
  password: string;
}

const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: 'u-100',
    name: 'Nadia Rahman',
    email: 'nadia.rahman@tmrnd.example',
    role: 'employee',
    department: 'Platform',
    password: 'password123'
  },
  {
    id: 'u-200',
    name: 'Farid Ismail',
    email: 'farid.ismail@tmrnd.example',
    role: 'manager',
    department: 'Platform',
    password: 'password123'
  },
  {
    id: 'u-300',
    name: 'Aina Yusuf',
    email: 'aina.yusuf@tmrnd.example',
    role: 'admin',
    department: 'Operations',
    password: 'password123'
  }
];

@Injectable()
export class AuthService {
  private readonly storageKey = 'tm-rd-holiday-planner.user';
  private readonly currentUserSubject = new BehaviorSubject<User | null>(this.readSession());

  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  readonly isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(map((user) => user !== null));

  login(credentials: LoginCredentials): Observable<User> {
    const match = DEMO_USERS.find(
      (user) => user.email === credentials.email && user.password === credentials.password
    );

    if (!match) {
      throw new Error('Invalid email or password');
    }

    const sessionUser = this.toSessionUser(match);
    this.persistSession(sessionUser);
    this.currentUserSubject.next(sessionUser);
    return of(sessionUser);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }

  hasRole(roles: User['role'] | User['role'][]): boolean {
    const user = this.currentUserSubject.value;

    if (!user) {
      return false;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.role);
  }

  getCurrentUserSnapshot(): User | null {
    return this.currentUserSubject.value;
  }

  private readSession(): User | null {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private persistSession(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  private toSessionUser(user: User & { password: string }): User {
    const { password, ...sessionUser } = user;
    return sessionUser;
  }
}
