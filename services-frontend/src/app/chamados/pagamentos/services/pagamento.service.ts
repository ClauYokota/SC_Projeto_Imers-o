import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Pagamento } from '../models/pagamento';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  
  private readonly baseUrl: string = 'http://localhost:8080/servicos/pagamentos'
  
  atualizarPagamento$: BehaviorSubject<boolean> = new BehaviorSubject(true)

  constructor(
    private http: HttpClient
  ) { }

  getPagamentos(): Observable<Pagamento[]>{
    return this.http.get<Pagamento[]>(this.baseUrl)
  }

  getPagamentoById(id:number):Observable<Pagamento>{
    return this.http.get<Pagamento>(`${this.baseUrl}/${id}`)
  }

  postPagamento(pag:Pagamento,idChamado:number){
    return this.http.post<Pagamento>(`${this.baseUrl}/${idChamado}`,pag)
  }

  putPagamento(pag:Pagamento){
    return this.http.put<Pagamento>(`${this.baseUrl}/${pag.idPagamento}`,pag).pipe(
      tap((pagamento)=>{
        this.atualizarPagamento$.next(true)
      })
    )
  }
}
