import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from "ng-recaptcha";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat/'
import { environment } from 'src/environments/environment';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ConfirmarLogoutComponent } from './components/confirmar-logout/confirmar-logout.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ListarClientesComponent } from './clientes/pages/listar-clientes/listar-clientes.component';



@NgModule({
  declarations: [
    AppComponent,
    ConfirmarLogoutComponent,
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: "6Lc78R0hAAAAAJmXUo_yEiqyvWUcL0CVfsWp4bEL" } as RecaptchaSettings,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
