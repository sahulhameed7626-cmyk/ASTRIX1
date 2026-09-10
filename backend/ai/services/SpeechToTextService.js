// FitSport Speech-To-Text Service (Whisper Abstraction & Fallback)
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export class SpeechToTextService {
  constructor(config = {}) {
    this.model = process.env.WHISPER_MODEL || config.model || 'base';
    this.whisperPath = process.env.WHISPER_PATH || config.whisperPath || 'whisper';
    this.timeout = parseInt(process.env.AI_REQUEST_TIMEOUT, 10) || 15000;
  }

  /**
   * Transcribe audio buffer or audio file path using Whisper.
   * Returns { text, language, confidence, provider }
   */
  async transcribeAudio(audioBufferOrPath) {
    // If string is already provided (e.g. from frontend Web Speech API)
    if (typeof audioBufferOrPath === 'string' && !fs.existsSync(audioBufferOrPath)) {
      return {
        text: audioBufferOrPath.trim(),
        language: 'en',
        confidence: 0.98,
        provider: 'web_speech_or_text'
      };
    }

    let filePath = audioBufferOrPath;
    let tempCreated = false;

    if (Buffer.isBuffer(audioBufferOrPath)) {
      filePath = path.join(process.cwd(), `temp_audio_${Date.now()}.wav`);
      fs.writeFileSync(filePath, audioBufferOrPath);
      tempCreated = true;
    }

    try {
      // Attempt local whisper CLI if installed
      const result = await new Promise((resolve) => {
        const proc = spawn(this.whisperPath, [filePath, '--model', this.model, '--output_format', 'txt'], {
          timeout: this.timeout
        });

        let stdout = '';
        let stderr = '';

        proc.stdout?.on('data', data => { stdout += data; });
        proc.stderr?.on('data', data => { stderr += data; });

        proc.on('close', code => {
          if (code === 0 && stdout.trim()) {
            resolve({
              text: stdout.trim(),
              language: 'en',
              confidence: 0.95,
              provider: 'whisper_local'
            });
          } else {
            resolve(null);
          }
        });

        proc.on('error', () => {
          resolve(null);
        });
      });

      if (result) return result;
    } catch (e) {
      // Graceful fallback
    } finally {
      if (tempCreated && fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    }

    // Default fallback
    return {
      text: '',
      language: 'en',
      confidence: 0.0,
      provider: 'whisper_unavailable_fallback'
    };
  }
}

export const speechToTextService = new SpeechToTextService();
