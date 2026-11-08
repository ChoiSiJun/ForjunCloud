package forjun.web.module.user.infrastructure.jpa;

import forjun.web.module.user.application.port.out.UserJpaPort;
import forjun.web.module.user.domain.User;
import forjun.web.module.user.infrastructure.jpa.mapper.UserJpaMapper;
import forjun.web.module.user.infrastructure.jpa.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Repository
public class UserJpaAdapter implements UserJpaPort {

    private final UserRepo userRepo;
    private final UserJpaMapper userJpaMapper;

    @Override
    public void saveUser(User user) {
        userRepo.save(userJpaMapper.toEntity(user));
    }

    @Override
    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    @Override
    public User getUser(Long id) {
        return userRepo.findById(id).map(userJpaMapper::toDomain).orElse(null);
    }

    @Override
    public User getUserByUserId(String userId) {
        return userJpaMapper.toDomain(userRepo.findByUserId(userId));
    }

    @Override
    public Boolean existsById(Long id) {
        return userRepo.findById(id).isPresent();
    }

    @Override
    public List<User> searchUserList(String keyword) {
        return userRepo.findByUserName(keyword).stream()
                .map(userJpaMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Boolean existsByUserId(String userId) {
        return userRepo.existsByUserId(userId);
    }
}

