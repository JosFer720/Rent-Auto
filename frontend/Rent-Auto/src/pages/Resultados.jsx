import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Resultados.module.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Resultados() {
  const query = useQuery();
  const tipo = query.get('tipo');

  const [filtro, setFiltro] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [filtroAdicional1, setFiltroAdicional1] = useState('');
  const [filtroAdicional2, setFiltroAdicional2] = useState('');
  const [verGrafica, setVerGrafica] = useState(false);

  const reportes = {
    reservas_usuario: {
      titulo: 'Reservas por Usuario',
      columnas: ['ID', 'Usuario', 'Vehículo', 'Fecha Inicio', 'Fecha Fin', 'Total', 'Sucursal'],
      filtros: [
        { label: 'Usuario o ID', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Sucursal', value: filtroAdicional2, onChange: setFiltroAdicional2, type: 'select', options: Array.from({ length: 10 }, (_, i) => `Sucursal ${i + 1}`) },
        { label: 'Fecha inicio', value: fechaInicio, onChange: setFechaInicio, type: 'date' },
        { label: 'Fecha fin', value: fechaFin, onChange: setFechaFin, type: 'date' }
      ],
      datos: [
        [1, 'Usuario 164', 'Nissan Model X', '2024-01-13', '2024-01-18', '$442.85', 'Sucursal 2'],
        [2, 'Usuario 36', 'Nissan Model Y', '2024-02-22', '2024-03-02', '$221.71', 'Sucursal 8'],
      ]
    },
    mantenimiento: {
      titulo: 'Mantenimiento',
      columnas: ['ID', 'Placa', 'Marca', 'Modelo', 'Año', 'Estado', 'Categoría', 'Costo Diario'],
      filtros: [
        { label: 'Placa o ID', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Estado', value: filtroAdicional1, onChange: setFiltroAdicional1, type: 'select', options: ['Disponible', 'Rentado', 'Mantenimiento'] },
        { label: 'Categoría', value: filtroAdicional2, onChange: setFiltroAdicional2, type: 'select', options: ['Económico', 'SUV', 'Deportivo', 'Familiar', 'Camioneta', 'Eléctrico'] },
        { label: 'Año', value: fechaInicio, onChange: setFechaInicio, type: 'number' }
      ],
      datos: [
        [1, 'XYZ0001', 'Nissan', 'Model X', 2013, 'Mantenimiento', 'Familiar', '$123.95'],
        [2, 'XYZ0002', 'Nissan', 'Model Y', 2012, 'Mantenimiento', 'SUV', '$36.16'],
      ]
    },
    alquileres: {
      titulo: 'Alquileres Activos',
      columnas: ['ID', 'Reserva', 'Fecha Entrega', 'Fecha Devolución', 'Total', 'Estado'],
      filtros: [
        { label: 'ID Reserva o Alquiler', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Estado', value: filtroAdicional1, onChange: setFiltroAdicional1, type: 'select', options: ['Activo', 'Completado'] },
        { label: 'Sucursal', value: filtroAdicional2, onChange: setFiltroAdicional2, type: 'select', options: Array.from({ length: 10 }, (_, i) => `Sucursal ${i + 1}`) },
        { label: 'Fecha entrega', value: fechaInicio, onChange: setFechaInicio, type: 'date' },
        { label: 'Fecha devolución', value: fechaFin, onChange: setFechaFin, type: 'date' }
      ],
      datos: [
        [1, 1, '2024-04-08', '2024-04-15', '$1030.90', 'Completado'],
        [2, 2, '2024-07-13', '2024-07-16', '$961.72', 'Completado'],
      ]
    },
    ingresos: {
      titulo: 'Ingresos',
      columnas: ['ID', 'Alquiler', 'Monto', 'Fecha Pago', 'Método', 'Sucursal'],
      filtros: [
        { label: 'ID Pago o Alquiler', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Método', value: filtroAdicional1, onChange: setFiltroAdicional1, type: 'select', options: ['Transferencia', 'Tarjeta de Crédito', 'Débito', 'Efectivo'] },
        { label: 'Sucursal', value: filtroAdicional2, onChange: setFiltroAdicional2, type: 'select', options: Array.from({ length: 10 }, (_, i) => `Sucursal ${i + 1}`) },
        { label: 'Fecha pago', value: fechaInicio, onChange: setFechaInicio, type: 'date' }
      ],
      datos: [
        [1, 1, '$195.76', '2024-04-09', 'Transferencia', 'Sucursal 5'],
        [2, 2, '$379.85', '2024-04-01', 'Transferencia', 'Sucursal 1'],
      ]
    }
  };

  const reporte = reportes[tipo];

  const datosFiltrados = reporte?.datos.filter((fila) => {
    const fecha = fila.find(c => typeof c === 'string' && /^\d{4}-\d{2}-\d{2}/.test(c));
    const incluyeFiltro = fila.some((c) =>
      typeof c === 'string' && c.toLowerCase().includes(filtro.toLowerCase())
    ) || fila[0].toString() === filtro;

    const filtro1 = filtroAdicional1 === '' || fila.some(c => typeof c === 'string' && c.toLowerCase().includes(filtroAdicional1.toLowerCase()));
    const filtro2 = filtroAdicional2 === '' || fila.some(c => typeof c === 'string' && c.includes(filtroAdicional2));
    const dentroDeFechas = (!fechaInicio || (fecha && fecha >= fechaInicio)) &&
                           (!fechaFin || (fecha && fecha <= fechaFin));

    return incluyeFiltro && filtro1 && filtro2 && dentroDeFechas;
  });

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(reporte.titulo, 105, 15, { align: 'center' });

    autoTable(doc, {
      head: [reporte.columnas],
      body: datosFiltrados,
      startY: 25
    });

    doc.save('informe.pdf');
  };

  const datosGrafica = {
    labels: datosFiltrados.map((fila) => fila[1]),
    datasets: [
      {
        label: 'Monto',
        data: datosFiltrados.map((fila) => {
          const monto = fila.find(c => typeof c === 'string' && c.includes('$'));
          return monto ? parseFloat(monto.replace('$', '')) : 1;
        }),
        backgroundColor: '#4e8c7b',
      }
    ]
  };

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

      <div className={styles.filtros}>
        {reporte.filtros.map((filtro, index) => (
          <div key={index}>
            {filtro.type === 'select' ? (
              <select 
                value={filtro.value} 
                onChange={(e) => filtro.onChange(e.target.value)}
                className={styles.filtro}
              >
                <option value="">{filtro.label}</option>
                {filtro.options.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </select>
            ) : filtro.type === 'date' ? (
              <label style={{ color: '#0e3f41', fontWeight: 'bold' }}>
                {filtro.label}
                <input 
                  type="date" 
                  value={filtro.value} 
                  onChange={(e) => filtro.onChange(e.target.value)}
                  className={styles.filtro}
                />
              </label>
            ) : filtro.type === 'number' ? (
              <input 
                type="number" 
                value={filtro.value} 
                onChange={(e) => filtro.onChange(e.target.value)}
                className={styles.filtro}
                placeholder={filtro.label}
                min="2000"
                max="2025"
              />
            ) : (
              <input 
                type="text" 
                value={filtro.value} 
                onChange={(e) => filtro.onChange(e.target.value)}
                className={styles.filtro}
                placeholder={filtro.label}
              />
            )}
          </div>
        ))}
        
        <button className={styles.filtro} onClick={generarPDF}>Generar PDF</button>
        <button className={styles.filtro} onClick={() => setVerGrafica(!verGrafica)}>
          {verGrafica ? 'Ver Tabla' : 'Ver Gráfica'}
        </button>
      </div>

      <div className={`${styles.flipCard} ${verGrafica ? styles.flipped : ''}`}>
        <div className={styles.flipInner}>
          <div className={styles.flipFront}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  {reporte.columnas.map((col, i) => (
                    <th key={i}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.map((fila, i) => (
                  <tr key={i}>
                    {fila.map((celda, j) => (
                      <td key={j}>{celda}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.flipBack}>
            <Bar data={datosGrafica} />
          </div>
        </div>
      </div>
    </div>
  );
}
