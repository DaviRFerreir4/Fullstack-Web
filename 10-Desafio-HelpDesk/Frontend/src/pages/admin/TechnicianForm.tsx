// @ts-expect-error TS2307
import BackIcon from '../../assets/icons/arrow-left.svg?react'

import { Button } from '../../components/form/Button'
import { ProfilePicture } from '../../components/ProfilePicture'
import { Input } from '../../components/form/Input'
import { TimeTag } from '../../components/TimeTag'
import { useNavigate, useParams } from 'react-router'
import { users } from '../../data/users'
import { useState } from 'react'
import { type ITechnician } from '../../components/table/Technician'

export function TechnicianForm() {
  const navigate = useNavigate()
  const params = useParams()

  const editionAvailable = !!params.id

  const user = users.find((user) => user.id === params.id)

  const [technicianData, setTechnicianData] = useState<
    ITechnician & { password: string }
  >({
    id: user?.id ?? '',
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    openingHours: user?.openingHours ?? [],
    profilePicture: user?.profilePicture,
  })

  const periods = [
    { name: 'Manhã', availableHours: [7, 8, 9, 10, 11, 12] },
    { name: 'Tarde', availableHours: [13, 14, 15, 16, 17, 18] },
    { name: 'Noite', availableHours: [19, 20, 21, 22, 23] },
  ]

  return (
    <form className="lg:mx-35.5 grid gap-4 lg:gap-6 text-gray-200">
      <div className="grid lg:flex lg:justify-between lg:items-end gap-3">
        <div className="grid gap-1">
          <div
            className="w-fit border-b border-transparent flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-gray-200 hover:border-gray-200 transition cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <BackIcon className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </div>
          <h1 className="text-lg lg:text-xl font-bold text-blue-dark line-clamp-1 wrap-anywhere">
            Perfil de técnico
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            text="Cancelar"
            variant="secondary"
            onClick={() => navigate(-1)}
          />
          <Button text="Salvar" />
        </div>
      </div>
      <div className="contents lg:flex lg:items-start lg:gap-6">
        <div className="p-5 border border-gray-500 rounded-[0.625rem] grid gap-5 lg:gap-6 lg:flex-3">
          <div>
            <h2 className="text-gray-200 font-bold">Dados pessoais</h2>
            <p className="text-xs text-gray-300">
              Defina as informações do perfil de técnico
            </p>
          </div>
          {editionAvailable && (
            <div>
              <ProfilePicture
                username={technicianData.name}
                profilePicture={technicianData.profilePicture}
                size="xl"
              />
            </div>
          )}
          <div className="grid gap-4">
            <Input
              label="Nome"
              id="name"
              type="text"
              placeholder="Nome completo"
              value={editionAvailable ? technicianData.name : undefined}
              onChange={(event) =>
                setTechnicianData({
                  ...technicianData,
                  name: event.target.value,
                })
              }
              required
            />
            <Input
              label="E-mail"
              id="email"
              type="email"
              placeholder="exemplo@mail.com"
              value={editionAvailable ? technicianData.email : undefined}
              onChange={(event) =>
                setTechnicianData({
                  ...technicianData,
                  email: event.target.value,
                })
              }
              required
            />
            {!editionAvailable && (
              <Input
                label="Senha"
                id="password"
                type="password"
                placeholder="Defina a senha de acesso"
                helperText="Mínimo de 8 dígitos"
                onChange={(event) =>
                  setTechnicianData({
                    ...technicianData,
                    password: event.target.value,
                  })
                }
                required
              />
            )}
          </div>
        </div>
        <div className="p-5 border border-gray-500 rounded-[0.625rem] grid gap-5 lg:gap-6 lg:flex-5">
          <div>
            <h2 className="text-gray-200 font-bold">Horários de atendimento</h2>
            <p className="text-xs text-gray-300">
              Selecione os horários de disponibilidade do técnico para
              atendimento
            </p>
          </div>
          <div className="grid gap-4 lg:gap-5">
            {periods.map((period) => (
              <div className="grid gap-2" key={period.name}>
                <h3 className="text-xxs text-gray-300 font-bold uppercase">
                  {period.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {period.availableHours.map((hour) => (
                    <TimeTag
                      hour={hour}
                      key={hour}
                      checked={technicianData.openingHours?.includes(hour)}
                      onChange={(event) =>
                        setTechnicianData({
                          ...technicianData,
                          openingHours: technicianData.openingHours?.includes(
                            Number(event.target.value)
                          )
                            ? technicianData.openingHours.filter(
                                (hour) => hour !== Number(event.target.value)
                              )
                            : technicianData.openingHours
                              ? [...technicianData.openingHours, hour]
                              : [hour],
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  )
}
