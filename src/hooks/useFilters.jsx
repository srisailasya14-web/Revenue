import { useMemo, useState } from 'react';
import { PRESETS, getPresetRange, getPreviousRange, parseCustomRange } from '@/utils/dates';

// Central filter state: preset, custom range, user, department.
export function useFilters() {
  const [preset, setPreset] = useState('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [userId, setUserId] = useState('');
  const [department, setDepartment] = useState('');

  const range = useMemo(() => {
    if (preset === 'custom') {
      const r = parseCustomRange(customStart, customEnd);
      return r || getPresetRange('30d');
    }
    return getPresetRange(preset);
  }, [preset, customStart, customEnd]);

  const prevRange = useMemo(() => getPreviousRange(range), [range]);

  return {
    preset, setPreset,
    customStart, setCustomStart,
    customEnd, setCustomEnd,
    userId, setUserId,
    department, setDepartment,
    range, prevRange,
    presets: PRESETS,
  };
}
