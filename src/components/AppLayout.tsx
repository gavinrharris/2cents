import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, MessageCircle, BarChart3, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", label: "Home", icon: Home },
    { to: "/chat", label: "Chat", icon: MessageCircle },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/update-info", label: "Update Info", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-accent">2</span>Cents
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}>
                <Button
                  variant={location.pathname === to ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
          {/* Mobile nav */}
          <nav className="flex items-center gap-1 md:hidden">
            {navItems.map(({ to, icon: Icon }) => (
              <Link key={to} to={to}>
                <Button variant={location.pathname === to ? "secondary" : "ghost"} size="icon" className="h-9 w-9">
                  <Icon className="h-4 w-4" />
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
};

export default AppLayout;
