import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },

    {
        path: '',
        loadComponent: () => import('./auth/auth.component').then((m) => m.AuthComponent),
        children: [
            {path: 'login', loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),},
            {path: 'forgot-password', loadComponent: () => import('./auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),},
            {path: 'change-password', loadComponent: () => import('./auth/change-password/change-password.component').then((m) => m.ChangePasswordComponent),},
            {path: '2fa/verify', loadComponent: () => import('./auth/two-step-verification/two-step-verification.component').then((m) => m.TwoStepVerificationComponent),},
            {path: '2fa/setup', loadComponent: () => import('./auth/two-step-setup/two-step-setup.component').then((m) => m.TwoStepSetupComponent),},
            
        ]
    },
     //Error
          { path: 'error', loadComponent: () => import('./error/error.component').then((m) => m.ErrorComponent,),
              children: [
                { path: '', loadComponent: () => import('./error/error-404/error-404.component').then((m) => m.Error404Component), },
                { path: 'error-404', loadComponent: () => import('./error/error-404/error-404.component').then((m) => m.Error404Component), },
                { path: 'error-500', loadComponent: () => import('./error/error-500/error-500.component').then((m) => m.Error500Component),},
              ],
            },
     {
        path: '',
        loadComponent: () => import('./features/features.component').then((m) => m.FeaturesComponent),
        children:[
            {path: 'index', loadComponent: () => import('./features/main-menu/dashboards/deals-dashboard/deals-dashboard.component').then((m) => m.DealsDashboardComponent),},
            {path: 'lead-dashboard', loadComponent: () => import('./features/main-menu/dashboards/lead-dashboard/lead-dashboard.component').then((m) => m.LeadDashboardComponent),},
            {path: 'project-dashboard', loadComponent: () => import('./features/main-menu/dashboards/project-dashboard/project-dashboard.component').then((m) => m.ProjectDashboardComponent),},
            //layout
             { path: 'layout-mini', loadComponent: () => import('./features/main-menu/dashboards/modal-dashboard/modal-dashboard.component').then((m) => m.ModalDashboardComponent), },
      { path: 'layout-hoverview', loadComponent: () => import('./features/main-menu/dashboards/modal-dashboard/modal-dashboard.component').then((m) => m.ModalDashboardComponent), },
      { path: 'layout-hidden', loadComponent: () => import('./features/main-menu/dashboards/modal-dashboard/modal-dashboard.component').then((m) => m.ModalDashboardComponent), },
      { path: 'layout-fullwidth', loadComponent: () => import('./features/main-menu/dashboards/modal-dashboard/modal-dashboard.component').then((m) => m.ModalDashboardComponent), },
      { path: 'layout-rtl', loadComponent: () => import('./features/main-menu/dashboards/modal-dashboard/modal-dashboard.component').then((m) => m.ModalDashboardComponent), },
      { path: 'layout-dark', loadComponent: () => import('./features/main-menu/dashboards/modal-dashboard/modal-dashboard.component').then((m) => m.ModalDashboardComponent), },
        ],
      },
      
]as const;
