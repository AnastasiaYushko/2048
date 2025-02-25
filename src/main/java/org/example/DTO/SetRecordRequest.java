package org.example.DTO;

import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Data
@Scope("prototype")
public class SetRecordRequest {
    @Positive(message = "id не может быть <=0")
    private int id;
    @Positive(message = "record не может быть <=0")
    private int record;
}
