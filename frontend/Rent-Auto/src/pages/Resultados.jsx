import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Autos.module.css';

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

export default function Resultados() {
	const query = useQuery();
	const tipo = query.get('tipo');

	const reportes = {
		reservas: {
			titulo: 'Reservas por Usuario',
			columnas: ['Usuario', 'Cantidad', 'Total Pagado', 'Última Reserva', 'Sucursal'],
			datos: [
				['Juan Pérez', 5, '$450', '03/05/2025', 'Centro'],
				['Ana Gómez', 2, '$180', '01/05/2025', 'Norte'],
				['Carlos Ruiz', 7, '$630', '05/05/2025', 'Sur'],
			]
		},
		mantenimiento: {
			titulo: 'Vehículos en Mantenimiento',
			columnas: ['Vehículo', 'Placa', 'Fecha', 'Motivo', 'Costo'],
			datos: [
				['Toyota Corolla', 'ABC123', '01/05/2025', 'Cambio de aceite', '$40'],
				['Nissan Sentra', 'XYZ789', '02/05/2025', 'Revisión de frenos', '$75'],
			]
		},
		pagos: {
			titulo: 'Pagos por Método',
			columnas: ['Método', 'Transacciones', 'Total', 'Último Pago', 'Sucursal'],
			datos: [
				['Tarjeta de Crédito', 12, '$1,250', '07/05/2025', 'Centro'],
				['Efectivo', 5, '$430', '06/05/2025', 'Norte'],
				['Transferencia', 3, '$300', '05/05/2025', 'Sur'],
			]
		},
		alquileres: {
			titulo: 'Alquileres Activos',
			columnas: ['Vehículo', 'Cliente', 'Inicio', 'Fin', 'Sucursal'],
			datos: [
				['Ford EcoSport', 'María López', '07/05/2025', '10/05/2025', 'Centro'],
				['Chevrolet Spark', 'Luis Ramírez', '06/05/2025', '09/05/2025', 'Norte'],
			]
		},
		ingresos: {
			titulo: 'Ingresos por Sucursal',
			columnas: ['Sucursal', 'Total Ingresos', 'Transacciones', 'Alquileres', 'Último Ingreso'],
			datos: [
				['Sucursal Centro', '$2,300', 20, 12, '07/05/2025'],
				['Sucursal Norte', '$1,850', 15, 9, '06/05/2025'],
				['Sucursal Sur', '$1,120', 10, 6, '05/05/2025'],
			]
		}
	};

	const reporte = reportes[tipo];

	if (!reporte) {
		return (
			<div className={styles.autosContainer}>
				<h1 className={styles.autosTitle}>Reporte no encontrado</h1>
			</div>
		);
	}

	return (
		<div className={styles.autosContainer}>
			<h1 className={styles.autosTitle}>{reporte.titulo}</h1>

			<table className={styles.tabla}>
				<thead>
					<tr>
						{reporte.columnas.map((col, i) => (
							<th key={i}>{col}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{reporte.datos.map((fila, i) => (
						<tr key={i}>
							{fila.map((celda, j) => (
								<td key={j}>{celda}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}