package com.soulcode.Servicos.Services;

import com.soulcode.Servicos.Models.Chamado;
import com.soulcode.Servicos.Models.Pagamento;
import com.soulcode.Servicos.Models.StatusPagamento;
import com.soulcode.Servicos.Repositories.ChamadoRepository;
import com.soulcode.Servicos.Repositories.PagamentoRepository;
import com.soulcode.Servicos.Services.Exceptions.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PagamentoService {

    @Autowired
    PagamentoRepository pagamentoRepository;

    @Autowired
    ChamadoRepository chamadoRepository;


    public List<Pagamento> mostrarTodosPagamentos(){
        return pagamentoRepository.findAll();
    }


    public Pagamento mostrarPagamentoPeloId(Integer idPagamento){
        Optional<Pagamento> pagamento = pagamentoRepository.findById(idPagamento);
        return pagamento.orElseThrow(
                () -> new EntityNotFoundException("Pagamento não cadastrado: " + idPagamento)
        );
    }


    public List<Pagamento> mostrarPagamentosPeloStatus(String status){
        return pagamentoRepository.findByStatus(status);
    }

    public List<List> quantidadeDePagamentosPeloStatus (){
        return pagamentoRepository.quantidadeDePagamentosPeloStatus();
    }

    public Pagamento cadastrarPagamento(Pagamento pagamento, Integer idChamado) throws EntityNotFoundException{
        Optional<Chamado> chamado = chamadoRepository.findById(idChamado);
        if (chamado.isPresent()){
            pagamento.setIdPagamento(idChamado);
            pagamento.setStatus(StatusPagamento.LANCADO);
            pagamentoRepository.save(pagamento);

            chamado.get().setPagamento(pagamento);
            chamadoRepository.save(chamado.get());
            return pagamento;
        }else{
            throw new EntityNotFoundException("Não foi possível cadastrar o pagamento, chamado não existe!");
        }

    }

    public Pagamento editarPagamento(Pagamento pagamento){
        return pagamentoRepository.save(pagamento);
    }

    public Pagamento modificarStatusPagamento(Integer idPagamento,String status){
        Pagamento pagamento = mostrarPagamentoPeloId(idPagamento);

        switch (status){
            case "LANCADO":
                pagamento.setStatus(StatusPagamento.LANCADO);
                break;
            case "QUITADO":
                pagamento.setStatus(StatusPagamento.QUITADO);
                break;
        }
        return pagamentoRepository.save(pagamento);
    }

    public List<List> orcamentoComServicoCliente(){

        return pagamentoRepository.orcamentoComServicoCliente();
    }
}
