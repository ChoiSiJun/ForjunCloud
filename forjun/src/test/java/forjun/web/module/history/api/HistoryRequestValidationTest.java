package forjun.web.module.history.api;

import forjun.web.exception.GlobalExceptionHandler;
import forjun.web.module.history.api.mapper.HistoryApiMapper;
import forjun.web.module.history.application.port.in.HistoryQuery;
import forjun.web.module.history.application.port.in.HistoryUsecase;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class HistoryRequestValidationTest {
    @Test void missingRequiredFieldsReturnBadRequestBeforeCallingTheUseCase() throws Exception {
        var useCase = mock(HistoryUsecase.class);
        var controller = new HistoryApi(mock(HistoryQuery.class), useCase, mock(HistoryApiMapper.class));
        var mvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mvc.perform(post("/api/v1/history").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
        mvc.perform(put("/api/v1/history/1").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
        verifyNoInteractions(useCase);
    }
}
