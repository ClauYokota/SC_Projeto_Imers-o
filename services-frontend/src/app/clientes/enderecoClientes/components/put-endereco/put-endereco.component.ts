import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, timeout } from 'rxjs';
import { ConfirmarSaidaCadastroComponent } from 'src/app/clientes/components/confirmar-saida-cadastro/confirmar-saida-cadastro.component';
import { Cliente } from 'src/app/clientes/models/cliente';
import { ClienteComponent } from 'src/app/clientes/pages/cliente/cliente.component';
import { ClienteService } from 'src/app/clientes/services/cliente.service';
import { EnderecoCliente } from '../../models/endereco-cliente';
import { EnderecoService } from '../../services/endereco.service';
import { PostEnderecoComponent } from '../post-endereco/post-endereco.component';

@Component({
  selector: 'app-put-endereco',
  templateUrl: './put-endereco.component.html',
  styleUrls: ['./put-endereco.component.css'],
})
export class PutEnderecoComponent implements OnInit {
  endereco!: EnderecoCliente;
  cliente!: Cliente;
  salvandoEndereco: boolean = false;
  desabilitar: boolean = true;
  naoEncontrado: boolean = false;

  formEndereco: FormGroup = this.fb.group({
    rua: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    uf: ['', [Validators.required]],
  });

  constructor(
   
    private fb: FormBuilder,
    private enderecoService: EnderecoService,
    private dialogRef: MatDialogRef<PutEnderecoComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {
    this.endereco = this.data;
    this.recuperarEndereco();
  }

  recuperarEndereco(): void {
    this.enderecoService.getEnderecoById(this.endereco.idEndereco!).subscribe(
      (endereco) => {
        this.endereco = endereco;
        this.formEndereco.setValue({
          rua: this.endereco.rua,
          bairro: this.endereco.bairro,
          cidade: this.endereco.cidade,
          uf: this.endereco.uf,
        });
        this.valorMudou();
      },
      (erro: HttpErrorResponse) => {
        this.naoEncontrado = erro.status == 404;
      }
    );
  }

  valorMudou() {
    this.formEndereco.valueChanges.subscribe((valores) => {
      this.desabilitar =
        this.formEndereco.invalid ||
        !(
          valores.rua != this.endereco.rua ||
          valores.bairro != this.endereco.bairro ||
          valores.cidade != this.endereco.cidade ||
          valores.uf != this.endereco.uf
        );
    });
  }

  salvarAtualizacoes() {
    const ec: EnderecoCliente = {
      ...this.formEndereco.value,
    };
    ec.idEndereco = this.endereco.idEndereco;

    this.enderecoService.putEnderecoCliente(ec).subscribe((resultado) => {
      this.snackbar.open('Endereco atualizado com sucesso', 'Ok', {
        duration: 3000,
      });
      this.dialogRef.close();
      this.recuperarEndereco();
      
    });
  }
}
