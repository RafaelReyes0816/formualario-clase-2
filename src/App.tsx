import { useState, useEffect } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Info,
  Loader2,
  RotateCcw,
  Send,
  Trophy,
  UserRound,
  X,
} from 'lucide-react';

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
    setStatusMessage('Enviando respuestas...');

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
      setStatusMessage('¡Respuestas enviadas correctamente!');
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
    <div className="min-h-screen bg-navy px-4 py-8 sm:px-6 lg:px-8">
      <main className="mx-auto w-full max-w-3xl">
        <div className="sheet-animate border-t-4 border-red bg-white shadow-[0_28px_60px_-32px_rgba(0,0,0,0.65)]">
          <header className="flex items-start gap-5 border-b border-line px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-navy text-white">
              <ClipboardList size={24} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="font-display text-4xl leading-none text-navy sm:text-5xl">
                Checklist del Día 2
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                Marca cada actividad cuando la termines. Tu progreso se guarda en este dispositivo.
              </p>
            </div>
          </header>

          <section className="border-b border-line px-6 py-6 sm:px-10" aria-label="Progreso">
            <div className="flex items-end justify-between gap-4">
              <p className="text-sm font-semibold text-navy">Progreso</p>
              <p className="font-display text-3xl leading-none tabular-nums text-navy">
                {completedCount}<span className="text-xl text-muted">/{totalCount}</span>
              </p>
            </div>
            <div
              className="mt-3 h-1.5 w-full bg-line"
              role="progressbar"
              aria-valuenow={completedCount}
              aria-valuemin={0}
              aria-valuemax={totalCount}
              aria-label="Actividades completadas"
            >
              <div
                className="h-full bg-red transition-[width] duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent === 100 && (
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-red">
                <Check size={16} strokeWidth={2.5} />
                Todas las actividades completadas
              </p>
            )}
          </section>

          <section className="border-b border-line px-6 py-6 sm:px-10">
            <label htmlFor="participant-name" className="flex items-center gap-2 text-sm font-semibold text-navy">
              <UserRound size={17} strokeWidth={1.8} />
              Tu nombre
            </label>
            <input
              id="participant-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre completo..."
              className="mt-3 w-full border-b-2 border-line bg-transparent py-2 text-base text-navy outline-none transition-colors placeholder:text-muted/60 focus:border-red"
            />
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Se guarda con tus respuestas para identificar tu entrega.
            </p>
          </section>

          <section className="px-6 py-6 sm:px-10" aria-label="Actividades">
            <div className="mb-1 flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-semibold text-navy">Actividades</h2>
              <span className="text-xs tabular-nums text-muted">{completedCount} de {totalCount}</span>
            </div>
            <ul>
              {activities.map((activity, index) => (
                <li key={activity.id}>
                  <label className="flex cursor-pointer items-start gap-4 border-t border-line py-3.5 transition-colors hover:bg-wash">
                    <input
                      type="checkbox"
                      checked={activity.checked}
                      onChange={() => toggleActivity(activity.id)}
                      className="sr-only"
                    />
                    <span className="w-6 shrink-0 pt-0.5 text-xs tabular-nums text-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                        activity.checked
                          ? 'border-red bg-red text-white'
                          : 'border-muted/50 bg-white text-transparent'
                      }`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span className={`text-sm leading-relaxed ${
                      activity.checked ? 'text-muted line-through decoration-muted/50' : 'text-navy'
                    }`}>
                      {activity.text}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-line bg-wash px-6 py-6 sm:px-10">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === 'sending'}
                className="inline-flex flex-1 items-center justify-center gap-2 bg-red px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:cursor-not-allowed disabled:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
              >
                {status === 'sending' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} strokeWidth={1.8} />
                )}
                {status === 'sending' ? 'Enviando respuestas...' : 'Enviar respuestas'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 border border-navy/20 bg-white px-5 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              >
                <RotateCcw size={17} strokeWidth={1.8} />
                Reiniciar
              </button>
            </div>

            {statusMessage && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-4 flex items-start gap-2 text-sm ${
                  status === 'error' ? 'text-red-dark' : status === 'success' ? 'text-navy' : 'text-muted'
                }`}
              >
                {status === 'error' ? (
                  <AlertCircle size={17} className="mt-px shrink-0" />
                ) : status === 'success' ? (
                  <CheckCircle2 size={17} className="mt-px shrink-0 text-red" />
                ) : (
                  <Loader2 size={17} className="mt-px shrink-0 animate-spin" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-muted">
              <Info size={15} className="mt-px shrink-0" />
              <p>Tu nombre identifica tu entrega y permite hacer seguimiento individual de tu progreso.</p>
            </div>
          </section>
        </div>

        <p className="mt-6 text-center text-xs text-white/45">Checklist del Día 2</p>
      </main>

      {status === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="sheet-animate relative w-full max-w-md bg-white px-7 py-8 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.55)]"
          >
            <button
              type="button"
              onClick={handleReset}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-muted transition-colors hover:bg-wash hover:text-navy"
            >
              <X size={18} />
            </button>

            <div className="mb-5 flex h-11 w-11 items-center justify-center bg-navy text-white">
              <Trophy size={22} strokeWidth={1.8} />
            </div>
            <h2 id="success-title" className="font-display text-3xl leading-tight text-navy">
              ¡Listo!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Ya tienes tres publicaciones publicitarias y una historia para tu negocio.
            </p>
            <div className="mt-5 border-t border-line pt-5">
              <p className="text-sm leading-relaxed text-navy">
                En el Día 3 usarás estos materiales para crear un{' '}
                <strong className="font-semibold text-red">video promocional con CapCut</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-navy px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-soft"
            >
              Continuar
              <ArrowRight size={17} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
