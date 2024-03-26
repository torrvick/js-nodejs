const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use((req, _res, next) => {
	if (req.url === '/') {
		req.url = '/index';
	}
	next();
});

app.use(express.static('static'));

app.get('/:page', (req, res) => {
	const page = req.params.page;

	const staticBase = path.join(__dirname, 'static');
	const pageFilePath = path.join(staticBase, `${page}.html`);
	const errorFilePath = path.join(staticBase, '404.html');

	let reqFileContent = '';
	let countingURL = req.url;

	if (fs.existsSync(pageFilePath)) {
		reqFileContent = fs.readFileSync(pageFilePath, 'utf8');
	} else {
		reqFileContent = fs.readFileSync(errorFilePath, 'utf8');
		countingURL = '/404';
	}

	const visitCountFilePath = path.join(__dirname, 'visitCounts.json');
	let visitCounts = {};

	if (fs.existsSync(visitCountFilePath)) {
		visitCounts = JSON.parse(fs.readFileSync(visitCountFilePath));
	}

	visitCounts[countingURL] = visitCounts[countingURL] ? visitCounts[countingURL] + 1 : 1;
	fs.writeFileSync(path.join(__dirname, 'visitCounts.json'), JSON.stringify(visitCounts));

	reqFileContent = reqFileContent.replace('{{viewCount}}', visitCounts[countingURL]);
	res.send(reqFileContent);
});

app.listen(3000, () => console.log('Сервер работает'));
