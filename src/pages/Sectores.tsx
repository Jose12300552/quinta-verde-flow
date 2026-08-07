import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sector {
  id: string;
  nombre: string;
  duracion_minutos: number;
  color: string;
  descripcion: string | null;
  activo: boolean;
}

const Sectores = () => {
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Sector | null>(null);
  const [nombre, setNombre] = useState("");
  const [duracion, setDuracion] = useState("60");
  const [color, setColor] = useState("amarillo");
  const [descripcion, setDescripcion] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSectores();
  }, []);

  const fetchSectores = async () => {
    const { data } = await supabase.from("sectores").select("*").order("nombre");
    if (data) setSectores(data);
  };

  const resetForm = () => {
    setNombre("");
    setDuracion("60");
    setColor("amarillo");
    setDescripcion("");
    setEditando(null);
  };

  const handleEdit = (s: Sector) => {
    setEditando(s);
    setNombre(s.nombre);
    setDuracion(String(s.duracion_minutos));
    setColor(s.color);
    setDescripcion(s.descripcion || "");
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      toast({ title: "Error", description: "El nombre es obligatorio", variant: "destructive" });
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      duracion_minutos: parseInt(duracion),
      color,
      descripcion: descripcion.trim() || null,
    };

    let error;
    if (editando) {
      const result = await supabase.from("sectores").update(payload).eq("id", editando.id);
      error = result.error;
    } else {
      const result = await supabase.from("sectores").insert(payload);
      error = result.error;
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: editando ? "Sector actualizado" : "Sector creado" });
    setOpen(false);
    resetForm();
    fetchSectores();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este sector? Se eliminarán también sus horarios.")) return;
    const { error } = await supabase.from("sectores").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Sector eliminado" });
    fetchSectores();
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="w-8 h-8" />
            Sectores del Parque
          </h1>
          <p className="text-muted-foreground">
            Gestiona los sectores de riego del Parque Quinta Estación
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Sector
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de sectores</CardTitle>
          <CardDescription>{sectores.length} sectores registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {sectores.map((s) => (
              <div
                key={s.id}
                className={`p-4 rounded-lg border-2 ${colorBadge(s.color)} relative group`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-bold">{s.nombre}</h3>
                    <p className="text-xs opacity-75 mt-1">{s.duracion_minutos} minutos</p>
                    {s.descripcion && (
                      <p className="text-xs mt-2 opacity-75">{s.descripcion}</p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(s)}
                      className="p-1 hover:bg-white/50 rounded"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1 hover:bg-white/50 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Sector" : "Nuevo Sector"}</DialogTitle>
            <DialogDescription>
              {editando
                ? "Modifica los datos del sector"
                : "Agrega un nuevo sector de riego al parque"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre del sector</Label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Laberinto de Wisterias"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Duración</Label>
                <Select value={duracion} onValueChange={setDuracion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">1 hora (60 min)</SelectItem>
                    <SelectItem value="90">1:30 horas (90 min)</SelectItem>
                    <SelectItem value="120">2 horas (120 min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amarillo">🟨 Amarillo (2h)</SelectItem>
                    <SelectItem value="verde">🟩 Verde (1:30h)</SelectItem>
                    <SelectItem value="azul">🟦 Azul (1h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción (opcional)</Label>
              <Textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción del sector, tipo de vegetación..."
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              {editando ? "Guardar cambios" : "Crear sector"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sectores;
