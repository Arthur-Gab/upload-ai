import { FileVideo, Loader2, ThumbsUp, Upload } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import { Separator } from '@radix-ui/react-separator';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';
import { getFFmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { api } from '@/lib/axios';

type Status = 'stoped' | 'converting' | 'uploading' | 'generating' | 'sucess';

const statusMessage = {
	converting: 'Convertendo...',
	uploading: 'Enviando...',
	generating: 'Transcrevendo...',
	sucess: 'Sucesso!',
};

interface VidieoInputFormProps {
	onVideoUploaded: (id: string) => void;
}

export function VideoInputForm(props: VidieoInputFormProps) {
	const [file, setFile] = useState<File | null>(null);
	const [status, setStatus] = useState<Status>('stoped');

	const promptInputRef = useRef<HTMLTextAreaElement>(null);

	function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
		const { files } = event.currentTarget;

		if (!files) {
			return; // No files uploaded
		}

		const selectedFile = files[0];

		setFile(selectedFile);
	}

	const previewURL = useMemo(() => {
		if (!file) {
			return null;
		}

		return URL.createObjectURL(file);
	}, [file]);

	async function convertVideoToAudio(video: File) {
		console.log('Convert started');

		const ffmpeg = await getFFmpeg();

		await ffmpeg.writeFile('input.mp4', await fetchFile(video));

		// ffmpeg.on('log', (log) => {
		// 	console.log(log);
		// }); // Error log

		ffmpeg.on('progress', (progress) => {
			console.log('Convert progress: ' + Math.round(progress.progress * 100));
		});

		await ffmpeg.exec([
			'-i',
			'input.mp4',
			'-map',
			'0:a',
			'-b:a',
			'20k',
			'-acodec',
			'libmp3lame',
			'output.mp3',
		]); // transform input.mp4 on output.mp3

		const data = await ffmpeg.readFile('output.mp3'); // get output.mp3

		const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
		const audioFile = new File([audioFileBlob], 'audio.mp3', {
			type: 'audio/mpeg',
		}); //Convert FileData (data) on File (audioFile)

		console.log('Convert finished.');

		return audioFile;
	}

	async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const prompt = promptInputRef.current?.value;

		if (!file) {
			return; // No files send
		}

		setStatus('converting');
		// convert mp4 → mp3 (25MB)
		const audioFile = await convertVideoToAudio(file);

		const data = new FormData();

		data.append('file', audioFile);

		setStatus('uploading');
		const response = await api.post('/videos', data);

		const videoID = response.data.video.id; // get ID to generate the prompt

		setStatus('generating');
		const transcription = await api.post(`/videos/${videoID}/transcription`, {
			prompt,
		});

		setStatus('sucess');
		props.onVideoUploaded(videoID);
	}

	return (
		<form
			className="space-y-6"
			onSubmit={handleUploadVideo}
		>
			{/* Upload do vídeo */}
			<div>
				<Label
					htmlFor="video"
					className="relative flex border rounded aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:border-primary"
				>
					{previewURL ? (
						<video
							src={previewURL}
							controls={false}
							className="pointer-events-none absolute inset-0" // o click do usuário vai pra label
						/>
					) : (
						<>
							<FileVideo
								className="icon-6 -mr-2"
								aria-hidden="true"
								focusable="false"
							/>
							Selecione um vídeo
						</>
					)}
				</Label>
				<input
					type="file"
					id="video"
					accept="video/mp4"
					className="sr-only"
					onChange={handleFileSelected}
				/>
			</div>

			<Separator />

			{/* Prompt de transcrição */}
			<div className="space-y-2">
				<Label htmlFor="transcription prompt">Prompt de transcrição</Label>
				<Textarea
					ref={promptInputRef}
					disabled={status !== 'stoped'}
					id="transcription prompt"
					className="h-20 resize-none leading-relaxed"
					placeholder="Inclua palavras chaves mencionadas no vídeo separadas por virgula"
					aria-description="Inclua palavras chaves mencionadas no vídeo separadas por virgula"
				/>
			</div>

			{/* Submit Button */}
			<Button
				className="w-full"
				disabled={status !== 'stoped'}
				type="submit"
			>
				{status === 'stoped' ? (
					<>
						<Upload
							className="icon-4"
							aria-hidden="true"
							focusable="false"
						/>
						Carregar vídeo
					</>
				) : status === 'sucess' ? (
					<>
						<ThumbsUp
							className="icon-4"
							aria-hidden="true"
							focusable="false"
						/>
						{statusMessage[status]}
					</>
				) : (
					<>
						<Loader2
							className="icon-4 animate-spin"
							aria-hidden="true"
							focusable="false"
						/>
						{statusMessage[status]}
					</>
				)}
			</Button>
		</form>
	);
}
