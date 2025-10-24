import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {
  editForm!: FormGroup;
  submitted = false;
  message = '';
  trip?: Trip;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      alert("Couldn't find a trip to edit.");
      this.router.navigate(['/']);
      return;
    }

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [{ value: tripCode, disabled: true }, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value) => {
        this.trip = value;
        // Patch values; for date, keep as-is or let user reselect
        const { code, ...rest } = value as any;
        this.editForm.patchValue(rest);
      },
      error: (err) => (this.message = 'Error loading trip: ' + (err?.message || err)),
    });
  }

  get f() { return this.editForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.editForm.invalid || !this.trip) return;
    const payload: Trip = {
      ...this.trip,
      ...this.editForm.getRawValue(),
      code: this.trip.code,
    } as Trip;
    this.tripDataService.updateTrip(payload).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => (this.message = 'Error updating trip: ' + (err?.message || err)),
    });
  }
}
