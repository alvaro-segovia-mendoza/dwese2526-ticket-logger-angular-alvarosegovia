import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { RegionsComponent } from './features/regions/regions.component';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';
import { Error404Component } from './features/error404/error404.component';
import { authGuard } from './core/guards/auth-guard';
import { RegionDetailComponent } from './features/region-detail/region-detail.component';
import { RegionCreateComponent } from './features/region-create/region-create';
import { RegionEditComponent } from './features/region-edit/region-edit';

export const routes: Routes = [
  {
    path: '', // Ruta inicial
    pathMatch: 'full',
    component: HomeComponent
  },
  { 
    path: 'login', // Página de inicio de sesión
    component: LoginComponent
  },
  { 
    path: 'regions', // Página protegida
    component: RegionsComponent,
    canActivate: [authGuard] // Por el guard
  },
  // Nueva región. /regions/new (antes de /regions/:id para evitar conflicto de rutas)
  {
    path: 'regions/new',
    component: RegionCreateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'regions/:id/edit',
    component: RegionEditComponent,
    canActivate: [authGuard]
  }, // antes del :id para que no lo confunda con "new"
  // Detalle de región: /regions/:id
  {
    path: 'regions/:id',
    component: RegionDetailComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'forbidden', 
    component: ForbiddenComponent
  }, // Página 403
  { 
    path: '**', // Ruta comodín para 404
    component: Error404Component
  },
];
