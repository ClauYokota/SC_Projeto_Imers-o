import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmarDelecaoClienteComponent } from '../../components/confirmar-delecao-cliente/confirmar-delecao-cliente.component';
import { FormClienteComponent } from '../../components/form-cliente/form-cliente.component';
import { PostEnderecoComponent } from '../../enderecoClientes/components/post-endereco/post-endereco.component';
import { PutEnderecoComponent } from '../../enderecoClientes/components/put-endereco/put-endereco.component';
import { EnderecoCliente } from '../../enderecoClientes/models/endereco-cliente';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { ClienteComponent } from '../cliente/cliente.component';

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.css'],
})
export class ListarClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  colunas: Array<String> = ['id', 'nome', 'email', 'endereco', 'actions'];


  constructor(
    
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
   
  ) {}

  ngOnInit(): void {
    this.clienteService.atualizarClienteSub$.subscribe((precisaAtualizar) => {
      if (precisaAtualizar) {
        this.recuperarClientes();
      }
    });
  }

  recuperarClientes(): void {
    this.clienteService.getClientes().subscribe(
      (clienteList) => {
        this.clientes = clienteList.reverse();
      },
      (erro) => {
        console.log(erro);
      },
      () => {
        console.log('Dados enviados com sucesso');
      }
    );
  }

  deletarCliente(client: Cliente): void {
    const dialogRef = this.dialog.open(ConfirmarDelecaoClienteComponent);

    dialogRef.afterClosed().subscribe((sucesso) => {
      if (sucesso) {
        this.clienteService.deleteCliente(client).subscribe(
          () => {
            this.snackbar.open('Cliente deletado', 'Ok', {
              duration: 3000,
            });
            this.recuperarClientes;
          },
          (error) => {
            this.snackbar.open('Não foi possível deletar o cliente', 'Ok', {
              duration: 3000,
            });
            console.log(error);
          }
        );
      }
    });
  }

  abrirFormCliente(): void {
    const dialogRef = this.dialog.open(FormClienteComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.recuperarClientes();
    });
  }

  postEndereco(idCliente: number): void {
    const dialogRef = this.dialog.open(PostEnderecoComponent, {
      disableClose: true,
      data: idCliente,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.recuperarClientes();
    });
  }

  putEndereco(endereco: EnderecoCliente): void {
    const dialogRef = this.dialog.open(PutEnderecoComponent, {
   
      data: endereco,
     
      
    });
    
    dialogRef.afterClosed().subscribe((sucess) => {
      this.recuperarClientes();
      
      

    });
  }
}
