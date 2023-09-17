import { FastifyInstance } from 'fastify';
import { fastifyMultipart } from '@fastify/multipart';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { prisma } from '../lib/prisma';

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
	app.register(fastifyMultipart, {
		limits: {
			fileSize: 1_048_576 * 25, // 25 MB
		},
	});

	app.post('/videos', async (req, res) => {
		const data = await req.file();

		if (!data) {
			return res.status(400).send({ error: 'Missing file input.' }); // sem arquivo
		}

		const extension = path.extname(data.filename);

		if (extension !== '.mp3') {
			return res
				.status(400)
				.send({ error: 'Invalid input type, please upload a MP3.' }); // arquivo não é mp3
		}

		const fileBaseName = path.basename(data.filename, extension); // example.mp3 → example
		const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`; // example-12341234.mp3

		// Save file inside tmp
		const uploadDestination = path.resolve(
			__dirname,
			'../../tmp',
			fileUploadName
		);

		await pump(data.file, fs.createWriteStream(uploadDestination)); // alias for promisify(pipeline)

		const video = await prisma.video.create({
			data: {
				name: data.filename,
				path: uploadDestination,
			},
		});

		return {
			video,
		};
	});
}
