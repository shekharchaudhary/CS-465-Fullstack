import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripDataService } from '../services/trip-data.service';
import { RouterModule } from '@angular/router';
import { Trip } from '../models/trip';
import { TripCardComponent } from '../trip-card/trip-card.component';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent, RouterModule],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css'
})
export class TripListingComponent implements OnInit {
  trips: Trip[] = [];

  constructor(private tripDataService: TripDataService, public auth: AuthenticationService) {}

  ngOnInit(): void {
    this.tripDataService.getTrips().subscribe({
      next: (trips) => (this.trips = trips),
      error: (err) => console.error('Failed to load trips', err),
    });
  }
}
