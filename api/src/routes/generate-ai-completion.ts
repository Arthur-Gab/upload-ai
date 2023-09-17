import { FastifyInstance } from 'fastify';
import { createReadStream } from 'node:fs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { openai } from '../lib/openai';

export async function generateIACompletionRoute(app: FastifyInstance) {
	app.post('/ai/complete', async (req, res) => {
		const bodySchema = z.object({
			videoID: z.string().uuid(),
			template: z.string(),
			temperature: z.number().min(0).max(1).default(0.5),
		});

		const { videoID, template, temperature } = bodySchema.parse(req.body); // Prompts received

		const video = await prisma.video.findUniqueOrThrow({
			where: {
				id: videoID,
			},
		});

		if (!video.transcription) {
			return res
				.status(400)
				.send({ error: 'Video transcription was not generated yet' }); // video sem transcrição
		}

		const promptMessage = template.replace(
			'{transcription}',
			video.transcription
		);

		const responseOpenAI = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			temperature,
			messages: [{ role: 'user', content: promptMessage }],
		});

		return responseOpenAI;
	});
}
