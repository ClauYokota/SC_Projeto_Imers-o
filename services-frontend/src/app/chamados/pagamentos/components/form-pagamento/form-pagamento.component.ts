import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ConfirmarSaidaCadastroComponent } from 'src/app/chamados/components/confirmar-saida-cadastro/confirmar-saida-cadastro.component';
import { Chamado } from 'src/app/chamados/models/chamado';
import { ChamadoService } from 'src/app/chamados/services/chamado.service';
import { Pagamento } from '../../models/pagamento';
import { PagamentoService } from '../../services/pagamento.service';

@Component({
  selector: 'app-form-pagamento',
  templateUrl: './form-pagamento.component.html',
  styleUrls: ['./form-pagamento.component.css']
})
export class FormPagamentoComponent implements OnInit {

  formPagamento: FormGroup = this.fb.group({
    valor:['',[Validators.required]],
    formPagamento:['',[Validators.required]]
  })
  
  salvandoPagamento:boolean = false
  idChamado!:number
  formaPagamento:string[]=[
    'PIX',
    'Dinheiro',
    'Cartão - Débito',
    'Cartão - Crédito'
  ]

  constructor(
    private pagamentoService: PagamentoService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FormPagamentoComponent>,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private chamadoService:ChamadoService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) { }

  ngOnInit(): void {
    this.idChamado = this.data
  }

  salvar():void{
    this.salvandoPagamento = true
    const p : Pagamento = this.formPagamento.value
    const idCh = this.idChamado
    let obsSalvar$: Observable<any>
    obsSalvar$ = this.pagamentoService.postPagamento(p,idCh)
    obsSalvar$.subscribe(
      (resultado)=>{
        this.snackBar.open(`Pagamento salvo com sucesso!`, 'OK',{duration: 3000, horizontalPosition: 'center', verticalPosition:'bottom'})
            this.dialogRef.close()
      }
    )
  }
  
  confirmarSaida(){
    const dialog = this.dialog.open(ConfirmarSaidaCadastroComponent)
    dialog.afterClosed().subscribe(
      (boolean)=>{
        if (boolean){
        this.dialog.closeAll()
        }
      }
    )
  }

}
