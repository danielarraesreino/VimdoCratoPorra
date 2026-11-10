import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI client server-side with v1beta for speech/TTS
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    apiVersion: 'v1beta',
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory audio cache to avoid re-generating TTS for identical requests
const audioCache = new Map<string, string>();

// Script Path
const SCRIPT_PATH = path.join(__dirname, 'public/assets/aistudio/regulacao_do_sistema_nervoso_e_sobrecarga_sensorial_14af65f6.md');

// Default Voice Profiles
export const VOICE_PROFILES = [
  {
    id: 'crato-charon',
    name: 'Seu Damião do Crato',
    desc: 'Homem de 52 anos, Cariri cearense. Voz madura, profunda, mansa e profundamente acolhedora.',
    voiceName: 'Charon',
    style: 'Homem cearense de meia-idade (cerca de 50 a 55 anos), natural da cidade do Crato, na região do Cariri, Ceará. Voz grave, madura, aveludada, mansa e acolhedora, com sotaque nordestino cearense autêntico e caloroso. Ritmo calmo, empático, afetuoso, com pausas naturais para respiração como quem acolhe alguém com sabedoria e serenidade.',
  },
  {
    id: 'crato-fenrir',
    name: 'Dr. Geraldo do Cariri',
    desc: 'Homem de 48 anos, voz firme, serena e terapêutica com sotaque cearense suave.',
    voiceName: 'Fenrir',
    style: 'Homem de 48 anos do Crato, Ceará. Tom de voz terapêutico, firme, claro, reconfortante e empático com sotaque cearense do Cariri natural e acolhedor.',
  },
  {
    id: 'crato-puck',
    name: 'Mestre Expedito',
    desc: 'Tom mais coloquial, comunicativo e dinâmico, típico das rodas de conversa do Cariri.',
    voiceName: 'Puck',
    style: 'Homem nordestino de meia-idade, conversador do interior do Ceará (Crato), tom expressivo, caloroso, simpático e empático.',
  },
];

// Predefined script segments
export const SCRIPT_SEGMENTS = [
  {
    id: 'full-video',
    title: '🎬 Vídeo Curto Completo (45s - 60s)',
    subtitle: 'Roteiro dinâmico e contínuo para Reels / TikTok',
    timeframe: '00:00 - 00:55',
    category: 'video',
    spokenText: 'Se você sente um cansaço absurdo mesmo depois de dormir nove horas, <breath> o problema pode não ser preguiça... seu cérebro pode estar travado no modo de sobrevivência. <breath> Quando você passa semanas em hipervigilância, sua amígdala cerebral assume o volante. Ela manda cortisol e adrenalina vinte e quatro horas por dia, achando que tem um predador na sala. O resultado? Seu corpo nunca entra no descanso reparador, no sistema parassimpático. <breath> Para quebrar esse ciclo agora, use o Suspiro Fisiológico: <breath> Duas inspirações curtas pelo nariz... <breath> e uma expiração longa e lenta pela boca. Faça isso três vezes seguidas. É o sinal químico mais rápido para o seu nervo vago avisar o cérebro que você está seguro. <breath> Salva esse vídeo para quando a sobrecarga bater, e manda pra quem anda se cobrando demais essa semana.',
    rawMarkdown: `> *"Se você sente um cansaço absurdo mesmo depois de dormir 9 horas, o problema pode não ser preguiça... seu cérebro pode estar travado no modo de sobrevivência."*\n\n> *"Quando você passa semanas em hipervigilância, sua amígdala cerebral assume o volante. Ela manda cortisol e adrenalina 24 horas por dia, achando que tem um predador na sala. O resultado? Seu corpo nunca entra no descanso reparador (sistema parassimpático)."*\n\n> *"Para quebrar esse ciclo agora, use o Suspiro Fisiológico: Duas inspirações curtas pelo nariz... e uma expiração longa e lenta pela boca. Faça isso 3 vezes seguidas. É o sinal químico mais rápido para o seu nervo vago avisar o cérebro que você está seguro."*\n\n> *"Salva esse vídeo para quando a sobrecarga bater, e manda pra quem anda se cobrando demais essa semana."*`,
  },
  {
    id: 'part-1-gancho',
    title: '🎯 Parte 1: O Gancho',
    subtitle: 'Validação e Despatologização',
    timeframe: '00:00 - 00:04',
    category: 'video',
    spokenText: 'Se você sente um cansaço absurdo mesmo depois de dormir nove horas, <breath> o problema pode não ser preguiça... seu cérebro pode estar travado no modo de sobrevivência.',
    rawMarkdown: `**Cena:** Olhar direto para a câmera, tom calmo e empático, sem música alta.\n> *"Se você sente um cansaço absurdo mesmo depois de dormir 9 horas, o problema pode não ser preguiça... seu cérebro pode estar travado no modo de sobrevivência."*`,
  },
  {
    id: 'part-2-mecanismo',
    title: '🧠 Parte 2: O Mecanismo',
    subtitle: 'Psicoeducação em Metáfora',
    timeframe: '00:05 - 00:25',
    category: 'video',
    spokenText: 'Quando você passa semanas em hipervigilância, sua amígdala cerebral assume o volante. Ela manda cortisol e adrenalina vinte e quatro horas por dia, achando que tem um predador na sala. <breath> O resultado? Seu corpo nunca entra no descanso reparador, no sistema parassimpático.',
    rawMarkdown: `**Cena:** Texto dinâmico na tela ou apoio visual.\n> *"Quando você passa semanas em hipervigilância, sua amígdala cerebral assume o volante. Ela manda cortisol e adrenalina 24 horas por dia, achando que tem um predador na sala. O resultado? Seu corpo nunca entra no descanso reparador (sistema parassimpático)."*`,
  },
  {
    id: 'part-3-ferramenta',
    title: '🛠️ Parte 3: A Ferramenta (Suspiro Fisiológico)',
    subtitle: 'Ação Prática com Respiração',
    timeframe: '00:26 - 00:45',
    category: 'video',
    spokenText: 'Para quebrar esse ciclo agora, use o Suspiro Fisiológico: <breath> Duas inspirações curtas pelo nariz... <breath> e uma expiração longa e lenta pela boca. <breath> Faça isso três vezes seguidas. É o sinal químico mais rápido para o seu nervo vago avisar o cérebro que você está seguro.',
    rawMarkdown: `**Cena:** Demonstração visual ou instrução passo a passo.\n> *"Para quebrar esse ciclo agora, use o Suspiro Fisiológico: Duas inspirações curtas pelo nariz... e uma expiração longa e lenta pela boca. Faça isso 3 vezes seguidas. É o sinal químico mais rápido para o seu nervo vago avisar o cérebro que você está seguro."*`,
  },
  {
    id: 'part-4-cta',
    title: '💬 Parte 4: Chamada para Ação',
    subtitle: 'CTA Acolhedor',
    timeframe: '00:46 - 00:55',
    category: 'video',
    spokenText: 'Salva esse vídeo para quando a sobrecarga bater, <breath> e manda pra quem anda se cobrando demais essa semana.',
    rawMarkdown: `> *"Salva esse vídeo para quando a sobrecarga bater, e manda pra quem anda se cobrando demais essa semana."*`,
  },
  {
    id: 'carrossel-full',
    title: '📱 Carrossel Completo: 10 Slides',
    subtitle: 'Narração contínua dos 10 cards explicativos',
    timeframe: 'Guia Completo',
    category: 'carrossel',
    spokenText: 'Vamos percorrer agora o carrossel sobre regulação do sistema nervoso e sobrecarga sensorial. <breath> Slide um: Por que você sente isso e o que fazer agora. Slide dois: O que parece ser contra o que realmente é na neurobiologia. Slide três: Os três sinais silenciosos que você provavelmente ignora. Slide quatro: Por que dizer apenas relaxe só piora o quadro. Slide cinco: O ciclo vicioso entre pensamento, sensação física e comportamento. Slide seis: A virada de chave através da desfusão cognitiva e validação. Slide sete: O exercício prático de ancoragem em sessenta segundos. Slide oito: O que a ciência moderna diz sobre regulação emocional contínua. Slide nove: Resumo prático para você guardar. E slide dez: Lembre-se, você não está quebrado. Seu cérebro só está tentando te proteger.',
    rawMarkdown: `Estrutura dos 10 Slides (1080x1350):\n- Slide 01: "Regulação do Sistema Nervoso e Sobrecarga Sensorial: Por que você sente isso e o que fazer agora"\n- Slide 02: O que parece ser vs O que realmente é na neurobiologia.\n- Slide 03: Os 3 sinais silenciosos que você provavelmente ignora.\n- Slide 04: Por que dizer 'apenas relaxe' piora o quadro.\n- Slide 05: O Ciclo Vicioso (Pensamento ➔ Sensação Física ➔ Comportamento).\n- Slide 06: A virada de chave: desfusão cognitiva e validação.\n- Slide 07: O exercício de ancoragem de 60 segundos.\n- Slide 08: O que a ciência diz sobre a regulação emocional contínua.\n- Slide 09: Resumo prático para você tirar print.\n- Slide 10: "Você não está quebrado. Seu cérebro só está tentando te proteger. Salve este post."`,
  },
];

