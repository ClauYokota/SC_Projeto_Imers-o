import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ConfirmarSaidaCadastroComponent } from 'src/app/clientes/components/confirmar-saida-cadastro/confirmar-saida-cadastro.component';
import { Cliente } from 'src/app/clientes/models/cliente';
import { EnderecoCliente } from '../../models/endereco-cliente';
import { EnderecoService } from '../../services/endereco.service';

@Component({
  selector: 'app-post-endereco',
  templateUrl: './post-endereco.component.html',
  styleUrls: ['./post-endereco.component.css'],
})
export class PostEnderecoComponent implements OnInit {
  formEndereco: FormGroup = this.fb.group({
    rua: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    uf: ['', [Validators.required]],
  });

  endereco!: EnderecoCliente;
  idCliente!: number;
  salvandoEndereco: boolean = false;

  constructor(
    private fb: FormBuilder,
    private enderecoService: EnderecoService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PostEnderecoComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {
    this.idCliente = this.data;
  }

  salvar(): void {
    this.salvandoEndereco = true;

    let obsSalvar$: Observable<any>;

    obsSalvar$ = this.enderecoService.postEnderecoCliente(
      this.idCliente,
      this.formEndereco.value
    );

    obsSalvar$.subscribe((sucesso) => {
      this.snackbar.open(`Cliente salvo com sucesso!`, 'Ok', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      this.dialogRef.afterClosed();
    });
  }

  confirmarSaida():void {
    const dialog = this.dialog.open(ConfirmarSaidaCadastroComponent);
    dialog.afterClosed().subscribe(
      (boolean)=>{
        if(boolean){
          this.dialog.closeAll();
        }
      }
    )
  }
}
