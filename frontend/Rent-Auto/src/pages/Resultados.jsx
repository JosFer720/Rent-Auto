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
  const [verGrafica, setVerGrafica] = useState(false);
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Diccionario de reportes corregido - las claves deben ser únicas
  const reportes = {
    reservas_usuario: {
      titulo: 'Reservas por Usuario',
      columnas: ['ID', 'Usuario', 'Vehículo', 'Fecha Inicio', 'Fecha Fin', 'Total', 'Sucursal'],
      endpoint: '/api/reservas',
      filtros: [
        { label: 'Usuario o ID', value: filtro, onChange: setFiltro, type: 'text' },
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
        { label: 'Placa o ID', value: filtro, onChange: setFiltro, type: 'text' },
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
        { label: 'ID Reserva o Alquiler', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Estado', value: filtroAdicional1, onChange: setFiltroAdicional1, type: 'select', options: ['Activo', 'Completado'] },
        { label: 'Sucursal', value: filtroAdicional2, onChange: setFiltroAdicional2, type: 'select', options: Array.from({ length: 10 }, (_, i) => `Sucursal ${i + 1}`) },
        { label: 'Fecha entrega', value: fechaInicio, onChange: setFechaInicio, type: 'date' },
        { label: 'Fecha devolución', value: fechaFin, onChange: setFechaFin, type: 'date' }
      ]
    },
    ingresos_reportes: { 
      titulo: 'Ingresos',
      columnas: ['ID', 'Alquiler', 'Monto', 'Fecha Pago', 'Método', 'Sucursal'],
      endpoint: '/api/ingresos',
      filtros: [
        { label: 'ID Pago o Alquiler', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Método', value: filtroAdicional1, onChange: setFiltroAdicional1, type: 'select', options: ['Transferencia', 'Tarjeta de Crédito', 'Débito', 'Efectivo'] },
        { label: 'Sucursal', value: filtroAdicional2, onChange: setFiltroAdicional2, type: 'select', options: Array.from({ length: 10 }, (_, i) => `Sucursal ${i + 1}`) },
        { label: 'Fecha pago', value: fechaInicio, onChange: setFechaInicio, type: 'date' }
      ]
    },
    metodos: {
      titulo: 'Pagos por Método',
      columnas: ['Método', 'Cantidad de Pagos', 'Total Recaudado'],
      endpoint: '/api/metodos',
      filtros: [
        { label: 'Método', value: filtro, onChange: setFiltro, type: 'text' },
        { label: 'Fecha inicio', value: fechaInicio, onChange: setFechaInicio, type: 'date' },
        { label: 'Fecha fin', value: fechaFin, onChange: setFechaFin, type: 'date' }
  ]
},
    ingresos: {
  titulo: 'Ingresos por Sucursal',
  columnas: ['Sucursal', 'Cantidad de Pagos', 'Total Recaudado'],
  endpoint: '/api/ingresos_sucursal',
  filtros: [
    { label: 'Sucursal', value: filtroAdicional2, onChange: setFiltroAdicional2, type: 'text' },
    { label: 'Fecha inicio', value: fechaInicio, onChange: setFechaInicio, type: 'date' },
    { label: 'Fecha fin', value: fechaFin, onChange: setFechaFin, type: 'date' }
  ]
}

  };

  const reporte = reportes[tipo];

  // Función para cargar datos desde el backend cuando el componente se monta o cambia el tipo
  useEffect(() => {
    if (reporte) {
      setCargando(true);
      setError(null);
      
      // URL del backend, ajusta según tu entorno (desarrollo/producción)
      const apiUrl = `http://${window.location.hostname}:3001${reporte.endpoint}`;
      
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error al cargar datos: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Convertir los datos del formato de objeto a matriz para compatibilidad con el código existente
          const formattedData = data.map(item => {
            // Extraer valores en el mismo orden que las columnas
            return Object.values(item);
          });
          setDatos(formattedData);
          setCargando(false);
        })
        .catch(err => {
          console.error("Error al obtener datos:", err);
          setError(err.message);
          setCargando(false);
          // Si hay un error, cargar datos de demostración para desarrollo
          setDatos(getDatosDemostracion(tipo));
        });
    }
  }, [tipo]);

  // Función para obtener datos de demostración en caso de error de conexión
  const getDatosDemostracion = (tipo) => {
    const demoDatos = {
      reservas_usuario: [
        [1, 'Usuario 164', 'Nissan Model X', '2024-01-13', '2024-01-18', '$442.85', 'Sucursal 2'],
        [2, 'Usuario 36', 'Nissan Model Y', '2024-02-22', '2024-03-02', '$221.71', 'Sucursal 8'],
      ],
      mantenimiento: [
        [1, 'XYZ0001', 'Nissan', 'Model X', 2013, 'Mantenimiento', 'Familiar', '$123.95'],
        [2, 'XYZ0002', 'Nissan', 'Model Y', 2012, 'Mantenimiento', 'SUV', '$36.16'],
      ],
      alquileres: [
        [1, 1, '2024-04-08', '2024-04-15', '$1030.90', 'Completado'],
        [2, 2, '2024-07-13', '2024-07-16', '$961.72', 'Completado'],
      ],
      ingresos_reportes: [  // Clave modificada para mantener consistencia
        [1, 1, '$195.76', '2024-04-09', 'Transferencia', 'Sucursal 5'],
        [2, 2, '$379.85', '2024-04-01', 'Transferencia', 'Sucursal 1'],
      ]
    };
    return demoDatos[tipo] || [];
  };

  const datosFiltrados = datos.filter((fila) => {
    if (!fila || fila.length === 0) return false;
    
    const filaString = fila.map(c => c?.toString().toLowerCase() || '');
    const searchText = filtro.toLowerCase();
    
    // Buscar por texto en cualquier columna o ID exacto
    const incluyeFiltro = filaString.some(c => c.includes(searchText)) || 
                         (fila[0]?.toString() === filtro);
    
    // Aplicar filtro adicional 1 (Estado/Método)
    const filtro1 = filtroAdicional1 === '' || 
                   filaString.some(c => c.includes(filtroAdicional1.toLowerCase()));
    
    // Aplicar filtro adicional 2 (Sucursal/Categoría)
    const filtro2 = filtroAdicional2 === '' || 
                   filaString.some(c => c.includes(filtroAdicional2.toLowerCase()));
    
    // Buscar fechas en la fila
    const fechaColumnas = fila.filter(c => typeof c === 'string' && 
                           /^\d{4}-\d{2}-\d{2}/.test(c));
    
    // Filtrar por rango de fechas si hay fechas en la fila
    const dentroDeFechas = fechaColumnas.length === 0 || 
                         fechaColumnas.some(fecha => 
                         (!fechaInicio || fecha >= fechaInicio) && 
                         (!fechaFin || fecha <= fechaFin));
    
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

    doc.save(`informe_${tipo}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const datosGrafica = {
    labels: datosFiltrados.map((fila, index) => {
      // Para el eje X, usar una columna descriptiva o el índice
      const posiblesLabels = [1, 2]; // índices de columnas que podrían ser buen label
      const labelCol = posiblesLabels.find(i => fila[i] && typeof fila[i] === 'string') || 0;
      return fila[labelCol]?.toString() || `Item ${index + 1}`;
    }),
    datasets: [
      {
        label: 'Monto',
        data: datosFiltrados.map((fila) => {
          // Buscar columna con valores monetarios
          const montoIndex = fila.findIndex(c => 
            typeof c === 'string' && c.includes('$') ||
            (typeof c === 'number' && c > 0)
          );
          
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
    return (
      <div className={styles.autosContainer}>
        <h1 className={styles.autosTitle}>Reporte no encontrado</h1>
      </div>
    );
  }

  return (
    <div className={styles.autosContainer}>
      <h1 className={styles.autosTitle}>{reporte.titulo}</h1>
      
      {error && (
        <div className={styles.errorMessage}>
          Error: {error}. Mostrando datos de demostración.
        </div>
      )}

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

      {cargando ? (
        <div className={styles.loading}>Cargando datos...</div>
      ) : (
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
                  {datosFiltrados.length > 0 ? (
                    datosFiltrados.map((fila, i) => (
                      <tr key={i}>
                        {fila.map((celda, j) => (
                          <td key={j}>{celda}</td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={reporte.columnas.length} style={{ textAlign: 'center' }}>
                        No hay datos disponibles
                      </td>
                    </tr>
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