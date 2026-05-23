import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  MapPin,
  User,
  Check,
  Loader2,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthContext";
import { CartItem } from "@/components/CartContext";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  tipo: "avulso" | "assinatura";
  planName?: string;
  planPrice?: number;
  onSuccess?: () => void;
}

const WHATSAPP_NUMBER = "558899830658";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCard(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatValidity(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 4)
    .replace(/(\d{2})(\d)/, "$1/$2");
}

function formatCEP(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export const CheckoutModal = ({
  open,
  onClose,
  items,
  total,
  tipo,
  planName,
  planPrice,
  onSuccess,
}: CheckoutModalProps) => {
  const { user, token } = useAuth();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nomeCompleto: user?.nome || "",
    cpf: "",
    cartao: "",
    validade: "",
    cvv: "",
    endereco: "",
    cep: "",
    cidade: "",
    estado: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (field === "cpf") value = formatCPF(value);
      if (field === "cartao") value = formatCard(value);
      if (field === "validade") value = formatValidity(value);
      if (field === "cep") value = formatCEP(value);
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const buildWhatsAppMessage = () => {
    const itensTxt =
      tipo === "assinatura"
        ? `Plano: ${planName}\nTotal: R$ ${(planPrice || total).toFixed(2).replace(".", ",")}/mês`
        : items
            .map(
              (i) =>
                `• Filamento PET ${i.weight} x${i.quantity} — R$ ${(i.price * i.quantity).toFixed(2).replace(".", ",")}`,
            )
            .join("\n");

    const msg =
      `Olá! Gostaria de finalizar este pedido:\n\n` +
      `📦 *Tipo:* ${tipo === "assinatura" ? "Assinatura Mensal" : "Compra Avulsa"}\n\n` +
      `👤 *Cliente:*\n` +
      `Nome: ${form.nomeCompleto}\n` +
      `E-mail: ${user?.email}\n` +
      `Telefone: ${user?.telefone || "Não informado"}\n\n` +
      `🛒 *Pedido:*\n${itensTxt}\n\n` +
      `💰 *Total: R$ ${(planPrice || total).toFixed(2).replace(".", ",")}${tipo === "assinatura" ? "/mês" : ""}\n\n` +
      `📍 *Endereço de Entrega:*\n` +
      `${form.endereco}\n` +
      `CEP: ${form.cep}\n` +
      `${form.cidade} - ${form.estado}\n\n` +
      `✅ *Pagamento preenchido pelo cliente no sistema.*`;

    return encodeURIComponent(msg);
  };

  const handleConfirm = async () => {
    if (
      !form.nomeCompleto ||
      !form.cpf ||
      !form.cartao ||
      !form.validade ||
      !form.cvv ||
      !form.endereco ||
      !form.cep ||
      !form.cidade ||
      !form.estado
    ) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // Save order to backend
      if (token) {
        await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tipo,
            items: items.map((i) => ({
              weight: i.weight,
              preco: i.price,
              quantidade: i.quantity,
            })),
            total: planPrice || total,
            endereco: form.endereco,
            cidade: form.cidade,
            estado: form.estado,
            cep: form.cep,
          }),
        });
      }
    } catch {
      // Continue even if backend fails
    }

    setStep("success");
    setLoading(false);

    // Redirect to WhatsApp after 1.5s
    setTimeout(() => {
      const msg = buildWhatsAppMessage();
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
      onSuccess?.();
      onClose();
      setStep("form");
    }, 1500);
  };

  const finalTotal = (planPrice || total).toFixed(2).replace(".", ",");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {step === "form" ? (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl gradient-cta flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-display font-bold text-foreground text-lg">
                          Finalizar Pedido
                        </h2>
                        <p className="text-muted-foreground text-xs">
                          Dados de pagamento e entrega
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-secondary"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Form */}
                    <div className="md:col-span-3 space-y-5">
                      {/* Personal */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">
                            Dados Pessoais
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">
                              Nome completo
                            </Label>
                            <Input
                              value={form.nomeCompleto}
                              onChange={handleChange("nomeCompleto")}
                              className="rounded-xl h-11 bg-secondary border-border text-sm"
                              placeholder="Seu nome completo"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">
                              CPF
                            </Label>
                            <Input
                              value={form.cpf}
                              onChange={handleChange("cpf")}
                              className="rounded-xl h-11 bg-secondary border-border text-sm"
                              placeholder="000.000.000-00"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">
                            Cartão de Pagamento
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">
                              Número do cartão
                            </Label>
                            <Input
                              value={form.cartao}
                              onChange={handleChange("cartao")}
                              className="rounded-xl h-11 bg-secondary border-border text-sm font-mono tracking-widest"
                              placeholder="0000 0000 0000 0000"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Validade
                              </Label>
                              <Input
                                value={form.validade}
                                onChange={handleChange("validade")}
                                className="rounded-xl h-11 bg-secondary border-border text-sm"
                                placeholder="MM/AA"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                CVV
                              </Label>
                              <Input
                                value={form.cvv}
                                onChange={handleChange("cvv")}
                                maxLength={4}
                                className="rounded-xl h-11 bg-secondary border-border text-sm"
                                placeholder="000"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">
                            Endereço de Entrega
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">
                              Endereço completo
                            </Label>
                            <Input
                              value={form.endereco}
                              onChange={handleChange("endereco")}
                              className="rounded-xl h-11 bg-secondary border-border text-sm"
                              placeholder="Rua, número, bairro"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">
                              CEP
                            </Label>
                            <Input
                              value={form.cep}
                              onChange={handleChange("cep")}
                              className="rounded-xl h-11 bg-secondary border-border text-sm"
                              placeholder="00000-000"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Cidade
                              </Label>
                              <Input
                                value={form.cidade}
                                onChange={handleChange("cidade")}
                                className="rounded-xl h-11 bg-secondary border-border text-sm"
                                placeholder="Sua cidade"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Estado
                              </Label>
                              <Input
                                value={form.estado}
                                onChange={handleChange("estado")}
                                maxLength={2}
                                className="rounded-xl h-11 bg-secondary border-border text-sm uppercase"
                                placeholder="CE"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="md:col-span-2">
                      <div className="bg-secondary rounded-2xl p-5 space-y-4 sticky top-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">
                            Resumo do Pedido
                          </span>
                        </div>

                        <div className="space-y-2">
                          {tipo === "assinatura" && planName ? (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {planName}
                              </span>
                              <span className="font-medium text-foreground">
                                R${" "}
                                {(planPrice || 0).toFixed(2).replace(".", ",")}
                                /mês
                              </span>
                            </div>
                          ) : (
                            items.map((item, i) => (
                              <div
                                key={i}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-muted-foreground">
                                  Filament {item.weight} x{item.quantity}
                                </span>
                                <span className="font-medium text-foreground">
                                  R${" "}
                                  {(item.price * item.quantity)
                                    .toFixed(2)
                                    .replace(".", ",")}
                                </span>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="border-t border-border pt-3">
                          <div className="flex justify-between">
                            <span className="font-display font-bold text-foreground">
                              Total
                            </span>
                            <span className="font-display font-bold text-primary text-lg">
                              R$ {finalTotal}
                              {tipo === "assinatura" ? "/mês" : ""}
                            </span>
                          </div>
                        </div>

                        <div className="bg-accent/50 rounded-xl p-3 text-xs text-muted-foreground">
                          <p className="font-medium text-primary mb-1">
                            🔒 Dados seguros
                          </p>
                          <p>
                            Após confirmar, você será direcionado ao WhatsApp
                            para finalizar o pedido com nossa equipe.
                          </p>
                        </div>

                        <Button
                          onClick={handleConfirm}
                          disabled={loading}
                          className="w-full gradient-cta text-white rounded-full font-semibold shadow-eco hover:scale-[1.02] transition-transform h-12"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                              Processando...
                            </>
                          ) : (
                            "Confirmar Pedido →"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Success */
                <div className="p-12 text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300 }}
                    className="h-20 w-20 rounded-full gradient-cta flex items-center justify-center mx-auto"
                  >
                    <Check className="h-10 w-10 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                      Pedido Confirmado!
                    </h2>
                    <p className="text-muted-foreground">
                      Redirecionando para o WhatsApp para finalizar com nossa
                      equipe...
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Star className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">
                      Abrindo WhatsApp...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
