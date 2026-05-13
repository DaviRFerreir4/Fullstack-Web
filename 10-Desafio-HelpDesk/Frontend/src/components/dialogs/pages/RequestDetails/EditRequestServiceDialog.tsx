import { useMemo, type Dispatch, type SetStateAction } from 'react'
import { Autocomplete } from '../../../form/Autocomplete'
import { CheckboxSlider } from '../../../form/CheckboxSlider'
import { Input } from '../../../form/Input'
import { Select } from '../../../form/Select'
import type { Service } from '../../../../dtos/services'
import type { AddServiceFormErrors } from '../../../../types/forms'

interface EditRequestServiceDialogProps {
  useNewService?: boolean
  useSelect?: boolean
  isNewService?: boolean
  setIsNewService?: Dispatch<SetStateAction<boolean>>
  formAddState?: {
    data?: {
      title: FormDataEntryValue | null
      value: FormDataEntryValue | null
      service: FormDataEntryValue | null
      serviceName: FormDataEntryValue | null
    }
    fieldErrors?: AddServiceFormErrors
    formErrors?: string[]
  } | null
  clearFields: () => void
  services: Service[] | null
  serviceId?: string
  setServiceId?: Dispatch<SetStateAction<string>>
  serviceName: string
  setServiceName: Dispatch<SetStateAction<string>>
  fetchServices: (title?: string | undefined) => Promise<void>
  serviceValue: string
}

export function EditRequestServiceDialog({
  useNewService,
  useSelect,
  isNewService,
  setIsNewService,
  formAddState,
  clearFields,
  services,
  serviceId,
  setServiceId,
  serviceName,
  setServiceName,
  fetchServices,
  serviceValue,
}: EditRequestServiceDialogProps) {
  const autocompleteItems = useMemo(
    () =>
      services?.map((service) => ({
        title: service.title,
        value: service.id,
      })) ?? [{ title: 'Nenhum item encontrado', value: '' }],
    [services]
  )

  return (
    <div className="grid gap-4">
      {useNewService && isNewService && setIsNewService && (
        <CheckboxSlider
          text="Serviço novo"
          defaultChecked={isNewService}
          onChange={(event) => {
            setIsNewService(event.target.checked)
            delete formAddState?.data
            delete formAddState?.fieldErrors
            delete formAddState?.formErrors
            clearFields()
          }}
        />
      )}
      {isNewService && formAddState ? (
        <div className="grid gap-4">
          <Input
            label="Título"
            name="title"
            id="title"
            placeholder="Nome do serviço"
            error={!!formAddState?.fieldErrors?.title}
            helperText={
              formAddState?.fieldErrors?.title
                ? formAddState?.fieldErrors?.title[0]
                : undefined
            }
            defaultValue={
              formAddState?.data?.title
                ? formAddState?.data.title?.toString()
                : ''
            }
            required
          />
          <Input
            key="key-new"
            label="Valor"
            name="value"
            id="value"
            type="number"
            currency
            placeholder="0,00"
            error={!!formAddState?.fieldErrors?.value}
            helperText={
              formAddState?.fieldErrors?.value
                ? formAddState?.fieldErrors?.value[0]
                : undefined
            }
            defaultValue={
              formAddState?.data?.value
                ? formAddState?.data.value?.toString()
                : ''
            }
            required
          />
        </div>
      ) : useSelect && serviceId && setServiceId ? (
        <div className="grid gap-4">
          <Select
            label="Serviço"
            name="service"
            placeholder="Indique o serviço a ser adicionado"
            options={
              services
                ?.filter((service) => service.isActive)
                .map((service) => {
                  return { text: service.title, value: service.id }
                }) ?? []
            }
            defaultValue={serviceId}
            selectValue={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
            required
          />
        </div>
      ) : (
        <div className="grid gap-4">
          <Autocomplete
            label="Serviços"
            placeholder="Pesquise o serviço"
            items={autocompleteItems}
            selectedItem={serviceName}
            setSelectedItem={setServiceName}
            name="serviceName"
            id="serviceName"
            autoComplete="off"
            required
            updateItems={fetchServices}
          />
          <Input
            key="key-existing"
            label="Valor"
            type="number"
            currency
            placeholder="0,00"
            required
            disabled
            value={serviceValue}
          />
        </div>
      )}
    </div>
  )
}
