import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencil } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/bars/Navbar';
import { getCategories, createCategory, updateCategory } from '../../services/categories';
import { createWord } from '../../services/words';
import { alertError, alertSuccess } from '../../helpers/alertTemplates';
import { Category } from '../../models/category/category.interface';
import { Word } from '../../models/word/word.interface';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const Categories = () => {
	const [editingCategory, setEditingCategory] = useState<Category>({
		id: null,
		name: null,
	});
	const [newWord, setNewWord] = useState<Word>({
		text: null,
		categoryId: null,
	});

	const [categories, setCategories] = useState([]);

	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const handleShowCategoryModal = () => setShowCategoryModal(true);
	const handleCloseCategoryModal = () => {
		setEditingCategory({
			id: null,
			name: null,
		});
		setShowCategoryModal(false);
	};

	const [showWordModal, setShowWordModal] = useState(false);
	const handleShowWordModal = () => setShowWordModal(true);
	const handleCloseWordModal = () => {
		setNewWord({
			text: null,
			categoryId: null,
		});
		setShowWordModal(false);
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

	const createNewCategory = async () => {
		if (!editingCategory.name || editingCategory.name.trim() === '') {
			await alertError('El nombre de la categoría es obligatorio');
			return;
		}
		// Create category
		createCategory(editingCategory).then(async (data) => {
			console.log('Categoría creada:', data);
			await alertSuccess('Categoría creada exitosamente');
			getAllCategories();
		}).catch(async (error) => {
			console.error('Error al crear la categoría:', error);
			await alertError(error.message, 'Error al crear la categoría');
		});
		// Close modal
		handleCloseCategoryModal();
	}
	const updateCategoryData = async () => {
		if (!editingCategory.name || editingCategory.name.trim() === '') {
			await alertError('El nombre de la categoría es obligatorio');
			return;
		}
		// Update category
		updateCategory(editingCategory).then(async (data) => {
			console.log('Categoría actualizada:', data);
			await alertSuccess('Categoría actualizada exitosamente');
			getAllCategories();
		}).catch(async (error) => {
			console.error('Error al actualizar la categoría:', error);
			await alertError(error.message, 'Error al actualizar la categoría');
		});
		// Close modal
		handleCloseCategoryModal();
	}
	const createNewWord = async () => {
		if (!newWord.text || newWord.text.trim() === '' || !newWord.categoryId) {
			await alertError('Todos los campos son obligatorios');
			return;
		}
		// Create word
		createWord(newWord).then(async (data) => {
			console.log('Palabra creada:', data);
			await alertSuccess('Palabra creada exitosamente');
		}).catch(async (error) => {
			console.error('Error al crear la palabra:', error);
			await alertError(error.message, 'Error al crear la palabra');
		});
		// Close modal
		handleCloseWordModal();
	}

	return (
		<>
			<div className="categories-container">
				<Navbar />
				<div className="categories-content">
					<h2>Categorías</h2>
					<div className="card">
						<div className="card-header d-flex justify-content-end gap-3">
							<button
								className="btn btn-primary"
								onClick={handleCreateCategory}
							>
								<FontAwesomeIcon icon={faPlus} className="me-2" />
								Crear categoria
							</button>
							<button className="btn btn-primary" onClick={handleShowWordModal}>
								<FontAwesomeIcon icon={faPlus} className="me-2" />
								Agregar palabra
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
														className="btn btn-warning"
														onClick={() => handleEditCategory(category)}
													>
														<FontAwesomeIcon icon={faPencil} className="me-2" />
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

			{/* Word Modal */}
			<Modal show={showWordModal} onHide={handleCloseWordModal}>
				<Modal.Header closeButton>
					<Modal.Title>Agregar palabra</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={e => { e.preventDefault(); createNewWord(); }}>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Palabra</Form.Label>
							<Form.Control
								type="string"
								placeholder="Palabra"
								autoFocus
								value={newWord.text || ''}
								onChange={(e) => setNewWord({ ...newWord, text: e.target.value })}
							/>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="exampleForm.ControlTextarea1"
						>
							<Form.Label>Categoría</Form.Label>
							<select className="form-select"
								aria-label="Selección de categoría"
								value={newWord.categoryId || ''}
								onChange={(e) => setNewWord({ ...newWord, categoryId: parseInt(e.target.value) })}
							>
								<option disabled value=''>Seleccionar categoría</option>
								{categories.map((category: Category) => (
									<option key={category.id} value={category.id!}>
										{category.name}
									</option>
								))}
							</select>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseWordModal}>
						Cerrar
					</Button>
					<Button variant="primary" onClick={createNewWord}>
						Guardar
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default Categories;
