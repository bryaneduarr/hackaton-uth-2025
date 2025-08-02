'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { aiDrivenQuestionnaire } from '@/ai/flows/ai-driven-questionnaire';
import { getOfflineQuestions } from '@/lib/offline-templates';
import { useToast } from '@/hooks/use-toast';
import type { FormData } from '@/app/page';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface QuestionnaireProps {
  onNext: (data: Partial<FormData>) => void;
  formData: FormData;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onNext, formData }) => {
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<{ question: string; answer: string }[]>(formData.questionnaire || []);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  const [offlineQuestions, setOfflineQuestions] = useState<string[]>([]);
  const [currentOfflineIndex, setCurrentOfflineIndex] = useState(0);

  const fetchNextQuestion = useCallback(async () => {
    setIsLoading(true);
    if (isOnline) {
      try {
        const res = await aiDrivenQuestionnaire({
          initialSymptoms: formData.symptoms || '',
          previousQuestionsAndAnswers: questionsAndAnswers,
        });
        if (res.complete || !res.question) {
          setIsCompleted(true);
        } else {
          setCurrentQuestion(res.question);
        }
      } catch (error) {
        console.error('Error fetching AI question:', error);
        toast({
          title: 'Error de Red',
          description: 'No se pudo conectar con el asistente de IA. Pasando a modo sin conexión.',
          variant: 'destructive',
        });
        // Fallback to offline mode
        const offlineQs = getOfflineQuestions(formData.symptoms || '');
        setOfflineQuestions(offlineQs);
        setCurrentQuestion(offlineQs[0] || null);
        if (!offlineQs[0]) setIsCompleted(true);
      }
    } else {
      // Offline logic
      const nextQuestion = offlineQuestions[currentOfflineIndex];
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
      } else {
        setIsCompleted(true);
      }
    }
    setIsLoading(false);
  }, [isOnline, formData.symptoms, questionsAndAnswers, toast, offlineQuestions, currentOfflineIndex]);
  
  useEffect(() => {
    if (isOnline) {
       // If we were in the middle of offline questions and came back online, restart with AI
       if (offlineQuestions.length > 0) {
         setOfflineQuestions([]);
         setCurrentOfflineIndex(0);
       }
    } else {
      if (!offlineQuestions.length) {
        const offlineQs = getOfflineQuestions(formData.symptoms || '');
        setOfflineQuestions(offlineQs);
      }
    }
  }, [isOnline, formData.symptoms, offlineQuestions.length]);

  useEffect(() => {
    // This effect runs when mode (online/offline) or related state changes
    fetchNextQuestion();
  }, [fetchNextQuestion]);


  const handleAnswer = (answer: 'Sí' | 'No') => {
    if (!currentQuestion) return;
    const newQnA = { question: currentQuestion, answer };
    setQuestionsAndAnswers(prev => [...prev, newQnA]);
    
    if (!isOnline) {
      setCurrentOfflineIndex(prev => prev + 1);
    }
    // The next question will be fetched by the effect hook reacting to state change
  };

  const totalQuestions = isOnline ? (questionsAndAnswers.length + 1) : offlineQuestions.length;
  const progress = totalQuestions > 0 ? (questionsAndAnswers.length / totalQuestions) * 100 : 0;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Cuestionario Guiado</CardTitle>
        <CardDescription>
          Responda las siguientes preguntas para ayudarnos a entender mejor la situación.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[20rem] flex flex-col justify-center items-center text-center p-8">
        {isLoading ? (
          <div className="space-y-4 w-full">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        ) : isCompleted ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Cuestionario Completo</h3>
            <p className="text-muted-foreground">Gracias por sus respuestas. Ahora puede continuar.</p>
            <Button onClick={() => onNext({ questionnaire: questionsAndAnswers })} size="lg">
              Continuar
            </Button>
          </div>
        ) : (
          <div className="space-y-8 w-full">
             <Progress value={progress} className="w-full" />
            <h3 className="text-2xl font-semibold">{currentQuestion}</h3>
            <div className="flex justify-center gap-4">
              <Button onClick={() => handleAnswer('Sí')} size="lg" className="bg-green-500 hover:bg-green-600">
                <ThumbsUp className="mr-2 h-5 w-5"/> Sí
              </Button>
              <Button onClick={() => handleAnswer('No')} size="lg" variant="destructive">
                <ThumbsDown className="mr-2 h-5 w-5"/> No
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Questionnaire;
