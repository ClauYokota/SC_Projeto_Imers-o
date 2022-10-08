import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { EnderecoCliente } from '../models/endereco-cliente';

@Injectable({
  providedIn: 'root',
})
export class EnderecoService {
  private readonly baseUrl: string =
    'http://localhost:8080/servicos/endereco-cliente';

  atualizarEnderecoCliente$: BehaviorSubject<boolean> = new BehaviorSubject(
    true
  );

  constructor(
    private http: HttpClient,
    private clienteService: ClienteService
  ) {}

  getEndereco(): Observable<EnderecoCliente[]> {
    return this.http.get<EnderecoCliente[]>(this.baseUrl);
  }

  getEnderecoById(id: number): Observable<EnderecoCliente> {
    return this.http.get<EnderecoCliente>(`${this.baseUrl}/${id}`);
  }

  postEnderecoCliente(idCliente: number, endereco: EnderecoCliente) {
    return this.http.post<EnderecoCliente>(
      `${this.baseUrl}/${idCliente}`,
      endereco
    );
  }

  putEnderecoCliente(endereco: EnderecoCliente): Observable<EnderecoCliente> {
    return this.http
      .put<EnderecoCliente>(`${this.baseUrl}/${endereco.idEndereco}`, endereco)
      .pipe(
        tap((endereco) => {
          this.atualizarEnderecoCliente$.next(true);
        }),
        tap(() => {
          this.clienteService.atualizarClienteSub$.next(true);
        })
      );
  }
}
