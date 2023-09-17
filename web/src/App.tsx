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

export function App() {
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
						/>
						<Textarea
							className="resize-none p-4 leading-relaxed"
							placeholder="Resultado gerado pela IA"
							aria-label="Resultado gerado pela IA"
							readOnly
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
					<form className="space-y-6">
						{/* Upload do vídeo */}
						<div>
							<Label
								htmlFor="video"
								className="flex border rounded aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:border-primary"
							>
								<FileVideo
									className="icon-6 -mr-2"
									aria-hidden="true"
									focusable="false"
								/>
								Selecione um vídeo
							</Label>
							<input
								type="file"
								id="video"
								accept="video/mp4"
								className="sr-only"
							/>
						</div>

						<Separator />

						{/* Prompt de transcrição */}
						<div className="space-y-2">
							<Label htmlFor="transcription prompt">Prompt de transcrição</Label>
							<Textarea
								id="transcription prompt"
								className="h-20 resize-none leading-relaxed"
								placeholder="Inclua palavras chaves mencionadas no vídeo separadas por virgula"
								aria-description="Inclua palavras chaves mencionadas no vídeo separadas por virgula"
							/>
						</div>

						{/* Submit Button */}
						<Button
							className="w-full"
							type="submit"
						>
							<Upload
								className="icon-4"
								aria-hidden="true"
								focusable="false"
							/>
							Carregar vídeo
						</Button>
					</form>

					<Separator />

					{/* Form Upload temperatura e modelo */}
					<form className="space-y-6">
						{/* Prompt Select */}
						<div className="space-y-2">
							<Label htmlFor="prompt-combobox">Prompt</Label>

							<Select id="prompt-combobox">
								<SelectTrigger>
									<SelectValue placeholder="Selecione um prompt" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="title">Título do YouTube</SelectItem>
									<SelectItem value="description">Descrição do YouTube</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Modelo Select*/}
						<div className="space-y-2">
							<Label htmlFor="model-combobox">Modelo</Label>

							<Select
								disabled
								id="model-combobox"
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
