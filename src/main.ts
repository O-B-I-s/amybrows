import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
window.addEventListener('error', (event) => {
  if (!(event.error instanceof Error)) {
    console.warn('Non-Error thrown:', event.error);
  }
});
