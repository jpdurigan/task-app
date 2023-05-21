import { ValidColor } from "./Theme";

export interface Task {
	id: string;
	text: string;
	date: number;
	done: boolean;
	tags: string[];
}

export interface Tag {
	id: string;
	label: string;
	color: ValidColor;
	ordering: number;
}

export const exampleTags: Tag[] = [
	{
		id: "0",
		label: "Universidade",
		color: "indigo",
		ordering: 0,
	},
	{
		id: "1",
		label: "Estágio",
		color: "orange",
		ordering: 1,
	},
	{
		id: "2",
		label: "Casa",
		color: "green",
		ordering: 2,
	},
];

export const exampleTasks: Task[] = [
	{
		id: "2",
		text: "Comprar leite e ovos",
		date: Date.now() + 1,
		done: true,
		tags: ["2"],
	},
	{
		id: "3",
		text: "Pesquisar preços de segundo monitor",
		date: Date.now() + 2,
		done: false,
		tags: ["2", "1"],
	},
	{
		id: "4",
		text: "Devolver livros da biblioteca",
		date: Date.now() + 3,
		done: false,
		tags: ["0"],
	},
	{
		id: "5",
		text: "Terminar componente até quinta",
		date: Date.now() + 4,
		done: true,
		tags: ["1"],
	},
];
