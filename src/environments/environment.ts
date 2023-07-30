// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export const environment = {
  production: false,
  // skysparkServer: 'http://solid-control.synology.me:3000/skyspark',
  // skysparkUrl: 'http://solid-control.synology.me:3000',
  skysparkServer: 'http://localhost:3000/skyspark',
  skysparkUrl: 'http://localhost:3000',
  skysparkProject: 'demo',
  startupPage: 'portfolio',
  sidebarLogo: 'assets/img/white_logo_transparent_background.png',
  autologinEnabled: false,
  autologinUser: {
    username: '',
    password: '',
  },
  chartColorsPalette: [
    'rgb(248, 248, 248)', // Off-white
    'rgb(57, 107, 159)', // Darker steel blue
    'rgb(51, 51, 51)', // Charcoal
    'rgb(89, 161, 79)', // Nice green
    'rgb(255,215,0)',
    'rgb(78, 121, 167)',
    'rgb(242, 142, 44)',
    'rgb(225, 87, 89)',
    'rgb(118, 183, 178)',
    'rgb(89, 161, 79)',
    'rgb(237, 201, 73)',
    'rgb(175, 122, 161)',
    'rgb(255, 157, 167)',
    'rgb(156, 117, 95)',
    'rgb(186, 176, 171)',
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
