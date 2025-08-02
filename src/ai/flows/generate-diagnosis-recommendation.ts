'use server';

/**
 * @fileOverview Generates a concise summary of a patient's condition, potential diagnoses,
 * recommended medications, and procedures.
 *
 * - generateDiagnosisRecommendation - A function that generates the diagnosis recommendation.
 * - GenerateDiagnosisRecommendationInput - The input type for the generateDiagnosisRecommendation function.
 * - GenerateDiagnosisRecommendationOutput - The return type for the generateDiagnosisRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDiagnosisRecommendationInputSchema = z.object({
  symptomsDescription: z.string().describe('A description of the patient\'s symptoms.'),
  vitalSigns: z.string().optional().describe('The patient\'s vital signs.'),
  questionnaireResponses: z.string().describe('The responses to the AI-driven questionnaire.'),
  multimediaContext: z
    .string()
    .optional()
    .describe(
      "Optional: A data URI of a photo or video providing visual context, that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  medicalExamPhotos: z
    .string()
    .optional()
    .describe(
      "Optional: A data URI of medical exam photos, that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type GenerateDiagnosisRecommendationInput = z.infer<
  typeof GenerateDiagnosisRecommendationInputSchema
>;

const GenerateDiagnosisRecommendationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the patient\'s condition.'),
  potentialDiagnoses: z
    .string()
    .describe('Potential diagnoses based on the provided information.'),
  recommendedMedications: z.string().describe('Recommended medications, if applicable.'),
  recommendedProcedures: z.string().describe('Recommended procedures, if applicable.'),
});

export type GenerateDiagnosisRecommendationOutput = z.infer<
  typeof GenerateDiagnosisRecommendationOutputSchema
>;

export async function generateDiagnosisRecommendation(
  input: GenerateDiagnosisRecommendationInput
): Promise<GenerateDiagnosisRecommendationOutput> {
  return generateDiagnosisRecommendationFlow(input);
}

const diagnosisRecommendationPrompt = ai.definePrompt({
  name: 'diagnosisRecommendationPrompt',
  input: {schema: GenerateDiagnosisRecommendationInputSchema},
  output: {schema: GenerateDiagnosisRecommendationOutputSchema},
  prompt: `You are an AI assistant for healthcare workers in the field. Based on the
  information provided about the patient, generate a concise summary of the patient's condition, potential diagnoses, recommended medications, and procedures.

  The entire output must be in Spanish.

  Present the summary in an easy-to-understand format. For any lists, use clear bullet points (using '-' or '*'). Ensure each bullet point is on a new line and there are no formatting errors.

  For "recommendedMedications", provide specific but simple medication names and explain their purpose clearly. For example: "Ibuprofeno - para aliviar el dolor y la inflamación."

  Here is the information about the patient:

  Symptoms Description: {{{symptomsDescription}}}
  {{#if vitalSigns}}
  Vital Signs: {{{vitalSigns}}}
  {{/if}}
  Questionnaire Responses: {{{questionnaireResponses}}}

  {{#if multimediaContext}}
  Multimedia Context: {{media url=multimediaContext}}
  {{/if}}

  {{#if medicalExamPhotos}}
  Medical Exam Photos: {{media url=medicalExamPhotos}}
  {{/if}}
  `,
});

const generateDiagnosisRecommendationFlow = ai.defineFlow(
  {
    name: 'generateDiagnosisRecommendationFlow',
    inputSchema: GenerateDiagnosisRecommendationInputSchema,
    outputSchema: GenerateDiagnosisRecommendationOutputSchema,
  },
  async input => {
    const {output} = await diagnosisRecommendationPrompt(input);
    return output!;
  }
);
