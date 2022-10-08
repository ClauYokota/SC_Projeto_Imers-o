import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    RecaptchaFormsModule,
    RecaptchaModule,
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
