import objectSearch from 'object-str-find';

type Key = {
  path: string;
  found: string[];
  value: string;
}
export type Keys = Array<Key>;

const filterResults = <T>(search: string, arr: Array<T>): Array<[Keys | null, T]> => {
  if (!search) return arr.map((d) => [null, d]);

  const filteredList = arr.filter((d) =>
    JSON.stringify(Object.values(d)).toLowerCase().includes(search.toLowerCase()),
  );

  if (!filteredList.length) return [];

  const listWithPaths: Array<[Keys | null, T]> = filteredList
    .map((d) => [objectSearch(d, search), d]);

  return listWithPaths.filter(([f]) => f ? !f.every((d) => d.path.includes('avatar') || d.path.includes('__typename')) : true)
};

export default filterResults;
