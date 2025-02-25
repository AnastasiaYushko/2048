package org.example.DAO;

import org.example.DataBase;
import org.example.SpringConfig;
import org.example.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.NoSuchElementException;

@Repository
public class UserDAOImpl implements UserDAO {
    @Autowired
    private final DataBase dataBase;

    public UserDAOImpl(DataBase dataBase) {
        this.dataBase = dataBase;
    }

    @Override
    public User getUserByLoginPassword(String login,String password) throws NoSuchElementException {
        return dataBase.getUserByLoginPassword(login,password);
    }

    @Override
    public int addUser(String name, String login,String password) throws NoSuchElementException {
        User user = SpringConfig.getContext().getBean("user", User.class);
        user.setName(name);
        user.setLogin(login);
        user.setPassword(password);
        user.setRecord(0);
        return dataBase.addUser(user);
    }

    @Override
    public String setRecord(int id, int record) throws NoSuchElementException {
        return dataBase.setRecord(id, record);
    }

    @Override
    public String deleteUser(int id) throws NoSuchElementException {
       return dataBase.deleteUser(id);
    }

    @Override
    public ArrayList<User> getAllUsers() {
        return dataBase.getAllUsers();
    }

    @Override
    public User getUserByID(int id) throws NoSuchElementException{
        return dataBase.getUserByID(id);
    }
}
