import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function toDateString(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

export interface DateRangePickerProps {
  /** Current value: fromDate and toDate in yyyy-MM-dd, or both null when no filter. */
  fromDate: string | null;
  toDate: string | null;
  /** Called when user selects a date or range, or clears. Pass undefined to clear. */
  onChange: (fromDate: string | undefined, toDate: string | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function DateRangePicker({
  fromDate,
  toDate,
  onChange,
  className,
  placeholder = 'Filtrar por data',
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const range: DateRange | undefined = React.useMemo(() => {
    if (!fromDate) return undefined;
    const from = new Date(fromDate + 'T12:00:00');
    if (!toDate) return { from };
    const to = new Date(toDate + 'T12:00:00');
    return { from, to };
  }, [fromDate, toDate]);

  const handleSelect = (r: DateRange | undefined) => {
    if (!r?.from) {
      onChange(undefined, undefined);
      setOpen(false);
      return;
    }
    const fromStr = toDateString(r.from);
    const toStr = r.to ? toDateString(r.to) : fromStr;
    onChange(fromStr, toStr);
    if (r.from && r.to) setOpen(false);
  };

  const label = React.useMemo(() => {
    if (!fromDate) return placeholder;
    if (!toDate || fromDate === toDate) return format(new Date(fromDate + 'T12:00:00'), 'd MMM yyyy', { locale: ptBR });
    return `${format(new Date(fromDate + 'T12:00:00'), 'd MMM', { locale: ptBR })} – ${format(new Date(toDate + 'T12:00:00'), 'd MMM yyyy', { locale: ptBR })}`;
  }, [fromDate, toDate, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('justify-start text-left font-normal', className)}
          aria-label={placeholder}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={1}
          locale={ptBR}
        />
        <div className="flex items-center justify-end gap-2 border-t p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(undefined, undefined);
              setOpen(false);
            }}
            aria-label="Limpar data"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
