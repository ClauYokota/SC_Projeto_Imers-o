import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmarSaidaCadastroComponent } from '../components/confirmar-saida-cadastro/confirmar-saida-cadastro.component';
import { ClienteComponent } from '../pages/cliente/cliente.component';

@Injectable({
  providedIn: 'root',
})
export class PodeSairGuard implements CanDeactivate<unknown> {
  constructor(private dialog: MatDialog) {}

  canDeactivate(
    component: ClienteComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const nome = component.formCliente.value.nome;
    const email = component.formCliente.value.email;

    if (nome != component.cliente.nome || email != component.cliente.email) {
      const dialogRef = this.dialog.open(ConfirmarSaidaCadastroComponent);

      const querSair = dialogRef.afterClosed();

      return querSair;
    } else {
      return true;
    }
  }
}
