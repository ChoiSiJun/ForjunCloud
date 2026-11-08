package forjun.web.module.user.infrastructure.jpa.mapper;

import forjun.web.module.user.domain.User;
import forjun.web.module.user.infrastructure.jpa.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserJpaMapper {

    UserEntity toEntity(User user);
    User toDomain(UserEntity userEntity);
}
