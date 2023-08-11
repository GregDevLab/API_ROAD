import { Prisma } from "@prisma/client";
import { Repository } from "@src/core";
import { CacheHandler, TokenHandler } from "@src/utils";
import bcrypt from 'bcrypt';
import { json } from "body-parser";

export default class AuthServices {
	repository: Repository;
	USERS: string = 'users';
	USER: string = 'user';
	constructor(private userRepository: Repository) {
		this.repository = userRepository
	}

	async signup(email: string, plainTextPassword: string, name: string) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
		const data = {
			email,
			password: hashedPassword,
			name
		}
		const isExist = await this.repository.findByField('email', email);
		if (isExist) throw new Error('Cet email est déjà utilisé');
		const user  = await this.repository.create(data);
		const {password, ...userRest} = user;
		CacheHandler.deleteCacheByKey([this.USERS]);
		return userRest
	}

	async signin(email: string, plainTextPassword: string) {
		const user = await this.repository.findByField('email', email);
		const isPasswordMatch = user ? await bcrypt.compare(plainTextPassword, user.password) : false;
		
		if (!user || !isPasswordMatch) {
			throw new Error('Erreur d`\'authentification, vérifier l`\'email et le mot de passe');
		}
		
		const {password, refreshToken, ...safeUser} = user;
		const token = await TokenHandler.generateToken(safeUser);
		const newRefreshToken = await TokenHandler.generateRefreshToken(user.id);
		await this.repository.update(user.id, {refreshToken: newRefreshToken});

		return {
			safeUser,
			token,
			newRefreshToken
		}
	}	

	async refreshToken(refreshToken: string) {
		const decoded = await TokenHandler.verifyRefreshToken(refreshToken);
		const user = await this.repository.findById(decoded.data);
		const {password, refreshToken: oldRefreshToken, ...safeUser} = user;
		
		if (!user || (oldRefreshToken !== refreshToken)) throw new Error('Le rafraichissement du token a échoué');


		const token = await TokenHandler.generateToken(safeUser);
		const newRefreshToken = await TokenHandler.generateRefreshToken(user.id);
		await this.repository.update(user.id, {refreshToken: newRefreshToken});
		return {
			safeUser,
			token,
			newRefreshToken
		}
	}

	async logout(refreshToken: string) {
		if (!refreshToken) return true
		const decoded = await TokenHandler.verifyRefreshToken(refreshToken);
		await this.repository.update(decoded.data, {refreshToken: null});
		return true
	}

	async authByToken(token: string, select:Prisma.UserSelect) {
		const decoded = await TokenHandler.verifyToken(token);
		const userFromCache = CacheHandler.getCache([this.USER, decoded.id, JSON.stringify(select)]);
		// if (userFromCache) return userFromCache;

		const user = await this.repository.findById(decoded.id, select);
		if (!user) throw new Error('L\'authentification a échoué');
		const {password, refreshToken, ...safeUser} = user;

		CacheHandler.setCacheIfNotExists([this.USER, decoded.id, JSON.stringify(select)], safeUser);

		return safeUser
	}
}