package com.soulcode.Servicos.Repositories;

import com.soulcode.Servicos.Models.Cargo;
import com.soulcode.Servicos.Models.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {

    @Query(value = "select \tf.id_funcionario, f.nome funcionario, SUM(p.valor) from funcionario f\n" +
            "\t inner join chamado ch on f.id_funcionario = ch.id_funcionario \n" +
            "\t INNER  JOIN  pagamento p on p.id_pagamento = ch.id_pagamento \n" +
            "\t WHERE ch.status = 'CONCLUIDO' AND f.id_funcionario =:idFunc"
            , nativeQuery = true)
    List<List> mostrarQtoFuncRecebeuChamadosConcluidos(Integer idFunc);

    Optional<Funcionario> findByEmail(String email);
    List<Funcionario> findByCargo(Optional<Cargo> cargo);

    @Query(value = "SELECT * FROM funcionario WHERE funcionario.foto is null", nativeQuery = true)
    List<Funcionario> mostrarFuncionariosComFotoNula();

    @Query(value = "SELECT f.* FROM funcionario f \n" +
            "\tLEFT JOIN chamado c ON f.id_funcionario = c.id_funcionario \n" +
            "\tWHERE c.id_funcionario IS NULL",nativeQuery = true)
    List<Funcionario> funcionariosSemChamado();


    @Query(value = "SELECT  COUNT(id_cargo) Quantidade_funcionario_cargo FROM funcionario WHERE id_cargo = :id_cargo ", nativeQuery = true)
    Long qntFuncionariosPeloCargo(Long id_cargo);
}
