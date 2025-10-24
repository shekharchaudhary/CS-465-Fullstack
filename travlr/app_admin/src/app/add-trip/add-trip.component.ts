import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent implements OnInit {
  addForm!: FormGroup;
  submitted = false;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) {}

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  get f() { return this.addForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.addForm.invalid) {
      this.message = 'Please correct the highlighted fields.';
      this.addForm.markAllAsTouched();
      return;
    }
    const form = this.addForm.value;
    // Normalize payload types expected by API
    const payload = {
      code: String(form.code || '').trim(),
      name: String(form.name || '').trim(),
      length: String(form.length || '').trim(),
      // Ensure date is ISO string so API parses consistently
      start: form.start ? new Date(form.start).toISOString() : '',
      resort: String(form.resort || '').trim(),
      perPerson: String(form.perPerson || '').trim(),
      image: String(form.image || '').trim(),
      description: String(form.description || '').trim(),
    };

    this.tripService.createTrip(payload as any).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: HttpErrorResponse) => {
        const apiMsg = (err && err.error && (err.error.message || err.error.error)) || '';
        const text = apiMsg || err.message || 'Unknown error';
        this.message = `Error creating trip: ${text}`;
      },
    });
  }
}
