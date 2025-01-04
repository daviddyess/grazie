/**
 * Grazie
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
function format(input: string | null, type: string) {
  switch (type) {
    case 'number':
      return input ? Number(input) : undefined;
    case 'number & greaterThan 0':
      return input && Number(input) > 0 ? Number(input) : 1;
    case 'boolean':
      return input ? Boolean(input) : undefined;
    case 'string':
    default:
      return input as string;
  }
}

export function searchParams(
  request: { url: string | URL },
  params: { [x: string]: string }
) {
  const url = new URL(request.url);
  const keys = {} as { [x: string]: any };
  for (const param of Object.keys(params)) {
    keys[param] = format(url.searchParams.get(param), params[param]);
  }
  return keys;
}

export function pagerParams(request: Request, defaultCount = 25) {
  const params = searchParams(request, {
    page: 'number & greaterThan 0',
    count: 'number',
    search: 'string'
  });

  return {
    page: params?.page,
    count: params?.count ?? defaultCount,
    pagerLoader: (totalCount: number) => ({
      page: params?.page,
      count:
        params?.count && params?.count !== defaultCount
          ? params.count
          : defaultCount,
      total: Math.ceil(totalCount / (params?.count ?? defaultCount))
    })
  };
}
