import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { AddFuncionarioComponent } from '../../components/add-funcionario/add-funcionario.component';
import { ConfirmarDelecaoComponent } from '../../components/confirmar-delecao/confirmar-delecao.component';
import { FormChamadoComponent } from '../../components/form-chamado/form-chamado.component';
import { Chamado } from '../../models/chamado';
import { FormPagamentoComponent } from '../../pagamentos/components/form-pagamento/form-pagamento.component';
import { PagamentoComponent } from '../../pagamentos/components/pagamento/pagamento.component';
import { Pagamento } from '../../pagamentos/models/pagamento';
import { ChamadoService } from '../../services/chamado.service';

@Component({
  selector: 'app-listar-chamados',
  templateUrl: './listar-chamados.component.html',
  styleUrls: ['./listar-chamados.component.css']
})
export class ListarChamadosComponent implements OnInit {
  
  chamados: Chamado[]=[]
  colunas: Array<string> = ['id','titulo','descricao','dataEntrada','status','cliente','funcionario','pagamento','actions']

  constructor(
    private chamService:ChamadoService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.chamService.atualizarChamadosSub$.subscribe(
      (precisaAtualizar)=>{
        if(precisaAtualizar){
          this.recuperarChamados()
        }
      }
    )
  }

  recuperarChamados():void{
    this.chamService.getChamados().subscribe(
      (cham)=>{
        this.chamados = cham.reverse()
      },
      (erro)=>{
        console.log(erro)
      },
      ()=>{
        console.log('Dados enviados com sucesso')
      }
    )
  }

  deletarChamado(cham:Chamado):void{
    const dialogRef = this.dialog.open(ConfirmarDelecaoComponent)

    dialogRef.afterClosed().subscribe(
      (deletar)=>{
        if (deletar){
          this.chamService.deleteChamado(cham).subscribe(
            ()=>{
              this.snackbar.open('Chamado deletado', 'Ok', {
                duration: 3000
              })
              this.recuperarChamados()
            },
            (error)=>{
              this.snackbar.open('Não foi possível deletar esse chamado', 'Ok', {
                duration: 3000
              })
              console.log(error)
            }
          )
        }
      }
    )
  }
  
  abrirFormChamados():void{
    const referenciaDialog = this.dialog.open (FormChamadoComponent, {disableClose:true})
    referenciaDialog.afterClosed().subscribe(
      ()=>{
        this.recuperarChamados()
      }
    )
  }

  abrirFormPagamentos(idChamado:number):void{
    const referenciaDialog = this.dialog.open(FormPagamentoComponent, {
      disableClose:true, 
      data:idChamado })
    referenciaDialog.afterClosed().subscribe(
      ()=>{
        this.recuperarChamados()
      }
    )
  }

  abrirAddFuncionario(chamado:Chamado):void{
    const referenciaDialog = this.dialog.open(AddFuncionarioComponent, { 
      data:chamado})
    referenciaDialog.afterClosed().subscribe(
      ()=>{
        this.recuperarChamados()
      }
    )
  }

  abrirEditarPagamento(pagamento:Pagamento):void{
    const referenciaDialog = this.dialog.open(PagamentoComponent, {data:pagamento})
    referenciaDialog.afterClosed().subscribe(
      ()=>{
        this.recuperarChamados()
      }
    )
  }
}
