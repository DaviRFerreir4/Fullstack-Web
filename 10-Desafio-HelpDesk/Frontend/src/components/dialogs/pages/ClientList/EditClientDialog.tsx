// @ts-expect-error TS2307
import EditIcon from '../../../../assets/icons/pen-line.svg?react'
// @ts-expect-error TS2307
import RemoveIcon from '../../../../assets/icons/trash.svg?react'

import { useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { Input } from '../../../form/Input'
import { ProfilePicture } from '../../../ProfilePicture'
import type { Client } from '../../../table/Client'
import { Button } from '../../../form/Button'
import type { EditClientFormActionReturn } from '../../../../types/forms'

interface EditClientDialogProps {
  client: Client
  setClient: Dispatch<SetStateAction<Client | null>>
  state: EditClientFormActionReturn
}

export function EditClientDialog({ client, state }: EditClientDialogProps) {
  const fileInputRef = useRef<null | HTMLInputElement>(null)

  const [customUrl, setCustomUrl] = useState('')

  return (
    <div>
      <Input
        label=""
        type="file"
        ref={fileInputRef}
        name="image"
        onChange={(e) => {
          const file = e.target.files?.[0]

          if (file) {
            const fileBlob = new Blob([file], { type: file.type })

            const fileUrl = URL.createObjectURL(fileBlob)

            setCustomUrl(fileUrl)
          }
        }}
      />
      <div className="flex items-center gap-4">
        <div className="w-fit rounded-full overflow-hidden relative group">
          <ProfilePicture
            userId={client.id}
            username={client.name}
            size="xl"
            profilePicture={client.profilePicture}
            onClick={() => {
              fileInputRef.current?.click()
            }}
            customUrl={customUrl}
          />
          <div
            className=" text-gray-200/70 rounded-full bg-gray-400/70 flex items-center justify-center absolute top-0 left-0 w-full h-full opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => {
              fileInputRef.current?.click()
            }}
          >
            <EditIcon className="w-6 h-6" />
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          Icon={RemoveIcon}
          iconColor="text-feedback-danger"
          size="custom"
          className="w-6 h-6"
          onClick={() => {
            setCustomUrl('none')

            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(new File([], 'none', { type: 'text/plain' }))

            if (fileInputRef.current) {
              fileInputRef.current.files = dataTransfer.files
            }
          }}
        />
      </div>
      <div className="mt-5 grid gap-4">
        <Input
          label="Nome"
          id="name"
          name="name"
          placeholder="Nome completo"
          error={!!state?.fieldErrors?.name}
          helperText={
            state?.fieldErrors?.name ? state.fieldErrors.name[0] : undefined
          }
          defaultValue={
            state?.data?.name ? state?.data.name?.toString() : client.name
          }
          // onChange={(event) =>
          //   setClient({ ...client, name: event.target.value })
          // }
          required
        />
        <Input
          label="E-mail"
          id="email"
          name="email"
          type="email"
          error={!!state?.fieldErrors?.email}
          helperText={
            state?.fieldErrors?.email ? state.fieldErrors.email[0] : undefined
          }
          defaultValue={
            state?.data?.email ? state?.data.email?.toString() : client.email
          }
          placeholder="exemplo@mail.com"
          // onChange={(event) =>
          //   setClient({ ...client, email: event.target.value })
          // }
          required
        />
      </div>
    </div>
  )
}
