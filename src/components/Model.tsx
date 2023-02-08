import { ColorsApp, validColor } from "./Theme";

export interface Task {
	id: number;
	text: string;
	date: number;
	done: boolean;
	tags: number[];
}

export interface Tag {
	id: number;
	label: string;
	color: validColor;
	ordering: number;
}

export const exampleTags: Tag[] = [
	{
		id: 0,
		label: "Universidade",
		color: ColorsApp.Indigo,
		ordering: 0,
	},
	{
		id: 1,
		label: "Estágio",
		color: ColorsApp.Orange,
		ordering: 1,
	},
	{
		id: 2,
		label: "Casa",
		color: ColorsApp.Green,
		ordering: 2,
	},
];

export const exampleData: Task[] = [
	{
		id: 1,
		text: "Entregar trabalho no escaninho",
		date: Date.now(),
		done: true,
		tags: [0],
	},
	{
		id: 2,
		text: "Comprar leite e ovos",
		date: Date.now() + 1,
		done: true,
		tags: [2],
	},
	{
		id: 3,
		text: "Pesquisar preços de segundo monitor",
		date: Date.now() + 2,
		done: false,
		tags: [2, 1],
	},
	{
		id: 4,
		text: "Devolver livros da biblioteca",
		date: Date.now() + 3,
		done: false,
		tags: [0],
	},
	{
		id: 5,
		text: "Terminar componente até quinta",
		date: Date.now() + 4,
		done: true,
		tags: [1],
	},
	{
		id: 6,
		text: "Escrever relatório",
		date: Date.now() + 5,
		done: true,
		tags: [1, 0],
	},
	{
		id: 7,
		text: "Pegar assinatura do professor",
		date: Date.now() + 6,
		done: false,
		tags: [1, 0],
	},
	{
		id: 8,
		text: "Fazer esqueleto da apresentação",
		date: Date.now() + 7,
		done: false,
		tags: [0],
	},
	{
		id: 9,
		text: "Chamar encanador!!",
		date: Date.now() + 8,
		done: false,
		tags: [2],
	},
];
