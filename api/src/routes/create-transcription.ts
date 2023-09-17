import { FastifyInstance } from 'fastify';
import { createReadStream } from 'node:fs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { openai } from '../lib/openai';

export async function createTranscriptionRoute(app: FastifyInstance) {
	app.post('/videos/:videoID/transcription', async (req) => {
		const paramsSchema = z.object({
			videoID: z.string().uuid(),
		});

		const { videoID } = paramsSchema.parse(req.params); // Video ID get Video on DB

		const bodySchema = z.object({
			prompt: z.string(),
		});

		const { prompt } = bodySchema.parse(req.body); // Prompts received

		const video = await prisma.video.findUniqueOrThrow({
			where: {
				id: videoID,
			},
		}); // Video on DataBase

		const videoPath = video.path;
		const audioReadStream = createReadStream(videoPath);

		const responseOpenAI = await openai.audio.transcriptions.create({
			file: audioReadStream,
			model: 'whisper-1',
			language: 'pt',
			temperature: 0,
			prompt,
		});

		const transcription = responseOpenAI.text;

		await prisma.video.update({
			where: {
				id: videoID,
			},
			data: {
				transcription,
			},
		});

		return { transcription };
	});
}
