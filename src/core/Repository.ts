import Irepository from "@src/interface/IRepository"
import prisma from "@src/prisma"

export default class Repository implements Irepository {
	readonly modelName: string
	readonly instance: any
	
	constructor(modelName) {
		this.modelName = modelName
		this.instance = prisma[this.modelName]
	}

	async create(data: any): Promise<any> {
		return await this.instance.create({ data })
	}

	async findAll(select?:any): Promise<any[]> {
		return await this.instance.findMany(select)
	}

	async findById(id: number | string, select?:any): Promise<any> {
		return await this.instance.findUnique({ where: { id }, select })
	}

	async update(id: number | string, data: any): Promise<any> {
		return await this.instance.update({ where: { id }, data })
	}

	async delete(id: number | string): Promise<any> {
		return await this.instance.delete({ where: { id } })
	}

	async findByField(field:string, value:string, select?:any): Promise<any> {
		return await this.instance.findUnique({ where: { [field]: value }, select })
	}

}