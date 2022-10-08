import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Funcionario } from 'src/app/funcionarios/models/funcionario';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { ConfirmarDelecaoComponent } from '../../components/confirmar-delecao/confirmar-delecao.component';
import { Chamado } from '../../models/chamado';
import { PagamentoService } from '../../pagamentos/services/pagamento.service';
import { ChamadoService } from '../../services/chamado.service';

@Component({
  selector: 'app-chamado',
  templateUrl: './chamado.component.html',
  styleUrls: ['./chamado.component.css']
})
export class ChamadoComponent implements OnInit {

  chamado!: Chamado

  formChamado: FormGroup = this.fb.group({
    titulo: ['', [Validators.required]],
    descricao: [''],
    status: ['', [Validators.required]],
    funcionario: [''],
    
  })

  desabilitar: boolean = true
  naoEncontrado: boolean = false
  funcionarios: Funcionario[] = []
  status:string[]=[
    'RECEBIDO',
    'ATRIBUIDO',
    'CONCLUIDO',
    'ARQUIVADO'
  ]

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private chamadoService: ChamadoService,
    private funcService: FuncionarioService

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params)=>{
        let idChamado = parseInt(params.get('idChamado')??'0')
        this.recuperarChamado(idChamado)
      }
    )
    this.mostrarFuncionarios()
  }

  recuperarChamado(id: number): void {
    this.chamadoService.getChamadoById(id).subscribe(
      cham => {
        this.chamado = cham

        this.formChamado.setValue({
          titulo: this.chamado.titulo,
          descricao: this.chamado.descricao,
          status: this.chamado.status,
          funcionario: this.chamado.funcionario?.idFuncionario??null,
          
        })
        this.valorMudou()
      },
      (erro: HttpErrorResponse) => {
        this.naoEncontrado = erro.status == 404
      }
    )
  }

  valorMudou() {
    this.formChamado.valueChanges.subscribe(
      (valores) => {
        this.desabilitar = this.formChamado.invalid || !(valores.titulo != this.chamado.titulo || valores.descricao != this.chamado.descricao ||  valores.status != this.chamado.status || valores.funcionario != this.chamado.funcionario?.idFuncionario)
      }
    )
  }

  salvarAtualizacoes() {
    const ch: Chamado = {
      ...this.formChamado.value
    }
    const idFuncionario = this.formChamado.value.funcionario
    ch.idChamado = this.chamado.idChamado
    
    if(idFuncionario){

    this.funcService.getFuncionarioById(idFuncionario).subscribe(
      (resposta)=>{
        ch.funcionario = resposta

        const obsSalvar: Observable<any> = this.chamadoService.putChamado(ch)
        
        obsSalvar.subscribe(
          (resultado)=>{
            this.snackBar.open('Chamado atualizado com sucesso', 'Ok', {
              duration: 3000
            })

            this.recuperarChamado(resultado.idChamado)
          }
        )
      }
    )
    }else{
    const obsSalvar: Observable<any> = this.chamadoService.putChamado(ch)
        
        obsSalvar.subscribe(
          (resultado)=>{
            this.snackBar.open('Chamado atualizado com sucesso', 'Ok', {
              duration: 3000
            })

            this.recuperarChamado(resultado.idChamado)
          }
        )
    }
  }

  deletar(): void {
    this.dialog.open(ConfirmarDelecaoComponent).afterClosed().subscribe(
      (deletar) => {
        if (deletar) {
          this.chamadoService.deleteChamado(this.chamado).subscribe(
            () => {
              this.snackBar.open('Chamado deletado', 'Ok', {
                duration: 3000
              })

              this.router.navigateByUrl('/chamados')
            }
          )
        }
      }
    )
  }

  mostrarFuncionarios(){
    this.funcService.getFuncionarios().subscribe(
      (funcionario)=>{
        this.funcionarios = funcionario
      }
    )
  }

}
