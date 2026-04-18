import React from 'react';
import { 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Settings2, 
  Hash, 
  Key, 
  Type, 
  Activity,
  Terminal,
  ArrowRight,
  Box,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ALGORITHMS } from '../utils/ciphers';

const NodeCard = ({ 
  node, 
  index, 
  total, 
  onRemove, 
  onMove, 
  onUpdate, 
  intermediateOutput, 
  intermediateInput,
  triggerFlash
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate(node.id, { ...node.config, [name]: value });
  };

  const typeConfig = {
    [ALGORITHMS.CAESAR]: { icon: <Box size={20} />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    [ALGORITHMS.XOR]: { icon: <Activity size={20} />, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    [ALGORITHMS.VIGENERE]: { icon: <Zap size={20} />, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  }[node.type] || { icon: <Activity size={20} />, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      className={`cipher-node-card group ${typeConfig.border} overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/60`}
    >
      {/* Sequential Animation Layer */}
      {triggerFlash && <div className="sequential-glow" />}

      {/* Node Index Badge */}
      <div className={`absolute -left-4 -top-4 w-10 h-10 rounded-2xl ${typeConfig.bg} border ${typeConfig.border} flex items-center justify-center text-lg font-black ${typeConfig.color} shadow-lg backdrop-blur-xl z-20`}>
        {index + 1}
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${typeConfig.bg} ${typeConfig.color} shadow-inner`}>
            {typeConfig.icon}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
              {node.type}
              <span className={`text-[10px] px-2.5 py-1 rounded-lg ${typeConfig.bg} ${typeConfig.color} uppercase tracking-widest font-bold border border-current/10`}>Active</span>
            </h3>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.25em] mt-1 opacity-60">Sequence Unit {index + 1}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
          <div className="flex bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-1.5 border border-slate-200 dark:border-white/5 shadow-2xl">
            <button 
              onClick={() => onMove(index, -1)} 
              disabled={index === 0}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 disabled:opacity-10 transition-all hover:text-brand-500"
              title="Move Up"
            >
              <ArrowRight size={16} className="-rotate-90" />
            </button>
            <button 
              onClick={() => onMove(index, 1)} 
              disabled={index === total - 1}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 disabled:opacity-10 transition-all hover:text-brand-500"
              title="Move Down"
            >
              <ArrowRight size={16} className="rotate-90" />
            </button>
          </div>
          <button 
            onClick={() => onRemove(node.id)}
            className="p-3 bg-red-500/5 hover:bg-red-500/20 text-red-500/40 hover:text-red-500 rounded-xl border border-red-500/10 transition-all shadow-lg"
            title="Terminate Node"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Param Column */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${typeConfig.color} shadow-[0_0_10px_currentColor]`} />
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Configure Unit</label>
          </div>
          
          <div className="relative group/input">
            {node.type === ALGORITHMS.CAESAR && (
              <input
                type="number"
                name="shift"
                value={node.config.shift}
                onChange={handleChange}
                placeholder="Cipher Shift"
                className="input-field w-full"
              />
            )}

            {node.type === ALGORITHMS.XOR && (
              <input
                type="text"
                name="key"
                value={node.config.key}
                onChange={handleChange}
                placeholder="Secret Key"
                className="input-field w-full"
              />
            )}

            {node.type === ALGORITHMS.VIGENERE && (
              <input
                type="text"
                name="keyword"
                value={node.config.keyword}
                onChange={handleChange}
                placeholder="Keyword"
                className="input-field w-full"
              />
            )}
          </div>
        </div>

        {/* Trace Column */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Unit Output</label>
          </div>
          <div className="code-block h-14 flex flex-col justify-center px-6 group/trace cursor-default border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-4 mt-1">
              <span className="text-[9px] font-black text-brand-600 dark:text-brand-500 w-8 uppercase">Buffer</span>
              <div className="flex items-center gap-2 flex-1 overflow-hidden">
                <ArrowRight size={10} className="text-brand-500/40" />
                <p className="truncate text-emerald-800 dark:text-emerald-400 font-black tracking-tight uppercase">
                  {intermediateOutput || '...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NodeCard;
