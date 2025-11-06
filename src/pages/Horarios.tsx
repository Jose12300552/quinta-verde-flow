import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const Horarios = () => {
  const [horarios, setHorarios] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [hora, setHora] = useState("08");
  const [minuto, setMinuto] = useState("00");
  const [duracion, setDuracion] = useState("10");
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchHorarios();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchHorarios = async () => {
    const { data } = await supabase
      .from("horarios_riego")
      .select("*")
      .order("hora", { ascending: true })
      .order("minuto", { ascending: true });
    
    if (data) setHorarios(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const horarioData = {
      hora: parseInt(hora),
      minuto: parseInt(minuto),
      duracion_segundos: parseInt(duracion) * 60,
      dias_semana: diasSeleccionados,
      created_by: user.id,
    };

    try {
      if (editando) {
        const { error } = await supabase
          .from("horarios_riego")
          .update(horarioData)
          .eq("id", editando.id);

        if (error) throw error;
        toast({ title: "Horario actualizado" });
      } else {
        const { error } = await supabase
          .from("horarios_riego")
          .insert(horarioData);

        if (error) throw error;
        toast({ title: "Horario creado" });
      }

      fetchHorarios();
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (horario: any) => {
    setEditando(horario);
    setHora(String(horario.hora).padStart(2, '0'));
    setMinuto(String(horario.minuto).padStart(2, '0'));
    setDuracion(String(horario.duracion_segundos / 60));
    setDiasSeleccionados(horario.dias_semana);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("horarios_riego")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Horario eliminado" });
      fetchHorarios();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      const { error } = await supabase
        .from("horarios_riego")
        .update({ activo: !activo })
        .eq("id", id);

      if (error) throw error;
      fetchHorarios();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditando(null);
    setHora("08");
    setMinuto("00");
    setDuracion("10");
    setDiasSeleccionados([0, 1, 2, 3, 4, 5, 6]);
  };

  const toggleDia = (dia: number) => {
    setDiasSeleccionados(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Horarios de Riego</h1>
          <p className="text-muted-foreground">Programa los riegos automáticos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleClose()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Horario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editando ? "Editar" : "Nuevo"} Horario</DialogTitle>
              <DialogDescription>
                Configura un horario de riego automático
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hora">Hora</Label>
                  <Input
                    id="hora"
                    type="number"
                    min="0"
                    max="23"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minuto">Minuto</Label>
                  <Input
                    id="minuto"
                    type="number"
                    min="0"
                    max="59"
                    value={minuto}
                    onChange={(e) => setMinuto(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracion">Duración (minutos)</Label>
                <Input
                  id="duracion"
                  type="number"
                  min="1"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Días de la semana</Label>
                <div className="flex gap-2">
                  {DIAS_SEMANA.map((dia, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant={diasSeleccionados.includes(index) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDia(index)}
                    >
                      {dia}
                    </Button>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editando ? "Actualizar" : "Crear"} Horario
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {horarios.map((horario) => (
          <Card key={horario.id} className="shadow-elegant">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold">
                    {String(horario.hora).padStart(2, '0')}:{String(horario.minuto).padStart(2, '0')}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Duración: {Math.floor(horario.duracion_segundos / 60)} minutos
                  </p>
                  <div className="flex gap-1">
                    {horario.dias_semana.map((dia: number) => (
                      <Badge key={dia} variant="secondary" className="text-xs">
                        {DIAS_SEMANA[dia]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={horario.activo}
                  onCheckedChange={() => toggleActivo(horario.id, horario.activo)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(horario)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(horario.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {horarios.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay horarios programados</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Horarios;
