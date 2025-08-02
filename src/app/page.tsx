'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/header';
import SymptomForm from '@/components/symptom-form';
import VitalsForm from '@/components/vitals-form';
import Questionnaire from '@/components/questionnaire';
import MediaUpload from '@/components/media-upload';
import Summary from '@/components/summary';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export type FormData = {
  symptoms?: string;
  vitals?: {
    bloodPressure?: string;
    temperature?: string;
    pulse?: string;
    glucose?: string;
    weight?: string;
  };
  questionnaire?: { question: string; answer: string }[];
  multimediaContext?: string;
  medicalExamPhotos?: string;
};

type Step = 'symptoms' | 'vitals' | 'questionnaire' | 'media' | 'summary';

const OFFLINE_DATA_KEY = 'healthsnap-offline-data';

export default function Home() {
  const [step, setStep] = useState<Step>('symptoms');
  const [formData, setFormData] = useState<FormData>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(OFFLINE_DATA_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          setStep('summary');
        } catch (error) {
          console.error('Failed to parse saved data:', error);
          localStorage.removeItem(OFFLINE_DATA_KEY);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  const handleNext = useCallback((data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prevStep) => {
      const steps: Step[] = ['symptoms', 'questionnaire', 'vitals', 'media', 'summary'];
      const currentIndex = steps.indexOf(prevStep);
      return steps[currentIndex + 1] || 'summary';
    });
  }, []);

  const handleBack = useCallback(() => {
    setStep((prevStep) => {
      const steps: Step[] = ['symptoms', 'questionnaire', 'vitals', 'media', 'summary'];
      const currentIndex = steps.indexOf(prevStep);
      return steps[currentIndex - 1] || 'symptoms';
    });
  }, []);
  
  const restart = useCallback(() => {
    setFormData({});
    setStep('symptoms');
    localStorage.removeItem(OFFLINE_DATA_KEY);
  }, []);

  const renderStep = () => {
    switch (step) {
      case 'symptoms':
        return <SymptomForm onNext={handleNext} formData={formData} />;
      case 'questionnaire':
        return <Questionnaire onNext={handleNext} formData={formData} />;
      case 'vitals':
        return <VitalsForm onNext={handleNext} formData={formData} />;
      case 'media':
        return <MediaUpload onNext={handleNext} formData={formData} />;
      case 'summary':
        return <Summary formData={formData} onRestart={restart} />;
      default:
        return <SymptomForm onNext={handleNext} formData={formData} />;
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-xl font-semibold">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isOnline={isOnline} />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {step !== 'symptoms' && (
             <Button variant="ghost" onClick={handleBack} className="mb-4">
               <ArrowLeft className="mr-2 h-4 w-4" /> Volver
             </Button>
          )}
          {renderStep()}
        </div>
      </main>
    </div>
  );
}
