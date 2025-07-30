// utils/filterPastData.ts

/**
 * Filters out future records from analytics data arrays.
 * Works with date strings in formats: YYYY-MM-DD, YYYY-MM, or YYYY.
 */

export function filterPastData<T extends { date?: string }>(data: T[]): T[] {
  const today = new Date();

  return data.filter((item) => {
    if (!item.date) return false;

    // YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
      return new Date(item.date) <= today;
    }
    // YYYY-MM format
    if (/^\d{4}-\d{2}$/.test(item.date)) {
      return new Date(item.date + "-01") <= today;
    }
    // YYYY format
    if (/^\d{4}$/.test(item.date)) {
      return Number(item.date) <= today.getFullYear();
    }

    return true;
  });
}

/**
 * Filters parallel arrays of numbers and labels, removing future labels.
 */
export function filterChartData(
  data: number[],
  labels?: string[]
): { filteredData: number[]; filteredLabels?: string[] } {
  if (!labels) return { filteredData: data, filteredLabels: labels };

  const today = new Date();
  const filteredData: number[] = [];
  const filteredLabels: string[] = [];

  labels.forEach((label, i) => {
    let isPast = true;

    if (/^\d{4}-\d{2}-\d{2}$/.test(label)) {
      isPast = new Date(label) <= today;
    } else if (/^\d{4}-\d{2}$/.test(label)) {
      isPast = new Date(label + "-01") <= today;
    } else if (/^\d{4}$/.test(label)) {
      isPast = Number(label) <= today.getFullYear();
    }

    if (isPast) {
      filteredData.push(data[i]);
      filteredLabels.push(label);
    }
  });

  return { filteredData, filteredLabels };
}
