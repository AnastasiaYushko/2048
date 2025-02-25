package org.example.service;

import org.example.DTO.*;

public interface UserService {
    AddUserResponse addUser(AddUserRequest userRequestDTO);

    GetUserResponse getUserByLoginPassword(GetUserByLoginPasswordRequest getUserByLoginPasswordRequestDTO);

    String setRecord(SetRecordRequest setRecordRequestDTO);

    String deleteUser(DeleteUserRequest deleteUSerRequestDTO);

    GetAllUsersResponse getAllUsers();

    GetUserResponse getUserByID(GetUserByIDRequest getUserByIDRequest);
}
