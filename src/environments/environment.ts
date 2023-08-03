// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export const environment = {
  production: false,
  skysparkServer: 'http://solid-control.synology.me:3000/skyspark',
  skysparkUrl: 'http://solid-control.synology.me:3000',
  // skysparkServer: 'http://localhost:3000/skyspark',
  // skysparkUrl: 'http://localhost:3000',
  skysparkProject: 'demo',
  startupPage: 'portfolio',
  sidebarLogo: 'assets/img/white_logo_transparent_background.png',
  autologinEnabled: false,
  autologinUser: {
    username: '',
    password: '',
  },
  chartColorsPalette: [
    'rgb(255, 179, 71)', // Yellow
    'rgb(35, 166, 245)', // Light Blue
    'rgb(145, 103, 250)', // Purple
    'rgb(103, 191, 92)', // Green
    'rgb(251, 72, 103)', // Red
    'rgb(245, 166, 35)', // Orange
    'rgb(66, 133, 244)', // Blue
    'rgb(247, 131, 198)', // Pink
    'rgb(100, 181, 246)', // Sky Blue
    'rgb(255, 140, 0)', // Orange-Yellow
  ],
  imports: [StoreDevtoolsModule.instrument()],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
