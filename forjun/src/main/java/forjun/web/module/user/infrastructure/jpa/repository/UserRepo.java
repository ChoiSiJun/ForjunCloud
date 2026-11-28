package forjun.web.module.user.infrastructure.jpa.repository;


import forjun.web.module.user.infrastructure.jpa.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<UserEntity,Long> {

    @Modifying
    @Query("""
            update UserEntity u set u.userName = :userName, u.email = :email,
                u.historyPrivate = :historyPrivate, u.personalPrivate = :personalPrivate
            where u.id = :id
            """)
    int updateMetadata(@Param("id") long id, @Param("userName") String userName, @Param("email") String email,
                       @Param("historyPrivate") String historyPrivate, @Param("personalPrivate") String personalPrivate);

    @Modifying
    @Query("update UserEntity u set u.userName = :userName, u.email = :email where u.id = :id")
    int updateProfile(@Param("id") long id, @Param("userName") String userName, @Param("email") String email);

    @Modifying
    @Query("update UserEntity u set u.historyPrivate = :historyPrivate, u.personalPrivate = :personalPrivate where u.id = :id")
    int updatePrivacy(@Param("id") long id, @Param("historyPrivate") String historyPrivate,
                      @Param("personalPrivate") String personalPrivate);

    @Query("select u.password from UserEntity u where u.id = :id")
    Optional<String> findPasswordHash(@Param("id") long id);

    @Modifying
    @Query("update UserEntity u set u.password = :newHash where u.id = :id and u.password = :oldHash")
    int updatePasswordIfUnchanged(@Param("id") long id, @Param("oldHash") String oldHash, @Param("newHash") String newHash);

    //이름으로 이용자 리스트검색
    List<UserEntity> findByUserName(String username);
    
    //이용자 로그인 아이디로 이용자 정보 가져오기
    UserEntity findByUserId(String userId);

    //이용자 로그인 아이디로 존재여부 판단
    Boolean existsByUserId(String userId);

}
