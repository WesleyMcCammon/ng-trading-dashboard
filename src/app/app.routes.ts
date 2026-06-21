import { Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard-component/dashboard-component';
import { SettingsComponent } from './component/settings-component/settings-component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
];
