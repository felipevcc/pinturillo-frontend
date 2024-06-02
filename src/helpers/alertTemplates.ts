import Swal from 'sweetalert2';

export async function alertError(msg: string | null = null, title: string | null = null) {
	await Swal.fire({
		icon: 'error',
		title: title ? title : 'Oops...',
		text: msg ? msg : 'Algo salió mal!',
	});
}

export async function alertSuccess(msg: string | null = null) {
	await Swal.fire({
		icon: 'success',
		title: '¡Genial!',
		text: msg ? msg : 'Operación exitosa!',
	});
}

export async function alertTemporalSuccess(msg: string | null = null) {
	await Swal.fire({
		icon: 'success',
		title: '¡Genial!',
		text: msg ? msg : 'Operación exitosa!',
		showConfirmButton: false,
		timer: 1500,
	});
}

export async function alertPlayRoom(msg: string) {
	await Swal.fire({
		title: msg,
	});
}

export async function alertDelete() {
	const { isConfirmed } = await Swal.fire({
		icon: 'warning',
		title: 'Esta seguro de eliminar?',
		showCancelButton: true
	});
	return isConfirmed;
}
