import { Prisma } from "@prisma/client"
import Irepository from "@src/interface/IRepository"
import prisma from "@src/prisma"

export default class Repository implements Irepository {
	readonly modelName: string
	readonly instance: any
	
	constructor(modelName) {
		this.modelName = modelName
		this.instance = prisma[this.modelName]
	}

	/**
	 * Crée une nouvelle instance avec les données fournies.
	 * @param data - Les données nécessaires pour créer l'instance.
	 * @returns Une promesse qui résout l'instance créée.
	 */
	async create(data: any): Promise<any> {
		return await this.instance.create({ data })
	}

	/**
	 * Trouve toutes les instances correspondant aux critères de sélection donnés.
	 * @param select - Critères de sélection, exemple : {where: {params: value}, include: {table: boolean}}. Consultez la documentation de PRISMA pour plus de détails.
	 * @returns Une promesse qui résout un tableau contenant toutes les instances correspondantes.
	 */
	async findAll(select?:any): Promise<any[]> {
		return await this.instance.findMany({...select})
	}

	/**
	 * Trouve une instance par son ID.
	 * @param id - L'ID de l'instance à trouver.
	 * @param select - Critères de sélection optionnels.
	 * @returns Une promesse qui résout l'instance correspondante, ou null si aucune instance n'est trouvée.
	 */
	async findById(id: number | string, select?:any): Promise<any> {
		return await this.instance.findUnique({ where: { id }, ...select  })
	}

	/**
	 * Met à jour une instance par son ID avec les données fournies.
	 * @param id - L'ID de l'instance à mettre à jour.
	 * @param data - Les données pour mettre à jour l'instance.
	 * @returns Une promesse qui résout l'instance mise à jour.
	 */
	async update(id: number | string, data: any): Promise<any> {
		return await this.instance.update({ where: { id }, data })
	}

	/**
	 * Supprime une instance par son ID.
	 * @param id - L'ID de l'instance à supprimer.
	 * @returns Une promesse qui résout l'instance supprimée.
	 */
	async delete(id: number | string): Promise<any> {
		return await this.instance.delete({ where: { id } })
	}

	/**
	 * Trouve une instance par un champ spécifique et sa valeur correspondante.
	 * @param field - Le nom du champ à rechercher.
	 * @param value - La valeur correspondante du champ à rechercher.
	 * @param select - Critères de sélection optionnels.
	 * @returns Une promesse qui résout l'instance correspondante, ou null si aucune instance n'est trouvée.
	 */
	async findByField(field:string, value:string, select?:any): Promise<any> {
		return await this.instance.findUnique({ where: { [field]: value }, select })
	}
}