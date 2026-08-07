-- ============================================================
-- SARQUE — BASE DE DATOS COMPLETA (visualización + cronograma editable)
-- App de visualización para Parque Ecoturístico Quinta Estación
-- Ejecutar en SQL Editor de Supabase
-- ============================================================

-- ============================================================
-- LIMPIEZA — eliminar tablas anteriores si existen
-- ============================================================
DROP TABLE IF EXISTS public.historial_riego CASCADE;
DROP TABLE IF EXISTS public.horarios_riego CASCADE;
DROP TABLE IF EXISTS public.estado_dispositivo CASCADE;
DROP TABLE IF EXISTS public.sectores CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- ============================================================
-- 1. TABLA: sectores
-- ============================================================
CREATE TABLE public.sectores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  duracion_minutos INTEGER NOT NULL CHECK (duracion_minutos > 0 AND duracion_minutos <= 240),
  color TEXT NOT NULL DEFAULT 'amarillo' CHECK (color IN ('amarillo', 'verde', 'azul')),
  descripcion TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. TABLA: horarios_riego (cronograma semanal)
-- Cada fila = un riego programado (sector, día, hora)
-- ============================================================
CREATE TABLE public.horarios_riego (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id UUID NOT NULL REFERENCES public.sectores(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_inicio INTEGER NOT NULL CHECK (hora_inicio BETWEEN 0 AND 23),
  minuto_inicio INTEGER NOT NULL DEFAULT 0 CHECK (minuto_inicio BETWEEN 0 AND 59),
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sector_id, dia_semana, hora_inicio, minuto_inicio)
);

-- ============================================================
-- 3. FUNCIONES Y TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sectores_updated_at
  BEFORE UPDATE ON public.sectores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_horarios_updated_at
  BEFORE UPDATE ON public.horarios_riego
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 4. RLS PÚBLICO (sin autenticación)
-- ============================================================
ALTER TABLE public.sectores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios_riego ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso publico sectores"
  ON public.sectores FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Acceso publico horarios"
  ON public.horarios_riego FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 5. DATOS INICIALES — sectores del Parque Quinta Estación
-- Colores: amarillo=2h, verde=1.5h, azul=1h
-- ============================================================
INSERT INTO public.sectores (nombre, duracion_minutos, color) VALUES
  ('Quinta Avenida', 120, 'amarillo'),
  ('Casa Club (Salón)', 120, 'amarillo'),
  ('Camping', 90, 'verde'),
  ('Mapa Torre (Abajo)', 90, 'verde'),
  ('Reservorio', 90, 'verde'),
  ('Curvas (Norte)', 120, 'amarillo'),
  ('Curvas (Sud)', 120, 'amarillo'),
  ('Mil y una Flor', 120, 'amarillo'),
  ('Laguna de Carpas', 90, 'verde'),
  ('Suculentas', 60, 'azul'),
  ('Cactáreo', 60, 'azul'),
  ('Toro', 120, 'amarillo'),
  ('Laberinto', 90, 'verde'),
  ('Laguna Cuadrada', 90, 'verde'),
  ('Huerto', 90, 'verde'),
  ('Frutales 1', 120, 'amarillo'),
  ('Frutales 2', 120, 'amarillo'),
  ('Rotonda', 120, 'amarillo'),
  ('Mediterráneo Calle', 120, 'amarillo'),
  ('Mediterráneo Bambú', 120, 'amarillo');

-- ============================================================
-- 6. DATOS INICIALES — cronograma semanal según foto
-- dia_semana: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles,
--             4=Jueves, 5=Viernes, 6=Sábado
-- ============================================================

-- LUNES (dia_semana = 1)
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 1, 8 FROM public.sectores WHERE nombre = 'Quinta Avenida';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 1, 10 FROM public.sectores WHERE nombre = 'Casa Club (Salón)';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 1, 12 FROM public.sectores WHERE nombre = 'Camping';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 1, 14 FROM public.sectores WHERE nombre = 'Mapa Torre (Abajo)';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 1, 16 FROM public.sectores WHERE nombre = 'Reservorio';

-- MARTES (dia_semana = 2)
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 2, 8 FROM public.sectores WHERE nombre = 'Curvas (Norte)';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 2, 10 FROM public.sectores WHERE nombre = 'Curvas (Sud)';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 2, 12 FROM public.sectores WHERE nombre = 'Mil y una Flor';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 2, 14 FROM public.sectores WHERE nombre = 'Laguna de Carpas';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 2, 16 FROM public.sectores WHERE nombre = 'Suculentas';

-- MIÉRCOLES (dia_semana = 3)
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 3, 8 FROM public.sectores WHERE nombre = 'Cactáreo';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 3, 10 FROM public.sectores WHERE nombre = 'Toro';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 3, 12 FROM public.sectores WHERE nombre = 'Laberinto';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 3, 14 FROM public.sectores WHERE nombre = 'Laguna Cuadrada';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 3, 16 FROM public.sectores WHERE nombre = 'Huerto';

-- JUEVES (dia_semana = 4)
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 4, 8 FROM public.sectores WHERE nombre = 'Frutales 1';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 4, 10 FROM public.sectores WHERE nombre = 'Frutales 2';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 4, 12 FROM public.sectores WHERE nombre = 'Quinta Avenida';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 4, 14 FROM public.sectores WHERE nombre = 'Casa Club (Salón)';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 4, 16 FROM public.sectores WHERE nombre = 'Camping';

-- VIERNES (dia_semana = 5)
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 5, 8 FROM public.sectores WHERE nombre = 'Curvas (Norte)';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 5, 10 FROM public.sectores WHERE nombre = 'Curvas (Sud)';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 5, 12 FROM public.sectores WHERE nombre = 'Mil y una Flor';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 5, 14 FROM public.sectores WHERE nombre = 'Laguna de Carpas';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 5, 16 FROM public.sectores WHERE nombre = 'Laberinto';

-- SÁBADO (dia_semana = 6)
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 6, 8 FROM public.sectores WHERE nombre = 'Rotonda';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 6, 10 FROM public.sectores WHERE nombre = 'Huerto';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 6, 12 FROM public.sectores WHERE nombre = 'Mapa Torre (Abajo)';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 6, 14 FROM public.sectores WHERE nombre = 'Toro';

-- DOMINGO (dia_semana = 0)
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 0, 8 FROM public.sectores WHERE nombre = 'Mediterráneo Calle';
INSERT INTO public.horarios_riego (sector_id, dia_semana, hora_inicio)
SELECT id, 0, 10 FROM public.sectores WHERE nombre = 'Mediterráneo Bambú';

-- ============================================================
-- LISTO. La app ya puede leer sectores y cronograma.
-- ============================================================
