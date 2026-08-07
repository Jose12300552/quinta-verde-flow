import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const HORAS = [8, 10, 12, 14, 16, 18];

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

const Horarios = () => {
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [open, setOpen] = useState(false);
  const [sectorId, setSectorId] = useState("");
  const [diaSemana, setDiaSemana] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSectores();
    fetchHorarios();
  }, []);

  const fetchSectores = async () => {
    const { data } = await supabase
      .from("sectores")
      .select("*")
      .eq("activo", true)
      .order("nombre");
    if (data) setSectores(data);
  };

  const fetchHorarios = async () => {
    const { data } = await supabase
      .from("horarios_riego")
      .select("*, sectores(*)")
      .order("dia_semana")
      .order("hora_inicio");
    if (data) setHorarios(data as any);
  };

  const handleCreate = async () => {
    if (!sectorId || !diaSemana || !horaInicio) {
      toast({
        title: "Error",
        description: "Completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("horarios_riego").insert({
      sector_id: sectorId,
      dia_semana: parseInt(diaSemana),
      hora_inicio: parseInt(horaInicio),
      minuto_inicio: 0,
      activo: true,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Horario creado" });
    setOpen(false);
    setSectorId("");
    setDiaSemana("");
    setHoraInicio("");
    fetchHorarios();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("horarios_riego").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Horario eliminado" });
    fetchHorarios();
  };

  const colorClase = (color: string) => {
    switch (color) {
      case "amarillo":
        return "bg-yellow-100 border-yellow-400 text-yellow-900 hover:bg-yellow-200";
      case "verde":
        return "bg-green-100 border-green-400 text-green-900 hover:bg-green-200";
      case "azul":
        return "bg-blue-100 border-blue-400 text-blue-900 hover:bg-blue-200";
      default:
        return "bg-gray-100 border-gray-400 text-gray-900";
    }
  };

  const getHorariosCelda = (dia: number, hora: number) => {
    return horarios.filter(
      (h) => h.dia_semana === dia && h.hora_inicio === hora
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            Cronograma de Riego
          </h1>
          <p className="text-muted-foreground">
            Horarios semanales de riego por sector
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Horario
        </Button>
      </div>

      {/* Leyenda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-400" />
              <span>Riego 2 horas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-400" />
              <span>Riego 1:30 horas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-400" />
              <span>Riego 1 hora</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla del cronograma */}
      <Card>
        <CardHeader>
          <CardTitle>Cronograma semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted font-semibold text-sm">Hora</th>
                  {DIAS.map((dia, idx) => (
                    <th key={idx} className="border p-2 bg-muted font-semibold text-sm">
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HORAS.map((hora) => (
                  <tr key={hora}>
                    <td className="border p-2 font-mono text-sm font-semibold bg-muted">
                      {String(hora).padStart(2, "0")}:00 - {String(hora + 2).padStart(2, "0")}:00
                    </td>
                    {DIAS.map((_, dia) => {
                      const celdas = getHorariosCelda(dia, hora);
                      return (
                        <td key={dia} className="border p-1 align-top min-w-[120px]">
                          {celdas.map((h) => (
                            <div
                              key={h.id}
                              className={`p-2 mb-1 rounded border-2 group relative ${colorClase(
                                h.sectores.color
                              )}`}
                            >
                              <p className="text-xs font-semibold pr-6">{h.sectores.nombre}</p>
                              <p className="text-xs opacity-75">
                                {h.sectores.duracion_minutos} min
                              </p>
                              <button
                                onClick={() => handleDelete(h.id)}
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de nuevo horario */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Horario</DialogTitle>
            <DialogDescription>
              Asigna un sector a un día y franja horaria
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Sector</Label>
              <Select value={sectorId} onValueChange={setSectorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectores.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nombre} ({s.duracion_minutos} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Día de la semana</Label>
              <Select value={diaSemana} onValueChange={setDiaSemana}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  {DIAS.map((dia, idx) => (
                    <SelectItem key={idx} value={String(idx)}>
                      {dia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hora de inicio</Label>
              <Select value={horaInicio} onValueChange={setHoraInicio}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la hora" />
                </SelectTrigger>
                <SelectContent>
                  {HORAS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {String(h).padStart(2, "0")}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCreate} className="w-full">
              Crear Horario
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Horarios;
