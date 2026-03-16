import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

interface ReservationDialogProps {
  spotId: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (spotId: string, name: string, plate: string) => void;
}

const ReservationDialog = ({ spotId, open, onClose, onConfirm }: ReservationDialogProps) => {
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !plate.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (spotId) {
      onConfirm(spotId, name, plate);
      setName("");
      setPlate("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Reservar Vaga {spotId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="plate">Placa do veículo</Label>
            <Input id="plate" placeholder="ABC-1234" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
