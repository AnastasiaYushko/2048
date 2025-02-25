const GRID_SIZE = 3;
let grid = [];
//Рекорд над игровым полем
let score = 0;
//Рекорд пользователя
let highScore = "";
let playerName = "";
let userId = localStorage.getItem('userId') || 0;

function initializeGame() {
    // Проверяем, есть ли userId в localStorage
    if (userId) {
        // Если userId есть, значит пользователь авторизован
        fetch(`http://localhost:8080/getUserByID?id=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных пользователя');
                }
                return response.json();
            })
            .then(data => {
                // Если запрос успешен, отображаем данные пользователя
                playerName = data.name;
                highScore = data.record;
                document.getElementById('player-name').textContent = playerName;
                document.getElementById('high-score').textContent = `Рекорд: ${data.record}`;

                document.getElementById('player-name').style.display = 'block';
                document.getElementById('high-score').style.display = 'block';

                // Показываем кнопку "Выйти" и "Удалить аккаунт"
                document.getElementById('exit').style.display = 'block';
                document.getElementById('delete-account').style.display = 'block';

                // Скрываем кнопки "Авторизация" и "Регистрация"
                document.getElementById('change-user').style.display = 'none';
                document.getElementById('register-button').style.display = 'none';
            })
            .catch(error => {
                // Если произошла ошибка, устанавливаем значения по умолчанию
                playerName = "";
                highScore = "";
                userId = 0;

                // Скрываем имя и рекорд
                document.getElementById('player-name').textContent = "";
                document.getElementById('high-score').textContent = "";
                document.getElementById('player-name').style.display = 'none';
                document.getElementById('high-score').style.display = 'none';

                // Показываем кнопки "Авторизация" и "Регистрация"
                document.getElementById('change-user').style.display = 'block';
                document.getElementById('register-button').style.display = 'block';

                // Скрываем кнопки "Выйти" и "Удалить аккаунт"
                document.getElementById('exit').style.display = 'none';
                document.getElementById('delete-account').style.display = 'none';
            });
    } else {
        // Если userId нет, значит пользователь не авторизован
        playerName = "";
        highScore = "";

        // Скрываем имя и рекорд
        document.getElementById('player-name').textContent = "";
        document.getElementById('high-score').textContent = "";
        document.getElementById('player-name').style.display = 'none';
        document.getElementById('high-score').style.display = 'none';

        // Показываем кнопки "Авторизация" и "Регистрация"
        document.getElementById('change-user').style.display = 'block';
        document.getElementById('register-button').style.display = 'block';

        // Скрываем кнопки "Выйти" и "Удалить аккаунт"
        document.getElementById('exit').style.display = 'none';
        document.getElementById('delete-account').style.display = 'none';
    }

    initializeGrid();
    updateGrid();
}

//Создание игрового поля
function initializeGrid() {
    grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    addRandomTile();
    addRandomTile();
}

//Добавление плитки на поле
function addRandomTile() {
    //Массив пустых ячеек
    let emptyCells = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

//Обновление поля
function updateGrid() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            while (cell.firstChild) {
                //Удаляет предыдущие дочерние элементы
                cell.removeChild(cell.firstChild);
            }
            //создает HTML-элемент для отображения плитки и добавляет его в ячейку
            if (grid[i][j] !== 0) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.classList.add(`tile-${grid[i][j]}`);
                tile.textContent = grid[i][j];
                cell.appendChild(tile);
            }
        }
    }
    document.getElementById('score').textContent = score;
}

//Перемещение плиток в игре
function move(direction) {
    //Отслеживание перемещения
    let moved = false;

    //Транспонирование -- кнопки вверх и вниз
    function transpose(matrix) {
        return matrix[0].map((col, i) => matrix.map(row => row[i]));
    }

    // Реверсирование строк -- кнопка вправо и влево
    function reverseRows(matrix) {
        return matrix.map(row => row.reverse());
    }

    //Направления
    switch (direction) {
        case 'up':
            grid = transpose(grid);
            break;
        case 'down':
            grid = transpose(grid);
            grid = reverseRows(grid);
            break;
        case 'left':
            break;
        case 'right':
            grid = reverseRows(grid);
            break;
    }

    for (let i = 0; i < GRID_SIZE; i++) {
        let row = grid[i];
        let newRow = row.filter(val => val !== 0);
        for (let j = 0; j < newRow.length - 1; j++) {
            //Слияние
            if (newRow[j] === newRow[j + 1]) {
                newRow[j] *= 2;
                score += newRow[j];
                newRow.splice(j + 1, 1);
                moved = true;
            }
        }
        while (newRow.length < GRID_SIZE) {
            newRow.push(0);
        }

        if (String(row) !== String(newRow)) {
            moved = true;
        }

        grid[i] = newRow;
    }

    //Обратные действия
    switch (direction) {
        case 'up':
            grid = transpose(grid);
            break;
        case 'down':
            grid = reverseRows(grid);
            grid = transpose(grid);
            break;
        case 'left':
            break;
        case 'right':
            grid = reverseRows(grid);
            break;
    }

    //Перемещение происзошло
    if (moved) {
        //Добавляем одну плитку
        addRandomTile();
        //Обновляем поле
        updateGrid();
        //Сохраняем состояние игры
        saveGameState();
    }

    // Если игра окочена -- показ модального окна
    // Обновление рекорда на сервере, если он изменился
    if (isGameOver()) {
        let gameOverMessage = "Игра окончена! Результат: " + score;
        let newRecord = false;

        if (score > highScore && userId !== 0) {
            newRecord = true;
            highScore = score;
            localStorage.setItem('highScore', highScore);
            gameOverMessage += " У вас новый рекорд!";
            document.getElementById('high-score').textContent = `Рекорд: ${highScore}`;
            document.getElementById('high-score').style.display = 'block';
        }

        document.getElementById('game-over-message').textContent = gameOverMessage;

        const modal = document.getElementById('game-over-modal');
        modal.style.display = "block";

        // Предотвращаем действия по умолчанию и всплытие событий для клавиш
        window.addEventListener('keydown', function (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }, { once: true });

        // Обработчик для клика на экран
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModalAndSendRecord();
            }
        }, { once: true });

        // Функция закрытия модального окна и отправки рекорда
        function closeModalAndSendRecord() {
            modal.style.display = "none";
            clearGameState();

            if (newRecord && userId !== 0) {
                const requestBody = JSON.stringify({
                    id: userId,
                    record: highScore
                });

                fetch('http://localhost:8080/setRecordUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: requestBody
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Произошла непредвиденная ошибка при записи рекорда на сервер');
                        }
                        document.getElementById('high-score').textContent = `Рекорд: ${highScore}`;
                        document.getElementById('high-score').style.display = 'block';

                    })
                    .catch(error => {
                        console.error(error);
                        alert('Произошла непредвиденная ошибка при записи рекорда на сервер.');
                    });
            }
        }

        const closeButton = modal.querySelector('.close-button');
        if (closeButton) {
            closeButton.onclick = function () {
                closeModalAndSendRecord();
            };
        }

        initializeGrid();
        updateGrid();
    }
}

//Проверка завершена ли игра
function isGameOver() {
    //Есть ли пустые ячейки
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === 0) {
                return false;
            }
        }
    }

    //Есть ли возможность объединить какие-либо плитки в строках или столбцах
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE - 1; j++) {
            if (grid[i][j] === grid[i][j + 1] || grid[j][i] === grid[j + 1][i]) {
                return false;
            }
        }
    }

    return true;
}

//Сохранение состояния игры
function saveGameState() {
    localStorage.setItem('gameGrid', JSON.stringify(grid));
    localStorage.setItem('gameScore', score);
}

//Очистка состояния игры
function clearGameState() {
    localStorage.removeItem('gameGrid');
    localStorage.removeItem('gameScore');
    score = 0;
    //Получение нового поля
    initializeGrid();
    updateGrid();
}

//Управление игры кнопками
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
    }
});

//При загрузке страницы заново инициализировать игру
window.onload = initializeGame;

//Кнопка начать заново
document.getElementById('restart-game').addEventListener('click', () => {
    clearGameState();
});

//Кнопка авторизация
document.getElementById('change-user').addEventListener('click', () => {
    //Показываем форму логина
    document.getElementById('login-form').style.display = 'block';
    //Скрываем кнопку авторизации и регистрации
    document.getElementById('change-user').style.display = 'none';
    document.getElementById('register-button').style.display = 'none';
    document.getElementById('register-message').style.display = 'none';
});

//Нажатие кнопки "Войти"
document.getElementById('submit-login').addEventListener('click', () => {
    const login = document.getElementById('login');
    const password = document.getElementById('password');
    const loginValue = login.value;
    const passwordValue = password.value;
    const errorMessage = document.getElementById('error-message');

    if (loginValue === '' || passwordValue === '') {
        errorMessage.textContent = "Заполните все поля!";
        return;
    }

    const requestBody = JSON.stringify({ login: loginValue, password: passwordValue });

    fetch('http://localhost:8080/getUserByLoginPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            // Сохраняем id пользователя в localStorage и обновляем глобальную переменную
            localStorage.setItem('userId', data.id);
            userId = data.id;

            playerName = data.name;
            highScore = data.record;
            document.getElementById('player-name').textContent = `${data.name}`;
            document.getElementById('high-score').textContent = `Рекорд: ${data.record}`;

            //Скрываем форму логина
            document.getElementById('login-form').style.display = 'none';

            //Показываем имя и рекорд
            document.getElementById('high-score').style.display = 'block';
            document.getElementById('player-name').style.display = 'block';

            document.getElementById('error-message').textContent = "";
            login.value = '';
            password.value = '';

            // Показываем кнопку "Выйти" и "Удалить аккаунт"
            const exitButton = document.getElementById('exit');
            exitButton.style.display = 'block';
            const deleteAccountButton = document.getElementById('delete-account');
            deleteAccountButton.style.display = 'block';

            // Скрываем кнопки "Авторизация" и "Регистрация"
            const changeUserButton = document.getElementById('change-user');
            changeUserButton.style.display = 'none';
            const registerButton = document.getElementById('register-button');
            registerButton.style.display = 'none';
        })
        .catch(error => {
            errorMessage.textContent = error.message;
            console.error('Ошибка:', error);
        });
});

// Если пользователя не авторизован,тогда не отображать данные
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('userId')) { // Если userId нет в localStorage
        document.getElementById('high-score').style.display = 'none';
        document.getElementById('player-name').style.display = 'none';
    }
});

//Кнопка закрыть для авторизации
document.getElementById('close-login').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('change-user').style.display = 'block';
    document.getElementById('register-button').style.display = 'block';

    const login = document.getElementById('login');
    const password = document.getElementById('password');

    login.value = '';
    password.value = '';

    document.getElementById('error-message').textContent = "";
});

// Обработчик кнопки "Регистрация"
document.getElementById('register-button').addEventListener('click', () => {
    document.getElementById('change-user').style.display = 'none';
    document.getElementById('register-button').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('register-message').style.display = 'none';
    document.getElementById('register-message-error').style = "block";

});

// Обработчик кнопки "Ок" в форме регистрации
document.getElementById('submit-register').addEventListener('click', () => {
    const registerName = document.getElementById('register-name').value;
    const registerLogin = document.getElementById('register-login').value;
    const registerPassword = document.getElementById('register-password').value;
    const registerMessageError = document.getElementById('register-message-error');
    const registerMessageButton = document.getElementById('register-message');

    // Проверяем, что все поля заполнены
    if (registerName === '' || registerLogin === '' || registerPassword === '') {
        registerMessageError.textContent = "Пожалуйста, заполните все поля!";
        registerMessageError.className = 'error-message';
        return;
    }

    //Тело запроса
    const requestBody = JSON.stringify({
        name: registerName,
        login: registerLogin,
        password: registerPassword
    });

    // Запрос регистрации
    fetch('http://localhost:8080/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            // Если регистрация успешна, выводим сообщение
            registerMessageButton.textContent = "Пользователь успешно создан!";
            registerMessageButton.className = 'success-message';
            registerMessageButton.style.display = 'block';

            // Очищаем поля формы
            document.getElementById('register-name').value = '';
            document.getElementById('register-login').value = '';
            document.getElementById('register-password').value = '';

            // Скрываем форму регистрации после успешной регистрации 
            document.getElementById('register-form').style.display = 'none';

            // Показываем кнопку "Выйти"
            document.getElementById('exit').style.display = 'none';

            // Показываем кнопку "Удалить аккаунт"
            document.getElementById('delete-account').style.display = 'none';

            // Скрываем кнопки "Авторизация" и "Регистрация"
            document.getElementById('change-user').style.display = 'block';
            document.getElementById('register-button').style.display = 'block';

        })
        .catch(error => {
            // Если произошла ошибка, выводим сообщение об ошибке
            registerMessageError.textContent = error.message;
            registerMessageError.className = 'error-message';
            console.error('Ошибка:', error);
        });
});

// Обработчик кнопки "Закрыть" в форме регистрации
document.getElementById('close-register').addEventListener('click', () => {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('change-user').style.display = 'block';
    document.getElementById('register-button').style.display = 'block';

    // Очищаем поля формы регистрации
    document.getElementById('register-name').value = '';
    document.getElementById('register-login').value = '';
    document.getElementById('register-password').value = '';

    const registerMessageError = document.getElementById('register-message-error');
    registerMessageError.textContent = ""; // Очищаем сообщение об ошибке
    registerMessageError.style.display = "none";
});

// Обработчик кнопки "Выйти с аккаунта"
document.getElementById('exit').addEventListener('click', () => {
    // Обнуляем данные пользователя
    playerName = "";
    highScore = 0;
    userId = 0;

    // Скрываем кнопку "Выйти"
    document.getElementById('exit').style.display = 'none';

    // Показываем кнопку "Авторизация" и "Регистрация"
    document.getElementById('change-user').style.display = 'block';
    document.getElementById('register-button').style.display = 'block';

    // Показываем кнопку "Удалить аккаунт"
    document.getElementById('delete-account').style.display = 'none';


    // Обновляем отображение имени и рекорда (устанавливаем пустые значения)
    document.getElementById('player-name').textContent = "";
    document.getElementById('high-score').textContent = "";

    // Удаляем id пользователя из localStorage
    localStorage.removeItem('userId');

    // Скрываем кнопку "Изменить пользователя"
    changeUserButton.textContent = "Авторизация";
    document.getElementById('login-form').style.display = 'none';

    // Скрываем имя и рекорд
    document.getElementById('player-name').style.display = 'none';
    document.getElementById('high-score').style.display = 'none';
});

// Функция для показа модального окна
function showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

// Функция для скрытия модального окна
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Обработчик кнопки "Удалить аккаунт"
document.getElementById('delete-account').addEventListener('click', () => {
    // Показываем модальное окно подтверждения
    showModal('delete-confirmation-modal');
});

// Обработчик кнопки "Да" в модальном окне подтверждения
document.getElementById('confirm-delete').addEventListener('click', () => {
    // Выполняем DELETE-запрос к серверу
    fetch(`http://localhost:8080/deleteUser?id=${userId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при удалении аккаунта');
            }
            // Если удаление успешно, обнуляем данные пользователя и скрываем элементы
            playerName = "";
            highScore = "";
            userId = 0;

            document.getElementById('player-name').textContent = playerName;
            document.getElementById('high-score').textContent = highScore;
            localStorage.removeItem('userId');

            // Скрываем кнопку "Выйти" и "Удалить аккаунт"
            document.getElementById('exit').style.display = 'none';
            document.getElementById('delete-account').style.display = 'none';
            document.getElementById('player-name').style.display = 'none';
            document.getElementById('high-score').style.display = 'none';

            // Показываем кнопки "Авторизация" и "Регистрация"
            document.getElementById('change-user').style.display = 'block';
            document.getElementById('register-button').style.display = 'block';

            const changeUserButton = document.getElementById('change-user');
            changeUserButton.textContent = "Авторизация";

            // Закрываем модальное окно
            closeModal('delete-confirmation-modal');
        })
        .catch(error => {
            console.error(error);
            alert('Произошла ошибка при удалении аккаунта.');
            closeModal('delete-confirmation-modal'); // Закрываем модальное окно даже при ошибке
        });
});

// Обработчик кнопки "Нет" в модальном окне подтверждения
document.getElementById('cancel-delete').addEventListener('click', () => {
    // Закрываем модальное окно
    closeModal('delete-confirmation-modal');
});

// Обработчик для кнопки закрытия (крестик)
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function () {
        closeModal(this.closest('.modal').id);
    });
});

// Скрываем модальное окно при клике вне его
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
});

initializeGame();