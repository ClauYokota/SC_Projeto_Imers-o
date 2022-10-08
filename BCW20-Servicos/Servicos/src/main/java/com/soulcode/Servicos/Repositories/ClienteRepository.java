package com.soulcode.Servicos.Repositories;

import com.soulcode.Servicos.Models.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ClienteRepository  extends JpaRepository<Cliente,Integer> {

    @Query(value = "\tselect cl.id_cliente, cl.nome, SUM(p.valor)  from chamado ch \n" +
            "\tINNER  JOIN  cliente cl  on cl.id_cliente  = ch.id_cliente \n" +
            "\tINNER  JOIN  pagamento p on p.id_pagamento = ch.id_pagamento \n" +
            "\twhere p.status = 'QUITADO' AND cl.id_cliente =:idCliente"
            , nativeQuery = true)
    List<List> findByValorPagoPorChamadoConcluido(Integer idCliente);

}
