# HealthSnap AI

Documentacion en Notion [aqui](https://confusion-fragrance-8d3.notion.site/Hackathon-Grupo-3A-Salud-Movil-23c0ac18aa21804f915ae8d306de2ddf?source=copy_link).

Una aplicación de telemedicina inteligente construida con Next.js y Firebase que utiliza IA para diagnósticos médicos preliminares.

## 🏥 Características Principales

- **Captura de Síntomas**: Formulario guiado intuitivo para la descripción detallada de síntomas
- **Cuestionario Inteligente**: Preguntas dinámicas generadas por IA basadas en los síntomas iniciales del paciente
- **Captura de Signos Vitales**: Registro de presión arterial, temperatura, pulso, glucosa y peso
- **Carga Multimedia**: Subida de imágenes/videos de condiciones físicas y resultados de laboratorio
- **Motor de Recomendaciones IA**: Generación automática de resúmenes del caso del paciente, diagnósticos potenciales y recomendaciones médicas
- **Modo Offline**: Captura de datos offline con sincronización automática al reconectarse
- **Interfaz Responsiva**: Diseño optimizado para dispositivos móviles y escritorio

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 15 con TypeScript
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **IA**: Google Genkit con integración a OpenAI
- **Backend**: Firebase
- **Formularios**: React Hook Form + Zod validation
- **Estado**: Local Storage para persistencia offline

## 🎨 Diseño

La aplicación utiliza una paleta de colores calmante y confiable:

- **Primario**: Azul desaturado claro (#A7D1E8) para transmitir calma y confianza
- **Fondo**: Azul muy claro desaturado (#EAF3F9)
- **Acento**: Verde suave desaturado (#B5E4A7) para crear armonía visual

## 🔧 Desarrollo

Para comenzar el desarrollo:

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run genkit:dev` - Inicia Genkit para desarrollo de IA
- `npm run genkit:watch` - Genkit en modo watch
- `npm run build` - Construye la aplicación para producción
- `npm run lint` - Ejecuta el linter

## 📱 Flujo de la Aplicación

1. **Síntomas** - El usuario describe sus síntomas iniciales
2. **Cuestionario IA** - Preguntas inteligentes generadas dinámicamente
3. **Signos Vitales** - Registro de datos biométricos
4. **Media** - Carga de imágenes relacionadas con la condición
5. **Resumen** - Diagnóstico y recomendaciones generadas por IA

## ⚠️ Nota Importante

Esta aplicación está diseñada para fines educativos y de prototipo. No debe utilizarse como sustituto del consejo médico profesional.
