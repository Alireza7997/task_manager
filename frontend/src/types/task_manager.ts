export interface TaskData {
	id: number;
	name: string;
	description: string;
	done: boolean;
}

export interface TableData {
	id: number;
	title: string;
	description: string;
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
		| "DeleteTask";
	tasks: TaskData[];
	tables: TableData[];
}
