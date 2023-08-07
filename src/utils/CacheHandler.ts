import cache from "@src/cache"

export default class CacheHandler {

	static setCacheIfNotExists = (key: string, data: any, ttl?:number) => {
		if(!cache.keys().includes(key)) {
			cache.set(key, data, ttl ?? 60 * 60);
		}
	}

	static getCache = (key: string) => {
		if(cache.keys().includes(key)) {
			return cache.get(key) 
		} 
		return null
	}

	static updateCache = (key: string, data: any, ttl?:number) => {
		cache.set(key, data, ttl ?? 60 * 60);
	}

	static deleteCacheByKey = (key: string) => {
		if(cache.keys().includes(key)) {
			cache.del(key) 
		} 
	}

}