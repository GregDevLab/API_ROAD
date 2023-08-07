import { Controller, Repository } from "@src/core";
import { UserRepository } from "@src/repository";
import { AuthServices } from "@src/services";


export default class AuthController extends Controller {

	readonly services: AuthServices;
	readonly repository: Repository

	constructor() {
		super()
		this.repository = new UserRepository();
		this.services = new AuthServices(this.repository);
	}

	private sendTokenCookies = (res: any, token: string, refreshToken: string) => {
		res.cookie('token', token, { httpOnly: true, secure:true,  maxAge: 1000 * 60 * 15 });
		res.cookie('refreshToken', refreshToken, { httpOnly: true,secure:true, maxAge: 1000 * 60 * 60 * 24 });
	}

	private clearTokenCookies = (res: any) => {
		res.clearCookie('token', { httpOnly: true, secure: true});
		res.clearCookie('refreshToken', { httpOnly: true, secure: true});
	}

	signin = async (req: any, res: any) => {
		try {
			const { email, password } = req.body;
			const user = await this.services.signin(email, password);
			const {token, newRefreshToken, ...safeUser} = user;
			this.sendTokenCookies(res, token, newRefreshToken);
			return this.sendSuccess(res, 200, 'Connexion réussie', safeUser);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la connexion', error);
		}
	}

	signup = async (req: any, res: any) => {
		try {
			const { email, password, name } = req.body;
			const user = await this.services.signup(email, password, name);
			
			return this.sendSuccess(res, 200, 'Inscription réussie', user);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de l\'inscription', error);
		}
	}



	refreshToken = async (req: any, res: any) => {
		try {
			const { refreshToken } = req.cookies;
			const data = await this.services.refreshToken(refreshToken);

			const {token, newRefreshToken, ...safeUser} = data;

			this.sendTokenCookies(res, token, newRefreshToken);
			return this.sendSuccess(res, 200, 'Refresh token réussi', safeUser);
		} catch (error) {
			this.clearTokenCookies(res);
			return this.sendError(res, 403, error.message ?? 'Echec lors du refresh token', error);
		}
	}

	logout = async (req: any, res: any) => {
		try {
			const refreshToken = req.cookies.refreshToken;
			await this.services.logout(refreshToken);
			this.clearTokenCookies(res);
			return this.sendSuccess(res, 200, 'Déconnexion réussie',[]);
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de la déconnexion', error);
		}
	}

	authByToken = async (req: any, res: any) => {
		try {
			const { token } = req.cookies;
			const user = await this.services.authByToken(token);
			return this.sendSuccess(res, 200, 'Authentification réussie', user);
		} catch (error) {
			return this.sendError(res, 403, 'Echec lors de l\'authentification', error);
		}
	}

}