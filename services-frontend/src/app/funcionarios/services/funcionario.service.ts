import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable, tap } from 'rxjs';
import { Funcionario } from '../models/funcionario';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private readonly baseUrl: string = 'http://localhost:8080/servicos/funcionarios'
  atualizarFuncionariosSub$: BehaviorSubject<boolean> = new BehaviorSubject(true)

  constructor(
    private http: HttpClient,
    private storage: AngularFireStorage, 
    private authService: AuthService
  ) { }

  getFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.baseUrl)
  }


  deleteFuncionario(func: Funcionario): Observable<any> {
 
    if (func.foto!=null && func.foto.length>0){

      this.storage.refFromURL(func.foto).delete().pipe( 

        mergeMap(()=> { 
          
          return this.http.delete<any>(`${this.baseUrl}/${func.idFuncionario}`)

        }),
        tap((funcionario)=>{

          this.atualizarFuncionariosSub$.next(true)

        })
      )
    }
    return this.http.delete<any>(`${this.baseUrl}/${func.idFuncionario}`).pipe(

      tap((funcionario)=>{

        this.atualizarFuncionariosSub$.next(true)

      })
    )
  }

  getFuncionarioById(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.baseUrl}/${id}`)
  }


  salvarFuncionario(func: Funcionario,idCargo:number, foto?: File) {
   
    if (foto == undefined) { 
      return this.http.post<Funcionario>(`${this.baseUrl}/${idCargo}`, func)
    }

    return this.http.post<Funcionario>(`${this.baseUrl}/${idCargo}`, func)
    .pipe(
      map(async (func) => {
  
        const linkFotoFirebase = await this.uploadImagem(foto)

        func.foto = linkFotoFirebase

        return this.atualizarFuncionario(func)
      })
    )
  }

  atualizarFuncionario(func: Funcionario, foto?: File): any {

    if (foto == undefined) {
      return this.http.put<Funcionario>(`${this.baseUrl}/${func.idFuncionario}`, func)
      .pipe(
        tap((funcionario) => {
          this.atualizarFuncionariosSub$.next(true)
        })
      )
    }

    if (func.foto.length > 0) {
      const inscricao = this.storage.refFromURL(func.foto).delete()
      .subscribe(
        () => {
          inscricao.unsubscribe()
        }
      )
    }

    return this.http.put<Funcionario>(`${this.baseUrl}/${func.idFuncionario}`, func).pipe(
      mergeMap(async (funcionarioAtualizado) => {
        const linkFotoFirebase = await this.uploadImagem(foto)

        funcionarioAtualizado.foto = linkFotoFirebase

        return this.atualizarFuncionario(funcionarioAtualizado)
      }),
      tap((funcionario) => {
        this.atualizarFuncionariosSub$.next(true)
      })
    )
  }

  private async uploadImagem(foto: File): Promise<string> {

    const nomeDoArquivo = Date.now() 

    const dados = await this.storage.upload(`${nomeDoArquivo}`, foto)

    const downloadURL = await dados.ref.getDownloadURL() 

    return downloadURL
  }
}
