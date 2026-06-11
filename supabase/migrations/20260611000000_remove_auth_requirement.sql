-- Eliminar autenticación: hacer todas las tablas públicamente accesibles
-- y created_by opcional

-- 1. Hacer created_by opcional en horarios_riego
ALTER TABLE public.horarios_riego
  ALTER COLUMN created_by DROP NOT NULL;

-- 2. Eliminar políticas RLS restrictivas existentes en horarios_riego
DROP POLICY IF EXISTS "Authenticated users can view horarios" ON public.horarios_riego;
DROP POLICY IF EXISTS "Only admins and operators can insert horarios" ON public.horarios_riego;
DROP POLICY IF EXISTS "Only admins and operators can update horarios" ON public.horarios_riego;
DROP POLICY IF EXISTS "Only admins and operators can delete horarios" ON public.horarios_riego;

-- 3. Crear políticas públicas para horarios_riego
CREATE POLICY "Acceso público total a horarios"
  ON public.horarios_riego
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Eliminar políticas restrictivas en historial_riego
DROP POLICY IF EXISTS "Authenticated users can view historial" ON public.historial_riego;
DROP POLICY IF EXISTS "Only admins and operators can insert historial" ON public.historial_riego;
DROP POLICY IF EXISTS "Only admins and operators can update historial" ON public.historial_riego;

-- 5. Crear políticas públicas para historial_riego
CREATE POLICY "Acceso público total a historial"
  ON public.historial_riego
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Eliminar políticas restrictivas en estado_dispositivo
DROP POLICY IF EXISTS "Authenticated users can view device state" ON public.estado_dispositivo;

-- 7. Permitir SELECT público en estado_dispositivo
CREATE POLICY "Acceso público a lectura de estado_dispositivo"
  ON public.estado_dispositivo
  FOR SELECT
  USING (true);
