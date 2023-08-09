import cache from "@src/cache"

type keyType = [key:string, id?:string | number | undefined, subKey?:string | number | undefined]
export default class CacheHandler {

	/**
   * Met en cache les données si la clé n'existe pas déjà.
   * @param {keyType} key - Un tableau contenant les parties de la clé.
   * @param {any} data - Les données à mettre en cache.
   * @param {number} [ttl] - Durée de vie du cache en secondes (par défaut 1 heure).
   */
	static setCacheIfNotExists = (key: keyType, data: any, ttl?:number) => {
		if(!cache.keys().includes(key.join('-'))) {
			cache.set(key.join('-'), data, ttl ?? 60 * 60);
		}
	}

	/**
   * Récupère les données du cache en utilisant une clé donnée.
   * @param {keyType} key - Un tableau contenant les parties de la clé.
   * @return {any | null} Les données depuis le cache ou null si la clé n'est pas trouvée.
   */
	static getCache = (key: keyType) => {
		if(cache.keys().includes(key.join('-'))) {
			console.log("🚀 ~ file: CacheHandler.ts:15 ~ CacheHandler ~ cache.get(key.join('-')):", cache.get(key.join('-')))
			return cache.get(key.join('-')) 
		} 
		return null
	}

	/**
   * Met à jour les données du cache pour une clé donnée.
   * @param {keyType} key - Un tableau contenant les parties de la clé.
   * @param {any} data - Les nouvelles données à mettre en cache.
   * @param {number} [ttl] - Durée de vie du cache en secondes (par défaut 1 heure).
   */
	static updateCache = (key: keyType, data: any, ttl?:number) => {
		this.deleteCacheByKey(key)
		cache.set(key.join('-'), data, ttl ?? 60 *60);
	}

	/**
   * Supprime les données du cache en utilisant une clé donnée.
   * @param {keyType} key - Un tableau contenant les parties de la clé.
   */
	static deleteCacheByKey = (key: keyType) => {
		cache.keys().forEach((cacheKey) => {
			if(cacheKey.includes(key.join('-'))) {
				cache.del(cacheKey)
			}
		})
	}

}