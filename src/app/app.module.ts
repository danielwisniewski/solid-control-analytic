import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/interceptor/token.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { appReducer } from './state';
import { TimerangeEffects } from './core/store/timerange/timerange.effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { RouterEffects } from './core/store/router/router.effects';
import { PagesEffects } from './core/store/pages/pages.effects';
import { SitesEffects } from './core/store/sites/sites.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([
      TimerangeEffects,
      RouterEffects,
      PagesEffects,
      SitesEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
