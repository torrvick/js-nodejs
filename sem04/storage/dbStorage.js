const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const database = './storage/users.db';

const db = new sqlite3.Database(database, (err) => {
	if (err) {
		console.error(err.message);
	} else {
		db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        lastName TEXT,
        age INTEGER,
        city TEXT
        )
    `);
	}
});

function getAllUsers(res) {
	db.all('SELECT * FROM users', (err, users) => {
		if (err) {
			handleError(err, res);
		} else if (!users) {
			res.status(404).send({ users: null });
		} else {
			res.send({ users });
		}
	});
}

function getUserById(req, res) {
	db.get('SELECT * FROM users WHERE id = ?', req.params.id, (err, user) => {
		if (err) {
			handleError(err, res);
		} else if (!user) {
			res.status(404).send({ user: null });
		} else {
			res.send({ user });
		}
	});
}

function addUser(req, res) {
	const user = { id: uuidv4(), ...req.body };
	db.run('INSERT INTO users VALUES (?, ?, ?, ?, ?)', ...Object.values(user), (err) => {
		if (err) {
			handleError(err, res);
		} else {
			res.send({ user });
		}
	});
}

function editUser(req, res) {
	const { name, lastName, age, city } = req.body;
	const { id } = req.params;
	db.get('SELECT * FROM users WHERE id = ?', id, (err, user) => {
		if (err) {
			handleError(err, res);
		} else if (!user) {
			return res.status(404).send({ user: null });
		} else {
			const query = `
				UPDATE users SET
				name=?,
				lastName=?,
				age=?,
				city=?
				WHERE id=?
			`;
			db.run(query, [name, lastName, age, city, id], (err) => {
				if (err) {
					handleError(err, res);
				} else {
					res.send({ user: { id, name, lastName, age, city } });
				}
			});
		}
	});
}

function removeUser(req, res) {
	const { id } = req.params;
	db.get('SELECT * FROM users WHERE id = ?', id, (err, user) => {
		if (err) {
			handleError(err, res);
		} else if (!user) {
			return res.status(404).send({ user: null });
		} else {
			db.run('DELETE FROM users WHERE id=?', id, (err) => {
				if (err) {
					res.status(500).send({ error: 'Ошибка сервера' });
				} else {
					res.send({ user });
				}
			});
		}
	});
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
