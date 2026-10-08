import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Database, 
  Terminal, 
  Server, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Globe
} from 'lucide-react';
import { CORE_PHP_CODEBASE, CodeFile } from '../data/corePhpCodebase';

export const PhpSqlExplorer: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const currentFile: CodeFile = CORE_PHP_CODEBASE[activeFileIndex] || CORE_PHP_CODEBASE[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = currentFile.code.split('\n');

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Production Core PHP 8.x & MySQL 8.0 Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Enterprise Backend Engine & Schema Exporter
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Complete, runnable Core PHP and MySQL scripts supporting recursive Common Table Expressions (CTE) hierarchy queries, atomic weekly binary payouts, and multi-factor authentication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy File'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download {currentFile.filename}</span>
          </button>
        </div>
      </div>

      {/* CTE Architecture Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
            <Cpu className="w-4 h-4" />
            <span>Recursive CTE Hierarchy</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Eliminates traditional N+1 recursive PHP queries using MySQL 8.0 <code className="text-amber-300 font-mono">WITH RECURSIVE binary_hierarchy</code> to traverse depth levels in O(1) database roundtrips.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>ACID Transaction Safety</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Weekly binary matching closing engine executes within <code className="text-emerald-300 font-mono">PDO::beginTransaction()</code> to prevent partial commission payouts or race conditions.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase">
            <Server className="w-4 h-4" />
            <span>Automated Cron Daemon</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Pre-configured Linux crontab scripts running every Sunday at 23:59:00 IST to match binary PV, deduct 2% TDS + 5% Admin, and carry forward leftover volume.
          </p>
        </div>
      </div>

      {/* File Navigation Strip & Code Viewer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-2 bg-slate-950 border-b border-slate-800">
          {CORE_PHP_CODEBASE.map((file, idx) => (
            <button
              key={file.filename}
              onClick={() => setActiveFileIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                activeFileIndex === idx
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>{file.filename}</span>
              <span className="text-[10px] opacity-75 font-sans">({file.category})</span>
            </button>
          ))}
        </div>

        {/* File Description Header */}
        <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-300">
            <span className="text-slate-500 mr-2 font-mono">File: {currentFile.filename}</span>
            <span>{currentFile.description}</span>
          </div>
          <span className="font-mono text-slate-500 text-[11px]">{lines.length} lines</span>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="overflow-x-auto max-h-[600px] p-4 bg-slate-950 font-mono text-xs leading-relaxed">
          <pre className="table w-full">
            <code>
              {lines.map((line, i) => (
                <div key={i} className="table-row hover:bg-slate-900/50">
                  <span className="table-cell select-none pr-4 text-right text-slate-600 w-12 text-[11px]">
                    {i + 1}
                  </span>
                  <span className="table-cell whitespace-pre text-slate-200">
                    {line}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>

      </div>

    </div>
  );
};
