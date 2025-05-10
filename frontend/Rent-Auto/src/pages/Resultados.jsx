// ...importaciones
import React, { useState, useEffect } from 'react';
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
  const [monto, setMonto] = useState('');
  const [verGrafica, setVerGrafica] = useState(false);
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const reportes = {
    reservas_usuario: {
      titulo: 'Reservas por Usuario',
      columnas: ['ID', 'Usuario', 'Vehículo', 'Fecha Inicio', 'Fecha Fin', 'Total', 'Sucursal'],
      endpoint: '/api/reservas',
      filtros: [
        { label: 'Usuario', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Sucursal', value: filtroAdicional2, onChange: setFiltroAdicional2, type: 'select', options: Array.from({ length: 10 }, (_, i) => `Sucursal ${i + 1}`) },
        { label: 'Fecha inicio', value: fechaInicio, onChange: setFechaInicio, type: 'date' },
        { label: 'Fecha fin', value: fechaFin, onChange: setFechaFin, type: 'date' }
      ]
    },
    mantenimiento: {
      titulo: 'Mantenimiento',
      columnas: ['ID', 'Placa', 'Marca', 'Modelo', 'Año', 'Estado', 'Categoría', 'Costo Diario'],
      endpoint: '/api/mantenimiento',
      filtros: [
        { label: 'Placa', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Estado', value: filtroAdicional1, onChange: setFiltroAdicional1, type: 'select', options: ['Disponible', 'Rentado', 'Mantenimiento'] },
        { label: 'Categoría', value: filtroAdicional2, onChange: setFiltroAdicional2, type: 'select', options: ['Económico', 'SUV', 'Deportivo', 'Familiar', 'Camioneta', 'Eléctrico'] },
        { label: 'Año', value: fechaInicio, onChange: setFechaInicio, type: 'number' }
      ]
    },
    alquileres: {
      titulo: 'Alquileres Activos',
      columnas: ['ID', 'Reserva', 'Fecha Entrega', 'Fecha Devolución', 'Total', 'Estado'],
      endpoint: '/api/alquileres',
      filtros: [
        { label: 'Alquiler', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Estado', value: filtroAdicional1, onChange: setFiltroAdicional1, type: 'select', options: ['Activo', 'Completado'] },
        { label: 'Sucursal', value: filtroAdicional2, onChange: setFiltroAdicional2, type: 'select', options: Array.from({ length: 10 }, (_, i) => `Sucursal ${i + 1}`) },
        { label: 'Fecha entrega', value: fechaInicio, onChange: setFechaInicio, type: 'date' },
        { label: 'Fecha devolución', value: fechaFin, onChange: setFechaFin, type: 'date' }
      ]
    },
    ingresos: {
      titulo: 'Ingresos por Sucursal',
      columnas: ['ID', 'Alquiler', 'Monto', 'Fecha Pago', 'Método', 'Sucursal'],
      endpoint: '/api/ingresos',
      filtros: [
        { label: 'Alquiler', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Método', value: filtroAdicional1, onChange: setFiltroAdicional1, type: 'select', options: ['Transferencia', 'Tarjeta de Crédito', 'Débito', 'Efectivo'] },
        { label: 'Sucursal', value: filtroAdicional2, onChange: setFiltroAdicional2, type: 'select', options: Array.from({ length: 10 }, (_, i) => `Sucursal ${i + 1}`) },
        { label: 'Fecha pago', value: fechaInicio, onChange: setFechaInicio, type: 'date' },
        { label: 'Monto', value: monto, onChange: setMonto, type: 'number' }
      ]
    },
    pagos: {
      titulo: 'Pagos por Cliente',
      columnas: ['ID', 'Cliente', 'Monto', 'Fecha Pago', 'Método'],
      endpoint: '/api/pagos',
      filtros: [
        { label: 'Cliente', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Método de Pago', value: filtroAdicional1, onChange: setFiltroAdicional1, type: 'select', options: ['Transferencia', 'Tarjeta de Crédito', 'Débito', 'Efectivo'] },
        { label: 'Fecha pago', value: fechaInicio, onChange: setFechaInicio, type: 'date' },
        { label: 'Monto', value: monto, onChange: setMonto, type: 'number' }
      ]
}

  };

  const reporte = reportes[tipo];

  useEffect(() => {
    if (reporte) {
      setCargando(true);
      setError(null);

      const apiUrl = `http://${window.location.hostname}:3001${reporte.endpoint}`;
      
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);
          return response.json();
        })
        .then(data => {
          const formattedData = data.map(item => Object.values(item));
          setDatos(formattedData);
          setCargando(false);
        })
        .catch(err => {
          console.error("Error al obtener datos:", err);
          setError(err.message);
          setDatos(getDatosDemostracion(tipo));
          setCargando(false);
        });
    }
  }, [tipo]);

  const getDatosDemostracion = (tipo) => {
    const demoDatos = {
      ingresos: [
        [1, 1, '$379.85', '2024-04-01', 'Transferencia', 'Sucursal 1'],
        [2, 2, '$120.50', '2024-03-15', 'Efectivo', 'Sucursal 2'],
        [3, 3, '$412.00', '2024-03-12', 'Tarjeta de Crédito', 'Sucursal 3']
      ],
      pagos: [
        [1, 'Carlos Méndez', '$195.76', '2024-04-09', 'Transferencia'],
        [2, 'Laura Ruiz', '$85.00', '2024-04-02', 'Efectivo'],
        [3, 'Pedro Gómez', '$142.30', '2024-03-27', 'Tarjeta de Crédito']
      ],
    reservas_usuario: [
      [101, 'jgarcia', 'Toyota Corolla', '2024-04-01', '2024-04-05', '$150.00', 'Sucursal 1'],
      [102, 'mperez', 'Nissan Versa', '2024-03-10', '2024-03-12', '$85.00', 'Sucursal 2'],
      [103, 'alopez', 'Chevrolet Spark', '2024-04-07', '2024-04-10', '$120.00', 'Sucursal 3']
    ],
    mantenimiento: [
      [201, 'ABC123', 'Toyota', 'Corolla', 2020, 'Mantenimiento', 'Económico', '$25.00'],
      [202, 'XYZ789', 'Nissan', 'Versa', 2019, 'Disponible', 'Económico', '$22.00'],
      [203, 'LMN456', 'Kia', 'Rio', 2021, 'Mantenimiento', 'Familiar', '$28.00']
    ],
    alquileres: [
      [301, 101, '2024-04-01', '2024-04-05', '$150.00', 'Completado'],
      [302, 102, '2024-03-10', '2024-03-12', '$85.00', 'Activo'],
      [303, 103, '2024-04-07', '2024-04-10', '$120.00', 'Activo']
    ]
  };
  return demoDatos[tipo] || [];
};

  const montoValido = (monto) => {
    if (!monto) return true;
    const valor = parseFloat(monto.toString().replace('$', '').replace(',', ''));
    return (!montoMin || valor >= parseFloat(montoMin)) &&
           (!montoMax || valor <= parseFloat(montoMax));
  };

  const datosFiltrados = datos.filter((fila) => {
    if (!fila || fila.length === 0) return false;

    const filaString = fila.map(c => c?.toString().toLowerCase() || '');
    const searchText = filtro.toLowerCase();

    const incluyeFiltro = filaString.some(c => c.includes(searchText)) || (fila[0]?.toString() === filtro);
    const filtro1 = filtroAdicional1 === '' || filaString.some(c => c.includes(filtroAdicional1.toLowerCase()));
    const filtro2 = filtroAdicional2 === '' || filaString.some(c => c.includes(filtroAdicional2.toLowerCase()));
    const fechaColumnas = fila.filter(c => typeof c === 'string' && /^\d{4}-\d{2}-\d{2}/.test(c));
    const dentroDeFechas = fechaColumnas.length === 0 || fechaColumnas.some(fecha => (!fechaInicio || fecha >= fechaInicio) && (!fechaFin || fecha <= fechaFin));
    
    const montoIndex = fila.findIndex(c => typeof c === 'string' && c.includes('$'));
    const monto = fila[montoIndex];

    return incluyeFiltro && filtro1 && filtro2 && dentroDeFechas && montoValido(monto);
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

    doc.save(`informe_${tipo}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const datosGrafica = {
    labels: datosFiltrados.map((fila, index) => {
      const posiblesLabels = [1, 2];
      const labelCol = posiblesLabels.find(i => fila[i] && typeof fila[i] === 'string') || 0;
      return fila[labelCol]?.toString() || `Item ${index + 1}`;
    }),
    datasets: [
      {
        label: 'Monto',
        data: datosFiltrados.map((fila) => {
          const montoIndex = fila.findIndex(c => typeof c === 'string' && c.includes('$') || typeof c === 'number');
          if (montoIndex >= 0) {
            const valor = fila[montoIndex];
            if (typeof valor === 'string' && valor.includes('$')) {
              return parseFloat(valor.replace('$', '').replace(',', ''));
            }
            return parseFloat(valor);
          }
          return 0;
        }),
        backgroundColor: '#4e8c7b',
      }
    ]
  };

  if (!reporte) {
    return <div className={styles.autosContainer}><h1 className={styles.autosTitle}>Reporte no encontrado</h1></div>;
  }

  return (
    <div className={styles.autosContainer}>
      <h1 className={styles.autosTitle}>{reporte.titulo}</h1>
      {error && <div className={styles.errorMessage}>Error: {error}. Mostrando datos de demostración.</div>}

      <div className={styles.filtros}>
        {reporte.filtros.map((filtro, index) => (
          <div key={index}>
            {filtro.type === 'select' ? (
              <select value={filtro.value} onChange={(e) => filtro.onChange(e.target.value)} className={styles.filtro}>
                <option value="">{filtro.label}</option>
                {filtro.options.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </select>
            ) : filtro.type === 'date' ? (
              <label style={{ color: '#0e3f41', fontWeight: 'bold' }}>
                {filtro.label}
                <input type="date" value={filtro.value} onChange={(e) => filtro.onChange(e.target.value)} className={styles.filtro} />
              </label>
            ) : (
              <input
                type={filtro.type}
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

      {cargando ? (
        <div className={styles.loading}>Cargando datos...</div>
      ) : (
        <div className={`${styles.flipCard} ${verGrafica ? styles.flipped : ''}`}>
          <div className={styles.flipInner}>
            <div className={styles.flipFront}>
              <table className={styles.tabla}>
                <thead>
                  <tr>{reporte.columnas.map((col, i) => <th key={i}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {datosFiltrados.length > 0 ? datosFiltrados.map((fila, i) => (
                    <tr key={i}>{fila.map((celda, j) => <td key={j}>{celda}</td>)}</tr>
                  )) : (
                    <tr><td colSpan={reporte.columnas.length} style={{ textAlign: 'center' }}>No hay datos disponibles</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className={styles.flipBack}>
              {datosFiltrados.length > 0 ? (
                <Bar data={datosGrafica} />
              ) : (
                <div className={styles.noData}>No hay datos para mostrar en la gráfica</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
