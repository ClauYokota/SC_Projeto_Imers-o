package com.soulcode.Servicos.Services;

import com.soulcode.Servicos.Models.Chamado;
import com.soulcode.Servicos.Models.Cliente;
import com.soulcode.Servicos.Models.Funcionario;
import com.soulcode.Servicos.Models.StatusChamado;
import com.soulcode.Servicos.Repositories.ChamadoRepository;
import com.soulcode.Servicos.Repositories.ClienteRepository;
import com.soulcode.Servicos.Repositories.FuncionarioRepository;
import com.soulcode.Servicos.Services.Exceptions.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ChamadoService {

    @Autowired
    ChamadoRepository chamadoRepository;

    @Autowired
    ClienteRepository clienteRepository;

    @Autowired
    FuncionarioRepository funcionarioRepository;

    @Cacheable("chamadosCache")
    public List<Chamado> mostrarTodosChamados(){
        return chamadoRepository.findAll();	}

    @Cacheable(value = "chamadosCache", key = "#idChamado")
    public Chamado mostrarUmChamado(Integer idChamado) {
        Optional<Chamado> chamado = chamadoRepository.findById(idChamado);
        return chamado.orElseThrow(
                () -> new EntityNotFoundException("Chamado não cadastrado" + idChamado)
        );
    }
    @Cacheable(value = "chamadosCache", key = "'chamado-cliente:'.concat(#idCliente)")
    public List<Chamado> buscarChamadosPeloCliente(Integer idCliente){
        Optional<Cliente> cliente = clienteRepository.findById(idCliente);
        return chamadoRepository.findByCliente(cliente);

    }
    @Cacheable(value = "chamadosCache", key = "'chamado-funcionario:'.concat(#idFuncionario)")
    public List<Chamado> buscarChamadosPeloFuncionario(Integer idFuncionario){
        Optional<Funcionario> funcionario = funcionarioRepository.findById(idFuncionario);
        return chamadoRepository.findByFuncionario(funcionario);
    }
    @Cacheable(value = "chamadosCache", key = "#status")
    public List<Chamado> buscarChamadosPeloStatus(String status){
        return chamadoRepository.findByStatus(status);
    }

    @Cacheable(value = "chamadosCache", key = "#statusPagamento")
    public List<Chamado> findByStatusDoPagamento(String statusPagamento){
        return chamadoRepository.findByStatusDoPagamento(statusPagamento);
    }
    @Cacheable(value = "chamadosCache", key = "'quantidade-chamados-status'")
    public List<List>quantidadeDeChamadosPeloStatus(){
        return chamadoRepository.quantidadeDeChamadosPeloStatus();
    }

    @Cacheable(value = "chamadosCache")
    public List<Chamado> buscarPorIntervaloData(Date data1, Date data2){
        return chamadoRepository.findByIntervaloData(data1,data2);
    }

    @CachePut(value = "chamadosCache", key = "#idCliente")
    public Chamado cadastrarChamado(Chamado chamado, Integer idCliente)throws EntityNotFoundException{
        Optional<Cliente> cliente = clienteRepository.findById(idCliente);
        if (cliente.isPresent()) {
            chamado.setStatus(StatusChamado.RECEBIDO);
            chamado.setFuncionario(null);
            chamado.setCliente(cliente.get());
            return chamadoRepository.save(chamado);
        }else {
            throw new EntityNotFoundException("Não foi possível cadastrar um chamado, cliente não existe.");
        }
    }

    @CachePut(value = "chamadosCache", key = "#idChamado")
    public Chamado editarChamado(Chamado chamado, Integer idChamado){

        Chamado chamadoSemAsNovasAlteracoes = mostrarUmChamado(idChamado);
        chamado.setPagamento(chamadoSemAsNovasAlteracoes.getPagamento());
        chamado.setDataEntrada(chamadoSemAsNovasAlteracoes.getDataEntrada());
        chamado.setCliente(chamadoSemAsNovasAlteracoes.getCliente());
        switch (chamado.getStatus().toString()) {
            case "ATRIBUIDO": {
                chamado.setStatus(StatusChamado.ATRIBUIDO);
                break;
            }
            case "CONCLUIDO": {
                chamado.setStatus(StatusChamado.CONCLUIDO);
                break;
            }
            case "ARQUIVADO": {
                chamado.setStatus(StatusChamado.ARQUIVADO);
                break;
            }
            case "RECEBIDO": {
                chamado.setStatus(StatusChamado.RECEBIDO);
                break;
            }
        }
        return chamadoRepository.save(chamado);
    }


    @CachePut(value = "chamadosCache")
    public Chamado atribuirFuncionario(Integer idChamado, Integer idFuncionario){

        Optional<Funcionario> funcionario = funcionarioRepository.findById(idFuncionario);
        Chamado chamado = mostrarUmChamado(idChamado);
        chamado.setFuncionario(funcionario.get());
        chamado.setStatus(StatusChamado.ATRIBUIDO);

        return chamadoRepository.save(chamado);
    }


    @CacheEvict(value = "chamadosCache",key = "#idChamado" ,allEntries = true)
    public void excluirChamado(Integer idChamado){
        chamadoRepository.deleteById(idChamado);
    }

}
