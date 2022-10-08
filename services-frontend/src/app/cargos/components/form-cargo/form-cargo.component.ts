import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Cargo } from '../../models/cargo';
import { CargoService } from '../../services/cargo.service';
import { ConfirmarSaidaCadastroComponent } from '../confirmar-saida-cadastro/confirmar-saida-cadastro.component';

@Component({
  selector: 'app-form-cargo',
  templateUrl: './form-cargo.component.html',
  styleUrls: ['./form-cargo.component.css']
})
export class FormCargoComponent implements OnInit {

  formCargo: FormGroup = this.fb.group({
    nome:['',[Validators.required]],
    descricao:['',[Validators.required]],
    salario:['',[Validators.required]]
  })

  salvandoCargo: boolean = false

  constructor(
    private fb: FormBuilder,
    private cargoService: CargoService,
    private dialogRef: MatDialogRef<FormCargoComponent>,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  salvar():void{
    this.salvandoCargo = true
    const c: Cargo = this.formCargo.value
    let obsSalvar$: Observable<any>

    obsSalvar$ = this.cargoService.postCargo(c)

    obsSalvar$.subscribe(
      (resultado)=>{
        this.snackBar.open(`Cargo salvo com sucesso!`, 'OK',{duration: 3000, horizontalPosition: 'center', verticalPosition:'bottom'})
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
