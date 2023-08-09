import jwt from 'jsonwebtoken';
type Data = {
	id: string;
	role: 'ADMIN' | 'USER'
}
export default class TokenHandler {
	constructor() {
	}
	static async generateToken(data:Data) {
		const token = await jwt.sign({ id: data.id, role: data.role }, process.env.JWT_SECRET, { expiresIn: 60 * 15 });
		return token;
	}

	static async generateRefreshToken(data:Data) {
		const token = await jwt.sign({ data }, process.env.JWT_REFRESH_SECRET, { expiresIn: 60 * 60 * 24 });
		return token;
	}

	static async verifyToken(token:string) {
		const decoded = await jwt.verify(token, process.env.JWT_SECRET);
		return decoded;
	}

	static async verifyRefreshToken(token:string) {
		const decoded = await jwt.verify(token, process.env.JWT_REFRESH_SECRET);
		return decoded;
	}
}

