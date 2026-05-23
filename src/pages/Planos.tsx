import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthContext";
import { CheckoutModal } from "@/components/CheckoutModal";
import { toast } from "sonner";

const plans = [
  {
    name: "Maker Start",
    price: 279,
    priceStr: "279",
    rolls: 3,
    popular: false,
    benefits: [
      "3 rolos de filamento/mês",
      "Entrega recorrente gratuita",
      "5% de desconto por rolo",
      "Suporte por e-mail",
      "Cancele quando quiser",
    ],
  },
  {
    name: "Maker Pro",
    price: 534,
    priceStr: "534",
    rolls: 6,
    popular: true,
    benefits: [
      "6 rolos de filamento/mês",
      "Entrega recorrente gratuita",
      "11% de desconto por rolo",
      "Suporte prioritário",
      "Acesso a cores exclusivas",
      "Cancele quando quiser",
    ],
  },
  {
    name: "Maker Business",
    price: 1020,
    priceStr: "1.020",
    rolls: 12,
    popular: false,
    benefits: [
      "12 rolos de filamento/mês",
      "Entrega recorrente gratuita",
      "15% de desconto por rolo",
      "Suporte dedicado",
      "Acesso a cores exclusivas",
      "Faturamento empresarial",
      "Cancele quando quiser",
    ],
  },
];

const Planos = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAssinar = (plan: typeof plans[0]) => {
    if (!isAuthenticated) {
      toast.error("Faça login para assinar um plano");
      navigate("/login", { state: { from: "/planos" } });
      return;
    }
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16 space-y-4">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Planos de <span className="text-primary">Assinatura</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Receba filamento reciclado todo mês com desconto exclusivo. Escolha o plano ideal para você.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <AnimatedSection key={plan.name} delay={i * 0.15}>
                <div
                  className={`relative rounded-3xl p-8 h-full flex flex-col ${
                    plan.popular
                      ? "gradient-cta text-primary-foreground shadow-eco-lg scale-105"
                      : "bg-card border border-border shadow-eco"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-eco-accent text-eco-dark text-xs font-bold px-4 py-1 rounded-full">
                      Mais Popular
                    </span>
                  )}

                  <div className="space-y-4 mb-8">
                    <h3 className={`font-display text-xl font-semibold ${plan.popular ? "" : "text-foreground"}`}>
                      {plan.name}
                    </h3>
                    <div>
                      <span className={`font-display text-4xl font-bold ${plan.popular ? "" : "text-foreground"}`}>
                        R$ {plan.priceStr}
                      </span>
                      <span className={`text-sm ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        /mês
                      </span>
                    </div>
                    <p className={`text-sm ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {plan.rolls} rolos de 1kg por mês
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm">
                        <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                        <span className={plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"}>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    onClick={() => handleAssinar(plan)}
                    className={`w-full rounded-full font-semibold ${
                      plan.popular
                        ? "bg-primary-foreground text-eco-dark hover:bg-primary-foreground/90"
                        : "gradient-cta text-primary-foreground shadow-eco"
                    }`}
                  >
                    Assinar Agora
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout for subscription */}
      {selectedPlan && (
        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          items={[]}
          total={selectedPlan.price}
          tipo="assinatura"
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
        />
      )}

      <Footer />
    </div>
  );
};

export default Planos;
