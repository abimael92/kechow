export interface AuthCredentials {
	email: string;
	password: string;
}

export interface RegisterPayload extends AuthCredentials {
	name: string;
	password_confirmation: string;
	role: string;
}

export interface AuthUser {
	id: number;
	name: string;
	email: string;
	role: string;
}
