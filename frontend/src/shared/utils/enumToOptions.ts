export function enumToOptions<T extends Record<string, string>>(enumObj: T): { value: string; label: string }[] {
    return Object.entries(enumObj).map(([key, value]) => ({
      value: key.toLowerCase(),
      label: value,
    }));
  }
  