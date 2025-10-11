import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../models/trip';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent {
  @Input() trip!: Trip;

  constructor(private router: Router, private auth: AuthenticationService) {}

  editTrip() {
    if (!this.trip?.code) return;
    localStorage.setItem('tripCode', this.trip.code);
    this.router.navigate(['/edit']);
  }

  canEdit(): boolean { return this.auth.isLoggedIn(); }
}
