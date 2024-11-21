import React, { useState, useEffect } from 'react';
import { Calculator, Timer, Coins, Play, Pause, Square, Hammer, Printer, Zap, Box, Ruler, Cpu, Info } from 'lucide-react';

interface CostiLavoro {
  materiali: number;
  orelavoro: number;
  costoOrario: number;
}

type JobType = 'falegnameria' | 'laser' | 'stampa3d';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => (
  <div className="group relative inline-block">
    {children}
    <div className="opacity-0 bg-gray-900 text-white text-sm rounded-lg py-2 px-3 absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

const getJobConfig = (type: JobType) => {
  switch (type) {
    case 'falegnameria':
      return {
        icon: Hammer,
        title: 'Falegnameria',
        color: 'from-amber-500 to-orange-600',
        bgGradient: 'from-amber-50 to-orange-50',
        accent: 'border-orange-500',
        iconBg: 'bg-orange-600',
        description: 'Calcolo costi per lavori di falegnameria',
        materialLabel: 'Costo Legname e Materiali',
        materialIcon: Box
      };
    case 'laser':
      return {
        icon: Zap,
        title: 'Lavoro con Laser',
        color: 'from-blue-500 to-indigo-600',
        bgGradient: 'from-blue-50 to-indigo-50',
        accent: 'border-indigo-500',
        iconBg: 'bg-indigo-600',
        description: 'Calcolo costi per lavorazioni laser',
        materialLabel: 'Costo Materiali da Taglio',
        materialIcon: Ruler
      };
    case 'stampa3d':
      return {
        icon: Printer,
        title: 'Stampa 3D',
        color: 'from-emerald-500 to-teal-600',
        bgGradient: 'from-emerald-50 to-teal-50',
        accent: 'border-teal-500',
        iconBg: 'bg-teal-600',
        description: 'Calcolo costi per stampa 3D',
        materialLabel: 'Costo Filamento/Resina',
        materialIcon: Cpu
      };
  }
};

function App() {
  const [showInfo, setShowInfo] = useState(false);
  const [jobType, setJobType] = useState<JobType>('falegnameria');
  const [jobStates, setJobStates] = useState<Record<JobType, CostiLavoro>>({
    falegnameria: { materiali: 0, orelavoro: 0, costoOrario: 0 },
    laser: { materiali: 0, orelavoro: 0, costoOrario: 0 },
    stampa3d: { materiali: 0, orelavoro: 0, costoOrario: 0 }
  });

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const jobTypes = [
    { id: 'falegnameria', label: 'Falegnameria', icon: Hammer },
    { id: 'laser', label: 'Lavoro con Laser', icon: Zap },
    { id: 'stampa3d', label: 'Stampa 3D', icon: Printer },
  ];

  const currentJobConfig = getJobConfig(jobType);
  const currentCostiInput = jobStates[jobType];

  const updateJobState = (updates: Partial<CostiLavoro>) => {
    setJobStates(prev => ({
      ...prev,
      [jobType]: { ...prev[jobType], ...updates }
    }));
  };

  useEffect(() => {
    let intervalId: number;
    if (isRunning && !isPaused) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, isPaused]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const stopTimer = () => {
    const hoursWorked = time / 3600;
    updateJobState({ orelavoro: currentCostiInput.orelavoro + hoursWorked });
    setTime(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calcolaTotale = () => {
    const costoMateriali = currentCostiInput.materiali;
    const costoLavoro = currentCostiInput.orelavoro * currentCostiInput.costoOrario;
    return costoMateriali + costoLavoro;
  };

  const totale = calcolaTotale();

  return (
    <div className={`min-h-screen p-6 flex items-center justify-center bg-gradient-to-br ${currentJobConfig.bgGradient}`}>
      <div className="w-full max-w-2xl glass rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 ${currentJobConfig.iconBg} rounded-2xl rotate-3 transform hover:rotate-6 transition-transform`}>
              <Calculator className="w-10 h-10 text-white icon-3d" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Calcolatore Costi
              </h1>
              <p className="text-sm text-gray-600 mt-1">{currentJobConfig.description}</p>
            </div>
          </div>
          <Tooltip text="Mostra guida applicazione">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-3 rounded-xl transition-all ${
                showInfo ? 'bg-indigo-500 text-white' : 'bg-white/50 hover:bg-white/80'
              }`}
            >
              <Info className="w-6 h-6" />
            </button>
          </Tooltip>
        </div>

        {showInfo && (
          <div className="glass rounded-2xl p-6 mb-8 border-t-4 border-indigo-500 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Guida Applicazione</h2>
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <Box className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-700">Seleziona il tipo di lavoro per calcolare i costi specifici</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-700">Usa il timer per tracciare automaticamente le ore di lavoro</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-700">Inserisci la tariffa oraria per calcolare il costo del lavoro</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-700">Avvia il timer per iniziare a tracciare il tempo</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Pause className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-700">Metti in pausa il timer senza perdere il conteggio</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <Square className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-700">Ferma il timer e aggiungi il tempo alle ore di lavoro</p>
              </div>
            </div>
          </div>
        )}

        {/* Job Type Selector */}
        <div className={`glass rounded-2xl p-4 mb-8 border-t-4 ${currentJobConfig.accent}`}>
          <div className="grid grid-cols-3 gap-2">
            {jobTypes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setJobType(id as JobType)}
                className={`p-4 rounded-xl transition-all ${
                  jobType === id 
                    ? `bg-gradient-to-br ${getJobConfig(id as JobType).color} text-white shadow-lg scale-105` 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`w-6 h-6 ${jobType === id ? 'text-white' : 'text-gray-700'}`} />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Timer Section */}
        <div className={`glass rounded-2xl p-6 mb-8 border-t-4 ${currentJobConfig.accent}`}>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-gray-900">
              {formatTime(time)}
            </div>
            <div className="flex justify-center gap-4">
              <Tooltip text="Avvia il timer">
                <button
                  onClick={startTimer}
                  disabled={isRunning && !isPaused}
                  className="p-3 bg-green-500 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <Play className="w-6 h-6 text-white" />
                </button>
              </Tooltip>
              <Tooltip text="Metti in pausa">
                <button
                  onClick={pauseTimer}
                  disabled={!isRunning || isPaused}
                  className="p-3 bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  <Pause className="w-6 h-6 text-white" />
                </button>
              </Tooltip>
              <Tooltip text="Ferma e aggiungi alle ore">
                <button
                  onClick={stopTimer}
                  disabled={!isRunning && !isPaused}
                  className="p-3 bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <Square className="w-6 h-6 text-white" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            {/* Costo Materiali */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-lg font-semibold text-gray-900 pl-4">
                <Tooltip text="Inserisci il costo totale dei materiali utilizzati">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${currentJobConfig.color} shadow-lg transform hover:scale-105 transition-transform`}>
                    <currentJobConfig.materialIcon className="h-5 w-5 text-white icon-3d" strokeWidth={2.5} />
                  </div>
                </Tooltip>
                {currentJobConfig.materialLabel}
              </label>
              <input
                type="number"
                className="input-glass block w-full px-6 h-16 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg"
                placeholder="Inserisci il costo dei materiali (€)"
                value={currentCostiInput.materiali || ''}
                onChange={(e) => updateJobState({ materiali: parseFloat(e.target.value) || 0 })}
              />
            </div>

            {/* Tariffa Oraria */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-lg font-semibold text-gray-900 pl-4">
                <Tooltip text="Inserisci quanto vuoi guadagnare all'ora">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${currentJobConfig.color} shadow-lg transform hover:scale-105 transition-transform`}>
                    <Coins className="h-5 w-5 text-white icon-3d" strokeWidth={2.5} />
                  </div>
                </Tooltip>
                Tariffa Oraria
              </label>
              <input
                type="number"
                className="input-glass block w-full px-6 h-16 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg"
                placeholder="Inserisci la tariffa oraria (€)"
                value={currentCostiInput.costoOrario || ''}
                onChange={(e) => updateJobState({ costoOrario: parseFloat(e.target.value) || 0 })}
              />
            </div>

            {/* Ore di Lavoro */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-lg font-semibold text-gray-900 pl-4">
                <Tooltip text="Ore totali di lavoro (si aggiorna automaticamente con il timer)">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${currentJobConfig.color} shadow-lg transform hover:scale-105 transition-transform`}>
                    <Timer className="h-5 w-5 text-white icon-3d" strokeWidth={2.5} />
                  </div>
                </Tooltip>
                Ore di Lavoro
              </label>
              <input
                type="number"
                className="input-glass block w-full px-6 h-16 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg"
                placeholder="Inserisci le ore di lavoro"
                value={currentCostiInput.orelavoro.toFixed(2) || ''}
                onChange={(e) => updateJobState({ orelavoro: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className={`glass rounded-2xl p-8 border-t-4 ${currentJobConfig.accent}`}>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-semibold text-gray-900">Costo lavoro:</span>
              <span className={`text-4xl font-bold bg-gradient-to-r ${currentJobConfig.color} bg-clip-text text-transparent`}>
                {totale.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;