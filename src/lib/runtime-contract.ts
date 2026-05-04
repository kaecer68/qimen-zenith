import * as fs from 'fs';
import * as path from 'path';

function loadEnvFile(filePath: string): Record<string, string> {
  const env: Record<string, string> = {};
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        env[key] = value;
      }
    }
  } catch {
    return {};
  }
  
  return env;
}

const envPorts = loadEnvFile(path.join(process.cwd(), '.env.ports'));

export function getRuntimeValue(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
    
    const envValue = envPorts[key]?.trim();
    if (envValue) return envValue;
  }

  return undefined;
}

export function requireRuntimeValue(keys: string[], label: string): string {
  const value = getRuntimeValue(keys);
  if (!value) {
    throw new Error(`${label} is required. Run scripts/sync-contracts.sh or export ${keys.join('/')}.`);
  }
  return value;
}

export function getQimenGrpcHost(): string {
  return requireRuntimeValue(
    ['QIMEN_GRPC_HOST', 'GRPC_HOST'],
    'Qimen gRPC host'
  );
}

export function getLunarApiUrl(): string {
  const value = getRuntimeValue(['LUNAR_API_URL', 'LUNAR_REST_PORT']);
  if (!value) {
    throw new Error('Lunar API URL is required. Run scripts/sync-contracts.sh or export LUNAR_API_URL.');
  }
  if (/^\d+$/.test(value)) {
    return `http://localhost:${value}`;
  }
  return value.replace(/\/$/, '');
}
