export const config = {
  agentUrl: process.env.NEXT_PUBLIC_AGENT_URL || 'http://localhost:8000/api/agent',
} as const;

export type Config = typeof config; 