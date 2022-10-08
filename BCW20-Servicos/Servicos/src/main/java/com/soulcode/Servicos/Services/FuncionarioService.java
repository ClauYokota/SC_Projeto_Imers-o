package com.soulcode.Servicos.Services;

import com.soulcode.Servicos.Models.Cargo;
import com.soulcode.Servicos.Models.Funcionario;
import com.soulcode.Servicos.Repositories.CargoRepository;
import com.soulcode.Servicos.Repositories.FuncionarioRepository;
import com.soulcode.Servicos.Services.Exceptions.DataIntegrityViolationException;
import com.soulcode.Servicos.Services.Exceptions.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class FuncionarioService {

    @Autowired
    FuncionarioRepository funcionarioRepository;

    @Autowired
    CargoRepository cargoRepository;


    @Cacheable("funcionarioCache")
    public List<Funcionario> mostrarTodosFuncionarios(){

        return funcionarioRepository.findAll();
    }

    @Cacheable(value = "funcionarioCache", key = "#idFuncionario")
    public Funcionario mostrarUmFuncionarioPeloId(Integer idFuncionario)
    {
        Optional<Funcionario> funcionario = funcionarioRepository.findById(idFuncionario);
        return funcionario.orElseThrow(
                () -> new EntityNotFoundException("Funcionário não cadastrado: " + idFuncionario)
        );
    }

    @Cacheable(value = "funcionarioCache", key = "#email")
    public Funcionario mostrarUmFuncionarioPeloEmail(String email){
        Optional<Funcionario> funcionario = funcionarioRepository.findByEmail(email);
        return funcionario.orElseThrow(
                () -> new EntityNotFoundException("Funcionário não cadastrado: " + email)
        );
    }

    @Cacheable(value = "funcionarioCache", key = "'cargo'.concat(#idCargo)")
    public List<Funcionario> mostrarTodosFuncionariosDeUmCargo(Integer idCargo){
        Optional<Cargo> cargo = cargoRepository.findById(idCargo);
        return funcionarioRepository.findByCargo(cargo);
    }

    @Cacheable(value = "funcionarioCache", key = "'foto-null'")
    public List<Funcionario> mostrarFuncionariosComFotoNula(){
        return funcionarioRepository.mostrarFuncionariosComFotoNula();
    }

    @Cacheable(value = "funcionarioCache", key = "'chamado-null'")
    public List<Funcionario> funcionariosSemChamado(){
        return funcionarioRepository.funcionariosSemChamado();
    }

    @Cacheable(value = "funcionarioCache", key="'funcionario'.concat(#id_cargo)")
    public Long qntFuncionariosPeloCargo(Long id_cargo){
        return  funcionarioRepository.qntFuncionariosPeloCargo(id_cargo);
    }

    @Cacheable(value="funcionarioCache", key="'chamado'.concat(#id_funcionario)")
    public List<List> mostrarQtoFuncRecebeuChamadosConcluidos (Integer idFuncionario){
        return funcionarioRepository.mostrarQtoFuncRecebeuChamadosConcluidos(idFuncionario);
    }

    @CachePut(value ="funcionarioCache", key = "#idCargo")
    public Funcionario cadastrarFuncionario(Funcionario funcionario, Integer idCargo) throws DataIntegrityViolationException {
        try{
            funcionario.setIdFuncionario(null);
            Optional<Cargo> cargo = cargoRepository.findById(idCargo);
            funcionario.setCargo(cargo.get());
            return funcionarioRepository.save(funcionario);
        } catch (Exception e){
            throw new DataIntegrityViolationException("Não foi possível cadastrar o funcionário");
        }
    }


    @CachePut(value = "funcionarioCache", key = "#funcionario.idFuncionario")
    public Funcionario editarFuncionario(Funcionario funcionario){
        return funcionarioRepository.save(funcionario);
    }

    @CachePut("funcionarioCache")
    public Funcionario salvarFoto(Integer idFuncionario, String caminhoFoto){
        Funcionario funcionario = mostrarUmFuncionarioPeloId(idFuncionario);
        funcionario.setFoto(caminhoFoto);
        return funcionarioRepository.save(funcionario);
    }

    @CacheEvict(value = "funcionarioCache", key ="#idFuncionario", allEntries = true)
    public void excluirFuncionario(Integer idFuncionario){

        funcionarioRepository.deleteById(idFuncionario);
    }
}
