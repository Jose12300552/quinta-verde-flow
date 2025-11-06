import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Power, Clock, Activity, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [estadoDispositivo, setEstadoDispositivo] = useState<any>(null);
  const [proximoRiego, setProximoRiego] = useState<any>(null);
  const [estadisticasHoy, setEstadisticasHoy] = useState({ total: 0, tiempo: 0 });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEstado();
    fetchProximoRiego();
    fetchEstadisticasHoy();
    
    const interval = setInterval(() => {
      fetchEstado();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchEstado = async () => {
    const { data } = await supabase
      .from("estado_dispositivo")
      .select("*")
      .eq("esp32_id", "ESP32_QUINTA_ESTACION")
      .single();
    
    if (data) setEstadoDispositivo(data);
  };

  const fetchProximoRiego = async () => {
    const now = new Date();
    const diaActual = now.getDay();
    const horaActual = now.getHours();
    const minutoActual = now.getMinutes();

    const { data } = await supabase
      .from("horarios_riego")
      .select("*")
      .eq("activo", true)
      .contains("dias_semana", [diaActual])
      .order("hora", { ascending: true })
      .order("minuto", { ascending: true });

    if (data) {
      const proximo = data.find(h => 
        h.hora > horaActual || (h.hora === horaActual && h.minuto > minutoActual)
      );
      setProximoRiego(proximo);
    }
  };

  const fetchEstadisticasHoy = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from("historial_riego")
      .select("*")
      .gte("fecha_hora_inicio", `${hoy}T00:00:00`)
      .lte("fecha_hora_inicio", `${hoy}T23:59:59`);

    if (data) {
      const total = data.length;
      const tiempo = data.reduce((acc, r) => acc + (r.duracion_real || 0), 0);
      setEstadisticasHoy({ total, tiempo });
    }
  };

  const toggleBomba = async () => {
    if (!estadoDispositivo) return;

    setLoading(true);
    try {
      const nuevoEstado = estadoDispositivo.estado_bomba === "encendido" ? "apagado" : "encendido";
      
      const { error: updateError } = await supabase
        .from("estado_dispositivo")
        .update({
          estado_bomba: nuevoEstado,
          tiempo_inicio_riego: nuevoEstado === "encendido" ? new Date().toISOString() : null,
        })
        .eq("esp32_id", "ESP32_QUINTA_ESTACION");

      if (updateError) throw updateError;

      if (nuevoEstado === "encendido") {
        const { error: historialError } = await supabase
          .from("historial_riego")
          .insert({
            tipo: "manual",
            estado: "completado",
            fecha_hora_inicio: new Date().toISOString(),
          });

        if (historialError) throw historialError;
      } else {
        const { data: historialData } = await supabase
          .from("historial_riego")
          .select("*")
          .eq("tipo", "manual")
          .is("fecha_hora_fin", null)
          .order("fecha_hora_inicio", { ascending: false })
          .limit(1)
          .single();

        if (historialData) {
          const duracion = Math.floor(
            (new Date().getTime() - new Date(historialData.fecha_hora_inicio).getTime()) / 1000
          );

          await supabase
            .from("historial_riego")
            .update({
              fecha_hora_fin: new Date().toISOString(),
              duracion_real: duracion,
            })
            .eq("id", historialData.id);
        }
      }

      fetchEstado();
      fetchEstadisticasHoy();
      
      toast({
        title: nuevoEstado === "encendido" ? "Bomba encendida" : "Bomba apagada",
        description: `El sistema de riego ha sido ${nuevoEstado}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTiempoTranscurrido = () => {
    if (!estadoDispositivo?.tiempo_inicio_riego) return "0s";
    const inicio = new Date(estadoDispositivo.tiempo_inicio_riego).getTime();
    const ahora = new Date().getTime();
    const segundos = Math.floor((ahora - inicio) / 1000);
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}m ${segundosRestantes}s`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        <p className="text-muted-foreground">Sistema de riego automatizado</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2 shadow-water">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="w-5 h-5" />
              Control Manual
            </CardTitle>
            <CardDescription>Encender o apagar la bomba de riego</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-6 rounded-lg bg-gradient-subtle border">
              <div className="space-y-2">
                <p className="text-sm font-medium">Estado de la bomba</p>
                <Badge 
                  variant={estadoDispositivo?.estado_bomba === "encendido" ? "default" : "secondary"}
                  className={estadoDispositivo?.estado_bomba === "encendido" ? "bg-success" : ""}
                >
                  {estadoDispositivo?.estado_bomba === "encendido" ? "Encendido" : "Apagado"}
                </Badge>
                {estadoDispositivo?.estado_bomba === "encendido" && (
                  <p className="text-sm text-muted-foreground">
                    Tiempo: {getTiempoTranscurrido()}
                  </p>
                )}
              </div>
              <Button
                size="lg"
                onClick={toggleBomba}
                disabled={loading}
                className={estadoDispositivo?.estado_bomba === "encendido" 
                  ? "bg-destructive hover:bg-destructive/90" 
                  : "bg-success hover:bg-success/90"}
              >
                {loading ? "Procesando..." : estadoDispositivo?.estado_bomba === "encendido" ? "Apagar" : "Encender"}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4" />
              <span>Estado de conexión:</span>
              <Badge variant={estadoDispositivo?.estado_conexion === "online" ? "default" : "secondary"}>
                {estadoDispositivo?.estado_conexion === "online" ? "En línea" : "Sin conexión"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Próximo Riego
            </CardTitle>
          </CardHeader>
          <CardContent>
            {proximoRiego ? (
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  {String(proximoRiego.hora).padStart(2, '0')}:{String(proximoRiego.minuto).padStart(2, '0')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Duración: {Math.floor(proximoRiego.duracion_segundos / 60)} minutos
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay riegos programados</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Riegos Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{estadisticasHoy.total}</p>
            <p className="text-sm text-muted-foreground">
              Total: {Math.floor(estadisticasHoy.tiempo / 60)} min
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Dispositivo:</span> ESP32
              </p>
              <p className="text-sm">
                <span className="font-medium">IP:</span> {estadoDispositivo?.ip_address || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
