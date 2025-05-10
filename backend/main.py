from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Query
from typing import Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from typing import List, Dict, Any

app = FastAPI()

# Configuración de CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_connection():
    try:
        return psycopg2.connect(
            dbname=os.getenv("DB_NAME", "rent_auto"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "postgres"),
            host=os.getenv("DB_HOST", "db"),
            port=os.getenv("DB_PORT", 5432)
        )
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión a la base de datos: {str(e)}")

@app.get("/api/reservas")
def get_reservas():
    conn = None
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT
                    r.id_reserva AS id,
                    u.nombre AS usuario,
                    v.marca || ' ' || v.modelo AS vehiculo,
                    r.fecha_inicio::date AS fecha_inicio,
                    r.fecha_fin::date AS fecha_fin,
                    r.total,
                    s.nombre AS sucursal
                FROM reserva r
                JOIN usuario u ON r.id_usuario = u.id_usuario
                JOIN vehiculo v ON r.id_vehiculo = v.id_vehiculo
                LEFT JOIN usuario_sucursal us ON u.id_usuario = us.id_usuario
                LEFT JOIN sucursal s ON us.id_sucursal = s.id_sucursal
                ORDER BY r.id_reserva;
            """)
            return cur.fetchall()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error en la consulta SQL: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.get("/api/mantenimiento")
def get_mantenimiento():
    conn = None
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT
                    v.id_vehiculo AS id,
                    v.placa,
                    v.marca,
                    v.modelo,
                    v.anio,
                    v.estado,
                    c.nombre AS categoria,
                    v.costo_diario
                FROM vehiculo v
                LEFT JOIN vehiculo_categoria vc ON v.id_vehiculo = vc.id_vehiculo
                LEFT JOIN categoria c ON vc.id_categoria = c.id_categoria
                WHERE v.estado = 'Mantenimiento'
                ORDER BY v.id_vehiculo
            """)
            return cur.fetchall()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error en la consulta SQL: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.get("/api/alquileres")
def get_alquileres():
    conn = None
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT
                    a.id_alquiler AS id,
                    a.id_reserva,
                    a.fecha_entrega::date AS fecha_entrega,
                    a.fecha_devolucion::date AS fecha_devolucion,
                    a.total,
                    CASE WHEN a.fecha_devolucion IS NULL THEN 'Activo' ELSE 'Completado' END AS estado
                FROM alquiler a
                ORDER BY a.id_alquiler
            """)
            return cur.fetchall()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error en la consulta SQL: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.get("/api/ingresos")
def get_ingresos(
    id_alquiler: Optional[str] = Query(default='', alias='alquiler'),
    metodo: Optional[str] = Query(default='', alias='metodo'),
    sucursal: Optional[str] = Query(default='', alias='sucursal'),
    monto: Optional[float] = Query(default=None, alias='monto')
):
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = """
                SELECT
                    p.id_pago AS id,
                    p.id_alquiler,
                    p.monto,
                    p.fecha_pago::date AS fecha_pago,
                    p.metodo,
                    COALESCE(s.nombre, 'Sin Sucursal') AS sucursal
                FROM pago p
                JOIN alquiler a ON p.id_alquiler = a.id_alquiler
                JOIN reserva r ON a.id_reserva = r.id_reserva
                JOIN usuario u ON r.id_usuario = u.id_usuario
                LEFT JOIN usuario_sucursal us ON u.id_usuario = us.id_usuario
                LEFT JOIN sucursal s ON us.id_sucursal = s.id_sucursal
                WHERE 1=1
            """

            params = {}

            if id_alquiler:
                query += " AND CAST(p.id_alquiler AS TEXT) ILIKE %(id_alquiler)s"
                params["id_alquiler"] = f"%{id_alquiler}%"

            if metodo:
                query += " AND LOWER(p.metodo) = LOWER(%(metodo)s)"
                params["metodo"] = metodo

            if sucursal:
                query += " AND LOWER(s.nombre) ILIKE %(sucursal)s"
                params["sucursal"] = f"%{sucursal.lower()}%"

            if monto is not None:
                query += " AND p.monto >= %(monto)s"
                params["monto"] = monto

            query += " ORDER BY p.fecha_pago DESC"

            cur.execute(query, params)
            return cur.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en /api/ingresos: {str(e)}")
    finally:
        conn.close()




@app.get("/api/ingresos_sucursal")
def ingresos_por_sucursal():
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT
                    s.nombre AS sucursal,
                    COUNT(*) AS cantidad_de_pagos,
                    SUM(p.monto) AS total_recaudado
                FROM pago p
                JOIN alquiler a ON p.id_alquiler = a.id_alquiler
                JOIN reserva r ON a.id_reserva = r.id_reserva
                JOIN usuario u ON r.id_usuario = u.id_usuario
                LEFT JOIN usuario_sucursal us ON u.id_usuario = us.id_usuario
                LEFT JOIN sucursal s ON us.id_sucursal = s.id_sucursal
                GROUP BY s.nombre
                ORDER BY total_recaudado DESC;
            """)
            return cur.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/metodos")
def get_metodos(
    id: int = Query(None),
    cliente: str = Query(None),
    metodo: str = Query(None),
    monto_min: float = Query(None)
):
    conn = None
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = """
                SELECT 
                    p.id_pago AS id,
                    u.nombre AS cliente,
                    p.monto,
                    p.fecha_pago::date AS fecha_pago,
                    p.metodo
                FROM pago p
                JOIN alquiler a ON p.id_alquiler = a.id_alquiler
                JOIN reserva r ON a.id_reserva = r.id_reserva
                JOIN usuario u ON r.id_usuario = u.id_usuario
                WHERE 1=1
            """
            params = []

            if id is not None:
                query += " AND p.id_pago = %s"
                params.append(id)

            if cliente:
                query += " AND LOWER(u.nombre) LIKE %s"
                params.append(f"%{cliente.lower()}%")

            if metodo:
                query += " AND LOWER(p.metodo) = %s"
                params.append(metodo.lower())

            if monto_min is not None:
                query += " AND p.monto >= %s"
                params.append(monto_min)

            query += " ORDER BY p.fecha_pago DESC"

            cur.execute(query, params)
            return cur.fetchall()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error SQL en /api/metodos: {str(e)}")
    finally:
        if conn:
            conn.close()