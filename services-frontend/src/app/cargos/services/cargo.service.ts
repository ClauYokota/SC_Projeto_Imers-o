import { HttpClient } from '@angular/common/http';
import { EmbeddedViewRef, Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Cargo } from '../models/cargo';

@Injectable({
  providedIn: 'root',
})
export class CargoService {
  private readonly baseUrl: string = 'http://localhost:8080/servicos/cargos';
  atualizarCargoSub$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private storage: AngularFireStorage
  ) {}

  getCargos(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.baseUrl);
  }

  getCargoById(id: number): Observable<Cargo> {
    return this.http.get<Cargo>(`${this.baseUrl}/${id}`);
  }

  deleteCargo(carg: Cargo): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${carg.idCargo}`).pipe(
      tap((cargo) => {
        this.atualizarCargoSub$.next(true);
      })
    );
  }
  
  postCargo(carg: Cargo) {
    return this.http.post<Cargo>(this.baseUrl, carg);
  }

  putCargo(carg: Cargo) {
    return this.http.put<Cargo>(`${this.baseUrl}/${carg.idCargo}`, carg).pipe(
      tap((cargo) => {
        this.atualizarCargoSub$.next(true);
      })
    )
  }
}
