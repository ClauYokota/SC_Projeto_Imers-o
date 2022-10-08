import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { PostEnderecoComponent } from '../../enderecoClientes/components/post-endereco/post-endereco.component';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { ConfirmarSaidaCadastroComponent } from '../confirmar-saida-cadastro/confirmar-saida-cadastro.component';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.css'],
})
export class FormClienteComponent implements OnInit {
  formClientes: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],

    email: ['', [Validators.required, Validators.email]],
  });

  salvandoCliente: boolean = false;
  cliente: Cliente[] = [];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private dialogRef: MatDialogRef<FormClienteComponent>,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  salvar(): void {
    this.salvandoCliente = true;
    const cl: Cliente = this.formClientes.value;
    const idCliente: number = this.formClientes.value.idCliente;
    let obsSalvar$: Observable<any>;

    obsSalvar$ = this.clienteService.postCliente(cl);

    obsSalvar$.subscribe((sucesso) => {
      this.snackbar.open(`Cliente salvo com sucesso!`, 'Ok', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      this.dialogRef.close();
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
  postEndereco(idCliente: number): void {
    console.log(idCliente);

    const dialogRef = this.dialog.open(PostEnderecoComponent, {
      disableClose: true,
      data:idCliente
    });
  }
  
}
