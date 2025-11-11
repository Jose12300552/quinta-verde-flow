-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only admins and operators can insert device state" ON public.estado_dispositivo;
DROP POLICY IF EXISTS "Only admins and operators can update device state" ON public.estado_dispositivo;

-- Create public policies for ESP32 device communication
CREATE POLICY "Permitir inserción pública para ESP32"
  ON public.estado_dispositivo 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Permitir actualización pública para ESP32"
  ON public.estado_dispositivo 
  FOR UPDATE 
  USING (true);