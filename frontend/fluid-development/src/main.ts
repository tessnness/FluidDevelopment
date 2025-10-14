import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { inject as injectVercelAnalytics } from '@vercel/analytics'


// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

injectVercelAnalytics();

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    
  ]
}).catch(err => console.error(err));
