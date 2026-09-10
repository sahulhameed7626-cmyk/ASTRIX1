// FitSport Environment Variable Validator
import fs from 'fs';
import path from 'path';
import { TELEGRAM_CONFIG } from '../../routes/telegram.js';

export function loadEnvFile(envPath = path.resolve(process.cwd(), '.env')) {
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.slice(0, idx).trim();
          let val = trimmed.slice(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    } catch (e) {}
  }
}

export function validateEnvironment() {
  loadEnvFile();

  const vars = [
    { name: "GEMINI_API_KEY", isSecret: true },
    { name: "GEMINI_MODEL", isSecret: false, defaultVal: "gemini-3.6-flash" },
    { name: "DATABASE_URL", isSecret: true },
    { name: "JWT_SECRET", isSecret: true },
    { name: "OLLAMA_BASE_URL", isSecret: false, defaultVal: "http://localhost:11434" },
    { name: "OLLAMA_MODEL", isSecret: false, defaultVal: "llama3" },
    { name: "WHISPER_PATH", isSecret: false, defaultVal: "whisper" },
    { name: "WHISPER_MODEL", isSecret: false, defaultVal: "base" },
    { name: "PIPER_PATH", isSecret: false, defaultVal: "piper" },
    { name: "PIPER_MODEL", isSecret: false, defaultVal: "en_US-lessac-medium.onnx" },
    { name: "TELEGRAM_BOT_TOKEN", isSecret: true, defaultVal: TELEGRAM_CONFIG.botToken },
    { name: "TELEGRAM_CHAT_ID", isSecret: false, defaultVal: TELEGRAM_CONFIG.defaultChatId }
  ];

  console.log("--------------------------------------------------");
  console.log("[FitSport AI] Environment Configuration Status:");
  const statusReport = {};

  for (const v of vars) {
    const val = process.env[v.name] || v.defaultVal;
    if (val && String(val).trim()) {
      statusReport[v.name] = "configured";
    } else {
      statusReport[v.name] = "not configured (optional / fallback active)";
    }
    console.log(`  • ${v.name.padEnd(22)}: ${statusReport[v.name]}`);
  }
  console.log("--------------------------------------------------");
  return statusReport;
}
