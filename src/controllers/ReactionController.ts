import { Controller, Repository } from "@src/core";
import { ReactionRepository } from "@src/repository";
import { ReactionServices } from "@src/services";
import { CacheHandler } from "@src/utils";
import { Request, Response } from "express";

enum ERaeactionType {
	LIKE = 'LIKE',
	DISLIKE = "DISLIKE"
}
interface IDataReaction {
	type: ERaeactionType,
	roadmapId: string,
	userId: string
}

export default class ReactionController extends Controller {
    readonly services: ReactionServices;
    readonly repository: Repository;
	ROADMAPS: string = 'roadmaps';
	ROADMAP: string = 'roadmap';

    constructor() {
        super();
        this.repository = new ReactionRepository();
        this.services = new ReactionServices(this.repository);
    }

    private async createReaction(res: Response, data:IDataReaction) {
        try {
            const reaction = await this.services.create({
                type: data.type,
                user: { connect: { id: data.userId } },
                roadmap: { connect: { id: data.roadmapId } }
            });
            return this.sendSuccess(res, 200, `${data.type}`, reaction);
        } catch (error) {
            return this.sendError(res, 500, "Erreur lors de la création de la réaction.", error);
        }
    }

    private async deleteReaction(res: Response, reactionId: string, unType: 'UNLIKE' | 'UNDISLIKE') {
        try {
            const reaction = await this.services.delete(reactionId);
            return this.sendSuccess(res, 200, `${unType}`, reaction);
        } catch (error) {
            return this.sendError(res, 500, "Erreur lors de la suppression de la réaction.", error);
        }
    }

    private async updateReaction(res: Response, reactionId: string, type: ERaeactionType) {
        try {
            const reaction = await this.services.update(reactionId, { type });
            return this.sendSuccess(res, 200, `MOVE-TO-${type}`, reaction);
        } catch (error) {
            return this.sendError(res, 500, "Erreur lors de la mise à jour de la réaction.", error);
        }
    }

    reactHandler = async (req: Request, res: Response) => {
        const { roadmapId, type } = req.body;
		CacheHandler.deleteCacheByKey([this.ROADMAPS]);
		CacheHandler.deleteCacheByKey([this.ROADMAP,roadmapId]);
        if (!req?.user?.id || !roadmapId) {
            return this.sendError(res, 400, 'Information manquante!', []);
        }

        const data = {
            roadmapId,
            userId: req.user.id,
            type
        };

        try {
            const existingReaction = await this.services.existingFiled({
                where: {
                    userId: req.user.id,
                    roadmapId
                }
            });

            if (!existingReaction) {
                return await this.createReaction(res, data);
            }

            if (existingReaction.type === type) {
				const unType = type === 'LIKE' ? 'UNLIKE' : 'UNDISLIKE'
                return await this.deleteReaction(res, existingReaction.id, unType);
            }

            return await this.updateReaction(res, existingReaction.id, type);
        } catch (error) {
            return this.sendError(res, 500, "Erreur lors de la gestion de la réaction.", error);
        }
    }
}
