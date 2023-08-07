import { Prisma, User } from "@prisma/client";
import { Repository } from "@src/core";
import { CacheHandler } from "@src/utils";


type SafeUser = Omit<User, 'password' | 'refreshToken'>;

export default class UserServices {
	repository: Repository;
	constructor(private userRepository: Repository) {
		this.repository = userRepository
	}

	private safeUser(user: User): SafeUser {
		const {password, refreshToken, ...userCopy} = user 
		return userCopy;
	}

	async findAll(select?:Prisma.UserSelect) {
		const usersFromCache = CacheHandler.getCache(`users-${JSON.stringify(select)}}`);
		const originalUsers = await this.repository.findAll(select);
		const safeUsers = usersFromCache ?? originalUsers.map(this.safeUser);
		CacheHandler.setCacheIfNotExists(`users-${JSON.stringify(select)}}`, safeUsers, 60 * 30);
		return safeUsers;
	}

	async findById(id: number | string, select?:Prisma.UserSelect) {
		const userFromCache = CacheHandler.getCache(`user-${id}`);
		const originalUser = await this.repository.findById(id, select)
		const safeUser = userFromCache ?? this.safeUser(originalUser);
		CacheHandler.setCacheIfNotExists(`user-${id}`, safeUser);
		return safeUser;
	}

	async update(id: number | string, data: User) {
		const user = await this.repository.update(id, data);
		const safeUser = this.safeUser(user);
		CacheHandler.updateCache(`user-${id}`, safeUser);
		return safeUser;
	}

	async delete(id: number | string) {
		CacheHandler.deleteCacheByKey(`user-${id}`);
		return await this.repository.delete(id);
	}

}