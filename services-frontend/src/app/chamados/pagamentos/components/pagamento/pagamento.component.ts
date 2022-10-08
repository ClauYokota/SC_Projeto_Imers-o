import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmarSaidaComponent } from 'src/app/chamados/components/confirmar-saida/confirmar-saida.component';
import { Pagamento } from '../../models/pagamento';
import { PagamentoService } from '../../services/pagamento.service';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.css'],
})
export class PagamentoComponent implements OnInit {
  pagamento!: Pagamento;

  formPagamento: FormGroup = this.fb.group({
    valor: ['', [Validators.required]],
    formPagamento: ['', [Validators.required]],
    status: ['', [Validators.required]],
  });

  naoEncontrado: boolean = false;
  desabilitar: boolean = true;

  status: string[] = ['LANCADO', 'QUITADO'];

  formaPagamento: string[] = [
    'PIX',
    'Dinheiro',
    'Cartão - Débito',
    'Cartão - Crédito',
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private pagService: PagamentoService,
    private dialogRef: MatDialogRef<PagamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.recuperarPagamento();
  }

  recuperarPagamento(): void {
    this.pagamento = this.data;
    this.pagService.getPagamentoById(this.pagamento.idPagamento).subscribe(
      (pag) => {
        this.pagamento = pag;

        this.formPagamento.setValue({
          valor: this.pagamento.valor,
          formPagamento: this.pagamento.formPagamento,
          status: this.pagamento.status,
        });
        this.valorMudou();
      },
      (erro: HttpErrorResponse) => {
        this.naoEncontrado = erro.status == 404;
      }
    );
  }

  valorMudou() {
    this.formPagamento.valueChanges.subscribe((valores) => {
      this.desabilitar =
        this.formPagamento.invalid ||
        !(
          valores.valor != this.pagamento.valor ||
          valores.formPagamento != this.pagamento.formPagamento ||
          valores.status != this.pagamento.status
        );
    });
  }

  salvarAtualizacoes() {
    const pag: Pagamento = {
      idPagamento: this.pagamento.idPagamento,
      valor: this.formPagamento.value.valor,
      formPagamento: this.formPagamento.value.formPagamento,
      status: this.formPagamento.value.status,
    };

    this.pagService.putPagamento(pag).subscribe((pg: any) => {
      this.snackBar.open('Pagamento atualizado com sucesso', 'Ok', {
        duration: 3000,
      });
      this.dialogRef.close();
      this.recuperarPagamento();
    });
  }

  confirmarSaida() {
    const dialog = this.dialog.open(ConfirmarSaidaComponent);
    dialog.afterClosed().subscribe((boolean) => {
      if (boolean) {
        this.dialog.closeAll();
      }
    });
  }
}
