import { Prisma, User } from "@prisma/client";
import { Repository } from "@src/core";
import Services from "@src/core/Services";
import { CacheHandler } from "@src/utils";


type SafeUser = Omit<User, 'password' | 'refreshToken'>;

export default class UserServices extends Services {
	repository: Repository;
	USERS: string = 'users';
	USER: string = 'user';
	
	constructor(private userRepository: Repository) {
		super()
		this.repository = userRepository
	}

	async findAll(select?:Prisma.UserSelect) {
		const usersFromCache = CacheHandler.getCache([this.USERS,JSON.stringify(select)]);
		if(usersFromCache) return usersFromCache;

		const originalUsers = await this.repository.findAll(select);
		const safeUsers = originalUsers.map(this.sanitize);

		CacheHandler.setCacheIfNotExists([this.USERS, JSON.stringify(select)], safeUsers, 60 * 30);

		return safeUsers;
	}

	async findById(id: number | string, select?:Prisma.UserSelect) {
		const userFromCache = CacheHandler.getCache([this.USER, id,JSON.stringify(select)]);
		if(userFromCache) return userFromCache;
		console.log('not cached')
		const originalUser = await this.repository.findById(id, select)
		const safeUser = this.sanitize(originalUser);

		CacheHandler.setCacheIfNotExists([this.USER, id, JSON.stringify(select)], safeUser);
		
		return safeUser;
	}

	async update(id: number | string, data: User) {

		const user = await this.repository.update(id, data);
		const safeUser = this.sanitize(user);

		CacheHandler.updateCache([this.USER, id], safeUser);
		CacheHandler.deleteCacheByKey([this.USERS]);
		return safeUser;
	}

	async delete(id: number | string) {
		CacheHandler.deleteCacheByKey([this.USER, id]);
		CacheHandler.deleteCacheByKey([this.USERS]);
		return await this.repository.delete(id);
	}

}