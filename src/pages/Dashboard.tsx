import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Droplets, Clock, Calendar, MapPin, Sparkles } from "lucide-react";

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const CAUDAL_LPS = 4; // 4 litros por segundo

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

const Dashboard = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    fetchHorarios();
    const interval = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchHorarios = async () => {
    const { data } = await supabase
      .from("horarios_riego")
      .select("*, sectores(*)")
      .eq("activo", true)
      .order("dia_semana")
      .order("hora_inicio");

    if (data) setHorarios(data as any);
  };

  // Calcular sector activo (riego en curso ahora)
  const diaActual = ahora.getDay();
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

  const riegoActivo = horarios.find((h) => {
    if (h.dia_semana !== diaActual) return false;
    const inicioMin = h.hora_inicio * 60 + h.minuto_inicio;
    const finMin = inicioMin + h.sectores.duracion_minutos;
    return minutosActuales >= inicioMin && minutosActuales < finMin;
  });

  // Próximo riego (hoy o futuro)
  const proximoRiego = horarios
    .filter((h) => {
      if (h.dia_semana > diaActual) return true;
      if (h.dia_semana === diaActual) {
        const inicioMin = h.hora_inicio * 60 + h.minuto_inicio;
        return inicioMin > minutosActuales;
      }
      return false;
    })
    .sort((a, b) => {
      const da = (a.dia_semana - diaActual + 7) % 7;
      const db = (b.dia_semana - diaActual + 7) % 7;
      if (da !== db) return da - db;
      return a.hora_inicio * 60 + a.minuto_inicio - (b.hora_inicio * 60 + b.minuto_inicio);
    })[0];

  // Riegos de hoy
  const riegosHoy = horarios.filter((h) => h.dia_semana === diaActual);
  const segundosTotalesHoy = riegosHoy.reduce(
    (acc, h) => acc + h.sectores.duracion_minutos * 60,
    0
  );
  const litrosTotalesHoy = segundosTotalesHoy * CAUDAL_LPS;

  // Progreso del riego activo
  const progresoActivo = riegoActivo
    ? Math.min(
        100,
        ((minutosActuales - (riegoActivo.hora_inicio * 60 + riegoActivo.minuto_inicio)) /
          riegoActivo.sectores.duracion_minutos) *
          100
      )
    : 0;

  const minutosRestantes = riegoActivo
    ? Math.max(
        0,
        riegoActivo.hora_inicio * 60 +
          riegoActivo.minuto_inicio +
          riegoActivo.sectores.duracion_minutos -
          minutosActuales
      )
    : 0;

  const colorClase = (color: string) => {
    switch (color) {
      case "amarillo":
        return "bg-yellow-100 border-yellow-400 text-yellow-900";
      case "verde":
        return "bg-green-100 border-green-400 text-green-900";
      case "azul":
        return "bg-blue-100 border-blue-400 text-blue-900";
      default:
        return "bg-gray-100 border-gray-400 text-gray-900";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sistema de Riego — Quinta Estación</h1>
        <p className="text-muted-foreground">
          {DIAS[diaActual]},{" "}
          {ahora.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </p>
      </div>

      {/* RIEGO EN CURSO */}
      <Card className={`shadow-water border-2 ${riegoActivo ? "border-primary animate-pulse" : ""}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className={`w-5 h-5 ${riegoActivo ? "text-primary" : "text-muted-foreground"}`} />
            Riego en Curso
          </CardTitle>
          <CardDescription>
            {riegoActivo
              ? "Sector siendo regado en este momento"
              : "No hay riegos activos en este momento"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {riegoActivo ? (
            <div className="space-y-4">
              <div className={`p-6 rounded-lg border-2 ${colorClase(riegoActivo.sectores.color)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium opacity-75">SECTOR ACTIVO</p>
                    <h2 className="text-2xl font-bold">{riegoActivo.sectores.nombre}</h2>
                  </div>
                  <Badge className="bg-success">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Regando
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso del riego</span>
                    <span className="font-semibold">{progresoActivo.toFixed(0)}%</span>
                  </div>
                  <Progress value={progresoActivo} className="h-3" />
                  <div className="flex justify-between text-xs opacity-75">
                    <span>
                      Inicio: {String(riegoActivo.hora_inicio).padStart(2, "0")}:
                      {String(riegoActivo.minuto_inicio).padStart(2, "0")}
                    </span>
                    <span>{minutosRestantes} min restantes</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Duración programada</p>
                  <p className="font-semibold">{riegoActivo.sectores.duracion_minutos} min</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Volumen estimado</p>
                  <p className="font-semibold">
                    {(riegoActivo.sectores.duracion_minutos * 60 * CAUDAL_LPS).toLocaleString()} L
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Droplets className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>El sistema está en espera del próximo horario programado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GRID DE TARJETAS */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5" />
              Próximo Riego
            </CardTitle>
          </CardHeader>
          <CardContent>
            {proximoRiego ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{DIAS[proximoRiego.dia_semana]}</p>
                <p className="text-2xl font-bold">
                  {String(proximoRiego.hora_inicio).padStart(2, "0")}:
                  {String(proximoRiego.minuto_inicio).padStart(2, "0")}
                </p>
                <p className="text-sm font-medium">{proximoRiego.sectores.nombre}</p>
                <Badge variant="outline" className="text-xs">
                  {proximoRiego.sectores.duracion_minutos} min
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin riegos programados</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              Riegos Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{riegosHoy.length}</p>
            <p className="text-sm text-muted-foreground">
              {Math.floor(segundosTotalesHoy / 60)} min totales
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              ~{litrosTotalesHoy.toLocaleString()} L estimados
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5" />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Bomba:</span> Grundfos 5 HP
              </p>
              <p>
                <span className="text-muted-foreground">Caudal:</span> {CAUDAL_LPS} L/s
              </p>
              <p>
                <span className="text-muted-foreground">Sectores:</span> {new Set(horarios.map((h) => h.sector_id)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIEGOS DEL DÍA */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Riegos programados para hoy — {DIAS[diaActual]}</CardTitle>
        </CardHeader>
        <CardContent>
          {riegosHoy.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay riegos programados hoy</p>
          ) : (
            <div className="space-y-2">
              {riegosHoy
                .sort((a, b) => a.hora_inicio * 60 + a.minuto_inicio - (b.hora_inicio * 60 + b.minuto_inicio))
                .map((h) => {
                  const inicioMin = h.hora_inicio * 60 + h.minuto_inicio;
                  const finMin = inicioMin + h.sectores.duracion_minutos;
                  const enCurso = minutosActuales >= inicioMin && minutosActuales < finMin;
                  const completado = minutosActuales >= finMin;
                  return (
                    <div
                      key={h.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${colorClase(
                        h.sectores.color
                      )} ${enCurso ? "ring-2 ring-primary" : ""} ${completado ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold">
                          {String(h.hora_inicio).padStart(2, "0")}:
                          {String(h.minuto_inicio).padStart(2, "0")}
                        </span>
                        <span className="font-medium">{h.sectores.nombre}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>{h.sectores.duracion_minutos} min</span>
                        {enCurso && <Badge className="bg-success">En curso</Badge>}
                        {completado && <Badge variant="secondary">Completado</Badge>}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
