let fs = require('fs');


class Contenedor {

	constructor(fileName) {
		this.fileName = fileName;
		this.currentId = 1;
		const initialize = async (fileName) => {
			if (fs.existsSync(fileName)) {
				const fileContent = fs.readFileSync(fileName, 'utf-8');
				this.contenedor = JSON.parse(fileContent)
				this.currentId = Math.max.apply(Math, this.contenedor.map(function (o) { return o.id; })) + 1;
			} else {
				this.contenedor = []
			}
		}
		initialize(fileName);
	}

	writeToFile = async () => {
		try {
			await fs.promises.writeFile(this.fileName, JSON.stringify(this.contenedor));
		} catch (e) {
			console.error("error escribiendo");
		}
	}

	save = async (objeto) => {
		const obj = this.contenedor.find(o => o.id === objeto.id);
		if (obj) {
			this.contenedor = this.contenedor.map(obj => (obj.id === objeto.id) ? objeto : obj);
		} else {
			objeto.id = this.currentId;
			this.contenedor.push({ ...objeto, id: this.currentId });
			this.currentId++;
		}
		await this.writeToFile();
	}

	getById(id) {
		const result = this.contenedor.find(o => o.id === id);
		return (result) ? result : null;
	}

	getAll() {
		return this.contenedor;
	}

	async deleteById(id) {
		this.contenedor = this.contenedor.filter(x => x.id !== id);
		await this.writeToFile();
	}

	async deleteAll() {
		this.contenedor = [];
		await this.writeToFile();
	}
}

module.exports = {
	Contenedor,
};