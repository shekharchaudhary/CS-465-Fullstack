import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private tokenKey = 'travlr-token';

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  public getToken(): string | null {
    return this.storage.getItem(this.tokenKey);
  }

  private saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(String(token).split('.')[1] || '')) || {};
      const exp = Number(payload.exp || 0);
      if (!!exp && Date.now() >= exp * 1000) {
        // Token expired
        this.logout();
        return false;
      }
      return true;
    } catch {
      // Corrupt token; clear it
      this.logout();
      return false;
    }
  }

  public logout(): void {
    this.storage.removeItem(this.tokenKey);
  }

  public login(user: User, passwd: string): void {
    this.tripDataService.login(user, passwd).subscribe({
      next: (resp: AuthResponse) => this.saveToken(resp.token),
      error: () => this.logout(),
    });
  }

  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd).subscribe({
      next: (resp: AuthResponse) => this.saveToken(resp.token),
      error: () => this.logout(),
    });
  }
}
