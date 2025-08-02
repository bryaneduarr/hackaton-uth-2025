'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { FormData } from '@/app/page';

interface VitalsFormProps {
  onNext: (data: Partial<FormData>) => void;
  formData: FormData;
}

const formSchema = z.object({
  bloodPressure: z.string().optional(),
  temperature: z.string().optional(),
  pulse: z.string().optional(),
  glucose: z.string().optional(),
  weight: z.string().optional(),
});

type VitalsFormData = z.infer<typeof formSchema>;

const VitalsForm: React.FC<VitalsFormProps> = ({ onNext, formData }) => {
  const form = useForm<VitalsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodPressure: formData.vitals?.bloodPressure || '',
      temperature: formData.vitals?.temperature || '',
      pulse: formData.vitals?.pulse || '',
      glucose: formData.vitals?.glucose || '',
      weight: formData.vitals?.weight || '',
    },
  });

  function onSubmit(values: VitalsFormData) {
    onNext({ vitals: values });
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Información Preclínica</CardTitle>
        <CardDescription>
          Ingrese los signos vitales del paciente. Puede omitir este paso si no tiene los instrumentos.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bloodPressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presión Arterial (ej. 120/80)</FormLabel>
                    <FormControl>
                      <Input placeholder="Tensiómetro digital" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperatura (ej. 37°C)</FormLabel>
                    <FormControl>
                      <Input placeholder="Termómetro infrarrojo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pulse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oxímetro de pulso (ej. 98%)</FormLabel>
                    <FormControl>
                      <Input placeholder="Oxímetro de pulso" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="glucose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Glucosa (ej. 90 mg/dL)</FormLabel>
                    <FormControl>
                      <Input placeholder="Glucómetro + tiras" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (ej. 70 kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="Báscula digital" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
             <Button type="button" variant="outline" onClick={() => onNext({})}>
                Omitir y continuar
              </Button>
            <Button type="submit">
              Continuar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default VitalsForm;
