import { environment } from "../environments/environment";

const API = environment.apiUrl;

export const getCategories = async () => {
	const url = new URL(`${API}/api/v1/categories`);
	const response = await fetch(url);
	const data = await response.json();
	return data;
};
