package forjun.web.module.user.infrastructure.jpa.repository;


import forjun.web.module.user.infrastructure.jpa.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<UserEntity,Long> {

    //이름으로 이용자 리스트검색
    List<UserEntity> findByUserName(String username);
    
    //이용자 로그인 아이디로 이용자 정보 가져오기
    UserEntity findByUserId(String userId);

    //이용자 로그인 아이디로 존재여부 판단
    Boolean existsByUserId(String userId);

}
