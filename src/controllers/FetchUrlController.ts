import { Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default class FetchUrlController {

	fetchUrl = async (req: Request, res: Response) => {
		let url = req.query.url as string

		if (!url.startsWith("https://")) {
			if (url.startsWith("http://")) {
				url = url.replace("http://", "https://");
			} else {
				url = "https://" + url;
			}
		}

		if(!url) return res.json({ success: 0 });
		try {
			const response = await axios.get(url);
			const $ = cheerio.load(response.data);

			const title = $('title').text();
			const description = $('meta[name="description"]').attr('content');
			const image = $('meta[property="og:image"]').attr('content');

			return res.json({
				success: 1,
				link: url,
				meta: {
					title: title,
					description: description,
					image: {
						url: image,
					},
				},
			});
		} catch (error) {
			console.error(error);
			return res.json({ success: 0 });
		}
	}	
} 

