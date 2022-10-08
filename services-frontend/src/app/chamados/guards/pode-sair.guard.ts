import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmarSaidaComponent } from '../components/confirmar-saida/confirmar-saida.component';
import { ChamadoComponent } from '../pages/chamado/chamado.component';

@Injectable({
  providedIn: 'root'
})
export class PodeSairGuard implements CanDeactivate<unknown> {
  
  constructor(
    private dialog: MatDialog
  ){}

  canDeactivate(
    component: ChamadoComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const titulo = component.formChamado.value.titulo
      const descricao = component.formChamado.value.descricao
      const status = component.formChamado.value.status
      const funcionario = component.formChamado.value.funcionario

      if (titulo != component.chamado.titulo || descricao != component.chamado.descricao||  status != component.chamado.status|| funcionario != component.chamado.funcionario?.idFuncionario) {
        const dialogRef = this.dialog.open(ConfirmarSaidaComponent)
  
        const querSair = dialogRef.afterClosed()
  
        return querSair
      } else {
        return true
      }
  }
  
}
