import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";

const navItems = [
  { label: "Início", path: "/" },
  { label: "Comprar", path: "/comprar" },
  { label: "Planos", path: "/planos" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-eco-dark/85 backdrop-blur-lg border-b border-primary-foreground/10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-9 w-auto" inverted />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-eco-glow ${
                location.pathname === item.path ? "text-eco-glow" : "text-primary-foreground/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/comprar" className="relative text-primary-foreground/70 hover:text-eco-glow transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full gradient-cta text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-primary-foreground/70 text-sm flex items-center gap-1.5">
                <User className="h-4 w-4 text-eco-glow" />
                <span className="text-eco-glow font-medium">{user?.nome.split(" ")[0]}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-primary-foreground/50 hover:text-destructive transition-colors"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="gradient-cta text-primary-foreground rounded-full px-6">
                Entrar
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link to="/comprar" className="relative text-primary-foreground">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full gradient-cta text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button className="text-primary-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-eco-dark border-b border-primary-foreground/10 overflow-hidden"
          >
            <div className="flex flex-col gap-3 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors hover:text-eco-glow ${
                    location.pathname === item.path ? "text-eco-glow" : "text-primary-foreground/70"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="flex items-center justify-between pt-2 border-t border-primary-foreground/10">
                  <span className="text-eco-glow text-sm font-medium">{user?.nome}</span>
                  <button onClick={() => { handleLogout(); setOpen(false); }} className="text-sm text-red-400 flex items-center gap-1">
                    <LogOut className="h-3 w-3" /> Sair
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button size="sm" className="gradient-cta text-primary-foreground rounded-full w-full">
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
