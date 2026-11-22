import { useState, useEffect } from 'react';

interface Activity {
  id: number;
  text: string;
  checked: boolean;
}

const initialActivities: Activity[] = [
  { id: 1, text: "Recuperé las imágenes y el brief del Día 1.", checked: false },
  { id: 2, text: "Utilicé el PROMPT 1 para crear mensajes.", checked: false },
  { id: 3, text: "Obtuve textos para tres publicaciones y una historia.", checked: false },
  { id: 4, text: "Revisé títulos, subtítulos y llamadas a la acción.", checked: false },
  { id: 5, text: "Utilicé el PROMPT 2 para preparar Canva IA.", checked: false },
  { id: 6, text: "Copié el prompt final generado por ChatGPT.", checked: false },
  { id: 7, text: "Probé el prompt en Canva IA.", checked: false },
  { id: 8, text: "Comprobé si los diseños eran editables.", checked: false },
  { id: 9, text: "Coloqué fotografías creadas en el Día 1.", checked: false },
  { id: 10, text: "Terminé tres publicaciones cuadradas.", checked: false },
  { id: 11, text: "Creé una historia vertical.", checked: false },
  { id: 12, text: "Comparé Canva con Ideogram.", checked: false },
  { id: 13, text: "Descargué cuatro archivos PNG.", checked: false },
  { id: 14, text: "Guardé los trabajos en Google Drive.", checked: false },
];

const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx37zmyAk4iTzOE_susrGAwGFsdaQWS8lrUJz69odkpBvjb4QOrRxCP5_tPkumudBPPvw/exec';

function App() {
  const [name, setName] = useState('');
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Load saved data from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('checklist_name');
    const savedActivities = localStorage.getItem('checklist_activities');

    if (savedName) setName(savedName);
    if (savedActivities) setActivities(JSON.parse(savedActivities));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('checklist_name', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('checklist_activities', JSON.stringify(activities));
  }, [activities]);

  const toggleActivity = (id: number) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id ? { ...activity, checked: !activity.checked } : activity
      )
    );
  };

  const completedCount = activities.filter(a => a.checked).length;
  const totalCount = activities.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setStatus('error');
      setStatusMessage('Por favor, ingresa tu nombre antes de enviar.');
      return;
    }

    setStatus('sending');
    setStatusMessage('Enviando datos...');

    try {
      const data = {
        nombre: name.trim(),
        fecha: new Date().toLocaleString('es-MX'),
        actividades: activities.map(a => ({
          actividad: a.text,
          completada: a.checked ? 'Sí' : 'No'
        })),
        progreso: `${completedCount}/${totalCount} (${progressPercent}%)`
      };

      await fetch(DEFAULT_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // With no-cors mode, we can't read the response, but the request was sent
      setStatus('success');
      setStatusMessage('¡Datos enviados exitosamente a Google Sheets!');
    } catch (error) {
      setStatus('error');
      setStatusMessage('Error al enviar. Intenta de nuevo.');
    }
  };

  const handleReset = () => {
    setActivities(initialActivities);
    setStatus('idle');
    setStatusMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Checklist Día 2
          </h1>
          <p className="text-purple-200 text-lg">
            Marca las actividades completadas
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">Progreso</span>
            <span className="text-purple-200 font-bold">{completedCount}/{totalCount} ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #818cf8, #c084fc, #f472b6)'
              }}
            />
          </div>
          {progressPercent === 100 && (
            <p className="text-green-300 text-sm mt-2 text-center font-medium animate-pulse">
              🎉 ¡Todas las actividades completadas!
            </p>
          )}
        </div>

        {/* Name Input */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
          <label className="block text-white font-medium mb-3">
            👤 Tu nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu nombre completo..."
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
          <p className="text-purple-300/70 text-sm mt-2">
            Tu nombre se incluirá en el registro de Google Sheets
          </p>
        </div>

        {/* Activities Checklist */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-white font-bold text-lg mb-4">
            ✅ Actividades del Día 2
          </h2>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <label
                key={activity.id}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  activity.checked
                    ? 'bg-green-500/20 border border-green-400/30'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={activity.checked}
                    onChange={() => toggleActivity(activity.id)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    activity.checked
                      ? 'bg-green-500 border-green-400'
                      : 'border-purple-300/50 bg-white/5'
                  }`}>
                    {activity.checked && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={`text-sm md:text-base leading-relaxed transition-all duration-200 ${
                  activity.checked
                    ? 'text-green-200 line-through opacity-75'
                    : 'text-white'
                }`}>
                  <span className="text-purple-300/60 font-mono text-xs mr-2">{String(index + 1).padStart(2, '0')}.</span>
                  {activity.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={handleSubmit}
            disabled={status === 'sending'}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              status === 'sending'
                ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/25'
            }`}
          >
            {status === 'sending' ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <span>📤</span>
                Enviar a Google Sheets
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="py-4 px-6 rounded-xl font-medium text-purple-200 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200"
          >
            🔄 Reiniciar
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`rounded-xl p-4 mb-6 border text-center font-medium ${
            status === 'success'
              ? 'bg-green-500/20 border-green-400/30 text-green-200'
              : status === 'error'
              ? 'bg-red-500/20 border-red-400/30 text-red-200'
              : 'bg-blue-500/20 border-blue-400/30 text-blue-200'
          }`}>
            {status === 'success' && '✅ '}
            {status === 'error' && '❌ '}
            {status === 'sending' && '📡 '}
            {statusMessage}
          </div>
        )}

        {/* Info Note */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <p className="text-purple-300/70 text-sm text-center">
            💡 <strong>¿Es ideal pedir el nombre?</strong> Sí, porque permite identificar quién completó las actividades y hacer seguimiento individual en Google Sheets. Los datos se guardan automáticamente con tu nombre y fecha.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-400/50 text-sm">
          <p>Checklist interactivo • Conectado con Google Sheets</p>
        </div>
      </div>

      {/* Congrats Modal */}
      {status === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-3xl p-8 md:p-10 max-w-lg w-full border border-white/20 shadow-2xl shadow-purple-500/20 animate-fade-in">
            {/* Confetti decoration */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="flex gap-2 text-4xl animate-bounce">
                <span>🎉</span>
                <span>✨</span>
                <span>🎊</span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                setActivities(initialActivities);
                setStatus('idle');
                setStatusMessage('');
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center mt-4">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¡Felicitaciones!
              </h2>
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
                <p className="text-lg text-purple-100 leading-relaxed mb-3">
                  Ya tienes <strong className="text-white">tres publicaciones publicitarias</strong> y <strong className="text-white">una historia</strong> para tu negocio.
                </p>
                <div className="w-full h-px bg-white/20 my-4" />
                <p className="text-base text-purple-200 leading-relaxed">
                  En el <strong className="text-yellow-300">Día 3</strong> utilizarás estos materiales para crear un <strong className="text-yellow-300">video promocional con CapCut</strong>. 🎬
                </p>
              </div>
              <button
                onClick={() => {
                  setActivities(initialActivities);
                  setStatus('idle');
                  setStatusMessage('');
                }}
                className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-green-500/25"
              >
                ¡Entendido! Continuar ➜
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
