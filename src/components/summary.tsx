'use client';

import React, { useState, useEffect } from 'react';
import { generateDiagnosisRecommendation, GenerateDiagnosisRecommendationOutput } from '@/ai/flows/generate-diagnosis-recommendation';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WifiOff, Lightbulb, Stethoscope, Pill, Microscope, Mail } from 'lucide-react';
import type { FormData } from '@/app/page';

interface SummaryProps {
  formData: FormData;
  onRestart: () => void;
}

const OFFLINE_DATA_KEY = 'healthsnap-offline-data';

const Summary: React.FC<SummaryProps> = ({ formData, onRestart }) => {
  const [result, setResult] = useState<GenerateDiagnosisRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isOnline = useOnlineStatus();
  
  useEffect(() => {
    const getDiagnosis = async () => {
      if (!isOnline) {
        localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(formData));
        setIsLoading(false);
        return;
      }

      if (!formData.symptoms) {
        setError("No hay datos de síntomas para generar un diagnóstico.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      localStorage.removeItem(OFFLINE_DATA_KEY);

      try {
        const questionnaireString = (formData.questionnaire || [])
          .map(qa => `P: ${qa.question}\nR: ${qa.answer}`)
          .join('\n');
          
        const vitalsString = formData.vitals
          ? Object.entries(formData.vitals)
              .filter(([, value]) => value)
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n')
          : undefined;

        const res = await generateDiagnosisRecommendation({
          symptomsDescription: formData.symptoms,
          vitalSigns: vitalsString,
          questionnaireResponses: questionnaireString,
          multimediaContext: formData.multimediaContext,
          medicalExamPhotos: formData.medicalExamPhotos,
        });
        setResult(res);
      } catch (err) {
        console.error('Error generating diagnosis:', err);
        setError('Ocurrió un error al generar el diagnóstico. Por favor, inténtelo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    getDiagnosis();
  }, [isOnline, formData]);

  const generateMarkdown = () => {
    if (!result) return '';
    
    // Use %0A for newlines in mailto links
    const nl = '%0A';
    
    const formatList = (text: string) => {
        return text.replace(/(\n-|\* )/g, `${nl}- `).replace(/(\n• )/g, `${nl}• `);
    };

    return `Salud Móvil - Resumen y Recomendaciones${nl}${nl}` +
           `Aviso: Este es un resumen generado por IA y no sustituye el consejo médico profesional.${nl}${nl}` +
           `------------------------------------${nl}${nl}` +
           `Resumen del Caso${nl}` +
           `${result.summary}${nl}${nl}` +
           `Diagnósticos Potenciales${nl}` +
           `${formatList(result.potentialDiagnoses)}${nl}${nl}` +
           `Medicamentos Recomendados${nl}` +
           `${formatList(result.recommendedMedications)}${nl}${nl}` +
           `Procedimientos Sugeridos${nl}` +
           `${formatList(result.recommendedProcedures)}`;
  };

  const handleSendEmail = () => {
    const emailBody = encodeURIComponent(generateMarkdown());
    const emailTo = 'befrba@gmail.com';
    const emailSubject = encodeURIComponent('Diagnóstico y Recomendaciones - Salud Móvil');
    const mailtoLink = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoLink;
  };

  const renderBulletPoints = (text: string) => {
    return (
      <ul className="list-disc list-inside space-y-1">
        {text.split(/\n-|\* /).filter(item => item.trim()).map((item, index) => (
          <li key={index}>{item.trim()}</li>
        ))}
      </ul>
    );
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!isOnline) {
    return (
      <Alert variant="destructive">
        <WifiOff className="h-4 w-4" />
        <AlertTitle>Sin Conexión a Internet</AlertTitle>
        <AlertDescription>
          No se puede generar el diagnóstico. La información ha sido guardada localmente y se procesará automáticamente cuando se restablezca la conexión a internet y recargue la aplicación.
        </AlertDescription>
        <div className="mt-4">
            <Button onClick={onRestart}>Iniciar Nuevo Reporte</Button>
        </div>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
         <div className="mt-4">
            <Button onClick={onRestart}>Iniciar Nuevo Reporte</Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Resumen y Recomendaciones</CardTitle>
          <CardDescription>
            Este es un resumen generado por IA basado en la información proporcionada. <strong>No sustituye el consejo médico profesional.</strong>
          </CardDescription>
        </CardHeader>
      </Card>

      {result && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
               <Lightbulb className="h-6 w-6 text-primary" />
               <CardTitle>Resumen del Caso</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.summary}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
               <Stethoscope className="h-6 w-6 text-primary" />
               <CardTitle>Diagnósticos Potenciales</CardTitle>
            </CardHeader>
            <CardContent>
              {renderBulletPoints(result.potentialDiagnoses)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
               <Pill className="h-6 w-6 text-primary" />
               <CardTitle>Medicamentos Recomendados</CardTitle>
            </CardHeader>
            <CardContent>
              {renderBulletPoints(result.recommendedMedications)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
               <Microscope className="h-6 w-6 text-primary" />
               <CardTitle>Procedimientos Sugeridos</CardTitle>
            </CardHeader>
            <CardContent>
              {renderBulletPoints(result.recommendedProcedures)}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-center mt-8 gap-4">
        <Button onClick={onRestart} size="lg">
          Iniciar Nuevo Reporte
        </Button>
        <Button onClick={handleSendEmail} size="lg" variant="outline" disabled={!result}>
          <Mail className="mr-2 h-5 w-5" />
          Abrir en Cliente de Correo
        </Button>
      </div>
    </div>
  );
};

export default Summary;
