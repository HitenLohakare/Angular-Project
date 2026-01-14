import {ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BaseContextService } from './core/services/base-context.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';



export const appConfig: ApplicationConfig = {
  
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideAppInitializer(async () => {
      const baseContext = inject(BaseContextService);
      await Promise.all([
      
      ]);
    }),
    provideHttpClient(withInterceptorsFromDi()),
  
  ]
};
