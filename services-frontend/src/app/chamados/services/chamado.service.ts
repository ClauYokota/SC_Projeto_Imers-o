import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, mergeMap, Observable, tap } from 'rxjs';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Chamado } from '../models/chamado';

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {
  
  private readonly baseUrl: string = 'http://localhost:8080/servicos/chamados'

  atualizarChamadosSub$: BehaviorSubject<boolean>=new BehaviorSubject(true)
  
  constructor(
    private http: HttpClient,
    private storage: AngularFireStorage,
    private funcService:FuncionarioService
  ) { }

  getChamados():Observable<Chamado[]>{
    return this.http.get<Chamado[]>(this.baseUrl)
  }

  getChamadoById(id:number):Observable<Chamado>{
    return this.http.get<Chamado>(`${this.baseUrl}/${id}`)
  }

  deleteChamado(cham:Chamado):Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/${cham.idChamado}`).pipe(
      tap(
        (chamado)=>{
          this.atualizarChamadosSub$.next(true)
        }
      )
    )
  }

  postChamado(cham:Chamado,idCliente:number){
    return this.http.post<Chamado>(`${this.baseUrl}/${idCliente}`, cham)
  }

  putChamado(cham:Chamado){
    return this.http.put<Chamado>(`${this.baseUrl}/${cham.idChamado}`,cham).pipe(
      tap(
        (chamado)=>{
          this.atualizarChamadosSub$.next(true)
        }
      )
    )
  }

  putAtribuirFuncionario(cham:Chamado,idChamado:number,idFuncionario:number){
    return this.http.put<Chamado>(`${this.baseUrl}/funcionario/${idChamado}/${idFuncionario}`,cham).pipe(
      tap(
        ()=>{
          this.atualizarChamadosSub$.next(true)
        }
      )
    )
  }

}
