const asTable = require('as-table');
const fs = require('fs');
require('colors');

const colors = {
	0: 'red',
	1: 'green',
	2: 'yellow',
	3: 'blue',
	4: 'magenta',
	5: 'cyan',
};

function readCSV(filename) {
	let data = fs.readFileSync(filename, 'utf8').toString();
	try {
		data = fs.readFileSync(filename, 'utf8').toString();
	} catch (e) {
		throw new Error('Файл не найден');
	}
	const arr = data.split('\n');
	console.log('sdfsdf');
	const tableData = arr.map((element) => {
		const record = element.split(';');
		let resObject = [];
		record.forEach((param, index) => {
			if (index > Object.keys(colors).length - 1) {
				index = (index - Object.keys(colors).length) % 10;
			}
			resObject.push(param.replace('\r', '')[colors[index]]);
		});
		return resObject;
	});
	return asTable(tableData);
}

module.exports = readCSV;
