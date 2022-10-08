import { EnderecoCliente } from "../enderecoClientes/models/endereco-cliente";



export interface Cliente {
  idCliente: number;
  nome: string;
  email: string;
  enderecoCliente?: EnderecoCliente; 
}
