import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';

interface Prompt {
	id: string;
	title: string;
	template: string;
}

interface PrompSelectProps {
	onPrompSelected: (template: string) => void;
}

export function PromptSelect(props: PrompSelectProps) {
	const [prompts, setPrompts] = useState<Prompt[] | null>(null);

	useEffect(() => {
		api.get('/prompts').then((response) => {
			setPrompts(response.data);
		});
	}, []);

	return (
		<Select
			onValueChange={props.onPrompSelected}
			required
		>
			<SelectTrigger>
				<SelectValue placeholder="Selecione um prompt" />
			</SelectTrigger>
			<SelectContent>
				{prompts?.map((prompt) => (
					<SelectItem
						key={prompt.id}
						value={prompt.template}
					>
						{prompt.title}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
