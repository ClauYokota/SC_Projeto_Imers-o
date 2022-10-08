import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly baseUrl: string = 'http://localhost:8080/servicos/clientes';
  atualizarClienteSub$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private AuthService: AuthService, private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.baseUrl);
  }

  getClientesById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  deleteCliente(client: Cliente): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${client.idCliente}`).pipe(
      tap((client) => {
        this.atualizarClienteSub$.next(true);
      })
    );
  }

  postCliente(client: Cliente) {
    return this.http.post<Cliente>(this.baseUrl, client);
  }

  putCliente(client: Cliente):Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/${client.idCliente}`, client).pipe(
      tap((client) => {
        this.atualizarClienteSub$.next(true);
      })
    );
  }
}
