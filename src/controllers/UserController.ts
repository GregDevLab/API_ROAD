import { Controller, Repository } from "@src/core";
import { UserRepository } from "@src/repository";
import { UserServices } from "@src/services";
import { Request, Response } from "express";

export default class UserController extends Controller {

	readonly services: UserServices;
	readonly repository: Repository
	constructor() {
		super()
		this.repository = new UserRepository();
		this.services = new UserServices(this.repository);
	}

	getAll = async (req: Request, res: Response) => {
		try {
			const selectQuery = this.parser(req.query.select as string);
			const users = await this.services.findAll(selectQuery);
			return this.sendSuccess(res, 200, 'Récupération des utilisateurs réussis', users);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la récupérations des utilisateurs', error);
		}
	}

	getById = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const selectQuery = this.parser(req.query.select as string);
			const user = await this.services.findById(id, selectQuery);
			return this.sendSuccess(res, 200, 'Récupération de l\'utilisateur réussie', user);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la récupération de l\'utilisateur', error);
		}
	}

	update = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const data = req.body;
			const user = await this.services.update(id, data);
			return this.sendSuccess(res, 200, 'Mise à jour de l\'utilisateur réussie', user);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la mise à jour de l\'utilisateur', error);
		}
	}

	delete = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const user = await this.services.delete(id);
			return this.sendSuccess(res, 200, 'Suppression de l\'utilisateur réussie', user);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la suppression de l\'utilisateur', error);
		}
	}

}