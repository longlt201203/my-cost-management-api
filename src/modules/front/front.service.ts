import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as unzipper from "unzipper";

@Injectable()
export class FrontService {
	async deploy(file: Express.Multer.File) {
		const uploadsFolderPath = "uploads";
		const filePath = path.join(uploadsFolderPath, file.filename);
		const publicFolderPath = "public";
		try {
			if (fs.existsSync(publicFolderPath))
				fs.rmdirSync(publicFolderPath, { recursive: true });
			const dir = await unzipper.Open.file(filePath);
			await dir.extract({ path: publicFolderPath });
		} catch (err) {}

		fs.rmSync(uploadsFolderPath, { recursive: true });
	}
}