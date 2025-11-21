
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptCard } from './components/PromptCard';
import { generatePrompts } from './services/geminiService';
import { ProductData, GeneratedPrompt, TargetModel, ProductType, VisualEmphasis } from './types';
import { Sparkles, Loader2, ShoppingBag, Tag, AlertCircle, MapPin, Shirt, Box, RotateCcw, Trash2, Layers, Eye, ScanFace, Activity, Search } from 'lucide-react';

const ENVIRONMENT_PRESETS = [
  "Praia Paradisíaca",
  "Quarto Minimalista",
  "Academia Moderna",
  "Rua Urbana Chic",
  "Estúdio Fotográfico",
  "Natureza/Parque"
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [price, setPrice] = useState('');
  const [hasPrice, setHasPrice] = useState(false);
  const [targetModel, setTargetModel] = useState<TargetModel>(TargetModel.VEO3);
  const [productType, setProductType] = useState<ProductType>(ProductType.PHYSICAL);
  const [environment, setEnvironment] = useState('');
  const [visualEmphasis, setVisualEmphasis] = useState<VisualEmphasis>(VisualEmphasis.DEFAULT);

  // 2. Auto-Save: Load from LocalStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('veo3_workspace');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setProductName(parsed.productName || '');
        setFeatures(parsed.features || '');
        setPrice(parsed.price || '');
        setHasPrice(parsed.hasPrice || false);
        setProductType(parsed.productType || ProductType.PHYSICAL);
        setEnvironment(parsed.environment || '');
        setVisualEmphasis(parsed.visualEmphasis || VisualEmphasis.DEFAULT);
      } catch (e) {
        console.error("Erro ao carregar dados salvos", e);
      }
    }
  }, []);

  // 2. Auto-Save: Save to LocalStorage on change
  useEffect(() => {
    const dataToSave = {
      productName,
      features,
      price,
      hasPrice,
      productType,
      environment,
      visualEmphasis
    };
    localStorage.setItem('veo3_workspace', JSON.stringify(dataToSave));
  }, [productName, features, price, hasPrice, productType, environment, visualEmphasis]);

  // 1. Reset Functionality
  const handleReset = () => {
    if (window.confirm("Tem certeza que deseja limpar todos os campos e começar um novo produto?")) {
      setProductName('');
      setFeatures('');
      setPrice('');
      setHasPrice(false);
      setEnvironment('');
      setVisualEmphasis(VisualEmphasis.DEFAULT);
      setPrompts([]);
      setError(null);
      localStorage.removeItem('veo3_workspace');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !features || !environment) {
      setError("Por favor, preencha o nome, características e o ambiente.");
      return;
    }

    setLoading(true);
    setError(null);
    setPrompts([]);

    const data: ProductData = {
      productName,
      features,
      price,
      hasPrice,
      targetModel,
      productType,
      environment,
      visualEmphasis
    };

    try {
      const response = await generatePrompts(data);
      setPrompts(response.prompts);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col pb-20 font-sans selection:bg-orange-100 selection:text-orange-900">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Section - Sticky Sidebar */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-24 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <ShoppingBag className="text-orange-600" size={18} />
                </div>
                <h2 className="text-base font-bold text-slate-800">Configuração do Produto</h2>
              </div>
              
              {/* 1. Reset Button UI */}
              <button 
                onClick={handleReset}
                title="Reiniciar / Limpar Tudo"
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-6">
              
              {/* 4. Improved Type Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider ml-1">Tipo de Produto</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setProductType(ProductType.PHYSICAL)}
                    className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-200 ${
                      productType === ProductType.PHYSICAL
                        ? 'bg-white text-slate-800 shadow-sm ring-1 ring-black/5'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Box size={14} />
                    Físico
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductType(ProductType.FASHION)}
                    className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-200 ${
                      productType === ProductType.FASHION
                        ? 'bg-white text-pink-700 shadow-sm ring-1 ring-black/5'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Shirt size={14} />
                    Moda
                  </button>
                </div>
              </div>

               {/* NEW: Visual Emphasis Selector */}
               <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                  <Eye size={12} /> Foco Visual (Câmera)
                </label>
                <div className="relative">
                  <select
                    value={visualEmphasis}
                    onChange={(e) => setVisualEmphasis(e.target.value as VisualEmphasis)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value={VisualEmphasis.DEFAULT}>🎥 Equilibrado (Padrão)</option>
                    <option value={VisualEmphasis.QUALITY_TEST}>💪 Prova de Qualidade (Agachamento/Teste)</option>
                    <option value={VisualEmphasis.TEXTURE_ZOOM}>🔍 Macro/Textura (Zoom Detalhado)</option>
                    <option value={VisualEmphasis.MOVEMENT}>💃 Caimento & Movimento (Giros)</option>
                    <option value={VisualEmphasis.LIFESTYLE}>☕ Lifestyle (Uso Real)</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                    <Activity size={16} />
                  </div>
                </div>
              </div>

              {/* Environment & 3. Presets */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider ml-1">Ambiente / Cenário</label>
                <div className="relative group">
                  <MapPin size={16} className="absolute left-3 top-3 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium placeholder:text-slate-400"
                    placeholder="Onde a modelo está?"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                  />
                </div>
                {/* Presets Chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {ENVIRONMENT_PRESETS.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setEnvironment(preset)}
                      className="text-[10px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-semibold hover:bg-orange-100 hover:text-orange-700 transition-colors border border-slate-200 hover:border-orange-200"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider ml-1">Detalhes</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="Nome do Produto"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <div className="relative">
                  <textarea
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm h-32 resize-none leading-relaxed placeholder:text-slate-400"
                    placeholder="Características: Cor, material, benefícios, para que serve..."
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                  />
                  {/* 7. Character Counter */}
                  <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium bg-white/80 px-1 rounded">
                    {features.length} chars
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-slate-50 p-1 rounded-2xl border border-slate-200/60">
                 <div className="p-3 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-2">
                    <Tag size={14} className={hasPrice ? "text-green-600" : "text-slate-400"} /> 
                    Incluir Preço?
                  </label>
                  <div className="relative inline-block w-10 align-middle select-none">
                    <input 
                      type="checkbox" 
                      checked={hasPrice}
                      onChange={(e) => setHasPrice(e.target.checked)}
                      className="peer absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5 transition-all duration-200 z-10"
                    />
                    <div className={`block h-6 rounded-full w-11 cursor-pointer transition-colors duration-200 ${hasPrice ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  </div>
                </div>
                
                {hasPrice && (
                  <div className="px-3 pb-3 animate-in slide-in-from-top-2 duration-200">
                     <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                      placeholder="Ex: R$ 49,90"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      autoFocus
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden bg-slate-900 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Criando Roteiros Pro...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} className="text-yellow-400 group-hover:animate-pulse" />
                      <span>Gerar Prompts Mágicos</span>
                    </>
                  )}
                </div>
                {/* Button Glow Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </button>
            </form>
          </div>
        </section>

        {/* Results Section */}
        <section className="lg:col-span-8 space-y-6">
           {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-in slide-in-from-top-4">
              <AlertCircle size={24} className="text-red-500" />
              <div>
                 <h4 className="font-bold text-sm">Ops! Algo deu errado.</h4>
                 <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {!loading && prompts.length === 0 && !error && (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-slate-400 p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
              <div className="relative">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 relative z-10">
                  <Layers size={48} className="text-orange-200" />
                </div>
                <div className="absolute inset-0 bg-orange-200/30 blur-2xl rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-3">Área de Criação</h3>
              <p className="text-center text-slate-500 max-w-md leading-relaxed">
                Preencha os detalhes do seu produto na barra lateral para gerar 4 variações de prompts Veo3 profissionais com a marca <b>@achadinhos_da_ellen</b>.
              </p>
            </div>
          )}

          {loading && (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-8 h-96 animate-pulse shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100">
                  <div className="flex justify-between items-center mb-8">
                     <div className="h-8 bg-slate-100 rounded-lg w-1/3"></div>
                     <div className="h-6 bg-slate-100 rounded-full w-20"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                    <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                    <div className="h-32 bg-slate-50 rounded-xl w-full mt-6 border border-slate-100"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            {prompts.map((prompt, index) => (
              <PromptCard key={index} prompt={prompt} index={index} />
            ))}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="text-center py-8 text-slate-400 text-xs font-medium">
        <p>© 2024 Gerador Veo3 @achadinhos_da_ellen. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
