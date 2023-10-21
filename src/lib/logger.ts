import type { Level } from 'pino';
import { pino } from 'pino';

const isLevel = (value: string): value is Level => {
  const levels = ['error', 'fatal', 'warn', 'info', 'debug', 'trace'];
  return levels.some(level => level === value);
};

export const logger = pino({
  formatters: {
    level: (
      label,
      number,
    ): {
      status: Level;
      level: number;
    } => ({ status: isLevel(label) ? label : 'error', level: number }),
  },
});
