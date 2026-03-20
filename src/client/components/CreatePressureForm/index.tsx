import S from './style.module.css';
import { useForm } from "../../hooks/useForm";
import { useMutation } from "@tanstack/react-query";
import { useState, type FC } from "react";

import { Dialog, Trigger, Portal, Close, Overlay, Content, Title, Description } from "@radix-ui/react-dialog"
import { IconPlus, IconX } from '@tabler/icons-react';
import { createPressureSchema, type PressureFormValues } from '../../infra/schemas/create-pressure';
import { formatDateTimeLocal } from '../../utils/format-date';

interface CreatePressureFormProps {
  username: string
};

export const CreatePressureForm: FC<CreatePressureFormProps> = ({
  username
}) => {
  console.log(username)
  const [open, setOpen] = useState(false);
  const initialValues = { measuredAt: formatDateTimeLocal(new Date()), annotation: '', systolic: 0, diastolic: 0, heartRate: 0 };
  const { values, errors, handleChange, handleSubmit } = useForm(createPressureSchema, initialValues);
  const [globalError, setGlobalError] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PressureFormValues) => fetch('/api/pressures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        pressure: {
          ...data,
          measuredAt: new Date(data.measuredAt)
        }
      }),
    }),
    onSuccess: async (data) => {
      if (data.status === 201) {
        setOpen(false)
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
        <button className={S.add_pressure}>
          <IconPlus />
          <span>Adicionar medição</span>
        </button>
      </Trigger>
      <Portal>
        <Overlay className={S.m_overlay}>
          <Content className={S.m_content}>
            <Title className={S.m_title}>Adicionar Nova medição</Title>
            <Description className={S.m_description}>
              Registre sua medição de pressão
            </Description>
            <form onSubmit={handleSubmit(mutate)}>

              <fieldset className={S.group}>
                <fieldset className={S.group}>
                  <label htmlFor="systolic">Sistólica</label>
                  <input
                    data-invalid={!!errors?.systolic}
                    onChange={handleChange("systolic")}
                    value={values?.systolic === 0 ? '' : values?.systolic}
                    id="systolic"
                    name="systolic"
                    type="text"
                    className={S.input}
                    placeholder="mmhg"
                  />
                  <p className={S.error_message}>{errors?.systolic}</p>
                </fieldset>
                <fieldset className={S.group}>
                  <label htmlFor="diastolic">Diastólica</label>
                  <input
                    data-invalid={!!errors?.diastolic}
                    onChange={handleChange("diastolic")}
                    value={values?.diastolic === 0 ? '' : values?.diastolic}
                    id="diastolic"
                    name="diastolic"
                    type="text"
                    className={S.input}
                    placeholder="mmhg"
                  />
                  <p className={S.error_message}>{errors?.diastolic}</p>
                </fieldset>
              </fieldset>

              <fieldset className={S.group}>
                <label htmlFor="heartRate">Coração</label>
                <input
                  data-invalid={!!errors?.heartRate}
                  onChange={handleChange("heartRate")}
                  value={values?.heartRate === 0 ? '' : values?.heartRate}
                  id="heartRate"
                  name="heartRate"
                  type="text"
                  className={S.input}
                  placeholder="bpm"
                />
                <p className={S.error_message}>{errors?.heartRate}</p>
              </fieldset>

              <fieldset className={S.group}>
                <label htmlFor="measuredAt">Hora</label>
                <input
                  data-invalid={!!errors?.measuredAt}
                  onChange={handleChange("measuredAt")}
                  value={values?.measuredAt}
                  id="measuredAt"
                  name="measuredAt"
                  type="datetime-local"
                  className={S.input}
                  placeholder="Tabela para sincronização"
                />
                <p className={S.error_message}>{errors?.measuredAt}</p>
              </fieldset>

              <fieldset className={S.group}>
                <label htmlFor="annotation">Anotação</label>
                <textarea
                  data-invalid={!!errors?.annotation}
                  onChange={handleChange("annotation")}
                  value={values.annotation}
                  id="annotation"
                  name="annotation"
                  className={S.textarea}
                  placeholder="Anotações sobre a situação da medição"
                ></textarea>
                <p className={S.error_message}>{errors?.annotation}</p>
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