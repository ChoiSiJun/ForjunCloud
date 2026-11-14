package forjun.web.module.personal.application;

import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import forjun.web.module.personal.application.port.in.PersonalQuery;
import forjun.web.module.personal.application.port.in.PersonalUseCase;
import forjun.web.module.personal.application.port.in.dto.GetPersonalQuery;
import forjun.web.module.personal.application.port.in.dto.GetPublicPersonalQuery;
import forjun.web.module.personal.application.port.in.dto.SavePersonalCommand;
import forjun.web.module.personal.domain.Personal;
import forjun.web.module.personal.application.port.out.PersonalJpaPort;
import forjun.web.module.personal.application.port.out.PersonalImagePort;
import forjun.web.module.personal.application.port.in.dto.PersonalView;
import forjun.web.module.user.application.port.in.UserQuery;
import forjun.web.module.user.application.port.in.dto.GetUserInfoByUserIdQuery;
import forjun.web.module.user.domain.PrivateStatus;
import forjun.web.module.user.domain.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@RequiredArgsConstructor
@Service
@Transactional
public class PersonalService implements PersonalUseCase , PersonalQuery {

    //personal Jpa 어댑터
    private final PersonalJpaPort personalJpaAdapater;
    private final PersonalImagePort personalImagePort;

    /** 유저 Query */
    private final UserQuery userQuery;

    
    @Override
    public void savePersonal(SavePersonalCommand command) {

        String fileId = command.profile_image_id();
        if (fileId != null) {
            if (fileId.isBlank()) {
                throw AppException.of(ErrorCode.FILE_NOT_FOUND);
            }
            var image = personalImagePort.findImage(fileId)
                    .orElseThrow(() -> AppException.of(ErrorCode.FILE_NOT_FOUND));
            // 소유자 정보가 없는 기존 파일은 이미 연결된 프로필에서만 유지한다.
            boolean ownsImage = command.userId().equals(image.ownerId());
            boolean keepsLegacyImage = image.ownerId() == null && personalJpaAdapater.getPersonal(command.userId())
                    .map(personal -> fileId.equals(personal.getProfile_image_id())).orElse(false);
            if (!ownsImage && !keepsLegacyImage) {
                throw AppException.of(ErrorCode.ACCESS_DENIED);
            }
        }

        // 자기소개서 도메인 생성
        personalJpaAdapater.savePersonal(PersonalFactory.createPersonal(command));
        
    }

    @Override
    public PersonalView getPersonal(GetPersonalQuery query) {
        return personalJpaAdapater.getPersonal(query.userId()).map(this::toView).orElse(null);
    }

    @Override
    public PersonalView getPublicPersonal(GetPublicPersonalQuery query) {

        //퍼블릭 자기소개서 유저 접근정보 체크
        String userId = query.userId();

        //유저 정보 조회
        GetUserInfoByUserIdQuery userParameterQuery = new GetUserInfoByUserIdQuery(userId);
        User user = userQuery.getUserByUserId(userParameterQuery);
        
        //유저 존재여부 체크
        if(user == null){
            throw AppException.of(ErrorCode.USER_NOT_FOUND, userId);
        }

        //유저 자기소개서 접근 권한 체크
        if(!user.getPersonalPrivate().equals(PrivateStatus.PUBLIC.name())){
            throw AppException.of(ErrorCode.PERSONAL_NOT_ACCESS, userId);
        }

        // 자기소개서 조회
        return personalJpaAdapater.getPersonal(query.userId()).map(this::toView).orElseThrow(
            () -> AppException.of(ErrorCode.PERSONAL_NOT_FOUND, userId)
        );
    }
    private PersonalView toView(Personal personal) {
        String fileId = personal.getProfile_image_id();
        String url = fileId == null || fileId.isBlank() ? null
                : personalImagePort.findImage(fileId).map(PersonalImagePort.ImageInfo::url).orElse(null);
        return new PersonalView(personal, url);
    }
}
