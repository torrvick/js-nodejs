const express = require('express');
const app = express();
const port = 3000;
// const usersStore = require('./storage/fsStorage');
const usersStore = require('./storage/dbStorage');
const { checkId, checkBody } = require('./validator');

app.use(express.json());

app.get('/users', (_req, res) => {
	usersStore.getAllUsers(res);
});

app.get('/users/:id', checkId, (req, res) => {
	usersStore.getUserById(req, res);
});

app.post('/users', checkBody, (req, res) => {
	usersStore.addUser(req, res);
});

app.put('/users/:id', checkId, checkBody, (req, res) => {
	usersStore.editUser(req, res);
});

app.delete('/users/:id', checkId, (req, res) => {
	usersStore.removeUser(req, res);
});

app.use((_req, res) => {
	res.status(404).send({ error: 'Неверный URL' });
});

app.listen(port, () => console.log(`Сервер слушает на порту ${port}!`));
