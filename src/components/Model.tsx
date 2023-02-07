import { ColorsApp, validColor } from "./Theme";

export interface Note {
	id: number;
	text: string;
	date: number;
	done: boolean;
	tags: Tag[];
}

export interface Tag {
	id: number;
	label: string;
	color: validColor;
	ordering: number;
}

export const exampleTags: { [key: string]: Tag } = {
	uni: {
		id: 0,
		label: "Universidade",
		color: ColorsApp.Indigo,
		ordering: 0,
	},
	work: {
		id: 1,
		label: "Estágio",
		color: ColorsApp.Orange,
		ordering: 1,
	},
	home: {
		id: 2,
		label: "Casa",
		color: ColorsApp.Green,
		ordering: 2,
	},
};

export const knownTags: Tag[] = [
	exampleTags.uni,
	exampleTags.work,
	exampleTags.home,
];

export const exampleData: Note[] = [
	{
		id: 1,
		text: "Entregar trabalho no escaninho",
		date: Date.now(),
		done: true,
		tags: [exampleTags.uni],
	},
	{
		id: 2,
		text: "Comprar leite e ovos",
		date: Date.now() + 1,
		done: true,
		tags: [exampleTags.home],
	},
	{
		id: 3,
		text: "Pesquisar preços de segundo monitor",
		date: Date.now() + 2,
		done: false,
		tags: [exampleTags.home, exampleTags.work],
	},
	{
		id: 4,
		text: "Devolver livros da biblioteca",
		date: Date.now() + 3,
		done: false,
		tags: [exampleTags.uni],
	},
	{
		id: 5,
		text: "Terminar componente até quinta",
		date: Date.now() + 4,
		done: true,
		tags: [exampleTags.work],
	},
	{
		id: 6,
		text: "Escrever relatório",
		date: Date.now() + 5,
		done: true,
		tags: [exampleTags.work, exampleTags.uni],
	},
	{
		id: 7,
		text: "Pegar assinatura do professor",
		date: Date.now() + 6,
		done: false,
		tags: [exampleTags.work, exampleTags.uni],
	},
	{
		id: 8,
		text: "Fazer esqueleto da apresentação",
		date: Date.now() + 7,
		done: false,
		tags: [exampleTags.uni],
	},
	{
		id: 9,
		text: "Chamar encanador!!",
		date: Date.now() + 8,
		done: false,
		tags: [exampleTags.home],
	},
];
