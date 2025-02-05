import { FormEvent, useState, useTransition } from 'react'

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
  initialState?: FormState,
) {
  const [formState, setFormState] = useState<FormState>(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    },
  )

  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const result = await action(data)
      setFormState(result)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
