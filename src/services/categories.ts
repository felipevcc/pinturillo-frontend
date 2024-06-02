import { environment } from '../environments/environment';

const API = environment.apiUrl;

export const getCategories = async () => {
	const url = new URL(`${API}/api/v1/categories`);
	const response = await fetch(url);
	const data = await response.json();
	return data;
};

export const createCategory = async (categoryData: any) => {
	const url = new URL(`${API}/api/v1/categories`);
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name: categoryData.name })
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message ? errorData.message : undefined);
	}
	return response.json();
};

export const updateCategory = async (categoryData: any) => {
	const url = new URL(`${API}/api/v1/categories`);
	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(categoryData)
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message ? errorData.message : undefined);
	}
	return response.json();
};
