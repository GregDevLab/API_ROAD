import { Repository } from "@src/core";
import Services from "@src/core/Services";
import { CacheHandler } from "@src/utils";
import { Prisma, Step } from "@prisma/client";
export default class StepServices extends Services {
	repository: Repository;
	STEP: string = 'step';
	STEPS: string = 'steps';
	constructor(private stepRepository: Repository) {
		super();
		this.repository = stepRepository
	}


	async findAll(select?:Prisma.StepSelect){
		const stepsFromCache = CacheHandler.getCache([this.STEPS,JSON.stringify(select)]);
		if(stepsFromCache) return stepsFromCache;

		const originalSteps = await this.repository.findAll(select);
		const sanitize = originalSteps.map(step => ({
				...step,
				author: step.author ? this.sanitize(step.author) : null
		}))

		CacheHandler.setCacheIfNotExists([this.STEPS,JSON.stringify(select)], sanitize, 60 * 30);

		return sanitize;
	}

	async findById(id: number | string, select?:Prisma.StepSelect){
		const stepFromCache = CacheHandler.getCache([this.STEP,JSON.stringify(select)]);
		if(stepFromCache) return stepFromCache;

		const originalStep = await this.repository.findById(id, select);
		const sanitize = originalStep.author ? this.sanitize(originalStep) : originalStep;

		CacheHandler.setCacheIfNotExists([this.STEP,JSON.stringify(select)], sanitize);

		return sanitize;
	}

	async create(data: Prisma.StepCreateInput){
		CacheHandler.deleteCacheByKey([this.STEPS]);
		return await this.repository.create(data);
	}

	async update(id: number | string, data: Step){
		const originalStep = await this.repository.update(id, data);
		const sanitize = originalStep.author ? this.sanitize(originalStep) : originalStep;


		CacheHandler.updateCache([this.STEP, id], sanitize);
		CacheHandler.deleteCacheByKey([this.STEPS]);
		return sanitize;
	}

	async delete(id: number | string){
		CacheHandler.deleteCacheByKey([this.STEP, id]);
		CacheHandler.deleteCacheByKey([this.STEPS]);
		return await this.repository.delete(id);
	}
}