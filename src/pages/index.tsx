import { useState, useMemo } from "react";
import { Car, CircleDot, Clock, Building2, Layers } from "lucide-react";
import Navbar from "../components/Navbar";
import ParkingSpot from "../components/ParkingSpot";
import ReservationDialog from "../components/ReservationDialog";
import { toast } from "sonner";

type SpotStatus = "available" | "occupied" | "reserved";

interface Spot {
  id: string;
  status: SpotStatus;
  name?: string;
  plate?: string;
  sector: string;
}

const sectors = [
  { name: "Térreo", prefix: "T", rows: ["A", "B", "C"], cols: 6 },
  { name: "1º Andar", prefix: "1", rows: ["A", "B", "C", "D"], cols: 6 },
  { name: "2º Andar", prefix: "2", rows: ["A", "B", "C", "D"], cols: 6 },
  { name: "Cobertura", prefix: "C", rows: ["A", "B"], cols: 6 },
];

const generateSpots = (): Spot[] => {
  const spots: Spot[] = [];
  sectors.forEach((sector) => {
    sector.rows.forEach((row) => {
      for (let i = 1; i <= sector.cols; i++) {
        const id = `${sector.prefix}${row}${i}`;
        const rand = Math.random();
        spots.push({
          id,
          sector: sector.name,
          status: rand < 0.3 ? "occupied" : rand < 0.4 ? "reserved" : "available",
          ...(rand < 0.3 && { name: "Cliente", plate: "XXX-0000" }),
          ...(rand >= 0.3 && rand < 0.4 && { name: "Reservado", plate: "YYY-0000" }),
        });
      }
    });
  });
  return spots;
};

const Index = () => {
  const [spots, setSpots] = useState<Spot[]>(generateSpots);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [activeSector, setActiveSector] = useState<string | null>(null);

  const stats = useMemo(() => ({
    total: spots.length,
    available: spots.filter((s) => s.status === "available").length,
    occupied: spots.filter((s) => s.status === "occupied").length,
    reserved: spots.filter((s) => s.status === "reserved").length,
  }), [spots]);

  const sectorNames = sectors.map((s) => s.name);
  const filteredSectors = activeSector ? sectorNames.filter((s) => s === activeSector) : sectorNames;

  const handleReserve = (spotId: string, name: string, plate: string) => {
    setSpots((prev) =>
      prev.map((s) => (s.id === spotId ? { ...s, status: "reserved" as SpotStatus, name, plate } : s))
    );
    setSelectedSpot(null);
    toast.success(`Vaga ${spotId} reservada para ${name} (${plate})`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        {/* Stats */}
        <section id="painel">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total", value: stats.total, icon: Building2, color: "text-foreground" },
              { label: "Livres", value: stats.available, icon: Car, color: "text-available" },
              { label: "Ocupadas", value: stats.occupied, icon: CircleDot, color: "text-occupied" },
              { label: "Reservadas", value: stats.reserved, icon: Clock, color: "text-reserved" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border bg-card p-3 text-center">
                <stat.icon className={`mx-auto h-5 w-5 ${stat.color}`} />
                <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sector filter + legend */}
        <section id="vagas" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <button
                onClick={() => setActiveSector(null)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  !activeSector ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                Todos
              </button>
              {sectorNames.map((name) => {
                const sectorSpots = spots.filter((s) => s.sector === name);
                const free = sectorSpots.filter((s) => s.status === "available").length;
                return (
                  <button
                    key={name}
                    onClick={() => setActiveSector(name)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      activeSector === name ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {name} ({free})
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-available/30 border border-available" /> Livre</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-occupied/30 border border-occupied" /> Ocupada</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-reserved/30 border border-reserved" /> Reservada</span>
            </div>
          </div>

          {/* Sector grids */}
          {filteredSectors.map((sectorName) => {
            const sectorSpots = spots.filter((s) => s.sector === sectorName);
            const free = sectorSpots.filter((s) => s.status === "available").length;
            return (
              <div key={sectorName} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{sectorName}</h3>
                  <span className="text-xs text-muted-foreground">{free}/{sectorSpots.length} livres</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {sectorSpots.map((spot) => (
                    <ParkingSpot
                      key={spot.id}
                      id={spot.id}
                      status={spot.status}
                      onClick={(id) => setSelectedSpot(id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Reservas */}
        <section id="reservas" className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Reservas Ativas</h2>
          {spots.filter((s) => s.status === "reserved").length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhuma reserva ativa.</p>
          ) : (
            <div className="divide-y rounded-lg border bg-card">
              {spots.filter((s) => s.status === "reserved").map((s) => (
                <div key={s.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Vaga {s.id}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{s.sector}</span>
                  </div>
                  <span className="text-muted-foreground">{s.name} · {s.plate}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contato */}
        <section id="contato" className="rounded-lg border bg-card p-4 text-center space-y-1">
          <h2 className="text-sm font-semibold text-foreground">Contato</h2>
          <p className="text-xs text-muted-foreground">📞 (11) 99999-0000 · ✉️ contato@parksmart.com.br</p>
          <p className="text-xs text-muted-foreground">Rua Exemplo, 123 · São Paulo - SP</p>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          © 2026 ParkSmart · Sistema de Estacionamento Inteligente
        </p>
      </main>

      <ReservationDialog
        spotId={selectedSpot}
        open={!!selectedSpot}
        onClose={() => setSelectedSpot(null)}
        onConfirm={handleReserve}
      />
    </div>
  );
};

export default Index;
