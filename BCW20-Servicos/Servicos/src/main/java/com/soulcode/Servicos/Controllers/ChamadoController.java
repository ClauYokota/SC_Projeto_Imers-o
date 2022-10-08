package com.soulcode.Servicos.Controllers;

import com.soulcode.Servicos.Models.Chamado;
import com.soulcode.Servicos.Services.ChamadoService;
import com.soulcode.Servicos.Services.PagamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Date;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("servicos")
public class ChamadoController {

    @Autowired
    PagamentoService pagamentoService;
    @Autowired
    ChamadoService chamadoService;

    @GetMapping("/chamados")
    public List<Chamado> mostrarTodosChamados(){
        List<Chamado> chamados = chamadoService.mostrarTodosChamados();
        return chamados;
    }

    @GetMapping("/chamados/{idChamado}")
    public ResponseEntity<Chamado> buscarUmChamado(@PathVariable Integer idChamado){
        Chamado chamado  = chamadoService.mostrarUmChamado(idChamado);
        return ResponseEntity.ok().body(chamado);

    }

    @GetMapping("/chamados/clientes/{idCliente}")
    public List<Chamado> buscarChamadosPeloCliente(@PathVariable Integer idCliente){
        List<Chamado> chamados = chamadoService.buscarChamadosPeloCliente(idCliente);
        return chamados;
    }

    @GetMapping("/chamados/funcionarios/{idFuncionario}")
    public List<Chamado> buscarChamadosPeloFuncionario(@PathVariable Integer idFuncionario){
        List<Chamado> chamados = chamadoService.buscarChamadosPeloFuncionario(idFuncionario);
        return chamados;
    }

    @GetMapping("/chamados/status")
    public List<Chamado> buscarChamadosPeloStatus(@RequestParam("status") String status){
        List<Chamado> chamados = chamadoService.buscarChamadosPeloStatus(status);
        return chamados;
    }

    @GetMapping("/chamados/status-pagamento")
    public List<Chamado> findByStatusDoPagamento(@RequestParam("statusPagamento") String statusPagamento){
        List<Chamado> chamados = chamadoService.findByStatusDoPagamento(statusPagamento);
        return chamados;
    }

    @GetMapping("/chamados/quantidade-status")
    public List<List>quantidadeDeChamadosPeloStatus(){
        List<List>chamados = chamadoService.quantidadeDeChamadosPeloStatus();
        return chamados;
    }

    @GetMapping("/chamados/intervalo-data")
    public List<Chamado> buscarPorIntervaloData(@RequestParam("data1") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date data1,
                                                @RequestParam("data2") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date data2){
        List<Chamado> chamados = chamadoService.buscarPorIntervaloData(data1,data2);
        return chamados;
    }

    @PostMapping("/chamados/{idCliente}")
    public ResponseEntity<Chamado> cadastrarChamado(@PathVariable Integer idCliente,
                                                    @RequestBody Chamado chamado){
        chamado = chamadoService.cadastrarChamado(chamado,idCliente);
        URI novaUri = ServletUriComponentsBuilder.fromCurrentRequest().path("{/id}")
                .buildAndExpand(chamado.getIdChamado()).toUri();
        return ResponseEntity.created(novaUri).body(chamado);
    }

    @PutMapping("/chamados/{idChamado}")
    public ResponseEntity<Chamado> editarChamado(@PathVariable Integer idChamado,
                                                 @RequestBody Chamado chamado){
        chamado.setIdChamado(idChamado);
        Chamado cham = chamadoService.editarChamado(chamado, idChamado);
        return ResponseEntity.ok().body(cham);
    }

    @PutMapping("/chamados/funcionario/{idChamado}/{idFuncionario}")
    public ResponseEntity<Chamado> atribuirFuncionario(@PathVariable Integer idChamado,
                                                       @PathVariable Integer idFuncionario){
        Chamado cham = chamadoService.atribuirFuncionario(idChamado, idFuncionario);
        return ResponseEntity.ok().body(cham);
    }


    @DeleteMapping("/chamados/{idChamado}")
    public ResponseEntity<Void> excluirChamado(@PathVariable Integer idChamado){
        chamadoService.excluirChamado(idChamado);
        return ResponseEntity.noContent().build();
    }

}
