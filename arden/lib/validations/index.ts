// Re-export de schemas base
export {
  requiredString,
  optionalString,
  dateString,
  uuidString,
} from './common'

// Re-export de schemas de dominio
export {
  obraSchema,
  obraFormSchema,
  tipologiaOptions,
  type ObraFormData,
  type TipologiaObra,
} from './obra'

export {
  servicoFormSchema,
  categoriaServicoOptions,
  type ServicoFormData,
  type CategoriaServicoOption,
} from './servico'

export {
  itemServicoFormSchema,
  type ItemServicoFormData,
} from './item-servico'
