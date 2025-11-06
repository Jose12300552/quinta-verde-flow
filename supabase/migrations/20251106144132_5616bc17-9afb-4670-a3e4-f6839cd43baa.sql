-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email, rol)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nombre', 'Usuario'),
    new.email,
    'admin'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Crear tabla de horarios de riego
CREATE TABLE public.horarios_riego (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hora INTEGER NOT NULL CHECK (hora >= 0 AND hora < 24),
  minuto INTEGER NOT NULL CHECK (minuto >= 0 AND minuto < 60),
  duracion_segundos INTEGER NOT NULL CHECK (duracion_segundos > 0),
  dias_semana INTEGER[] NOT NULL DEFAULT ARRAY[0,1,2,3,4,5,6],
  activo BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.horarios_riego ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver horarios"
  ON public.horarios_riego FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear horarios"
  ON public.horarios_riego FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Usuarios autenticados pueden actualizar horarios"
  ON public.horarios_riego FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden eliminar horarios"
  ON public.horarios_riego FOR DELETE
  TO authenticated
  USING (true);

-- Crear tabla de historial de riego
CREATE TABLE public.historial_riego (
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

ALTER TABLE public.historial_riego ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver historial"
  ON public.historial_riego FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear historial"
  ON public.historial_riego FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar historial"
  ON public.historial_riego FOR UPDATE
  TO authenticated
  USING (true);

-- Crear tabla de estado del dispositivo
CREATE TABLE public.estado_dispositivo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  esp32_id TEXT NOT NULL UNIQUE,
  estado_bomba TEXT NOT NULL DEFAULT 'apagado' CHECK (estado_bomba IN ('encendido', 'apagado')),
  estado_conexion TEXT NOT NULL DEFAULT 'offline' CHECK (estado_conexion IN ('online', 'offline')),
  ultimo_ping TIMESTAMPTZ,
  ip_address TEXT,
  tiempo_inicio_riego TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.estado_dispositivo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver estado"
  ON public.estado_dispositivo FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden actualizar estado"
  ON public.estado_dispositivo FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden insertar estado"
  ON public.estado_dispositivo FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insertar dispositivo por defecto
INSERT INTO public.estado_dispositivo (esp32_id, estado_bomba, estado_conexion)
VALUES ('ESP32_QUINTA_ESTACION', 'apagado', 'offline');

-- Trigger para actualizar updated_at en horarios_riego
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_horarios_updated_at
  BEFORE UPDATE ON public.horarios_riego
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_estado_dispositivo_updated_at
  BEFORE UPDATE ON public.estado_dispositivo
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();