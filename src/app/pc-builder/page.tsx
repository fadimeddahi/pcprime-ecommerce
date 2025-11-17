"use client";

import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { useTheme } from "../context/ThemeContext";
import { pcBuilderApi } from "../services/api";
import { CPU, Motherboard, RAM, Storage, Monitor, BuildResponse } from "../types/pc-builder";
import FeedbackModal from "../components/feedback-modal";

type AllComponentsResult = {
  cpus: CPU[];
  motherboards: Motherboard[];
  rams: RAM[];
  storages: Storage[];
  monitors: Monitor[];
};
import { FaMicrochip, FaMemory, FaHdd, FaDesktop, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaCog, FaChevronDown, FaChevronUp } from "react-icons/fa";

const PCBuilderPage = () => {
  const { theme } = useTheme();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  

  // Fetch all component lists in parallel with one query
  const { data: allComponents, isLoading: loading, error: fetchError, refetch } = useQuery<AllComponentsResult>({
    queryKey: ['pc-builder-components'],
    queryFn: async (): Promise<AllComponentsResult> => {
      const [cpus, motherboards, rams, storages, monitors] = await Promise.all([
        pcBuilderApi.getAllCPUs(),
        pcBuilderApi.getAllMotherboards(),
        pcBuilderApi.getAllRAM(),
        pcBuilderApi.getAllStorage(),
        pcBuilderApi.getAllMonitors(),
      ]);
      return { cpus, motherboards, rams, storages, monitors };
    },
  });
  
  // Expanded state for each component type
  const [expandedSections, setExpandedSections] = useState<{
    cpu: boolean;
    motherboard: boolean;
    ram: boolean;
    storage: boolean;
    monitor: boolean;
  }>({
    cpu: false,
    motherboard: false,
    ram: false,
    storage: false,
    monitor: false,
  });
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Selected components
  const [selectedCPU, setSelectedCPU] = useState<number | null>(null);
  const [selectedMotherboard, setSelectedMotherboard] = useState<number | null>(null);
  const [selectedRAM, setSelectedRAM] = useState<number | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<number | null>(null);
  const [selectedMonitor, setSelectedMonitor] = useState<number | null>(null);
  
  // Results
  const [checking, setChecking] = useState(false);
  const [buildResult, setBuildResult] = useState<BuildResponse | null>(null);
  const [error, setError] = useState("");



  // Check build compatibility
  const handleCheckCompatibility = async () => {
    if (!selectedCPU || !selectedMotherboard || !selectedRAM || !selectedStorage || !selectedMonitor) {
      setError("Veuillez sélectionner tous les composants");
      return;
    }

    try {
      setChecking(true);
      setError("");
      setBuildResult(null);

      const buildData = {
        cpu_id: selectedCPU,
        motherboard_id: selectedMotherboard,
        ram_id: selectedRAM,
        storage_id: selectedStorage,
        monitor_id: selectedMonitor,
      };

      console.log("🔍 Checking build compatibility:", buildData);
      const result = await pcBuilderApi.checkBuildCompatibility(buildData);
      console.log("✅ Compatibility result:", result);
      
      setBuildResult(result);
      setChecking(false);
    } catch (err: any) {
      console.error("❌ Compatibility check error:", err);
      setError(err.message || "Erreur lors de la vérification");
      setChecking(false);
    }
  };

  // Helper accessors for data
  const cpus = allComponents?.cpus || [];
  const motherboards = allComponents?.motherboards || [];
  const rams = allComponents?.rams || [];
  const storages = allComponents?.storages || [];
  const monitors = allComponents?.monitors || [];

  // Calculate total price
  const getTotalPrice = () => {
    let total = 0;
    if (selectedCPU) total += cpus.find(c => c.ID === selectedCPU)?.price || 0;
    if (selectedMotherboard) total += motherboards.find(m => m.ID === selectedMotherboard)?.price || 0;
    if (selectedRAM) total += rams.find(r => r.ID === selectedRAM)?.price || 0;
    if (selectedStorage) total += storages.find(s => s.ID === selectedStorage)?.price || 0;
    if (selectedMonitor) total += monitors.find(m => m.ID === selectedMonitor)?.price || 0;
    return total;
  };

  // Get selected component details
  const getSelectedCPU = () => cpus.find(c => c.ID === selectedCPU);
  const getSelectedMotherboard = () => motherboards.find(m => m.ID === selectedMotherboard);
  const getSelectedRAM = () => rams.find(r => r.ID === selectedRAM);
  const getSelectedStorage = () => storages.find(s => s.ID === selectedStorage);
  const getSelectedMonitor = () => monitors.find(m => m.ID === selectedMonitor);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100' : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
      }`}>
        <div className="text-center">
          <FaSpinner className="text-6xl text-[#fe8002] animate-spin mx-auto mb-4" />
          <p className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Chargement des composants...
          </p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-red-600 mb-4">Erreur lors du chargement des composants</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-[#fe8002] text-white rounded font-semibold">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 relative overflow-hidden transition-all duration-300 ${
      theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100' : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${theme === 'light' ? 'opacity-[0.03]' : 'opacity-[0.02]'}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #fe8002 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-[#fe8002]/10 via-transparent to-[#ff4500]/10 pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent tracking-tight mb-4">
            <FaCog className="inline-block mr-4 text-[#fe8002]" />
            PC Builder
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] mx-auto mb-4 shadow-lg shadow-[#fe8002]/50" />
          <p className={`text-lg font-bold ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Construisez votre PC parfait avec l'analyse IA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* CPU Selection */}
            <ComponentSelector
              title="Processeur (CPU)"
              icon={<FaMicrochip />}
              components={cpus}
              selected={selectedCPU}
              onSelect={setSelectedCPU}
              theme={theme}
              isExpanded={expandedSections.cpu}
              onToggle={() => toggleSection('cpu')}
              renderDetails={(cpu: CPU) => (
                <>
                  <p className="text-xs text-gray-500">Socket: {cpu.socket}</p>
                  <p className="text-xs text-gray-500">{cpu.cores} Cores / {cpu.threads} Threads</p>
                </>
              )}
            />

            {/* Motherboard Selection */}
            <ComponentSelector
              title="Carte Mère"
              icon={<FaCog />}
              components={motherboards}
              selected={selectedMotherboard}
              onSelect={setSelectedMotherboard}
              theme={theme}
              isExpanded={expandedSections.motherboard}
              onToggle={() => toggleSection('motherboard')}
              renderDetails={(mb: Motherboard) => (
                <>
                  <p className="text-xs text-gray-500">Socket: {mb.socket}</p>
                  <p className="text-xs text-gray-500">Form Factor: {mb.form_factor}</p>
                </>
              )}
            />

            {/* RAM Selection */}
            <ComponentSelector
              title="Mémoire RAM"
              icon={<FaMemory />}
              components={rams}
              selected={selectedRAM}
              onSelect={setSelectedRAM}
              theme={theme}
              isExpanded={expandedSections.ram}
              onToggle={() => toggleSection('ram')}
              renderDetails={(ram: RAM) => (
                <>
                  <p className="text-xs text-gray-500">{ram.capacity} GB - {ram.type}</p>
                  <p className="text-xs text-gray-500">{ram.speed} MHz</p>
                </>
              )}
            />

            {/* Storage Selection */}
            <ComponentSelector
              title="Stockage"
              icon={<FaHdd />}
              components={storages}
              selected={selectedStorage}
              onSelect={setSelectedStorage}
              theme={theme}
              isExpanded={expandedSections.storage}
              onToggle={() => toggleSection('storage')}
              renderDetails={(storage: Storage) => (
                <>
                  <p className="text-xs text-gray-500">{storage.type} - {storage.capacity} GB</p>
                </>
              )}
            />

            {/* Monitor Selection */}
            <ComponentSelector
              title="Moniteur"
              icon={<FaDesktop />}
              components={monitors}
              selected={selectedMonitor}
              onSelect={setSelectedMonitor}
              theme={theme}
              isExpanded={expandedSections.monitor}
              onToggle={() => toggleSection('monitor')}
              renderDetails={(monitor: Monitor) => (
                <>
                  <p className="text-xs text-gray-500">{monitor.size}" - {monitor.refresh_rate} Hz</p>
                </>
              )}
            />
          </div>

          {/* Build Summary */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 border-2 border-[#fe8002]/30 shadow-2xl backdrop-blur-xl sticky top-4 ${
              theme === 'light' ? 'bg-white shadow-[#fe8002]/20' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-[#fe8002]/10'
            }`}>
              <h2 className="text-[#fe8002] font-bold text-xl uppercase tracking-wide mb-6">Résumé du Build</h2>

              <div className="space-y-3 mb-6">
                {getSelectedCPU() && (
                  <BuildItem icon={<FaMicrochip />} name={getSelectedCPU()!.name} price={getSelectedCPU()!.price} theme={theme} />
                )}
                {getSelectedMotherboard() && (
                  <BuildItem icon={<FaCog />} name={getSelectedMotherboard()!.name} price={getSelectedMotherboard()!.price} theme={theme} />
                )}
                {getSelectedRAM() && (
                  <BuildItem icon={<FaMemory />} name={getSelectedRAM()!.name} price={getSelectedRAM()!.price} theme={theme} />
                )}
                {getSelectedStorage() && (
                  <BuildItem icon={<FaHdd />} name={getSelectedStorage()!.name} price={getSelectedStorage()!.price} theme={theme} />
                )}
                {getSelectedMonitor() && (
                  <BuildItem icon={<FaDesktop />} name={getSelectedMonitor()!.name} price={getSelectedMonitor()!.price} theme={theme} />
                )}
              </div>

              <div className="border-t-2 border-[#fe8002]/20 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className={`font-extrabold text-xl ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Total:</span>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                    {getTotalPrice().toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DZD
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl">
                  <p className="text-red-500 text-sm font-bold">{error}</p>
                </div>
              )}

              <button
                onClick={handleCheckCompatibility}
                disabled={checking || !selectedCPU || !selectedMotherboard || !selectedRAM || !selectedStorage || !selectedMonitor}
                className={`w-full bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black font-extrabold py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 uppercase tracking-wider border-2 border-white/30 ${
                  (checking || !selectedCPU || !selectedMotherboard || !selectedRAM || !selectedStorage || !selectedMonitor) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {checking ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Vérification...
                  </span>
                ) : (
                  'Vérifier la Compatibilité'
                )}
              </button>

              {/* Build Results */}
              {buildResult && (
                <div className={`mt-6 p-6 rounded-2xl border-2 ${
                  buildResult.compatible ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    {buildResult.compatible ? (
                      <FaCheckCircle className="text-3xl text-green-500" />
                    ) : (
                      <FaExclamationTriangle className="text-3xl text-red-500" />
                    )}
                    <div className="flex-1">
                      <h3 className={`font-extrabold text-lg ${buildResult.compatible ? 'text-green-500' : 'text-red-500'}`}>
                        {buildResult.compatible ? 'Build Compatible' : 'Problèmes Détectés'}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Score: <span className={`font-bold ${buildResult.score >= 70 ? 'text-green-500' : buildResult.score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>{buildResult.score}/10</span>
                        </p>
                        {buildResult.compatible && (
                          <span className={`text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600 font-semibold`}>
                            VÉRIFIÉ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {buildResult.bottleneck && buildResult.bottleneck !== 'none' && (
                    <div className="mb-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                      <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        Goulot d'étranglement
                      </p>
                      <p className="text-sm font-semibold text-yellow-600">
                        {buildResult.bottleneck}
                      </p>
                    </div>
                  )}

                  {buildResult.warnings && buildResult.warnings.length > 0 && (
                    <div className="mt-3">
                      <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        Avertissements
                      </p>
                      <ul className="space-y-2">
                        {buildResult.warnings.map((warning, index) => (
                          <li key={index} className={`text-xs flex items-start gap-2 p-2 rounded-lg ${
                            theme === 'light' ? 'bg-gray-50' : 'bg-white/5'
                          }`}>
                            <span className="text-[#fe8002] mt-0.5">•</span>
                            <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className={`font-bold py-3 px-8 rounded-xl transition-all duration-300 border-2 ${
              theme === 'light'
                ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
                : 'bg-blue-900/30 border-blue-500 text-blue-300 hover:bg-blue-900/50'
            }`}
          >
            💬 Avis sur le PC Builder
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};

// Component Selector Component
type ComponentSelectorProps<T> = {
  title: string;
  icon: React.ReactNode;
  components: T[];
  selected: number | null;
  onSelect: (id: number) => void;
  theme: string;
  renderDetails: (component: T) => React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
};

function ComponentSelector<T extends { ID: number; name: string; price: number }>(props: ComponentSelectorProps<T>) {
  const { title, icon, components, selected, onSelect, theme, renderDetails, isExpanded, onToggle } = props;
  const selectedComponent = components.find(c => c.ID === selected);
  return (
    <div className={`rounded-2xl p-6 border-2 border-[#fe8002]/30 shadow-2xl backdrop-blur-xl ${
      theme === 'light' ? 'bg-white shadow-[#fe8002]/20' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-[#fe8002]/10'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-[#fe8002] text-2xl">{icon}</span>
          <h3 className="text-[#fe8002] font-bold text-lg uppercase tracking-wide">{title}</h3>
        </div>
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg transition-all duration-300 ${
            theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/10'
          }`}
        >
          {isExpanded ? (
            <FaChevronUp className="text-[#fe8002] text-xl" />
          ) : (
            <FaChevronDown className="text-[#fe8002] text-xl" />
          )}
        </button>
      </div>

      {/* Show selected component when collapsed */}
      {!isExpanded && selectedComponent && (
        <div className="mb-3 p-3 rounded-xl border-2 border-[#fe8002] bg-[#fe8002]/10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-bold text-sm mb-1 text-[#fe8002]">
                {selectedComponent.name}
              </p>
              {renderDetails(selectedComponent)}
            </div>
            <p className="text-[#fe8002] font-bold text-sm">
              {selectedComponent.price.toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DZD
            </p>
          </div>
        </div>
      )}

      {/* Show all components when expanded */}
      {isExpanded && (
        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
          {components.map((component) => (
            <button
              key={component.ID}
              onClick={() => {
                onSelect(component.ID);
                onToggle(); // Auto-collapse after selection
              }}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                selected === component.ID
                  ? 'border-[#fe8002] bg-[#fe8002]/10'
                  : theme === 'light'
                  ? 'border-gray-200 hover:border-[#fe8002]/50 bg-gray-50'
                  : 'border-gray-800 hover:border-[#fe8002]/50 bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className={`font-bold text-sm mb-1 ${
                    selected === component.ID ? 'text-[#fe8002]' : theme === 'light' ? 'text-gray-800' : 'text-white'
                  }`}>
                    {component.name}
                  </p>
                  {renderDetails(component)}
                </div>
                <p className="text-[#fe8002] font-bold text-sm">
                  {component.price.toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DZD
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Show button to select when nothing is selected and collapsed */}
      {!isExpanded && !selectedComponent && (
        <button
          onClick={onToggle}
          className={`w-full p-3 rounded-xl border-2 border-dashed transition-all duration-300 ${
            theme === 'light' 
              ? 'border-gray-300 hover:border-[#fe8002] text-gray-600 hover:text-[#fe8002]' 
              : 'border-gray-700 hover:border-[#fe8002] text-gray-400 hover:text-[#fe8002]'
          }`}
        >
          <p className="text-sm font-semibold">Cliquez pour sélectionner</p>
        </button>
      )}
    </div>
  );
}

// Build Item Component
interface BuildItemProps {
  icon: React.ReactNode;
  name: string;
  price: number;
  theme: string;
}

const BuildItem = ({ icon, name, price, theme }: BuildItemProps) => {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border border-[#fe8002]/20 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
    }`}>
      <span className="text-[#fe8002] text-lg flex-shrink-0 mt-1">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-xs line-clamp-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          {name}
        </p>
        <p className="text-[#fe8002] font-bold text-xs">
          {price.toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DZD
        </p>
      </div>
    </div>
  );
};

export default PCBuilderPage;
