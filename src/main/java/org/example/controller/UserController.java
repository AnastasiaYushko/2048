package org.example.controller;

import jakarta.validation.Valid;
import org.example.DTO.*;
import org.example.SpringConfig;
import org.example.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@CrossOrigin(origins = "*")
@Validated
public class UserController {

    private final UserServiceImpl userService;

    @Autowired
    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<GetAllUsersResponse> add() {
        GetAllUsersResponse getAllUsersResponse = userService.getAllUsers();
        return new ResponseEntity<>(getAllUsersResponse, HttpStatus.OK);
    }


    @PostMapping("/addUser")
    public ResponseEntity<?> add(@Valid @RequestBody AddUserRequest addUserRequestDTO) throws NoSuchElementException {
       try {
           AddUserResponse createdUser = userService.addUser(addUserRequestDTO);
           return new ResponseEntity<>(createdUser, HttpStatus.OK);
       } catch (NoSuchElementException e) {
           return new ResponseEntity<>("Ошибка: " + e.getMessage(), HttpStatus.NOT_FOUND);
       }
    }

    @PostMapping("/getUserByLoginPassword")
    public ResponseEntity<?> getUserByLoginPassword(@Valid @RequestBody GetUserByLoginPasswordRequest getUserByLoginPasswordRequestDTO) throws NoSuchElementException {
        try {
            GetUserResponse getUserResponseDTO = userService.getUserByLoginPassword(getUserByLoginPasswordRequestDTO);
            return new ResponseEntity<>(getUserResponseDTO, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Ошибка: " + e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/setRecordUser")
    public ResponseEntity<String> setRecord(@Valid @RequestBody SetRecordRequest setRecordRequestDTO) throws NoSuchElementException {
        try {
            String result = userService.setRecord(setRecordRequestDTO);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Ошибка: " + e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestParam int id) throws NoSuchElementException {
        if (id <= 0) {
            return new ResponseEntity<>("Ошибка: id должен быть положительным", HttpStatus.BAD_REQUEST);
        }
        DeleteUserRequest deleteUserRequest = SpringConfig.getContext().getBean("deleteUserRequest", DeleteUserRequest.class);
        deleteUserRequest.setId(id);
        try {
            String result = userService.deleteUser(deleteUserRequest);
            return new ResponseEntity<>(result,HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Ошибка: " + e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getUserByID")
    public ResponseEntity<?> getUserByID(@RequestParam int id) {
        if (id <= 0) {
            return new ResponseEntity<>("Ошибка: id должен быть положительным", HttpStatus.BAD_REQUEST);
        }
        GetUserByIDRequest getUserByIDRequest = SpringConfig.getContext().getBean("getUserByIDRequest",GetUserByIDRequest.class);
        getUserByIDRequest.setId(id);
        try {
            GetUserResponse getUserResponseDTO = userService.getUserByID(getUserByIDRequest);
            return new ResponseEntity<>(getUserResponseDTO, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Ошибка: " + e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
