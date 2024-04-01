const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const usersFilePath = path.join(__dirname, 'users.json');

function getAllUsers(res) {
	try {
		const users = JSON.parse(fs.readFileSync(usersFilePath));

		res.send({ users });
	} catch (err) {
		handleError(err, res);
	}
}

function getUserById(req, res) {
	try {
		const users = JSON.parse(fs.readFileSync(usersFilePath));
		const foundedUser = users.find((user) => user.id === req.params.id);

		if (!foundedUser) {
			return res.status(404).send({ user: null });
		}

		res.status(200).send({ user: foundedUser });
	} catch (err) {
		handleError(err, res);
	}
}

function addUser(req, res) {
	try {
		let users = [];
		if (fs.existsSync(usersFilePath)) {
			users = JSON.parse(fs.readFileSync(usersFilePath));
		}

		const user = { id: uuidv4(), ...req.body };
		users.push(user);

		fs.writeFileSync(usersFilePath, JSON.stringify(users));

		res.send({ user });
	} catch (err) {
		handleError(err, res);
	}
}

function editUser(req, res) {
	try {
		const users = JSON.parse(fs.readFileSync(usersFilePath));
		let foundedUser = users.find((user) => user.id === req.params.id);

		if (!foundedUser) {
			return res.status(404).send({ user: null });
		}

		Object.assign(foundedUser, req.body);
		fs.writeFileSync(usersFilePath, JSON.stringify(users));

		res.send({ user: foundedUser });
	} catch (err) {
		handleError(err, res);
	}
}

function removeUser(req, res) {
	try {
		const users = JSON.parse(fs.readFileSync(usersFilePath));
		let foundedUserIndex = users.findIndex((user) => user.id === req.params.id);

		if (foundedUserIndex < 0) {
			return res.status(404).send({ user: null });
		}

		const userToRemove = users[foundedUserIndex];
		users.splice(foundedUserIndex, 1);

		fs.writeFileSync(usersFilePath, JSON.stringify(users));

		res.send({ user: userToRemove });
	} catch (err) {
		handleError(err, res);
	}
}

function handleError(err, res) {
	console.log(`Ошибка: ${err.message}`);
	res.status(500).send({ error: 'Ошибка сервера' });
}

module.exports = {
	getAllUsers,
	getUserById,
	addUser,
	editUser,
	removeUser,
};
