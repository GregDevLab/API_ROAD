import { User } from "@prisma/client";
import { Response } from "express";

export default class Services {

	constructor() {
	}

	sanitize(data: User) {
		if(data.password || data.refreshToken) {
			const { password,refreshToken, ...rest } = data;
			return rest;
		}
		return data;
	}

}