import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categories';
import { alertError, alertTemporalSuccess, alertDelete } from '../../helpers/alertTemplates';
import { Category } from '../../models/category/category.interface';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const Categories = () => {
	const [editingCategory, setEditingCategory] = useState<Category>({
		id: null,
		name: null,
	});

	const [categories, setCategories] = useState([]);

	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const handleShowCategoryModal = () => setShowCategoryModal(true);
	const handleCloseCategoryModal = () => {
		getAllCategories();
		setEditingCategory({
			id: null,
			name: null,
		});
		setShowCategoryModal(false);
	};

	useEffect(() => {
		getAllCategories();
	}, []);

	const getAllCategories = () => {
		getCategories().then((data) => {
			setCategories(data);
		}).catch(async (error) => {
			console.error('Error al obtener las categorías:', error);
			await alertError('Error: servicio caído');
		});
	}

	const handleCreateCategory = () => {
		setEditingCategory({
			id: null,
			name: null,
		});
		// Open modal
		handleShowCategoryModal();
	};
	const handleEditCategory = (category: any) => {
		setEditingCategory(category);
		// Open modal
		handleShowCategoryModal();
	};
	const handleDeleteCategory = async (category: any) => {
		// Deletion confirmation
		if (!await alertDelete()) return
		// Delete category
		deleteCategory(category.id).then(async () => {
			await alertTemporalSuccess('Categoría eliminada exitosamente');
		}).catch(async (error) => {
			console.error('Error al eliminar la categoría:', error);
			await alertError(error.message, 'Error al eliminar la categoría');
		}).finally(() => {
			// Close modal
			handleCloseCategoryModal();
		});
	};

	const createNewCategory = async () => {
		if (!editingCategory.name || editingCategory.name.trim() === '') {
			await alertError('El nombre de la categoría es obligatorio');
			return;
		}
		// Create category
		createCategory(editingCategory).then(async (data) => {
			console.log('Categoría creada:', data);
			await alertTemporalSuccess('Categoría creada exitosamente');
		}).catch(async (error) => {
			console.error('Error al crear la categoría:', error);
			await alertError(error.message, 'Error al crear la categoría');
		}).finally(() => {
			// Close modal
			handleCloseCategoryModal();
		});
	}
	const updateCategoryData = async () => {
		if (!editingCategory.name || editingCategory.name.trim() === '') {
			await alertError('El nombre de la categoría es obligatorio');
			return;
		}
		// Update category
		updateCategory(editingCategory).then(async (data) => {
			console.log('Categoría actualizada:', data);
			await alertTemporalSuccess('Categoría actualizada exitosamente');
		}).catch(async (error) => {
			console.error('Error al actualizar la categoría:', error);
			await alertError(error.message, 'Error al actualizar la categoría');
		}).finally(() => {
			// Close modal
			handleCloseCategoryModal();
		});
	}

	return (
		<>
			<div className="card">
				<div className="card-header d-flex justify-content-between gap-3 px-4">
					<h3>Categorías</h3>
					<button
						className="btn btn-primary"
						onClick={handleCreateCategory}
					>
						<FontAwesomeIcon icon={faPlus} className="me-2" />
						Crear categoría
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
										<td className='actions d-flex justify-content-center gap-3'>
											<button
												className="btn btn-warning"
												onClick={() => handleEditCategory(category)}
											>
												<FontAwesomeIcon icon={faPencil} />
												<span className="ms-2">Editar</span>
											</button>
											<button
												className="btn btn-danger"
												onClick={() => handleDeleteCategory(category)}
											>
												<FontAwesomeIcon icon={faTrash} />
												<span className="ms-2">Eliminar</span>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Category Modal */}
			<Modal show={showCategoryModal} onHide={handleCloseCategoryModal}>
				<Modal.Header closeButton>
					<Modal.Title>{editingCategory.id ? 'Actualizar' : 'Crear' } categoría</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={e => { e.preventDefault(); editingCategory.id ? updateCategoryData() : createNewCategory(); }}>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Categoría</Form.Label>
							<Form.Control
								type="string"
								placeholder="Nombre de la categoría"
								autoFocus
								value={editingCategory.name || ''}
								onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseCategoryModal}>
						Cerrar
					</Button>
					<Button variant="primary" onClick={editingCategory.id ? updateCategoryData : createNewCategory}>
						Guardar
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default Categories;
