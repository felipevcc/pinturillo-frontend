import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* import { faPencil } from '@fortawesome/free-solid-svg-icons'; */
import Navbar from '../../components/bars/Navbar';

const Categories = () => {
	/* const navigate = useNavigate(); */
	const [categoryName, setCategoryName] = useState('');
	const [editingCategory, setEditingCategory] = useState(null); // Estado para almacenar la categoría que se está editando

	const categories = [
		// Ejemplo de categorías
		{ id: 1, name: 'Categoría 1' },
		{ id: 2, name: 'Categoría 2' },
		{ id: 3, name: 'Categoría 3' }
	];

	useEffect(() => {
		document.body.classList.add('light-theme');

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
			// Aquí puedes llamar a la función que actualiza la categoría
		} else {
			console.log(`Creando categoría: ${categoryName}`);
			// Aquí puedes llamar a la función que crea la categoría
		}
		setCategoryName(''); // Limpiar el input
		setEditingCategory(null); // Restablecer el estado de edición
	};

	const handleEditCategory = (category: any) => {
		// Manejador para editar la categoría
		setEditingCategory(category);
		setCategoryName(category ? category.name : '');
		// Aquí puedes abrir el modal
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
										{/* Aquí debes renderizar tus categorías. Por ejemplo: */}
										{categories.map(category => (
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
