package org.example.DTO;

import lombok.Data;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
@Scope("prototype")
@Data
public class GetAllUsersResponse {
    private ArrayList<String> listUsers;
}
