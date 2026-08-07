import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Droplets, Calendar, TrendingUp, Trophy } from "lucide-react";

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const CAUDAL_LPS = 4;

interface Sector {
  id: string;
  nombre: string;
  duracion_minutos: number;
  color: string;
}

interface Horario {
  id: string;
  sector_id: string;
  dia_semana: number;
  hora_inicio: number;
  minuto_inicio: number;
  activo: boolean;
  sectores: Sector;
}

const Historial = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    const { data } = await supabase
      .from("horarios_riego")
      .select("*, sectores(*)")
      .eq("activo", true)
      .order("dia_semana");
    if (data) setHorarios(data as any);
  };

  const ahora = new Date();
  const diaActual = ahora.getDay();

  const horariosHoy = horarios.filter((h) => h.dia_semana === diaActual);
  const minutosHoy = horariosHoy.reduce((acc, h) => acc + h.sectores.duracion_minutos, 0);
  const litrosHoy = minutosHoy * 60 * CAUDAL_LPS;

  const minutosSemana = horarios.reduce((acc, h) => acc + h.sectores.duracion_minutos, 0);
  const litrosSemana = minutosSemana * 60 * CAUDAL_LPS;

  const litrosMes = litrosSemana * 4.3;
  const minutosMes = minutosSemana * 4.3;

  const datosPorDia = DIAS.map((dia, idx) => {
    const horariosDia = horarios.filter((h) => h.dia_semana === idx);
    const minutos = horariosDia.reduce((acc, h) => acc + h.sectores.duracion_minutos, 0);
    return {
      dia: dia.substring(0, 3),
      minutos,
      litros: minutos * 60 * CAUDAL_LPS,
      sectores: horariosDia.length,
    };
  });

  const estadisticasPorSector = horarios.reduce((acc, h) => {
    const key = h.sectores.nombre;
    if (!acc[key]) {
      acc[key] = {
        nombre: key,
        color: h.sectores.color,
        duracion: h.sectores.duracion_minutos,
        veces_semana: 0,
        minutos_semana: 0,
        litros_semana: 0,
      };
    }
    acc[key].veces_semana += 1;
    acc[key].minutos_semana += h.sectores.duracion_minutos;
    acc[key].litros_semana += h.sectores.duracion_minutos * 60 * CAUDAL_LPS;
    return acc;
  }, {} as Record<string, any>);

  const sectoresOrdenados = Object.values(estadisticasPorSector).sort(
    (a: any, b: any) => b.litros_semana - a.litros_semana
  );

  const distribucionDuracion = horarios.reduce((acc, h) => {
    const key = `${h.sectores.duracion_minutos} min`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const datosPie = Object.entries(distribucionDuracion).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS_PIE = ["#fbbf24", "#22c55e", "#3b82f6"];

  const colorBadge = (color: string) => {
    switch (color) {
      case "amarillo":
        return "bg-yellow-100 text-yellow-900 border-yellow-400";
      case "verde":
        return "bg-green-100 text-green-900 border-green-400";
      case "azul":
        return "bg-blue-100 text-blue-900 border-blue-400";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reportes de Riego</h1>
        <p className="text-muted-foreground">
          Estadísticas simuladas según cronograma — Caudal: {CAUDAL_LPS} L/s
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              Resumen de Hoy
            </CardTitle>
            <CardDescription>{DIAS[diaActual]}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-3xl font-bold">{horariosHoy.length}</p>
            <p className="text-sm text-muted-foreground">sectores programados</p>
            <p className="text-sm mt-2">
              <span className="font-semibold">{minutosHoy} min</span> de riego
            </p>
            <p className="text-sm">
              <span className="font-semibold">{litrosHoy.toLocaleString()} L</span> estimados
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5" />
              Resumen Semanal
            </CardTitle>
            <CardDescription>7 días</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-3xl font-bold">{horarios.length}</p>
            <p className="text-sm text-muted-foreground">riegos semanales</p>
            <p className="text-sm mt-2">
              <span className="font-semibold">
                {Math.floor(minutosSemana / 60)} h {minutosSemana % 60} min
              </span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">{litrosSemana.toLocaleString()} L</span> estimados
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplets className="w-5 h-5" />
              Estimación Mensual
            </CardTitle>
            <CardDescription>~30 días</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-3xl font-bold">
              {Math.round(litrosMes / 1000).toLocaleString()}k
            </p>
            <p className="text-sm text-muted-foreground">litros estimados</p>
            <p className="text-sm mt-2">
              <span className="font-semibold">{Math.floor(minutosMes / 60)} h</span> de riego
            </p>
            <p className="text-sm">
              <span className="font-semibold">{Math.round(litrosMes).toLocaleString()} L</span> total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Consumo por día de la semana</CardTitle>
            <CardDescription>Litros estimados (caudal {CAUDAL_LPS} L/s)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={datosPorDia}>
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip
                  formatter={(value: any, name: string) =>
                    name === "litros"
                      ? [`${value.toLocaleString()} L`, "Litros"]
                      : [value, name]
                  }
                />
                <Bar dataKey="litros" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Distribución por duración</CardTitle>
            <CardDescription>Cantidad de riegos por duración</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={datosPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {datosPie.map((_, index) => (
                    <Cell key={index} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Estadísticas por Sector
          </CardTitle>
          <CardDescription>
            Ordenados por consumo semanal estimado de mayor a menor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sectoresOrdenados.map((s: any, idx) => (
              <div
                key={s.nombre}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-muted-foreground w-8">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{s.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.veces_semana} {s.veces_semana === 1 ? "vez" : "veces"} por semana — {s.duracion} min cada una
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="font-bold">{s.litros_semana.toLocaleString()} L</p>
                    <p className="text-xs text-muted-foreground">por semana</p>
                  </div>
                  <Badge variant="outline" className={colorBadge(s.color)}>
                    {s.duracion} min
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Historial;
