-- Create app_role enum for role types
CREATE TYPE public.app_role AS ENUM ('admin', 'operator', 'viewer');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Remove rol column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS rol;

-- Update handle_new_user trigger to NOT auto-assign admin role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create profile, do NOT assign admin role automatically
  INSERT INTO public.profiles (id, nombre, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nombre', 'Usuario'),
    new.email
  );
  RETURN new;
END;
$$;

-- Update RLS policies to use has_role() for device control
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar estado" ON public.estado_dispositivo;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar estado" ON public.estado_dispositivo;

CREATE POLICY "Only admins and operators can update device state"
  ON public.estado_dispositivo
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'operator'));

CREATE POLICY "Only admins and operators can insert device state"
  ON public.estado_dispositivo
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'operator'));

-- Update RLS policies for horarios_riego
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar horarios" ON public.horarios_riego;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar horarios" ON public.horarios_riego;

CREATE POLICY "Only admins and operators can update schedules"
  ON public.horarios_riego
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'operator'));

CREATE POLICY "Only admins and operators can delete schedules"
  ON public.horarios_riego
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'operator'));

-- Update RLS policy for historial_riego
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar historial" ON public.historial_riego;

CREATE POLICY "Only admins and operators can update history"
  ON public.historial_riego
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'operator'));