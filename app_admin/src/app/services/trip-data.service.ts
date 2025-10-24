import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({ providedIn: 'root' })
export class TripDataService {
  private baseUrl = '/api/trips';

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.baseUrl);
  }

  getTrip(code: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.baseUrl}/${encodeURIComponent(code)}`);
  }

  createTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.baseUrl, trip);
  }

  updateTrip(trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.baseUrl}/${encodeURIComponent(trip.code)}`, trip);
  }

  deleteTrip(code: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${encodeURIComponent(code)}`);
  }

  // Auth API helpers
  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  private handleAuthAPICall(endpoint: string, user: User, passwd: string): Observable<AuthResponse> {
    const formData = { name: user.name, email: user.email, password: passwd };
    return this.http.post<AuthResponse>(`/api/${endpoint}`, formData);
  }
}
