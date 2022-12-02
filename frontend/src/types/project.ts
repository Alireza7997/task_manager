import { parseISO } from "date-fns";

export default class Project {
	public id: number;
	public name: string;
	public created_at: Date;
	public updated_at: Date;
	constructor(
		id: string,
		name: string,
		created_at: string,
		updated_at: string
	) {
		this.id = parseInt(id);
		this.name = name;
		this.created_at = parseISO(created_at);
		this.updated_at = parseISO(updated_at);
	}
}
