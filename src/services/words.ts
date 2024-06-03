import { environment } from '../environments/environment';
import { alertError, alertDelete } from '../helpers/alertTemplates';

const API = environment.apiUrl;

export const getWords = async () => {
	const url = new URL(`${API}/api/v1/words`);
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

export const createWord = async (wordData: any) => {
	const url = new URL(`${API}/api/v1/words`);
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id: 0, text: wordData.text })
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message ? errorData.message : undefined);
	}
	const data = await response.json();
	relateWordCategory(data.id, wordData.categoryId).then((data) => {
		console.log('Palabra relacionada con categoría:', data);
	}).catch(async (error) => {
		console.error('Error al relacionar la palabra con la categoría:', error);
		await alertError('Error al relacionar la palabra con la categoría');
	});
	return data;
}

// words-by-category relationship
const relateWordCategory = async (wordId: number, categoryId: number) => {
	const url = new URL(`${API}/api/v1/words-by-category`);
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id: 0, wordId: wordId, categoryId: categoryId })
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message ? errorData.message : undefined);
	}
	const data = await response.json();
	return data;
}

export const updateWord = async (wordData: any) => {
	const url = new URL(`${API}/api/v1/words`);
	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id: wordData.id, text: wordData.text })
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message ? errorData.message : undefined);
	}
	return response.json();
};

export const deleteWord = async (wordId: number) => {
	const url = new URL(`${API}/api/v1/words/${wordId}`);
	const response = await fetch(url, { method: 'DELETE' });
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message ? errorData.message : undefined);
	}
};
