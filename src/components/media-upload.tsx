'use client';

import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fileToBase64 } from '@/lib/utils';
import { UploadCloud, X } from 'lucide-react';
import type { FormData } from '@/app/page';

interface MediaUploadProps {
  onNext: (data: Partial<FormData>) => void;
  formData: FormData;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onNext, formData }) => {
  const [physicalPhoto, setPhysicalPhoto] = useState<string | null>(formData.multimediaContext || null);
  const [labPhoto, setLabPhoto] = useState<string | null>(formData.medicalExamPhotos || null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await fileToBase64(file);
      setter(base64);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    onNext({
      multimediaContext: physicalPhoto || undefined,
      medicalExamPhotos: labPhoto || undefined,
    });
  };

  const renderUploadBox = (
    id: string,
    label: string,
    photo: string | null,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    onChange: (e: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => void
  ) => (
    <div className="w-full">
      <Label htmlFor={id} className="text-base font-semibold">{label}</Label>
      <div className="mt-2 flex justify-center items-center w-full h-64 rounded-lg border-2 border-dashed border-border bg-card relative overflow-hidden">
        {photo ? (
          <>
            <Image src={photo} alt={`${label} preview`} layout="fill" objectFit="contain" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => setter(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <label htmlFor={id} className="mt-4 text-sm text-primary underline cursor-pointer">
              Seleccionar archivo
            </label>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
            <Input id={id} type="file" className="sr-only" onChange={(e) => onChange(e, setter)} accept="image/*" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Carga de Archivos Multimedia</CardTitle>
        <CardDescription>
          Si es posible, adjunte imágenes de la condición del paciente o de los resultados de exámenes médicos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {renderUploadBox("physical-photo", "Foto de Evaluación Física", physicalPhoto, setPhysicalPhoto, handleFileChange)}
          {renderUploadBox("lab-photo", "Foto de Exámenes Médicos", labPhoto, setLabPhoto, handleFileChange)}
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleSubmit} disabled={isProcessing}>
            Omitir y continuar
          </Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? 'Procesando...' : 'Generar Diagnóstico'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaUpload;
