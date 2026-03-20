import React, { useState } from 'react'
import z, { ZodError } from 'zod'

export const useForm = <T>(schema: z.ZodSchema<T>, initialValues: T) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const handleChange = (key: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues({ ...values, [key]: e.target.value })
  }

  const validade = () => {
    try {
      schema.parse(values)
      setErrors({})
      return true
    } catch (e) {
      if (e instanceof ZodError) {
        const fieldErrors = e.issues.reduce((acc, error) => {
          acc[error.path[0] as keyof T] = error.message;
          return acc;
        }, {} as Partial<Record<keyof T, string>>);
        setErrors(fieldErrors);
      }
      return false;
    }
  }

  const handleSubmit = (onSubmit: (values: T) => void) => (e: React.FormEvent) => {
    e.preventDefault()
    if (validade()) {
      onSubmit(values)
    }
  }

  return {
    values,
    errors,
    handleChange,
    handleSubmit
  }
}