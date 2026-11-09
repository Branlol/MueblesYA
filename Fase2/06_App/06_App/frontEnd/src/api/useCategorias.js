import { useEffect, useState } from 'react';
import { api } from './api';

let cache = null;

export function useCategorias() {
  const [categorias, setCategorias] = useState(cache || []);
  useEffect(() => {
    if (cache) return;
    api('/categorias').then((c) => { cache = c; setCategorias(c); }).catch(() => {});
  }, []);
  return categorias;
}