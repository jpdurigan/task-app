export interface Note {
	id: number;
	text: string;
	date: number;
	done: boolean;
	tags: string[];
}

export const exampleData: Note[] = [
	{
		id: 1,
		text: "Entregar trabalho no escaninho",
		date: Date.now(),
		done: true,
		tags: ["Universidade"],
	},
	{
		id: 2,
		text: "Comprar leite e ovos",
		date: Date.now() + 1,
		done: true,
		tags: ["Casa"],
	},
	{
		id: 3,
		text: "Pesquisar preços de segundo monitor",
		date: Date.now() + 2,
		done: false,
		tags: ["Casa", "Estágio"],
	},
	{
		id: 4,
		text: "Devolver livros da biblioteca",
		date: Date.now() + 3,
		done: false,
		tags: ["Universidade"],
	},
	{
		id: 5,
		text: "Terminar componente até quinta",
		date: Date.now() + 4,
		done: true,
		tags: ["Estágio"],
	},
	{
		id: 6,
		text: "Escrever relatório",
		date: Date.now() + 5,
		done: true,
		tags: ["Estágio", "Universidade"],
	},
	{
		id: 7,
		text: "Pegar assinatura do professor",
		date: Date.now() + 6,
		done: false,
		tags: ["Estágio", "Universidade"],
	},
	{
		id: 8,
		text: "Fazer esqueleto da apresentação",
		date: Date.now() + 7,
		done: false,
		tags: ["Universidade"],
	},
	{
		id: 9,
		text: "Chamar encanador!!",
		date: Date.now() + 8,
		done: false,
		tags: ["Casa"],
	},
];
