-- Tabla: Rol
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla: Usuario
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena_hash TEXT NOT NULL,
    id_rol INT REFERENCES rol(id_rol) NOT NULL
);

-- Tabla: Sucursal
CREATE TABLE sucursal (
    id_sucursal SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL
);

-- Tabla de cruce: Usuario-Sucursal
CREATE TABLE usuario_sucursal (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    id_sucursal INT REFERENCES sucursal(id_sucursal)
);

-- Tabla: Vehículo
CREATE TABLE vehiculo (
    id_vehiculo SERIAL PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INT CHECK (anio >= 2000),
    estado VARCHAR(20) DEFAULT 'Disponible' CHECK (estado IN ('Disponible', 'Rentado', 'Mantenimiento')),
    costo_diario NUMERIC(10,2) NOT NULL
);

-- Tabla: Categoría
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de cruce: Vehículo-Categoría
CREATE TABLE vehiculo_categoria (
    id SERIAL PRIMARY KEY,
    id_vehiculo INT REFERENCES vehiculo(id_vehiculo),
    id_categoria INT REFERENCES categoria(id_categoria)
);

-- Tabla: Reserva
CREATE TABLE reserva (
    id_reserva SERIAL PRIMARY KEY,
    id_sucursal INT REFERENCES sucursal(id_sucursal),
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    id_usuario INT REFERENCES usuario(id_usuario),
    id_vehiculo INT REFERENCES vehiculo(id_vehiculo),
    total NUMERIC(10,2) CHECK (total >= 0),
    CHECK (fecha_fin >= fecha_inicio)
);

-- Tabla: Alquiler 
CREATE TABLE alquiler (
    id_alquiler SERIAL PRIMARY KEY,
    id_reserva INT UNIQUE REFERENCES reserva(id_reserva),
    fecha_entrega TIMESTAMP NOT NULL,
    fecha_devolucion TIMESTAMP,
    total NUMERIC(10,2) CHECK (total >= 0)
);

-- Tabla: Pago
CREATE TABLE pago (
    id_pago SERIAL PRIMARY KEY,
    id_alquiler INT REFERENCES alquiler(id_alquiler),
    monto NUMERIC(10,2) NOT NULL CHECK (monto > 0),
    fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo VARCHAR(50) NOT NULL
);

-- Tabla: Mantenimiento
CREATE TABLE mantenimiento (
    id_mantenimiento SERIAL PRIMARY KEY,
    id_vehiculo INT REFERENCES vehiculo(id_vehiculo),
    descripcion TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL,
    costo NUMERIC(10,2) CHECK (costo >= 0)
);

-- 1. Actualizar estado del vehículo al crear un alquiler
CREATE OR REPLACE FUNCTION actualizar_estado_vehiculo_alquilar()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE vehiculo
    SET estado = 'Rentado'
    WHERE id_vehiculo = (
    SELECT id_vehiculo FROM reserva WHERE id_reserva = NEW.id_reserva
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_estado_alquilar
AFTER INSERT ON alquiler
FOR EACH ROW
EXECUTE FUNCTION actualizar_estado_vehiculo_alquilar();

-- 2. Liberar vehículo al devolverlo
CREATE OR REPLACE FUNCTION liberar_vehiculo_al_devolver()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fecha_devolucion IS NOT NULL THEN
    UPDATE vehiculo
    SET estado = 'Disponible'
    WHERE id_vehiculo = (
        SELECT id_vehiculo FROM reserva WHERE id_reserva = NEW.id_reserva
    );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_liberar_vehiculo
AFTER UPDATE ON alquiler
FOR EACH ROW
EXECUTE FUNCTION liberar_vehiculo_al_devolver();


-- 4. Calcular el total automáticamente al insertar una reserva
CREATE OR REPLACE FUNCTION calcular_total_reserva()
RETURNS TRIGGER AS $$
DECLARE
    costo NUMERIC(10,2);
    dias INT;
BEGIN
    SELECT costo_diario INTO costo FROM vehiculo WHERE id_vehiculo = NEW.id_vehiculo;
    dias := GREATEST(1, DATE_PART('day', NEW.fecha_fin - NEW.fecha_inicio));
    NEW.total := ROUND(costo * dias, 2);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calcular_total_reserva
BEFORE INSERT ON reserva
FOR EACH ROW
EXECUTE FUNCTION calcular_total_reserva();
