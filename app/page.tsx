import Link from 'next/link'
import { Rocket, Zap, Target, BarChart3, ShieldCheck, ArrowRight, MousePointer2, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#02020A] text-gray-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#02020A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              AFFPRESS
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#results" className="hover:text-white transition-colors">Resultados</a>
            <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors px-4 py-2">
              Entrar
            </Link>
            <Link href="/signup" className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-full font-bold text-sm transition-all transform active:scale-95 shadow-xl shadow-white/5">
              Começar Agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8 animate-bounce-slow">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Tecnologia de Clonagem Instantânea</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight mb-8">
            Sua Estrutura Própria <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-size-200 animate-gradient text-transparent bg-clip-text">
              em 30 Segundos.
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
            Pare de perder vendas para o produtor e bloqueios de links. Clone qualquer página de vendas,
            injete seus pixels e substitua links em massa automaticamente.
            <strong> O poder do Funil Americano na sua mão.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/signup" className="group w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center justify-center gap-3">
              QUERO MINHA ESTRUTURA AGORA
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#02020A] bg-gray-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-bold text-white">+2.400 Afiliados</span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Usando e faturando alto hoje</span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-24 relative max-w-5xl mx-auto group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full group-hover:bg-indigo-500/30 transition-all"></div>
            <div className="relative bg-gray-900/50 border border-white/10 rounded-3xl p-2 backdrop-blur-sm overflow-hidden shadow-2xl">
              <div className="bg-[#050510] rounded-2xl border border-white/5 overflow-hidden">
                <img
                  src="C:/Users/hiant/.gemini/antigravity/brain/15314f3f-94f3-4aa4-b2d8-ce2da5c28175/clone_hero_dashboard_1768015965551.png"
                  alt="AFFPRESS Dashboard"
                  className="w-full opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Por que o AFFPRESS é o fim dos seus problemas?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Desenvolvido por quem vive o campo de batalha do tráfego pago.
              Cada ferramenta foi pensada para blindar sua conta e aumentar seu ROI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900/50 border border-white/5 p-8 rounded-3xl hover:border-indigo-500/30 transition-all group">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Auto-Link Swap</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Esqueça a troca manual de links. Nosso robô detecta todos os botões da página
                clonada e substitui pelo seu link de afiliado instantaneamente.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900/50 border border-white/5 p-8 rounded-3xl hover:border-cyan-500/30 transition-all group">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Smart GEO (Nutra USA)</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Role funis nos EUA, Europa ou Brasil. Nosso sistema traduz os filtros de
                cookies e quizzes automaticamente baseados no país do seu tráfego.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900/50 border border-white/5 p-8 rounded-3xl hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Cyberpunk Analytics</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Acompanhe suas visitas e cliques em tempo real com um dashboard futurista.
                Saiba exatamente qual página está convertendo mais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Pronto para dominar o mercado <br />
              com a estrutura mais rápida do Brasil?
            </h2>
          </div>
          <Link href="/signup" className="bg-white text-indigo-600 px-12 py-6 rounded-2xl font-black text-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95">
            CRIAR MINHA CONTA AGORA
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 order-last">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-500 text-sm">
            © 2026 AFFPRESS. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-gray-500 hover:text-white text-sm transition-colors">Termos de Uso</Link>
            <Link href="/login" className="text-gray-500 hover:text-white text-sm transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s linear infinite;
                }
                .animate-bounce-slow {
                    animation: bounce 3s infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
    </div>
  )
}
