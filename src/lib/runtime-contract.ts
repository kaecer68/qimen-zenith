import fs from 'fs';
import path from 'path';

function readEnvPorts(): Record<string, string> {
  const filePath = path.resolve(process.cwd(), '.env.ports');
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, 'utf-8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .reduce<Record<string, string>>((acc, line) => {
      const [key, ...rest] = line.split('=');
      acc[key.trim()] = rest.join('=').trim();
      return acc;
    }, {});
}

export function getRuntimeValue(keys: string[]): string | undefined {
  for (const key of keys) {
    const envValue = process.env[key]?.trim();
    if (envValue) {
      return envValue;
    }
  }

  const envPorts = readEnvPorts();
  for (const key of keys) {
    const fileValue = envPorts[key]?.trim();
    if (fileValue) {
      return fileValue;
    }
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
  return requireRuntimeValue(
    ['LUNAR_API_URL'],
    'Lunar API URL'
  ).replace(/\/$/, '');
}
