-- ============================================================
-- SARQUE — Esquema completo sin autenticación
-- Ejecutar este script UNA SOLA VEZ en el SQL Editor de Supabase
-- ============================================================

-- 1. Tabla de horarios de riego
CREATE TABLE IF NOT EXISTS public.horarios_riego (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hora INTEGER NOT NULL CHECK (hora >= 0 AND hora < 24),
  minuto INTEGER NOT NULL CHECK (minuto >= 0 AND minuto < 60),
  duracion_segundos INTEGER NOT NULL CHECK (duracion_segundos > 0),
  dias_semana INTEGER[] NOT NULL DEFAULT ARRAY[0,1,2,3,4,5,6],
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabla de historial de riego
CREATE TABLE IF NOT EXISTS public.historial_riego (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha_hora_inicio TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_hora_fin TIMESTAMPTZ,
  duracion_real INTEGER,
  tipo TEXT NOT NULL CHECK (tipo IN ('manual', 'automatico')),
  horario_id UUID REFERENCES public.horarios_riego(id) ON DELETE SET NULL,
  estado TEXT NOT NULL DEFAULT 'completado' CHECK (estado IN ('completado', 'error', 'cancelado')),
  observaciones TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabla de estado del dispositivo
CREATE TABLE IF NOT EXISTS public.estado_dispositivo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  esp32_id TEXT NOT NULL UNIQUE,
  estado_bomba TEXT NOT NULL DEFAULT 'apagado' CHECK (estado_bomba IN ('encendido', 'apagado')),
  estado_conexion TEXT NOT NULL DEFAULT 'offline' CHECK (estado_conexion IN ('online', 'offline')),
  ultimo_ping TIMESTAMPTZ,
  ip_address TEXT,
  tiempo_inicio_riego TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Función y triggers de actualización automática
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_horarios_updated_at ON public.horarios_riego;
CREATE TRIGGER update_horarios_updated_at
  BEFORE UPDATE ON public.horarios_riego
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_estado_dispositivo_updated_at ON public.estado_dispositivo;
CREATE TRIGGER update_estado_dispositivo_updated_at
  BEFORE UPDATE ON public.estado_dispositivo
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Insertar dispositivo por defecto
-- ============================================================
INSERT INTO public.estado_dispositivo (esp32_id, estado_bomba, estado_conexion)
VALUES ('ESP32_QUINTA_ESTACION', 'apagado', 'offline')
ON CONFLICT (esp32_id) DO NOTHING;

-- ============================================================
-- RLS PÚBLICO (sin autenticación)
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.horarios_riego ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_riego ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estado_dispositivo ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores si existen
DROP POLICY IF EXISTS "Acceso público total a horarios" ON public.horarios_riego;
DROP POLICY IF EXISTS "Acceso público total a historial" ON public.historial_riego;
DROP POLICY IF EXISTS "Acceso público a lectura de estado_dispositivo" ON public.estado_dispositivo;
DROP POLICY IF EXISTS "Acceso público total a estado_dispositivo" ON public.estado_dispositivo;

-- Crear políticas públicas (acceso libre sin login)
CREATE POLICY "Acceso público total a horarios"
  ON public.horarios_riego
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Acceso público total a historial"
  ON public.historial_riego
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Acceso público total a estado_dispositivo"
  ON public.estado_dispositivo
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Listo. La base de datos está configurada para SARQUE sin login.
-- ============================================================
