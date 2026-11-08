package forjun.web.module.user.application.port.out;

import forjun.web.module.user.domain.User;

import java.util.List;

public interface UserJpaPort {

    //유저 저장 및 수정
    public void saveUser(User user);

    //유저 삭제
    public void deleteUser(Long id);
    
    //유저정보 고유 아이디로 얻기
    public User getUser(Long id);

    //유저정보 로그인 아이디로 얻기
    public User getUserByUserId(String userId);

    //유저 아이디 여부 조회
    public Boolean existsById(Long id);

    //유저 로그인 아이디로 존재여부 체크
    public Boolean existsByUserId(String userId);

    //유저 리스트 조회
    public List<User> searchUserList(String keyword);
}
