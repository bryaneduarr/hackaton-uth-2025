export const offlineTemplates: Record<string, string[]> = {
    'gripe': [
        "¿El paciente tiene fiebre superior a 38°C?",
        "¿Presenta dolor de cabeza?",
        "¿Tiene congestión nasal o secreción nasal?",
        "¿Siente dolores musculares o corporales?",
        "¿Ha tenido tos seca recientemente?"
    ],
    'tos': [
        "¿La tos es seca o produce flema?",
        "¿La tos ha durado más de una semana?",
        "¿Hay sibilancias o dificultad para respirar con la tos?",
        "¿El paciente siente dolor de garganta?",
        "¿Ha tenido fiebre junto con la tos?"
    ],
    'herida': [
        "¿La herida es profunda o superficial?",
        "¿Hay signos de infección como enrojecimiento, hinchazón o pus?",
        "¿El sangrado se ha detenido?",
        "¿El paciente está vacunado contra el tétanos?",
        "¿La herida fue causada por un objeto oxidado o sucio?"
    ],
    'erupcion': [
        "¿La erupción causa picazón?",
        "¿Se presenta en una zona específica o en todo el cuerpo?",
        "¿Las lesiones son planas, elevadas o con líquido?",
        "¿El paciente ha estado en contacto con alérgenos conocidos?",
        "¿Ha aparecido fiebre junto con la erupción?"
    ],
};

export const keywordMap: Record<string, keyof typeof offlineTemplates> = {
    'gripe': 'gripe',
    'flu': 'gripe',
    'resfriado': 'gripe',
    'tos': 'tos',
    'cough': 'tos',
    'corte': 'herida',
    'herida': 'herida',
    'lesion': 'herida',
    'sarpullido': 'erupcion',
    'erupcion': 'erupcion',
    'ronchas': 'erupcion',
};

export const getOfflineQuestions = (symptoms: string): string[] => {
    const words = symptoms.toLowerCase().replace(/[,.]/g, '').split(/\s+/);
    for (const word of words) {
        const templateKey = keywordMap[word];
        if (templateKey && offlineTemplates[templateKey]) {
            return offlineTemplates[templateKey];
        }
    }
    // Default fallback questions if no keyword is matched
    return [
        "¿El paciente tiene fiebre?",
        "¿Siente algún tipo de dolor?",
        "¿Hay alguna dificultad para respirar?",
        "¿Ha comido algo inusual recientemente?",
        "¿Los síntomas han aparecido de repente?"
    ];
};
