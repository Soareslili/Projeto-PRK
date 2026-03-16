import { Car } from "lucide-react";

type SpotStatus = "available" | "occupied" | "reserved";

interface ParkingSpotProps {
  id: string;
  status: SpotStatus;
  onClick: (id: string) => void;
}

const statusConfig: Record<SpotStatus, { bg: string; border: string; label: string }> = {
  available: { bg: "bg-available/10", border: "border-available", label: "Livre" },
  occupied: { bg: "bg-occupied/10", border: "border-occupied", label: "Ocupada" },
  reserved: { bg: "bg-reserved/10", border: "border-reserved", label: "Reservada" },
};

const ParkingSpot = ({ id, status, onClick }: ParkingSpotProps) => {
  const config = statusConfig[status];

  return (
    <button
      onClick={() => status === "available" && onClick(id)}
      disabled={status === "occupied"}
      className={`relative flex flex-col items-center justify-center gap-1 rounded-lg border-2 p-3 transition-all ${config.bg} ${config.border} ${
        status === "available" ? "cursor-pointer hover:scale-105 hover:shadow-md" : "cursor-default opacity-80"
      }`}
    >
      <Car
        className={`h-6 w-6 ${
          status === "occupied" ? "text-occupied" : status === "reserved" ? "text-reserved" : "text-available"
        }`}
      />
      <span className="text-xs font-bold text-foreground">{id}</span>
      <span className={`text-[10px] font-medium ${
        status === "occupied" ? "text-occupied" : status === "reserved" ? "text-reserved" : "text-available"
      }`}>
        {config.label}
      </span>
    </button>
  );
};

export default ParkingSpot;