declare module 'react-big-calendar' {
  import { ComponentType } from 'react';
  
  export interface CalendarProps {
    localizer: any;
    events: any[];
    startAccessor: string;
    endAccessor: string;
    eventPropGetter?: (event: any) => any;
    onSelectEvent?: (event: any) => void;
    onSelectSlot?: (slotInfo: any) => void;
    onEventDrop?: (dropInfo: any) => void;
    onEventResize?: (resizeInfo: any) => void;
    selectable?: boolean;
    resizable?: boolean;
    draggable?: boolean;
    components?: any;
    views?: string[];
    view?: string;
    onView?: (view: string) => void;
    date?: Date;
    onNavigate?: (date: Date) => void;
    popup?: boolean;
    className?: string;
    step?: number;
    timeslots?: number;
    min?: Date;
    max?: Date;
    onDragStart?: () => void;
    onDragEnd?: () => void;
  }
  
  export const Calendar: ComponentType<CalendarProps>;
  export const momentLocalizer: (moment: any) => any;
  export type View = 'month' | 'week' | 'day';
} 