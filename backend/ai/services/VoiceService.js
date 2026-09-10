// FitSport Voice Service: End-To-End Audio Processing Pipeline
import { speechToTextService } from './SpeechToTextService.js';
import { textToSpeechService } from './TextToSpeechService.js';

export class VoiceService {
  constructor(stt = speechToTextService, tts = textToSpeechService) {
    this.stt = stt;
    this.tts = tts;
  }

  /**
   * Process raw audio buffer or speech string to text transcript
   */
  async processAudioInput(audioData) {
    return await this.stt.transcribeAudio(audioData);
  }

  /**
   * Synthesize text response into audio
   */
  async synthesizeResponse(text) {
    return await this.tts.synthesizeSpeech(text);
  }
}

export const voiceService = new VoiceService();
