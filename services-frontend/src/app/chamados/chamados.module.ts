import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChamadosRoutingModule } from './chamados-routing.module';
import { ListarChamadosComponent } from './pages/listar-chamados/listar-chamados.component';
import { ChamadoComponent } from './pages/chamado/chamado.component';
import { FormChamadoComponent } from './components/form-chamado/form-chamado.component';
import { ConfirmarDelecaoComponent } from './components/confirmar-delecao/confirmar-delecao.component';
import { ConfirmarSaidaCadastroComponent } from './components/confirmar-saida-cadastro/confirmar-saida-cadastro.component';
import { ConfirmarSaidaComponent } from './components/confirmar-saida/confirmar-saida.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarModule } from '../components/navbar/navbar.module';
import { FormPagamentoComponent } from './pagamentos/components/form-pagamento/form-pagamento.component';
import { PagamentoComponent } from './pagamentos/components/pagamento/pagamento.component';
import { AddFuncionarioComponent } from './components/add-funcionario/add-funcionario.component';



@NgModule({
  declarations: [
    ListarChamadosComponent,
    ChamadoComponent,
    FormChamadoComponent,
    ConfirmarDelecaoComponent,
    ConfirmarSaidaCadastroComponent,
    ConfirmarSaidaComponent,
    FormPagamentoComponent,
    PagamentoComponent,
    AddFuncionarioComponent
  ],
  imports: [
    CommonModule,
    ChamadosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NavbarModule
  ]
})
export class ChamadosModule { }
