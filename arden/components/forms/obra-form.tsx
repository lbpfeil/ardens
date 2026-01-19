'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { obraSchema, type ObraFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ObraFormProps {
  defaultValues?: Partial<ObraFormData>
  onSubmit: (data: ObraFormData) => Promise<void>
  isEditing?: boolean
}

/**
 * Formulario de obra demonstrando o padrao de validacao com React Hook Form + Zod.
 *
 * Este componente serve como EXEMPLO do padrao a ser usado em todos os formularios.
 * Caracteristicas:
 * - Validacao automatica via schema Zod
 * - Erros inline abaixo de cada campo
 * - Tipos TypeScript inferidos do schema
 * - defaultValues para todos os campos (previne warnings controlled/uncontrolled)
 */
export function ObraForm({ defaultValues, onSubmit, isEditing = false }: ObraFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ObraFormData>({
    resolver: zodResolver(obraSchema),
    defaultValues: {
      nome: '',
      codigo: '',
      endereco: '',
      dataInicio: '',
      responsavel: '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nome da Obra */}
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Obra</Label>
        <Input
          id="nome"
          {...register('nome')}
          className={errors.nome ? 'border-destructive' : ''}
          placeholder="Ex: Residencial Aurora"
        />
        {errors.nome && (
          <p className="text-destructive text-xs">{errors.nome.message}</p>
        )}
      </div>

      {/* Codigo (opcional) */}
      <div className="space-y-2">
        <Label htmlFor="codigo">
          Codigo <span className="text-foreground-muted">(opcional)</span>
        </Label>
        <Input
          id="codigo"
          {...register('codigo')}
          className={errors.codigo ? 'border-destructive' : ''}
          placeholder="Ex: OBR-001"
        />
        {errors.codigo && (
          <p className="text-destructive text-xs">{errors.codigo.message}</p>
        )}
      </div>

      {/* Endereco */}
      <div className="space-y-2">
        <Label htmlFor="endereco">Endereco</Label>
        <Input
          id="endereco"
          {...register('endereco')}
          className={errors.endereco ? 'border-destructive' : ''}
          placeholder="Ex: Rua das Flores, 123 - Centro"
        />
        {errors.endereco && (
          <p className="text-destructive text-xs">{errors.endereco.message}</p>
        )}
      </div>

      {/* Data de Inicio */}
      <div className="space-y-2">
        <Label htmlFor="dataInicio">Data de Inicio</Label>
        <Input
          id="dataInicio"
          type="date"
          {...register('dataInicio')}
          className={errors.dataInicio ? 'border-destructive' : ''}
        />
        {errors.dataInicio && (
          <p className="text-destructive text-xs">{errors.dataInicio.message}</p>
        )}
      </div>

      {/* Responsavel */}
      <div className="space-y-2">
        <Label htmlFor="responsavel">Responsavel</Label>
        <Input
          id="responsavel"
          {...register('responsavel')}
          className={errors.responsavel ? 'border-destructive' : ''}
          placeholder="Ex: Eng. Maria Silva"
        />
        {errors.responsavel && (
          <p className="text-destructive text-xs">{errors.responsavel.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? 'Salvando...'
          : isEditing
            ? 'Salvar Alteracoes'
            : 'Criar Obra'}
      </Button>
    </form>
  )
}
