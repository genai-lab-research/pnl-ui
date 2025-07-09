import { apiConfig } from './config';

interface Talk2DBRequest {
  query: string;
  session_id: string;
  limit_results?: boolean;
  improvement_iterations?: number;
  return_base64_image?: boolean;
}

interface Talk2DBResponse {
  message: string;
  data?: {
    sql_code?: string;
    chart_code?: string;
    results?: any[];
    base_64_image?: string;
  };
}

class Talk2DBService {
  private sessionId: string;

  constructor() {
    // Generate a unique session ID for this browser session
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    const storageKey = 'talk2db_session_id';
    let sessionId = sessionStorage.getItem(storageKey);
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(storageKey, sessionId);
    }
    
    return sessionId;
  }

  async sendMessage(query: string): Promise<Talk2DBResponse> {
    try {
      const requestBody: Talk2DBRequest = {
        query,
        session_id: this.sessionId,
        limit_results: false,
        improvement_iterations: 2,
        return_base64_image: true
      };

      const response = await fetch(apiConfig.talk2dbUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to Talk2DB:', error);
      throw error;
    }
  }
}

export const talk2DBService = new Talk2DBService();