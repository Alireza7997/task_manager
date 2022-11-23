import { parseISO } from "date-fns";

export default class User {
	public username: string;
	public email: string;
	public created_at: Date;
	constructor(username: string, email: string, created_at: string) {
		this.username = username;
		this.email = email;
		this.created_at = parseISO(created_at);
	}
}
