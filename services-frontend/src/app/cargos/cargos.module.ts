import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CargosRoutingModule } from './cargos-routing.module';
import { CargoComponent } from './pages/cargo/cargo.component';
import { ListarCargosComponent } from './pages/listar-cargos/listar-cargos.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarModule } from '../components/navbar/navbar.module';
import { ConfirmarDelecaoCargoComponent } from './components/confirmar-delecao-cargo/confirmar-delecao-cargo.component';
import { FormCargoComponent } from './components/form-cargo/form-cargo.component';
import { ConfirmarSaidaCadastroComponent } from './components/confirmar-saida-cadastro/confirmar-saida-cadastro.component';
import { ConfirmarSaidaComponent } from './components/confirmar-saida/confirmar-saida.component';


@NgModule({
  declarations: [
    CargoComponent,
    ListarCargosComponent,
    ConfirmarDelecaoCargoComponent,
    FormCargoComponent,
    ConfirmarSaidaCadastroComponent,
    ConfirmarSaidaComponent
  ],
  imports: [
    CommonModule,
    CargosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NavbarModule
  ]
})
export class CargosModule { }
