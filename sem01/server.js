const http = require('http');
const visitCounts = {
	'/': 0,
	'/about': 0,
	404: 0,
};

const server = http.createServer((req, res) => {
	let content = '';
	let errorCode = null;

	switch (req.url) {
		case '/':
			visitCounts[req.url]++;
			content = `<h1>Главная страница</h1>
                        <p>Эту страницу посетили ${visitCounts[req.url]} раз</p>
                        <a href="/about">О сайте</a>`;
			break;
		case '/about':
			visitCounts[req.url]++;
			content = `<h1>О сайте</h1>
                        <p>Эту страницу посетили ${visitCounts[req.url]} раз</p>
                        <a href="/">Главная страница</a>`;
			break;
		default:
			errorCode = 404;
			visitCounts['404']++;
			content = `<h1>Неверный адрес</h1>
                        <p>Эту страницу посетили ${visitCounts['404']} раз</p>
                        <a href="/">Главная страница</a>`;
	}

	res.writeHead(errorCode ? errorCode : 200, { 'Content-Type': 'text/html; charset=UTF-8' });
	res.end(content);
});

const PORT = 3000;
server.listen(PORT, () => {
	console.log(`Сервер доступен на порту ${PORT}`);
});
