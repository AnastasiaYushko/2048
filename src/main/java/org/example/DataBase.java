package org.example;

import org.example.model.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Component
public class DataBase {
    private final Map<Integer, User> listUser;
    private Integer keyUser;

    public DataBase() {
        keyUser = 1;
        listUser = new HashMap<>();
    }

    public User getUserByLoginPassword(String login,String password) throws NoSuchElementException {
        synchronized (listUser) {
            for (User user: listUser.values()) {
                if (login.equals(user.getLogin()) && password.equals(user.getPassword())) {
                   return user;
                }
            }
        }
        throw new NoSuchElementException("Пользователь не найден");
    }

    public int addUser(User user) throws NoSuchElementException{
        synchronized (listUser) {
            for (User user1: listUser.values()) {
                if (user.getLogin().equals(user1.getLogin())) {
                   throw new NoSuchElementException("Пользователь c таким логином уже существует");
                }
            }
            user.setId(keyUser);
            listUser.put(keyUser, user);
            keyUser++;
            return user.getId();
        }
    }

    public String setRecord(int id, int record) throws NoSuchElementException {
        synchronized (listUser) {
            User user = listUser.get(id);
            if (user == null) {
                throw new NoSuchElementException("Пользователь не найден.");
            }
            user.setRecord(record);
            listUser.put(id, user);
        }
        return "Запись пользователя обновлена";
    }

    public String deleteUser(int id) throws NoSuchElementException {
        synchronized (listUser) {
            if (!listUser.containsKey(id)) {
                throw new NoSuchElementException("Пользователь не найден");
            }
            listUser.remove(id);
        }
        return "Пользователь удален";
    }

    public ArrayList<User> getAllUsers(){
        return new ArrayList<>(listUser.values());
    }

    public User getUserByID(int id){
        synchronized (listUser) {
            for (User user: listUser.values()) {
                if (id == user.getId()) {
                    return user;
                }
            }
        }
        throw new NoSuchElementException("Пользователь не найден");
    }
}