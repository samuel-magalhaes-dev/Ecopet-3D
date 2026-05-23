import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Trash2, X, Check } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { CheckoutModal } from "@/components/CheckoutModal";
import filamentImg from "@/assets/filament-product.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const weights = [
  { label: "250g", value: 250, price: 29.75 },
  { label: "500g", value: 500, price: 54.50 },
  { label: "1kg", value: 1000, price: 99.00 },
];

const Comprar = () => {
  const [selectedWeight, setSelectedWeight] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { items, addItem, removeItem, updateQuantity, clearCart, total: cartTotal, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const current = weights[selectedWeight];
  const total = current.price * quantity;

  const handleAddToCart = () => {
    addItem({ weight: current.label, weightValue: current.value, price: current.price }, quantity);
    setAddedFeedback(true);
    toast.success(`Filamento ${current.label} adicionado ao carrinho!`);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Faça login para finalizar a compra");
      navigate("/login", { state: { from: "/comprar" } });
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="bg-secondary rounded-3xl p-8 aspect-square flex items-center justify-center">
                <img
                  src={filamentImg}
                  alt="Filamento 3D Reciclado PET"
                  className="max-h-full max-w-full object-contain rounded-2xl"
                  loading="lazy"
                />
              </div>

              {/* Details */}
              <div className="space-y-8">
                <div>
                  <span className="text-sm font-medium text-primary bg-accent px-3 py-1 rounded-full">
                    Eco-Friendly
                  </span>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4">
                    Filamento 3D Reciclado
                  </h1>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    Filamento PET reciclado de alta qualidade para impressoras 3D. Produzido a partir de garrafas PET
                    coletadas e processadas com tecnologia de ponta. Compatível com a maioria das impressoras FDM.
                  </p>
                </div>

                <div className="text-3xl font-display font-bold text-primary">
                  R$ {total.toFixed(2).replace(".", ",")}
                </div>

                {/* Weight */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Peso</label>
                  <div className="flex gap-3">
                    {weights.map((w, i) => (
                      <button
                        key={w.value}
                        onClick={() => setSelectedWeight(i)}
                        className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                          selectedWeight === i
                            ? "gradient-cta text-primary-foreground shadow-eco"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Quantidade</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Minus className="h-4 w-4 text-foreground" />
                    </button>
                    <span className="font-display text-xl font-semibold text-foreground w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Plus className="h-4 w-4 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    className="gradient-cta text-primary-foreground rounded-full px-8 shadow-eco-lg hover:scale-105 transition-transform flex-1"
                  >
                    {addedFeedback ? (
                      <><Check className="mr-2 h-5 w-5" /> Adicionado!</>
                    ) : (
                      <><ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho</>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setCartOpen(true)}
                    className="rounded-full px-8 border-primary text-primary hover:bg-accent flex-1 relative"
                    variant="outline"
                  >
                    Ver Carrinho
                    {itemCount > 0 && (
                      <span className="ml-2 h-6 w-6 rounded-full gradient-cta text-[11px] font-bold text-primary-foreground flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </div>

                {/* Specs */}
                <div className="border-t border-border pt-6 space-y-3">
                  <h3 className="font-display font-semibold text-foreground">Especificações</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ["Material", "PET Reciclado"],
                      ["Diâmetro", "1.75mm"],
                      ["Tolerância", "±0.03mm"],
                      ["Temp. Impressão", "220-250°C"],
                      ["Temp. Mesa", "60-80°C"],
                      ["Compatibilidade", "FDM/FFF"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between bg-secondary rounded-lg px-4 py-2">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display text-xl font-bold text-foreground">Carrinho ({itemCount})</h2>
                <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <p className="text-muted-foreground text-center py-12">Seu carrinho está vazio</p>
                ) : (
                  items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-secondary rounded-2xl p-4">
                      <div className="h-16 w-16 rounded-xl bg-accent flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">Filamento PET {item.weight}</p>
                        <p className="text-primary font-semibold">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(i, item.quantity - 1)} className="h-7 w-7 rounded-lg bg-card flex items-center justify-center">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(i, item.quantity + 1)} className="h-7 w-7 rounded-lg bg-card flex items-center justify-center">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(i)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex justify-between text-lg font-display font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-primary">R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full gradient-cta text-primary-foreground rounded-full font-semibold shadow-eco hover:scale-[1.02] transition-transform"
                  >
                    Finalizar Compra
                  </Button>
                  <button onClick={clearCart} className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors">
                    Limpar carrinho
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        total={cartTotal}
        tipo="avulso"
        onSuccess={clearCart}
      />

      <Footer />
    </div>
  );
};

export default Comprar;
