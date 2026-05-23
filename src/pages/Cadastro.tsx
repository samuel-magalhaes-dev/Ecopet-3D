import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Logo from "@/components/Logo";
import { useAuth } from "@/components/AuthContext";
import { toast } from "sonner";

const Cadastro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }
    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await register(nome, email, senha, telefone);
      toast.success("Conta criada com sucesso! Bem-vindo à EcoPet 3D 🌱");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
      <AnimatedSection className="w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-eco-lg p-8 md:p-10 space-y-8">
          <div className="text-center space-y-4">
            <Link to="/" className="inline-block">
              <Logo className="h-10 w-auto mx-auto" />
            </Link>
            <h1 className="font-display text-2xl font-bold text-foreground">Criar sua conta</h1>
            <p className="text-muted-foreground text-sm">Preencha os dados para se cadastrar</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Nome completo</Label>
              <Input id="name" type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} className="rounded-xl h-12 bg-secondary border-border" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl h-12 bg-secondary border-border" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-foreground">Telefone <span className="text-muted-foreground">(opcional)</span></Label>
              <Input id="telefone" type="tel" placeholder="(88) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="rounded-xl h-12 bg-secondary border-border" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="rounded-xl h-12 bg-secondary border-border pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Repita a senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="rounded-xl h-12 bg-secondary border-border"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full gradient-cta text-primary-foreground rounded-full font-semibold shadow-eco hover:scale-[1.02] transition-transform"
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando conta...</> : "Criar Conta"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Entrar
            </Link>
          </div>

          <div className="text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Cadastro;
