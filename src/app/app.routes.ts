import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { ModifyPropertiesComponent } from './modify-properties/modify-properties.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  
  { path: 'modify-properties', component: ModifyPropertiesComponent },
  { path: '**', redirectTo: '' },
];