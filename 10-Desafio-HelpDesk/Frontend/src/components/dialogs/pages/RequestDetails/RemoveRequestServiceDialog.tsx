interface RemoveRequestServiceDialogProps {
  serviceName?: string
  requestId?: number
}

export function RemoveRequestServiceDialog({
  serviceName,
  requestId,
}: RemoveRequestServiceDialogProps) {
  return (
    <div className="grid gap-5">
      <p>
        Deseja realmente remover o serviço <strong>{serviceName}</strong> do
        chamado de nº {requestId}?
      </p>

      <p>
        Ao remove-lo, ele deixará de ser considerado no cálculo de valor total
        do chamado.
      </p>
    </div>
  )
}
