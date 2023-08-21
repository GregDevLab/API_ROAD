import { Prisma } from "@prisma/client";
import { Repository } from "@src/core";
import Services from "@src/core/Services";

export default class ReactionServices extends Services {
	repository: Repository;
	ROADMAPS: string = 'roadmaps';
	ROADMAP: string = 'roadmap';

	constructor(private reactionRepository: Repository) {
		super()
		this.repository = reactionRepository
	}

	async existingFiled(param:any) {
		const reaction = await this.repository.existingField(param)
		return reaction
	}

	async create(data:Prisma.ReactionCreateInput) {
		return await this.repository.create(data)
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async update(id:string, data:Prisma.ReactionUpdateInput) {
		return await this.repository.update(id, data)
	}
}