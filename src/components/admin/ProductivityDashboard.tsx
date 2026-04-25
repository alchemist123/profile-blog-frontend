import { useState, useEffect, type ReactElement } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableWidget } from './widgets/SortableWidget';
import TaskLoggerWidget from './widgets/TaskLoggerWidget';
import PlanningWidget from './widgets/PlanningWidget';
import StatsWidget from './widgets/StatsWidget';
import ClockWidget from './widgets/ClockWidget';
import CalendarWidget from './widgets/CalendarWidget';
import ReportWidget from './widgets/ReportWidget';

type WidgetDef = { id: string; component: ReactElement };

const INITIAL_WIDGETS: WidgetDef[] = [
  { id: 'clock', component: <ClockWidget /> },
  { id: 'task-logger', component: <TaskLoggerWidget /> },
  { id: 'stats', component: <StatsWidget /> },
  { id: 'calendar', component: <CalendarWidget /> },
  { id: 'planning', component: <PlanningWidget /> },
  { id: 'report', component: <ReportWidget /> },
];

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/productivity` : '/api/v1/productivity';

export default function ProductivityDashboard() {
  const [widgets, setWidgets] = useState<WidgetDef[]>(INITIAL_WIDGETS);

  useEffect(() => {
    fetch(`${API_BASE}/layout`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (data && data.order) {
          const hydrated = data.order.map((id: string) => INITIAL_WIDGETS.find(w => w.id === id)).filter(Boolean);
          if (hydrated.length === INITIAL_WIDGETS.length) {
            setWidgets(hydrated);
          }
        }
      })
      .catch(() => {
        // Fallback to local storage if API backend goes offline temporarily
        const saved = localStorage.getItem('dashboard-layout');
        if (saved) {
          const order = JSON.parse(saved);
          const hydrated = order.map((id: string) => INITIAL_WIDGETS.find(w => w.id === id)).filter(Boolean);
          if (hydrated.length === INITIAL_WIDGETS.length) setWidgets(hydrated);
        }
      });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Put exactly the API JSON Payload, maintaining existing backend values
        fetch(`${API_BASE}/layout`)
          .then(res => res.ok ? res.json() : {})
          .then(data => {
            const payload = { ...data, order: newItems.map(w => w.id) };
            fetch(`${API_BASE}/layout`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(console.error);
          })
          .catch(() => {
            // Fallback Local Storage
            localStorage.setItem('dashboard-layout', JSON.stringify(newItems.map(w => w.id)));
          });

        return newItems;
      });
    }
  }

  return (
    <div className="w-full bg-[#0B1015]/40 rounded-xl p-8 border border-slate-800 shadow-2xl relative">
      <div className="absolute top-0 right-0 p-4 opacity-50 text-[10px] font-mono text-emerald-500 tracking-[0.2em]">v5.0_PROD _API_ONLINE</div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(350px,_auto)] grid-flow-dense">
          <SortableContext
            items={widgets.map(w => w.id)}
            strategy={rectSortingStrategy}
          >
            {widgets.map((widget) => (
              <SortableWidget key={widget.id} id={widget.id}>
                {widget.component}
              </SortableWidget>
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
