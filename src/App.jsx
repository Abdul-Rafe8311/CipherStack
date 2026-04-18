import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  ShieldCheck, 
  LayoutGrid, 
  ArrowRightLeft, 
  Zap, 
  AlertCircle,
  Lock,
  Unlock,
  RefreshCcw,
  Copy,
  Layers,
  Fingerprint,
  Wand2,
  Moon,
  Sun,
  Settings,
  History,
  Command,
  Activity,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALGORITHMS, processNode } from './utils/ciphers';
import NodeCard from './components/NodeCard';

function App() {
  const [inputText, setInputText] = useState('');
  const [isDecryptMode, setIsDecryptMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [nodes, setNodes] = useState([
    { id: '1', type: ALGORITHMS.CAESAR, config: { shift: 3 } },
    { id: '2', type: ALGORITHMS.XOR, config: { key: 'secret' } },
    { id: '3', type: ALGORITHMS.VIGENERE, config: { keyword: 'CRYPTO' } },
  ]);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [flashIndex, setFlashIndex] = useState(-1);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Trigger sequential highlight when results change
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < nodes.length) {
        setFlashIndex(current);
        current++;
      } else {
        setFlashIndex(-1);
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [inputText, nodes, isDecryptMode]);

  const addNode = (type) => {
    const newNode = {
      id: Date.now().toString(),
      type: type,
      config: type === ALGORITHMS.CAESAR ? { shift: 0 } : type === ALGORITHMS.XOR ? { key: '' } : { keyword: '' }
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const updateNode = (id, newConfig) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, config: newConfig } : n));
  };

  const moveNode = (index, direction) => {
    const newNodes = [...nodes];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newNodes.length) return;
    [newNodes[index], newNodes[targetIndex]] = [newNodes[targetIndex], newNodes[index]];
    setNodes(newNodes);
  };

  const pipelineResults = useMemo(() => {
    let currentText = inputText;
    const steps = [];
    const activeNodes = isDecryptMode ? [...nodes].reverse() : nodes;

    activeNodes.forEach((node) => {
      const input = currentText;
      const output = processNode(input, node, isDecryptMode);
      steps.push({ nodeId: node.id, input, output });
      currentText = output;
    });

    return { steps, finalOutput: currentText };
  }, [inputText, nodes, isDecryptMode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pipelineResults.finalOutput);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const isValidPipeline = nodes.length >= 3;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      
      {/* PROFESSIONAL SIDEBAR */}
      <aside className="w-72 glass-panel border-r border-slate-200 dark:border-white/5 flex flex-col z-40">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Command size={22} />
            </div>
            <h1 className="font-black tracking-tighter text-xl">
              VAULT <span className="text-brand-500">v2.9</span>
            </h1>
          </div>

          <nav className="space-y-1">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 ml-4">Command Center</div>
            <button className="sidebar-link sidebar-link-active w-full">
              <Layers size={18} /> Logic Pipeline
            </button>
            <button className="sidebar-link sidebar-link-inactive w-full opacity-50 cursor-not-allowed">
              <History size={18} /> History
            </button>
            <button className="sidebar-link sidebar-link-inactive w-full opacity-50 cursor-not-allowed">
              <Settings size={18} /> Settings
            </button>
          </nav>

          <div className="mt-10 space-y-6">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-4">Add Processor</div>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => addNode(ALGORITHMS.CAESAR)}
                className="btn-secondary w-full justify-start py-3"
              >
                <Box size={16} className="text-blue-500" /> Caesar Unit
              </button>
              <button 
                onClick={() => addNode(ALGORITHMS.XOR)}
                className="btn-secondary w-full justify-start py-3"
              >
                <Activity size={16} className="text-indigo-500" /> XOR Unit
              </button>
              <button 
                onClick={() => addNode(ALGORITHMS.VIGENERE)}
                className="btn-secondary w-full justify-start py-3"
              >
                <Zap size={16} className="text-purple-500" /> Vigenere Unit
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto p-8 pt-0">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-full btn-secondary py-3 flex items-center justify-center gap-3"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Theme' : 'Dark Theme'}
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header/Utility Bar */}
        <header className="h-20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-10 glass-panel backdrop-blur-3xl z-30 shadow-none">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                System Online
             </div>
             <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Zap size={14} className="text-brand-500" /> Protocol 7.4-A Loaded
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsDecryptMode(!isDecryptMode)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-xl font-black text-[10px] tracking-[0.3em] transition-all border ${
                  isDecryptMode 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-500' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-500'
                }`}
            >
              {isDecryptMode ? <Unlock size={16} /> : <Lock size={16} />}
              {isDecryptMode ? 'INVERSE' : 'MASTER'}
            </button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto p-10 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Input Output Panels */}
            <section className="lg:col-span-5 space-y-8">
              <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6">
                  <label className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                    <ArrowRightLeft size={16} className="text-brand-500" />
                    Input Stream
                  </label>
                  <button 
                    onClick={() => setInputText('')}
                    className="p-2.5 hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-500/10"
                  >
                    <RefreshCcw size={14} />
                  </button>
                </div>
                <textarea
                  className="input-field w-full h-48 resize-none font-mono text-base leading-relaxed"
                  placeholder="Paste payload..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                    <LayoutGrid size={16} className="text-emerald-500" />
                    Output Array
                  </label>
                  <button 
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 p-2.5 rounded-xl transition-all border ${
                      copyFeedback 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' 
                      : 'hover:bg-slate-200 dark:hover:bg-white/5 border-transparent text-slate-400 hover:text-emerald-500 hover:border-emerald-500/10'
                    }`}
                  >
                   <AnimatePresence mode="wait">
                      {copyFeedback ? <motion.span initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} className="text-[9px] font-black uppercase tracking-widest px-1">Saved</motion.span> : <Copy size={14} />}
                   </AnimatePresence>
                  </button>
                </div>
                <div className="w-full min-h-48 bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/5 rounded-2xl p-6 text-emerald-800 dark:text-emerald-400 font-mono text-base break-all leading-relaxed shadow-inner">
                  {!isValidPipeline ? (
                    <div className="flex flex-col items-center justify-center min-h-[120px] text-slate-400 dark:text-slate-600 opacity-60">
                      <AlertCircle size={32} className="mb-3" />
                      <p className="text-[10px] font-black tracking-widest uppercase">Minimum 3 processors required</p>
                    </div>
                  ) : (
                    pipelineResults.finalOutput || <span className="text-slate-500 dark:text-slate-800 italic opacity-60">Awaiting buffer...</span>
                  )}
                </div>
              </div>
            </section>

            {/* Pipeline Area */}
            <section className="lg:col-span-7">
               <div className="space-y-0 relative min-h-[400px]">
                <AnimatePresence mode="popLayout">
                  {nodes.map((node, index) => {
                    const step = pipelineResults.steps.find(s => s.nodeId === node.id);
                    return (
                      <motion.div
                        key={node.id}
                        layout
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, x: -100 }}
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      >
                        <NodeCard
                          node={node}
                          index={index}
                          total={nodes.length}
                          onRemove={removeNode}
                          onUpdate={updateNode}
                          onMove={moveNode}
                          intermediateInput={step?.input}
                          intermediateOutput={step?.output}
                          triggerFlash={flashIndex === index}
                        />
                        {index < nodes.length - 1 && (
                          <div className="flow-line">
                            <div className="data-pulse" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {nodes.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-2 border-dashed border-slate-300 dark:border-white/5 rounded-[4rem] p-32 text-center group bg-white/5"
                  >
                    <Wand2 size={48} className="mx-auto text-slate-300 dark:text-slate-800 mb-6 group-hover:text-brand-500 transition-colors" />
                    <p className="text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.4em] text-[11px]">Command pipeline empty</p>
                    <button 
                      onClick={() => addNode(ALGORITHMS.CAESAR)}
                      className="mt-8 px-8 py-3 bg-brand-600 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      Initialize Pipeline
                    </button>
                  </motion.div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* FLOATING ACTION BUTTON */}
        <button 
          onClick={() => addNode(ALGORITHMS.CAESAR)}
          className="fab-button group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </main>
    </div>
  );
}

export default App;
