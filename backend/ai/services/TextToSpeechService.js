// FitSport Text-To-Speech Service (Piper Abstraction & Fallback)
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export class TextToSpeechService {
  constructor(config = {}) {
    this.piperPath = process.env.PIPER_PATH || config.piperPath || 'piper';
    this.modelPath = process.env.PIPER_MODEL || config.modelPath || 'en_US-lessac-medium.onnx';
  }

  /**
   * Synthesize spoken text to audio.
   * Returns { audioUrl, audioBase64, format, provider }
   */
  async synthesizeSpeech(text, options = {}) {
    const cleanText = String(text || '').trim();
    if (!cleanText) {
      return { audioUrl: null, audioBase64: null, provider: 'none' };
    }

    // Check if Piper is executable in local environment
    try {
      const outputPath = path.join(process.cwd(), 'public', 'temp_speech.wav');
      const isPiperAvailable = await new Promise((resolve) => {
        const proc = spawn(this.piperPath, ['--model', this.modelPath, '--output_file', outputPath], {
          timeout: 5000
        });

        proc.stdin?.write(cleanText);
        proc.stdin?.end();

        proc.on('close', code => {
          resolve(code === 0 && fs.existsSync(outputPath));
        });
        proc.on('error', () => resolve(false));
      });

      if (isPiperAvailable) {
        return {
          audioUrl: '/temp_speech.wav',
          format: 'audio/wav',
          provider: 'piper_local'
        };
      }
    } catch (e) {
      // Fallback
    }

    // Return structured payload so frontend uses browser Web Speech Synthesis flawlessly
    return {
      audioUrl: null,
      spokenText: cleanText,
      format: 'web_speech_synthesis',
      provider: 'browser_speech_synthesis'
    };
  }
}

export const textToSpeechService = new TextToSpeechService();