// Endpoint to fetch markdown content and structured script
app.get('/api/script', (req, res) => {
  try {
    let rawContent = '';
    if (fs.existsSync(SCRIPT_PATH)) {
      rawContent = fs.readFileSync(SCRIPT_PATH, 'utf-8');
    }
    res.json({
      segments: SCRIPT_SEGMENTS,
      profiles: VOICE_PROFILES,
      rawContent,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: 'Erro ao carregar roteiro', details: message });
  }
});

// Endpoint to generate speech using gemini-3.8-flash-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Charon', style, segmentId } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'O texto para narração é obrigatório.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chave GEMINI_API_KEY não configurada no servidor. Configure no painel de Secrets.',
      });
    }

    const effectiveStyle =
      style ||
      'Homem cearense de meia-idade (cerca de 50 anos) natural do Crato, Ceará (região do Cariri). Fala português brasileiro com sotaque nordestino cearense autêntico, voz madura, aveludada, acolhedora, tom manso, calmo e afetuoso de acolhimento psicológico, respirando naturalmente.';

    const cacheKey = `${voiceName}:::${text.trim()}:::${effectiveStyle}`;
    if (audioCache.has(cacheKey)) {
      return res.json({
        audioBase64: audioCache.get(cacheKey),
        mimeType: 'audio/wav',
        cached: true,
        voiceName,
      });
    }

    console.log(`[TTS] Gerando fala com gemini-3.8-flash-tts (Voz: ${voiceName}) para texto: "${text.slice(0, 60)}..."`);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                speaker: 'Narrador',
                style: effectiveStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName,
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      console.error('[TTS] Resposta sem áudio:', JSON.stringify(response, null, 2));
      return res.status(502).json({
        error: 'O modelo não retornou dados de áudio válidos.',
        details: response.text || 'Sem candidatos de áudio.',
      });
    }

    // Cache the audio
    audioCache.set(cacheKey, base64Audio);

    return res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      cached: false,
      voiceName,
      segmentId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[TTS Error]:', err);
    return res.status(500).json({
      error: 'Falha ao sintetizar voz via Gemini 3.8 Flash TTS',
      details: message,
    });
  }
});

// Serve frontend in dev or prod
async function setupServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
