import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../models/trip';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent {
  @Input() trip!: Trip;
  @Output() deleted = new EventEmitter<string>();
  busy = false;

  constructor(private router: Router, private auth: AuthenticationService, private tripService: TripDataService) {}

  editTrip() {
    if (!this.trip?.code) return;
    localStorage.setItem('tripCode', this.trip.code);
    this.router.navigate(['/edit']);
  }

  canEdit(): boolean { return this.auth.isLoggedIn(); }

  deleteTrip() {
    if (!this.canEdit() || !this.trip?.code || this.busy) return;
    const ok = confirm(`Delete trip "${this.trip.name}"? This cannot be undone.`);
    if (!ok) return;
    this.busy = true;
    this.tripService.deleteTrip(this.trip.code).subscribe({
      next: () => {
        this.deleted.emit(this.trip.code);
        this.busy = false;
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'Unknown error';
        alert(`Failed to delete trip: ${msg}`);
        this.busy = false;
      },
    });
  }
}
