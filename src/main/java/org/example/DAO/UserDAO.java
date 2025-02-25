package org.example.DAO;

import org.example.model.User;

import java.util.ArrayList;

public interface UserDAO {
    User getUserByLoginPassword(String login,String password);

    int addUser(String name,String login,String password);

    String setRecord(int id, int record);

    String deleteUser(int id);

    ArrayList<User> getAllUsers();

    User getUserByID(int id);
}
