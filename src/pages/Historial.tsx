import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Droplets, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Historial = () => {
  const [historial, setHistorial] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [estadisticas, setEstadisticas] = useState({
    totalRiegos: 0,
    tiempoTotal: 0,
    promedioTiempo: 0,
  });

  useEffect(() => {
    fetchHistorial();
  }, [filtroTipo]);

  const fetchHistorial = async () => {
    let query = supabase
      .from("historial_riego")
      .select("*, horarios_riego(hora, minuto)")
      .order("fecha_hora_inicio", { ascending: false })
      .limit(50);

    if (filtroTipo !== "todos") {
      query = query.eq("tipo", filtroTipo);
    }

    const { data } = await query;

    if (data) {
      setHistorial(data);
      
      const stats = data.reduce(
        (acc, item) => ({
          totalRiegos: acc.totalRiegos + 1,
          tiempoTotal: acc.tiempoTotal + (item.duracion_real || 0),
          promedioTiempo: 0,
        }),
        { totalRiegos: 0, tiempoTotal: 0, promedioTiempo: 0 }
      );
      
      stats.promedioTiempo = stats.totalRiegos > 0 
        ? Math.floor(stats.tiempoTotal / stats.totalRiegos) 
        : 0;
      
      setEstadisticas(stats);
    }
  };

  const formatDuracion = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}m ${segs}s`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Historial de Riego</h1>
        <p className="text-muted-foreground">Registro de todos los eventos de riego</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Riegos</CardTitle>
            <Droplets className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalRiegos}</div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <History className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(estadisticas.tiempoTotal / 60)} min
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuracion(estadisticas.promedioTiempo)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-water">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registro de Eventos</CardTitle>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="automatico">Automático</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {format(new Date(item.fecha_hora_inicio), "dd MMM yyyy, HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.tipo === "manual" ? "default" : "secondary"}>
                        {item.tipo === "manual" ? "Manual" : "Automático"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.duracion_real ? formatDuracion(item.duracion_real) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.estado === "completado" ? "default" : "destructive"}
                        className={item.estado === "completado" ? "bg-success" : ""}
                      >
                        {item.estado === "completado" ? "Completado" : 
                         item.estado === "error" ? "Error" : "Cancelado"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {historial.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No hay registros de riego
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Historial;
