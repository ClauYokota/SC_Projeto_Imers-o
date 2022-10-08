import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { observable, Observable } from 'rxjs';
import { ConfirmarDelecaoClienteComponent } from '../../components/confirmar-delecao-cliente/confirmar-delecao-cliente.component';
import { PostEnderecoComponent } from '../../enderecoClientes/components/post-endereco/post-endereco.component';
import { PutEnderecoComponent } from '../../enderecoClientes/components/put-endereco/put-endereco.component';
import { EnderecoCliente } from '../../enderecoClientes/models/endereco-cliente';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  cliente!: Cliente;

  formCliente: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    
  });

  desabilitar: boolean = true;
  naoEncontrado: boolean = false;
  

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let idCliente = parseInt(params.get('idCliente') ?? '0');
      this.recuperarCliente(idCliente);  

    });

      
    
  }

  

  recuperarCliente(id: number): void {
    this.clienteService.getClientesById(id).subscribe(
      (client) => {
        this.cliente = client;
        this.formCliente.setValue({
          nome: this.cliente.nome,
          email: this.cliente.email,
          
        });
        this.valorMudou();
      },
      (erro: HttpErrorResponse) => {
        this.naoEncontrado = erro.status == 404;
      }
    );
  }

  valorMudou() {
    this.formCliente.valueChanges.subscribe((valores) => {
      this.desabilitar =
        this.formCliente.invalid ||
        !(
          valores.nome != this.cliente.nome ||
          valores.email != this.cliente.email 
        );
    });
  }

   salvarAtualizacoes() {
    const cl: Cliente = {
      ...this.formCliente.value,
    };
    cl.idCliente = this.cliente.idCliente;

    this.clienteService.putCliente(cl).subscribe((resultado) => {
      this.snackbar.open('Cliente atualizado com sucesso', 'Ok', {
        duration: 3000,
      });
      this.recuperarCliente(resultado.idCliente);
      
    });
  }

  deletar(): void {
    this.dialog
      .open(ConfirmarDelecaoClienteComponent)
      .afterClosed()
      .subscribe((sucesso) => {
        if (sucesso) {
          this.clienteService.deleteCliente(this.cliente).subscribe(() => {
            this.snackbar.open('Cliente deletado', 'Ok', {
              duration: 3000,
            });

            this.router.navigateByUrl('/clientes');
          });
        }
      });
  }



 
}
