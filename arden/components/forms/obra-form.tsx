'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { obraFormSchema, type ObraFormData, tipologiaOptions } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
 *
 * Campos alinhados com tabela obras no banco de dados:
 * - nome (obrigatorio)
 * - codigo, tipologia, cidade, estado, responsavel_tecnico (opcionais)
 */
export function ObraForm({ defaultValues, onSubmit, isEditing = false }: ObraFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ObraFormData>({
    resolver: zodResolver(obraFormSchema),
    defaultValues: {
      nome: '',
      codigo: '',
      tipologia: undefined,
      cidade: '',
      estado: '',
      responsavel_tecnico: '',
      ...defaultValues,
    },
  })

  const tipologia = watch('tipologia')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nome da Obra */}
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Obra *</Label>
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

      {/* Tipologia */}
      <div className="space-y-2">
        <Label htmlFor="tipologia">
          Tipologia <span className="text-foreground-muted">(opcional)</span>
        </Label>
        <Select
          value={tipologia}
          onValueChange={(value) => setValue('tipologia', value as ObraFormData['tipologia'])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a tipologia" />
          </SelectTrigger>
          <SelectContent>
            {tipologiaOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cidade / Estado */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="cidade">
            Cidade <span className="text-foreground-muted">(opcional)</span>
          </Label>
          <Input
            id="cidade"
            {...register('cidade')}
            placeholder="Ex: Sao Paulo"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">UF</Label>
          <Input
            id="estado"
            {...register('estado')}
            maxLength={2}
            className={errors.estado ? 'border-destructive' : ''}
            placeholder="SP"
          />
          {errors.estado && (
            <p className="text-destructive text-xs">{errors.estado.message}</p>
          )}
        </div>
      </div>

      {/* Responsavel Tecnico */}
      <div className="space-y-2">
        <Label htmlFor="responsavel_tecnico">
          Responsavel Tecnico <span className="text-foreground-muted">(opcional)</span>
        </Label>
        <Input
          id="responsavel_tecnico"
          {...register('responsavel_tecnico')}
          className={errors.responsavel_tecnico ? 'border-destructive' : ''}
          placeholder="Ex: Eng. Maria Silva"
        />
        {errors.responsavel_tecnico && (
          <p className="text-destructive text-xs">{errors.responsavel_tecnico.message}</p>
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
