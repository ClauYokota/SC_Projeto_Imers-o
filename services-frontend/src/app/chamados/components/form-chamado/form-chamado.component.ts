import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/clientes/models/cliente';
import { ClienteService } from 'src/app/clientes/services/cliente.service';
import { Chamado } from '../../models/chamado';
import { ChamadoService } from '../../services/chamado.service';
import { ConfirmarSaidaCadastroComponent } from '../confirmar-saida-cadastro/confirmar-saida-cadastro.component';

@Component({
  selector: 'app-form-chamado',
  templateUrl: './form-chamado.component.html',
  styleUrls: ['./form-chamado.component.css']
})
export class FormChamadoComponent implements OnInit {

  formChamado: FormGroup = this.fb.group({
    titulo:['',[Validators.required]],
    descricao:['',[Validators.required]],
    dataEntrada:['',[Validators.required]],
    cliente:['',[Validators.required]]
  })

  salvandoChamado: boolean = false
  clientes: Cliente[]=[]
  
  constructor(
    private fb: FormBuilder,
    private chamadoService: ChamadoService,
    private dialogRef: MatDialogRef<FormChamadoComponent>,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private clienteService:ClienteService
  ) { }

  ngOnInit(): void {
    this.mostrarClientes()
  }

  salvar():void{
    this.salvandoChamado = true
    const ch: Chamado = this.formChamado.value
    const idCliente: number = this.formChamado.value.cliente.idCliente
    let obsSalvar$: Observable<any>

    obsSalvar$ = this.chamadoService.postChamado(ch,idCliente)

    obsSalvar$.subscribe(
      (resultado)=>{
        this.snackBar.open(`Chamado salvo com sucesso!`, 'OK',{duration: 3000, horizontalPosition: 'center', verticalPosition:'bottom'})
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
  mostrarClientes(){
    this.clienteService.getClientes().subscribe(
      (cliente)=>{
        this.clientes = cliente
      }
    )
  }

}
