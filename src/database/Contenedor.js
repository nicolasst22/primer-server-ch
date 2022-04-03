let fs = require('fs');


class Contenedor {

	constructor(fileName) {
		this.fileName = fileName;
		this.currentId = 1;
		const initialize = async (fileName) => {
			if (fs.existsSync(`./db/${fileName}.json`)) {
				const fileContent = fs.readFileSync(`./db/${fileName}.json`, 'utf-8');
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
			await fs.promises.writeFile(`./db/${this.fileName}.json`, JSON.stringify(this.contenedor));
		} catch (e) {
			console.error("error escribiendo", e);
		}
	}

	save = async (objeto) => {
		const obj = this.contenedor.find(o => o.id === objeto.id);
		let saved;
		if (obj) {
			this.contenedor = this.contenedor.map(obj => (obj.id === parseInt(objeto.id)) ? objeto : obj);
			saved = obj;
		} else {
			objeto.id = this.currentId;
			this.contenedor.push({ ...objeto, id: this.currentId });
			this.currentId++;
			saved = { ...objeto, id: this.currentId };
		}
		await this.writeToFile();
		return saved;
	}

	getById(id) {
		const result = this.contenedor.find(o => o.id === parseInt(id));
		return (result) ? result : null;
	}

	getAll() {
		return this.contenedor;
	}

	async deleteById(id) {
		this.contenedor = this.contenedor.filter(x => x.id !== parseInt(id));
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
