from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
def get_ingresos():
    conn = None
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT
                    p.id_pago AS id,
                    p.id_alquiler,
                    p.monto,
                    p.fecha_pago::date AS fecha_pago,
                    p.metodo,
                    s.nombre AS sucursal
                FROM pago p
                JOIN alquiler a ON p.id_alquiler = a.id_alquiler
                JOIN reserva r ON a.id_reserva = r.id_reserva
                JOIN sucursal s ON r.id_sucursal = s.id_sucursal
                ORDER BY p.id_pago
            """)
            return cur.fetchall()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error en la consulta SQL: {str(e)}")
    finally:
        if conn:
            conn.close()


@app.get("/api/ingresos/sucursal")
def ingresos_por_sucursal():
    conn = None
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT s.nombre AS sucursal, SUM(p.monto)::numeric(10,2) AS total
                FROM pago p
                JOIN alquiler a ON p.id_alquiler = a.id_alquiler
                JOIN reserva r ON a.id_reserva = r.id_reserva
                JOIN sucursal s ON r.id_sucursal = s.id_sucursal
                GROUP BY s.nombre
                ORDER BY s.nombre
            """)
            return cur.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    finally:
        if conn:
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
def ingresos_por_metodo():
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT
                    metodo,
                    COUNT(*) AS cantidad,
                    SUM(monto) AS total
                FROM pago
                GROUP BY metodo
                ORDER BY total DESC;
            """)
            return cur.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/health")
def health_check():
    return {"status": "healthy"}