export type Primitive = string | number | boolean | null | undefined | Date;

export type QueryValue = Primitive | Primitive[] | QueryParams;

export interface QueryParams {
  [key: string]: QueryValue;
}

const encode = (value: Primitive): string => {
  if (value instanceof Date) {
    return encodeURIComponent(value.toISOString());
  }

  if (value === null || value === undefined) {
    return "";
  }

  return encodeURIComponent(String(value));
};

const flatten = (params: QueryParams, prefix = ""): [string, Primitive][] => {
  const pairs: [string, Primitive][] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null) {
          return;
        }

        if (typeof item === "object" && !(item instanceof Date)) {
          pairs.push(...flatten(item as QueryParams, nextKey));
        } else {
          pairs.push([nextKey, item as Primitive]);
        }
      });
      return;
    }

    if (typeof value === "object" && !(value instanceof Date)) {
      pairs.push(...flatten(value as QueryParams, nextKey));
      return;
    }

    pairs.push([nextKey, value as Primitive]);
  });

  return pairs;
};

export const buildQueryString = (params?: QueryParams): string => {
  if (!params) {
    return "";
  }

  const pairs = flatten(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encode(value)}`)
    .join("&");

  return pairs ? `?${pairs}` : "";
};
