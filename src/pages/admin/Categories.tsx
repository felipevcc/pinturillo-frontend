import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* import { faPencil } from '@fortawesome/free-solid-svg-icons'; */
import Navbar from '../../components/bars/Navbar';
import { getCategories } from '../../services/categories';
import { alertError } from '../../helpers/alertTemplates';
import { Category } from '../../models/category/category.interface';

const Categories = () => {
	/* const navigate = useNavigate(); */
	const [categoryName, setCategoryName] = useState('');
	// Estado para almacenar la categoría que se está editando
	const [editingCategory, setEditingCategory] = useState(null);

	const [categories, setCategories] = useState([]);

	useEffect(() => {
		document.body.classList.add('light-theme');

		getCategories().then((data) => {
			setCategories(data);
		}).catch(async (error) => {
			console.error('Error al obtener las categorías:', error);
			await alertError('Error: servicio caído');
		});

		return () => {
			document.body.classList.remove('light-theme');
		};
	}, []);

	const handleCategoryNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setCategoryName(event.target.value);
	};

	const handleCreateOrUpdateCategory = () => {
		if (editingCategory) {
			console.log(`Actualizando categoría: ${categoryName}`);
			// Edit category
		} else {
			console.log(`Creando categoría: ${categoryName}`);
			// Create category
		}
		setCategoryName(''); // Clean input
		setEditingCategory(null); // Reset edit state
	};

	const handleEditCategory = (category: any) => {
		setEditingCategory(category);
		setCategoryName(category ? category.name : '');
		// Open modal
	};

	return (
		<>
			<div className="categories-container">
				<Navbar />
				<div className="categories-content">
					<h2>Categories</h2>
					<div className="card">
						<div className="card-header d-flex justify-content-end">
							<button
								className="btn btn-primary"
								onClick={() => handleEditCategory(null)}
							>
								Crear categoria
							</button>
						</div>
						<div className="card-body">
							<div className="table-responsive my-4 mx-2">
								<table className="table table-bordered" id="category_table">
									<thead>
										<tr>
											<th>Nombre</th>
											<th>Acciones</th>
										</tr>
									</thead>
									<tbody>
										{categories.map((category: Category) => (
											<tr key={category.id}>
												<td>{category.name}</td>
												<td>
													<button
														className="btn btn-primary"
														onClick={() => handleEditCategory(category)}
													>
														Editar
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				className="modal fade"
				id="exampleModal"
				tabIndex={-1}
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalLabel">
								{editingCategory ? 'Editar categoría' : 'Nueva categoría'}
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							<form>
								<div className="mb-3">
									<label htmlFor="category-name" className="col-form-label">
										Nombre:
									</label>
									<input
										type="text"
										className="form-control"
										id="category-name"
										value={categoryName}
										onChange={handleCategoryNameChange}
									/>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								data-bs-dismiss="modal"
							>
								Cerrar
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleCreateOrUpdateCategory}
							>
								{editingCategory ? 'Actualizar' : 'Crear'} categoría
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Categories;
