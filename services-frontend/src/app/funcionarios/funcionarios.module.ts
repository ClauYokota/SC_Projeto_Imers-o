import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuncionariosRoutingModule } from './funcionarios-routing.module';
import { ListarFuncionariosComponent } from './pages/listar-funcionarios/listar-funcionarios.component';
import { MaterialModule } from '../material/material.module';
import { FuncionarioComponent } from './pages/funcionario/funcionario.component';
import { FormFuncionarioComponent } from './components/form-funcionario/form-funcionario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmarDelecaoComponent } from './components/confirmar-delecao/confirmar-delecao.component';
import { ConfirmarSaidaComponent } from './components/confirmar-saida/confirmar-saida.component';
import { ConfirmarSaidaCadastroComponent } from './components/confirmar-saida-cadastro/confirmar-saida-cadastro.component';
import { NavbarModule } from '../components/navbar/navbar.module';


@NgModule({
  declarations: [
    ListarFuncionariosComponent,
    FuncionarioComponent,
    FormFuncionarioComponent,
    ConfirmarDelecaoComponent,
    ConfirmarSaidaComponent,
    ConfirmarSaidaCadastroComponent
  ],
  imports: [
    CommonModule,
    FuncionariosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NavbarModule
  ]
})
export class FuncionariosModule { }
