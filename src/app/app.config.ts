import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './modules/auth/interceptor/auth-interceptor';
import { provideToastr } from '@relynn/ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideToastr(),
     provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    )
  ]
};
