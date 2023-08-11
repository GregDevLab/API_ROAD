import { Prisma, Roadmap, User } from "@prisma/client";
import { Repository } from "@src/core";
import Services from "@src/core/Services";
import { CacheHandler } from "@src/utils";
import fs from 'fs';
import path from "path";

type RoadmapWithAuthor = Roadmap & {author?: User};


export default class RoadmapServices extends Services{
	repository: Repository;
	ROADMAPS: string = 'roadmaps';
	ROADMAP: string = 'roadmap';
	
	constructor(private roadmapRepository: Repository) {
		super()
		this.repository = roadmapRepository
	}

	async findAll(select?:Prisma.RoadmapSelect) {
		const roadmapsFromCache = CacheHandler.getCache([this.ROADMAPS, JSON.stringify(select)]) as RoadmapWithAuthor[] | undefined;
		if(roadmapsFromCache) return roadmapsFromCache;

		const roadmaps = await this.repository.findAll(select) as RoadmapWithAuthor[];
		const sanitize = roadmaps.map(roadmap => ({
				...roadmap,
				author: roadmap.author ? this.sanitize(roadmap.author) : null
		}))
		
		CacheHandler.setCacheIfNotExists([this.ROADMAPS, JSON.stringify(select)], sanitize, 60 * 30);
		return sanitize;
	}

	async findById(id: number | string, select?:Prisma.RoadmapSelect) {
		const roadmapFromCache = CacheHandler.getCache([this.ROADMAP, id,JSON.stringify(select)]) as RoadmapWithAuthor;
		if(roadmapFromCache) return roadmapFromCache;

		const roadmap = await this.repository.findById(id, select) as RoadmapWithAuthor;
		const sanitize = roadmap.author ? this.sanitize(roadmap.author) : roadmap

		CacheHandler.setCacheIfNotExists([this.ROADMAP, id,JSON.stringify(select)], sanitize);

		return sanitize;
	}

	async create(data: Prisma.RoadmapCreateInput) {
		CacheHandler.deleteCacheByKey([this.ROADMAPS]);
		return await this.repository.create(data);
	}

	async update(id: number | string, data: Prisma.RoadmapUpdateInput) {
		const oldRoadmap = await this.repository.findById(id);
		const updatedRoadmap = await this.repository.update(id, data);
		const sanitize = updatedRoadmap.author ? this.sanitize(updatedRoadmap.author) : updatedRoadmap
		if(oldRoadmap.imageUrl !== updatedRoadmap.imageUrl) {
			fs.unlink(`${path.join(__dirname, '../uploads')}/${oldRoadmap.imageUrl}`, (err) => {
				if (err) {
					console.error(err)
				}
			})
		}
		CacheHandler.updateCache([this.ROADMAP, id], sanitize);
		CacheHandler.deleteCacheByKey([this.ROADMAPS]);

		return sanitize;
	}

	async delete(id: number | string) {
		CacheHandler.deleteCacheByKey([this.ROADMAP, id]);
		CacheHandler.deleteCacheByKey([this.ROADMAPS]);
		const roadmap = await this.repository.delete(id);
		console.log("🚀 ~ file: RoadmapServices.ts:66 ~ RoadmapServices ~ delete ~ roadmap:", roadmap)
		if(roadmap) {
			fs.unlink(`${path.join(__dirname, '../uploads')}/${roadmap.imageUrl}`, (err) => {
				if (err) {
					console.error(err)
					return
				}
			})
		}
		return roadmap;
	}
}