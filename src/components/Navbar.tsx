import { Building2, Car, LayoutDashboard, Clock, Phone } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Painel", icon: LayoutDashboard, id: "painel" },
  { label: "Vagas", icon: Car, id: "vagas" },
  { label: "Reservas", icon: Clock, id: "reservas" },
  { label: "Contato", icon: Phone, id: "contato" },
];

const Navbar = () => {
  const [active, setActive] = useState("painel");

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">ParkSmart</span>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-online" />
          <span className="text-xs font-medium text-accent-foreground">Online</span>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex gap-1 overflow-x-auto border-t px-4 py-2 sm:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              active === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
