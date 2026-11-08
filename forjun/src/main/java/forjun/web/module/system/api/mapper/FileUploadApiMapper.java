package forjun.web.module.system.api.mapper;

import forjun.web.module.system.api.dto.UploadedFileResponse;
import forjun.web.module.system.domain.UploadFile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Value;

@Mapper(componentModel = "spring")
public abstract class FileUploadApiMapper {

    @Value("${file.upload.resource-domain}")
    protected String resourceDomain;

    @Value("${file.upload.resource-url}")
    protected String resourceUrl;

    @Mapping(target = "url", expression = "java(uploadFile.getUrl())")
    public abstract UploadedFileResponse toUploadedFileResponse(UploadFile uploadFile);
}
