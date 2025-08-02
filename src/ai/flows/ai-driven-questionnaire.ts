// This is an AI-driven questionnaire flow that uses the OpenAI API to ask relevant questions based on the user's initial symptom description.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialSymptomsInputSchema = z.object({
  initialSymptoms: z
    .string()
    .describe('Initial symptoms described by the patient.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo related to the patient's condition, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  examPhotoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of medical exams, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  previousQuestionsAndAnswers: z
    .array(z.object({question: z.string(), answer: z.string()}))
    .optional()
    .describe('Previous questions and answers in the questionnaire.'),
});
export type InitialSymptomsInput = z.infer<typeof InitialSymptomsInputSchema>;

const QuestionnaireOutputSchema = z.object({
  question: z.string().describe('Next question to ask the user.'),
  complete: z.boolean().describe('Whether the questionnaire is complete.'),
});
export type QuestionnaireOutput = z.infer<typeof QuestionnaireOutputSchema>;

export async function aiDrivenQuestionnaire(input: InitialSymptomsInput): Promise<QuestionnaireOutput> {
  return aiDrivenQuestionnaireFlow(input);
}

const generateQuestionPrompt = ai.definePrompt({
  name: 'generateQuestionPrompt',
  input: {schema: InitialSymptomsInputSchema},
  output: {schema: QuestionnaireOutputSchema},
  prompt: `You are a helpful AI assistant designed to dynamically generate questions for a healthcare worker based on a patient's described symptoms. Your goal is to refine questioning and gather detailed information about the patient's condition. The questions must be simple to answer with a yes/no answer. Your primary goal is to ask insightful questions. Only after several questions have been asked should you consider if you have enough information.

Here's the patient's initial symptom description: {{{initialSymptoms}}}

{{#if photoDataUri}}
Here's a photo related to the condition:
{{media url=photoDataUri}}
{{/if}}

{{#if examPhotoDataUri}}
Here's a photo of medical exams:
{{media url=examPhotoDataUri}}
{{/if}}

{{#if previousQuestionsAndAnswers}}
Previous Questions and Answers:
  {{#each previousQuestionsAndAnswers}}
    Question: {{{this.question}}}
    Answer: {{{this.answer}}}
  {{/each}}
{{/if}}

Based on this information, generate the next most relevant question to ask the healthcare worker. The answer should be phrased as a question. Do not set 'complete' to true unless you have asked at least three questions or if the user indicates the symptoms are not severe. If you have enough information to provide a recommendation, set complete to true and ask a final question before that recommendation. Return the question to the user.

If no further questions are needed, set complete to true and return a final clarifying question.
`,
});

const aiDrivenQuestionnaireFlow = ai.defineFlow(
  {
    name: 'aiDrivenQuestionnaireFlow',
    inputSchema: InitialSymptomsInputSchema,
    outputSchema: QuestionnaireOutputSchema,
  },
  async input => {
    const {output} = await generateQuestionPrompt(input);
    return output!;
  }
);
