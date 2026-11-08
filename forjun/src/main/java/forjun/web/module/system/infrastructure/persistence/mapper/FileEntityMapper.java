package forjun.web.module.system.infrastructure.persistence.mapper;


import forjun.web.module.system.domain.UploadFile;
import forjun.web.module.system.infrastructure.persistence.entity.UploadFileEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FileEntityMapper {
    
    @Mapping(target = "id", ignore = true)
    UploadFileEntity toEntity(UploadFile uploadFile);
    UploadFile toDomain(UploadFileEntity uploadFileEntity);
}
