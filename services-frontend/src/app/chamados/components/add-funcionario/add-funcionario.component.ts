import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Funcionario } from 'src/app/funcionarios/models/funcionario';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Chamado } from '../../models/chamado';
import { ChamadoService } from '../../services/chamado.service';
import { FormChamadoComponent } from '../form-chamado/form-chamado.component';

@Component({
  selector: 'app-add-funcionario',
  templateUrl: './add-funcionario.component.html',
  styleUrls: ['./add-funcionario.component.css']
})
export class AddFuncionarioComponent implements OnInit {
  formAddFuncionario: FormGroup = this.fb.group({
    funcionario:['',[Validators.required]]
  })

  salvandoFuncionario: boolean = false
  chamado!:Chamado
  funcionarios: Funcionario[]=[]

  constructor(
    private fb: FormBuilder,
    private chamadoService: ChamadoService,
    private dialogRef: MatDialogRef<FormChamadoComponent>,
    private snackBar: MatSnackBar,
    private funcService: FuncionarioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.mostrarFuncionarios()
    this.chamado=this.data
  }

  salvarFunc():void{
    this.salvandoFuncionario = true
    const cham = this.chamado
    const idCham =this.chamado.idChamado
    const idFuncionario = this.formAddFuncionario.value.funcionario

    let obsSalvar$: Observable<any>

    obsSalvar$ = this.chamadoService.putAtribuirFuncionario(cham, idCham,idFuncionario )

    obsSalvar$.subscribe(
      (resultado)=>{
        this.snackBar.open(`Funcionário atribuído com sucesso!`, 'OK',{duration: 3000, horizontalPosition: 'center', verticalPosition:'bottom'})
            this.dialogRef.close()
      }
    )
  }


  mostrarFuncionarios(){
    this.funcService.getFuncionarios().subscribe(
      (func)=>{
        this.funcionarios = func
      }
    )
  }
}
