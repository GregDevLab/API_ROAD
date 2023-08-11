import { Roadmap } from "@prisma/client";
import { Controller, Repository } from "@src/core";
import { RoadmapRepository } from "@src/repository";
import RoadmapServices from "@src/services/RoadmapServices";

export default class RoadmapController extends Controller {
	readonly services: RoadmapServices;
	readonly repository: Repository
	constructor() {
		super()
		this.repository = new RoadmapRepository();
		this.services = new RoadmapServices(this.repository);
	}

	getAll = async (req: any, res: any) => {
		try {
			const selectQuery = this.parser(req.query.select as string);
			console.log("🚀 ~ file: RoadmapController.ts:17 ~ RoadmapController ~ getAll= ~ selectQuery:", selectQuery)
			const roadmaps = await this.services.findAll(selectQuery)
			return this.sendSuccess(res, 200, 'Liste des roadmaps', roadmaps);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la récupération des roadmaps', error);
		}
	}

	getById = async (req: any, res: any) => {
		try {
			const { id } = req.params;
			const roadmap = await this.services.findById(id);
			return this.sendSuccess(res, 200, 'Roadmap', roadmap);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la récupération de la roadmap', error);
		}
	}

	create = async (req: any, res: any) => {
		try {
			const authorId = req.user.id;
			const data = req.body
			data.authorId = authorId
			const roadmap = this.services.create(data)
			return this.sendSuccess(res, 200, 'Roadmap créée', []);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la création de la roadmap', error);
		}
	}

	update = async (req: any, res: any) => {
		try {
			const { id } = req.params;
			const data = req.body
			const roadmap = await this.services.update(id, data)
			return this.sendSuccess(res, 200, 'Roadmap modifiée', roadmap);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la modification de la roadmap', error);
		}
	}

	delete = async (req: any, res: any) => {
		try {
			const { id } = req.params;
			const roadmap = await this.services.delete(id)
			return this.sendSuccess(res, 200, 'Roadmap supprimée', []);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la suppression de la roadmap', error);
		}
	}
	
}