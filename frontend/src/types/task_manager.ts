export interface TaskData {
	id: number;
	name: string;
	description: string;
	next: number;
	done: boolean;
	start_date: string;
	finish_date: string;
	due_date: string;
}

export interface TableData {
	id: number;
	title: string;
	description: string;
	next: number;
	created_at: string;
	updated_at: string;
	tasks: TaskData[];
}

export interface action {
	id: number;
	task_id: number;
	method:
		| "Add"
		| "Delete"
		| "Replace"
		| "ReplaceTable"
		| "ReplaceTasks"
		| "AddTask"
		| "DeleteTask"
		| "ReplaceTask"
		| "DnDTable"
		| "DnD";
	sourceIndex: number;
	destinationIndex: number;
	toTable: number;
	tasks: TaskData[];
	tables: TableData[];
}
