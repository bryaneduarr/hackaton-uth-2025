'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { FormData } from '@/app/page';

interface SymptomFormProps {
  onNext: (data: Partial<FormData>) => void;
  formData: FormData;
}

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Por favor, describa los síntomas con al menos 10 caracteres.',
  }),
});

const SymptomForm: React.FC<SymptomFormProps> = ({ onNext, formData }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: formData.symptoms || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onNext({ symptoms: values.symptoms });
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Bienvenido a Salud Móvil</CardTitle>
        <CardDescription>
          Para comenzar, por favor describa los síntomas que presenta el paciente.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Buenas tardes, ¿Cuáles son los síntomas que presenta?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: El paciente tiene fiebre alta, tos seca y dolor de cabeza desde hace tres días..."
                      className="min-h-[150px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" size="lg">
              Continuar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SymptomForm;
