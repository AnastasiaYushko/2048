package org.example.service;

import org.example.DAO.UserDAOImpl;
import org.example.DTO.*;
import org.example.SpringConfig;
import org.example.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.NoSuchElementException;

@Service
public class UserServiceImpl implements UserService {

    private final UserDAOImpl userDAO;

    @Autowired
    public UserServiceImpl(UserDAOImpl userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public AddUserResponse addUser(AddUserRequest userRequestDTO) throws NoSuchElementException{
        int id = userDAO.addUser(userRequestDTO.getName(), userRequestDTO.getLogin(),userRequestDTO.getPassword());
        AddUserResponse addUserResponseDTO = SpringConfig.getContext().getBean("addUserResponse", AddUserResponse.class);
        addUserResponseDTO.setId(id);
        return addUserResponseDTO;
    }

    @Override
    public GetUserResponse getUserByLoginPassword(GetUserByLoginPasswordRequest getUserByLoginPasswordRequestDTO) throws NoSuchElementException {
        GetUserResponse getUserResponseDTO = SpringConfig.getContext().getBean("getUserResponse", GetUserResponse.class);
        User user = userDAO.getUserByLoginPassword(getUserByLoginPasswordRequestDTO.getLogin(), getUserByLoginPasswordRequestDTO.getPassword());
        getUserResponseDTO.setId(user.getId());
        getUserResponseDTO.setName(user.getName());
        getUserResponseDTO.setRecord(user.getRecord());
        return getUserResponseDTO;
    }

    @Override
    public String setRecord(SetRecordRequest setRecordRequestDTO) throws NoSuchElementException {
        return userDAO.setRecord(setRecordRequestDTO.getId(), setRecordRequestDTO.getRecord());
    }

    @Override
    public String deleteUser(DeleteUserRequest deleteUSerRequestDTO) throws NoSuchElementException {
        return userDAO.deleteUser(deleteUSerRequestDTO.getId());
    }

    @Override
    public GetAllUsersResponse getAllUsers(){
        GetAllUsersResponse getAllUsersResponse = SpringConfig.getContext().getBean("getAllUsersResponse", GetAllUsersResponse.class);
        ArrayList<User> result = userDAO.getAllUsers();

        ArrayList<String> newListUsers = new ArrayList<>();

        for (User user : result) {
            newListUsers.add(user.toString());
        }

        getAllUsersResponse.setListUsers(newListUsers);
        return getAllUsersResponse;
    }

    @Override
    public GetUserResponse getUserByID(GetUserByIDRequest getUserByIDRequest) throws NoSuchElementException{
        GetUserResponse getUserResponseDTO = SpringConfig.getContext().getBean("getUserResponse", GetUserResponse.class);
        User user = userDAO.getUserByID(getUserByIDRequest.getId());
        getUserResponseDTO.setId(user.getId());
        getUserResponseDTO.setName(user.getName());
        getUserResponseDTO.setRecord(user.getRecord());
        return getUserResponseDTO;
    }
}
