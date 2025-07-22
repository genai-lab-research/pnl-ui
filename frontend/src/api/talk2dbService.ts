import { apiConfig } from './config';

interface Talk2DBRequest {
  query: string;
  limit_results?: boolean;
}

interface Talk2DBResponse {
  message: string | null;
  data: {
    generated_code: string;
    thoughts: string;
    results: any[];
  };
}

interface ChartRequest {
  query: string;
  data: any[];
  improvement_iterations?: number;
  return_base64_image?: boolean;
}

interface ChartResponse {
  base64_chart: string;
}

class Talk2DBService {

  async sendMessage(query: string): Promise<Talk2DBResponse> {
    try {
      const requestBody: Talk2DBRequest = {
        query,
        limit_results: false
      };

      const response = await fetch(`${apiConfig.talk2dbUrl}/v1/query`, {
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

  async generateChart(query: string, data: any[], improvementIterations: number = 0): Promise<ChartResponse> {
    try {
      const requestBody: ChartRequest = {
        query,
        data,
        improvement_iterations: improvementIterations,
        return_base64_image: true
      };

      const response = await fetch(`${apiConfig.talk2dbUrl}/v1/chart/query`, {
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

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error generating chart:', error);
      throw error;
    }
  }
}

export const talk2DBService = new Talk2DBService();