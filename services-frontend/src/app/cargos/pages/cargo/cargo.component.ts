import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmarDelecaoCargoComponent } from '../../components/confirmar-delecao-cargo/confirmar-delecao-cargo.component';
import { Cargo } from '../../models/cargo';
import { CargoService } from '../../services/cargo.service';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css'],
})
export class CargoComponent implements OnInit {
  cargo!: Cargo;

  formCargo: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    salario: ['', [Validators.required]],
  });

  desabilitar: boolean = true;
  naoEncontrado: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cargoService: CargoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let idCargo = parseInt(params.get('idCargo') ?? '0');
      this.recuperarCargo(idCargo);
    });
  }

  recuperarCargo(id: number): void {
    this.cargoService.getCargoById(id).subscribe(
      (carg) => {
        this.cargo = carg;

        this.formCargo.setValue({
          nome: this.cargo.nome,
          descricao: this.cargo.descricao,
          salario: this.cargo.salario,
        });
        this.valorMudou();
      },
      (erro: HttpErrorResponse) => {
        this.naoEncontrado = erro.status == 404;
      }
    );
  }

  valorMudou() {
    this.formCargo.valueChanges.subscribe((valores) => {
      this.desabilitar =
        this.formCargo.invalid ||
        !(
          valores.nome != this.cargo.nome ||
          valores.descricao != this.cargo.descricao ||
          valores.salario != this.cargo.salario
        );
    });
  }

  salvarAtualizacoes() {
    const c: Cargo = { ...this.formCargo.value };
    c.idCargo = this.cargo.idCargo;

    this.cargoService.putCargo(c).subscribe((carg:any) => {
      this.snackBar.open('Cargo atualizado com sucesso', 'Ok', {
        duration: 3000
      });
      this.recuperarCargo(carg.idCargo!);
    });
  }

  deletar(): void {
    this.dialog
      .open(ConfirmarDelecaoCargoComponent)
      .afterClosed()
      .subscribe((deletar) => {
        if (deletar) {
          this.cargoService.deleteCargo(this.cargo).subscribe(() => {
            this.snackBar.open('Cargo deletado', 'Ok', {
              duration: 3000,
            });

            this.router.navigateByUrl('/cargos');
          });
        }
      });
  }
}
