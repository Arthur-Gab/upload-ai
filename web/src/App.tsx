import { Github, FileVideo, Upload, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from './components/ui/select';
import { Slider } from './components/ui/slider';
import { VideoInputForm } from './components/VideoInputForm';
import { PromptSelect } from './components/prompt-select';
import { useState } from 'react';
import { useCompletion } from 'ai/react';

export function App() {
	const [temperature, setTemperature] = useState(0.5);
	const [videoID, setVideoID] = useState<string | null>(null);

	const {
		input,
		setInput,
		handleInputChange,
		handleSubmit,
		completion,
		isLoading,
	} = useCompletion({
		api: 'http://localhost:3333/ai/complete',
		body: {
			videoID,
			temperature,
		},
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return (
		<div className="min-h-screen flex flex-col">
			<header className="px-6 py-4 flex items-center border-b justify-between">
				<h1 className="text-xl font-bold">upload.ai</h1>
				<div className="flex items-center gap-3">
					<span className="text-sm text-muted-foreground">
						Desenvolvido com 💚 no NLW da Rocketseat
					</span>

					<Separator
						orientation="vertical"
						className="h-6"
					/>

					<Button variant="outline">
						<Github
							className="icon-4"
							aria-hidden="true"
							focusable="false"
						/>
						Github
					</Button>
				</div>
			</header>

			<main className="flex-1 px-6 py-4 flex gap-6">
				<section className="flex flex-col flex-1 gap-4">
					<div className="grid grid-rows-2 gap-4 flex-1">
						<Textarea
							className="resize-none p-4 leading-relaxed"
							placeholder="Inclua o prompt para a IA..."
							aria-label="Inclua o prompt para a IA..."
							value={input}
							onChange={handleInputChange}
						/>
						<Textarea
							className="resize-none p-4 leading-relaxed"
							placeholder="Resultado gerado pela IA"
							aria-label="Resultado gerado pela IA"
							readOnly
							value={completion}
						/>
					</div>
					<p className="text-sm text-muted-foreground">
						Lembre-se: você pode utilizar a variável{' '}
						<code className="text-primary">{'transcription'}</code> no seu prompt para
						adicionar o conteúdo da transcrição do vídeo selecionado
					</p>
				</section>
				<aside className="w-80 space-y-6">
					{/* Form upload vídeo */}
					<VideoInputForm onVideoUploaded={setVideoID} />

					<Separator />

					{/* Form Upload temperatura e modelo */}
					<form
						className="space-y-6"
						onSubmit={handleSubmit}
					>
						{/* Prompt Select */}
						<div className="space-y-2">
							<label>Prompt</label>
							<PromptSelect onPrompSelected={setInput} />
						</div>

						{/* Modelo Select*/}
						<div className="space-y-2">
							<Label>Modelo</Label>

							<Select
								disabled
								defaultValue="gpt 3.5"
								aria-describedby="model-description"
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="gpt 3.5">GPT 3.5-tubo 16k</SelectItem>
								</SelectContent>
							</Select>

							<span
								id="model-description"
								className="block text-xs text-muted-foreground italic"
							>
								Você poderá customizar esta opção em breve
							</span>
						</div>

						<Separator />

						{/* Temperatura Progress Bar */}

						<div className="space-y-2">
							<Label>Temperatura</Label>

							<Slider
								min={0}
								max={1}
								step={0.1}
								value={[temperature]}
								onValueChange={(value) => setTemperature(value[0])}
								aria-describedby="temperatura-description"
								aria-label="Aumente ou abaixe para modificar a criatividade da IA"
							/>

							<span
								id="temperatura-description"
								className="block text-xs text-muted-foreground italic"
							>
								Valores mais altos tendem a deixar o resultado mais criativo e com
								possíveis erros
							</span>
						</div>

						<Button
							className="w-full"
							type="submit"
							disabled={isLoading}
						>
							<Wand2
								className="icon-4"
								aria-hidden="true"
								focusable="false"
							/>
							Executar
						</Button>
					</form>
				</aside>
			</main>
		</div>
	);
}
