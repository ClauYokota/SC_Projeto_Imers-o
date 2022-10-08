package com.soulcode.Servicos.Services;

import com.soulcode.Servicos.Models.User;
import com.soulcode.Servicos.Repositories.UserRepository;
import com.soulcode.Servicos.Services.Exceptions.EntityNotFoundException;
import com.soulcode.Servicos.Util.TokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private TokenUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    public List<User> listar() {
        return userRepository.findAll();
    }

    public User cadastrar(User user) {
        return userRepository.save(user);
    }

    public User alterarSenha (String password, String login, String token)throws EntityNotFoundException{

        if (token != null && token.startsWith("Bearer")){
            String email = jwtUtils.getLogin(token.substring(7));
            Optional<User>user = userRepository.findByLogin(login);

            if(email.equals(user.get().getLogin())){
                user.get().setPassword(password);
                return userRepository.save(user.get());
            }
        }
        throw new EntityNotFoundException("Erro, login não encontrado");
    }

    public User desabilitarUsuario (String login, String token)throws EntityNotFoundException{

        if (token != null && token.startsWith("Bearer")){
            String email = jwtUtils.getLogin(token.substring(7));
            Optional<User>user = userRepository.findByLogin(login);

            if(email.equals(user.get().getLogin())){
                user.get().setDesable(true);
                return userRepository.save(user.get());
            }
        }
        throw new EntityNotFoundException("Erro, login não encontrado");
    }
}
