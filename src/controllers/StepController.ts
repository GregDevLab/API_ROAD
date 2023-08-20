import { Controller, Repository } from "@src/core";
import { StepRepository } from "@src/repository";
import { StepServices } from "@src/services";
import { Request, Response } from "express";

export default class StepController extends Controller {

	readonly services: StepServices;
	readonly repository: Repository
	constructor() {
		super();
		this.repository = new StepRepository();
		this.services = new StepServices(this.repository);
	}

	getAll = async (req:Request, res:Response) => {
		try{
			const selectQuery = this.parser(req.query.select as string);
			const steps = await this.services.findAll(selectQuery);
			return this.sendSuccess(res, 200, 'Récupération des étapes réussis', steps);
		} catch(error) {
			return this.sendError(res, 500, 'Echec lors de la récupérations des étapes', error);
		}
	}

	getById = async (req:Request, res:Response) => {
		try{
			const { id } = req.params;
			const selectQuery = this.parser(req.query.select as string);
			const step = await this.services.findById(id, selectQuery);
			return this.sendSuccess(res, 200, 'Récupération de l\'étape réussie', step);
		} catch(error) {
			return this.sendError(res, 500, 'Echec lors de la récupération de l\'étape', error);
		} 
	}

	create = async (req:Request, res:Response) => {
		try{
			if(!req.user) return this.sendError(res, 401, 'Vous devez être connecté pour créer une étape', []);
			const data = req.body;
			const authorId = req.user.id;
			const step = await this.services.create(data, authorId);
			console.log("🚀 ~ file: StepController.ts:43 ~ StepController ~ step:", step)
			return this.sendSuccess(res, 200, 'Création de l\'étape réussie', step);
		} catch(error) {
			return this.sendError(res, 500, 'Echec lors de la création de l\'étape', error);
		}
	}

	update = async (req:Request, res:Response) => {
		try {
			const { id } = req.params;
			const data = req.body;
			console.log("🚀 ~ file: StepController.ts:54 ~ StepController ~ update= ~ data:", data)
			const step = await this.services.update(id, data);
			return this.sendSuccess(res, 200, 'Mise à jour de l\'étape réussie', step);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la mise à jour de l\'étape', error);
		}
	}

	delete = async (req:Request, res:Response) => {
		try {
			const { id } = req.params;
			const step = await this.services.delete(id);
			return this.sendSuccess(res, 200, 'Suppression de l\'étape réussie', step);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la suppression de l\'étape', error);
		}
	}
}