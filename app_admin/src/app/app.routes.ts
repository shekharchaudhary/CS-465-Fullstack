import { Routes } from '@angular/router';
import { TripListingComponent } from './trip-listing/trip-listing.component';
import { AddTripComponent } from './add-trip/add-trip.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: TripListingComponent },
  { path: 'add', component: AddTripComponent },
  { path: 'edit', component: EditTripComponent },
  { path: 'login', component: LoginComponent },
];
