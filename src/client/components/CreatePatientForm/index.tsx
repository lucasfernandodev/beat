import S from './style.module.css';
import { createPatientSchema } from "../../infra/schemas/create-patient";
import { useForm } from "../../hooks/useForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Dialog, Trigger, Portal, Close, Overlay, Content, Title, Description } from "@radix-ui/react-dialog"
import { IconPlus, IconX } from '@tabler/icons-react';

export const CreatePatientForm = () => {

  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false);
  const initialValues = { name: '', username: '', databaseId: '' };
  const { values, errors, handleChange, handleSubmit } = useForm(createPatientSchema, initialValues);
  const [globalError, setGlobalError] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: (data: typeof initialValues) => fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    onSuccess: async (data) => {
      if (data.status === 201) {
        setOpen(false)
        queryClient.invalidateQueries({ queryKey: ['get-all-patients'] })
      } else {
        const res = await data.json()
        if ('error' in res && 'message' in res.error) {
          setGlobalError(res.error.message)
        }
      }
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <div className={S.button_create_user} role="button">
          <div className={S.icon}><IconPlus /></div>
          <span>Add Usuário</span>
        </div>
      </Trigger>
      <Portal>
        <Overlay className={S.m_overlay}>
          <Content className={S.m_content}>
            <Title className={S.m_title}>Criar usuário</Title>
            <Description className={S.m_description}>Crie um novo usuário para começar a monitorar sua pressão</Description>
            <form onSubmit={handleSubmit(mutate)}>

              <fieldset className={S.group}>
                <label htmlFor="name">Seu nome</label>
                <input data-invalid={!!errors?.name} onChange={handleChange("name")} value={values.name} id="name" name="name" type="text" className={S.input} placeholder="Seu nome" />
                <p className={S.error_message}>{errors?.name}</p>
              </fieldset>

              <fieldset className={S.group}>
                <label htmlFor="username">Username</label>
                <input data-invalid={!!errors?.username} onChange={handleChange("username")} value={values.username} id="username" name="username" type="text" className={S.input} placeholder="@username" />
                <p className={S.error_message}>{errors?.username}</p>
              </fieldset>

              <fieldset className={S.group}>
                <label htmlFor="databaseId">DatabaseId (Notion)</label>
                <input data-invalid={!!errors?.databaseId} onChange={handleChange("databaseId")} value={values.databaseId} id="databaseId" name="databaseId" type="text" className={S.input} placeholder="Tabela para sincronização" />
                <p className={S.error_message}>{errors?.databaseId}</p>
              </fieldset>

              <div className={S.global_error}>
                <p className={S.error_message}>{globalError}</p>
              </div>

              <div className={S.container_button} data-processing={isPending}>
                <button type="submit">Criar</button>
              </div>
            </form>

            <Close asChild>
              <button className={S.m_button_close} aria-label="Close">
                <IconX />
              </button>
            </Close>
          </Content>
        </Overlay>
      </Portal>
    </Dialog>
  )
}