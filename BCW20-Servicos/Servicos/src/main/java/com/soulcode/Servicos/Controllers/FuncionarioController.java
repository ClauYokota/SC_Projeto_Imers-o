package com.soulcode.Servicos.Controllers;

import com.soulcode.Servicos.Models.Funcionario;
import com.soulcode.Servicos.Services.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("servicos")
public class FuncionarioController {

    @Autowired
    FuncionarioService funcionarioService;

    @GetMapping("/funcionarios")
    public List<Funcionario> mostrarTodosFuncionarios(){
        List<Funcionario> funcionarios = funcionarioService.mostrarTodosFuncionarios();
        return funcionarios;
    }

    @GetMapping("/funcionarios/{idFuncionario}")
    public ResponseEntity<Funcionario> mostrarUmFuncionarioPeloId(@PathVariable Integer idFuncionario){
        Funcionario funcionario = funcionarioService.mostrarUmFuncionarioPeloId(idFuncionario);
        return ResponseEntity.ok().body(funcionario);
    }

    @GetMapping("/funcionarios/email/{email}")
    public ResponseEntity<Funcionario> mostrarUmFuncionarioPeloEmail(@PathVariable String email){
        Funcionario funcionario = funcionarioService.mostrarUmFuncionarioPeloEmail(email);
        return ResponseEntity.ok().body(funcionario);
    }

    @GetMapping("/funcionarios/cargo/{idCargo}")
    public List<Funcionario> mostrarTodosFuncionariosDeUmCargo(@PathVariable Integer idCargo){
        List<Funcionario> funcionarios = funcionarioService.mostrarTodosFuncionariosDeUmCargo(idCargo);
        return funcionarios;
    }

    @GetMapping("/funcionarios/foto-null")
    public List<Funcionario> mostrarFuncionariosComFotoNula(){
        return funcionarioService.mostrarFuncionariosComFotoNula();
    }

    @GetMapping("/funcionarios/chamados-null")
    public List<Funcionario> funcionariosSemChamado(){
        return funcionarioService.funcionariosSemChamado();
    }

    @GetMapping("/funcionarios/quantidade-cargo/{id_cargo}")
    public  Long qntFuncionariosPeloCargo(@PathVariable Long id_cargo){
        return funcionarioService.qntFuncionariosPeloCargo(id_cargo);
    }

    @GetMapping("/funcionarios/chamados-concluidos/{idFuncionario}")
    public List<List> mostrarQtoFuncRecebeuChamadosConcluidos(@PathVariable Integer idFuncionario){
        List<List> funcs = funcionarioService.mostrarQtoFuncRecebeuChamadosConcluidos(idFuncionario);
        return funcs;
    }

    @PostMapping("/funcionarios/{idCargo}")
    public ResponseEntity<Funcionario> cadastrarFuncionario(@PathVariable Integer idCargo, @RequestBody Funcionario funcionario){
        funcionario = funcionarioService.cadastrarFuncionario(funcionario,idCargo);
        URI novaUri = ServletUriComponentsBuilder.fromCurrentRequest().path("id")
                .buildAndExpand(funcionario.getIdFuncionario()).toUri(); // funcionarios/31
        return ResponseEntity.created(novaUri).body(funcionario);

    }

    @PutMapping("/funcionarios/{idFuncionario}")
    public ResponseEntity<Funcionario> editarFuncionario(@PathVariable Integer idFuncionario,
                                                         @RequestBody Funcionario funcionario){
        funcionario.setIdFuncionario(idFuncionario);
        funcionarioService.editarFuncionario(funcionario);
        return ResponseEntity.ok().body(funcionario);
    }

    @DeleteMapping("/funcionarios/{idFuncionario}")
    public ResponseEntity<Void> excluirFuncionario(@PathVariable Integer idFuncionario){
        funcionarioService.excluirFuncionario(idFuncionario);
        return ResponseEntity.noContent().build();
    }




}
