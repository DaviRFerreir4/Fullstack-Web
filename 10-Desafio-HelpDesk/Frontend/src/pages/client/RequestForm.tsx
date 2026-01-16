import { useState } from 'react'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { Textarea } from '../../components/form/Textarea'
import { services } from '../../data/services'
import { InfoField } from '../../components/InfoField'
import { Button } from '../../components/form/Button'

export function RequestForm() {
  const [title, setTitle] = useState('')
  const [serviceId, setServiceId] = useState('')

  return (
    <div className="lg:mx-35.5 grid gap-4 lg:gap-6 text-gray-200">
      <h1 className="text-lg lg:text-xl font-bold text-blue-dark">
        Novo chamado
      </h1>
      <form className="grid lg:items-start lg:grid-cols-[3fr_2fr] gap-4 lg:gap-6">
        <div className="p-5 lg:p-8 border border-gray-500 rounded-[0.625rem] grid gap-6">
          <div>
            <h2 className="font-bold ">Informações</h2>
            <p className="text-xs text-gray-300">
              Descreva as informações do seu problema
            </p>
          </div>
          <div className="grid gap-4">
            <Input
              label="Título"
              id="title"
              placeholder="Digite um título para o chamado"
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <Textarea
              label="Descrição"
              id="description"
              rows={6}
              placeholder="Descreva o que está acontecendo"
              required
            />
            <Select
              label="Categoria de serviço"
              id="service"
              options={services.map((service) => {
                return { text: service.title, value: service.id }
              })}
              placeholder="Selecione a categoria de atendimento"
              saveValue={(text: string) => setServiceId(text)}
              required
            />
          </div>
        </div>
        <div className="p-5 lg:p-6 border border-gray-500 rounded-[0.625rem] grid gap-6">
          <div>
            <h2 className="font-bold">Resumo</h2>
            <p className="text-xs text-gray-300">Valores e detalhes</p>
          </div>
          {serviceId !== '' && (
            <>
              <InfoField title="Categoria de serviço">
                <span className="text-sm">
                  {services.find((service) => service.id === serviceId)?.title}
                </span>
              </InfoField>
              <InfoField title="Custo inicial">
                <div className="font-bold">
                  <small className="text-xs mr-1">R$</small>
                  <span className="text-lg">
                    {services
                      .find((service) => service.id === serviceId)
                      ?.value.toLocaleString('pt-br', {
                        minimumFractionDigits: 2,
                      })}
                  </span>
                </div>
              </InfoField>
            </>
          )}
          <p className="text-xs text-gray-300">
            O chamado será automaticamente atribuído a um técnico disponível
          </p>
          <Button text="Criar chamado" />
        </div>
      </form>
    </div>
  )
}
