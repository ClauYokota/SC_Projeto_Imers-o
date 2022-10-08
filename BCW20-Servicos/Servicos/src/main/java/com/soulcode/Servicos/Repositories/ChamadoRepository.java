package com.soulcode.Servicos.Repositories;

import com.soulcode.Servicos.Models.Chamado;
import com.soulcode.Servicos.Models.Cliente;
import com.soulcode.Servicos.Models.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ChamadoRepository extends JpaRepository<Chamado,Integer> {

    List<Chamado> findByCliente(Optional<Cliente> cliente);

    List<Chamado> findByFuncionario(Optional<Funcionario> funcionario);

    @Query(value = "SELECT * FROM chamado WHERE status =:status",nativeQuery = true )
    List<Chamado> findByStatus(String status);

    @Query(value = "SELECT c.* FROM chamado c\n" +
            "\t INNER JOIN pagamento p ON c.id_chamado = p.id_pagamento \n" +
            "\t where p.status =:statusPagamento" , nativeQuery = true)
    List<Chamado> findByStatusDoPagamento(String statusPagamento);

    @Query(value="SELECT * FROM chamado WHERE data_entrada BETWEEN :data1 AND :data2", nativeQuery = true)
    List<Chamado> findByIntervaloData(Date data1, Date data2);

    @Query(value = "SELECT \tchamado.status,COUNT(status)  FROM chamado GROUP BY chamado.status;", nativeQuery = true)
    List<List> quantidadeDeChamadosPeloStatus();
}
