const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pcprimedz.onrender.com';

export interface FeedbackRequest {
  user_id?: number;
  subject: string;
  message: string;
  email?: string;
}

export interface FeedbackResponse {
  message: string;
}

export interface FeedbackError {
  error: string;
}

export interface Feedback {
  id: number;
  user_id?: number;
  subject: string;
  message: string;
  email?: string;
  resolved: boolean;
  created_at: string;
}

class FeedbackAPI {
  private baseURL = `${API_BASE_URL}/feedback`;

  async submitFeedback(feedback: FeedbackRequest): Promise<FeedbackResponse> {
    try {
      const response = await fetch(`${this.baseURL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          error: errorData.error || 'Failed to submit feedback',
        };
      }

      return await response.json();
    } catch (error: any) {
      throw {
        status: error.status || 500,
        error: error.error || error.message || 'Network error',
      };
    }
  }

  async getAllFeedback(): Promise<Feedback[]> {
    try {
      const response = await fetch(`${this.baseURL}/`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getUnresolvedFeedback(): Promise<Feedback[]> {
    try {
      const response = await fetch(`${this.baseURL}/unresolved`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch unresolved feedback');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async resolveFeedback(feedbackId: number): Promise<FeedbackResponse> {
    try {
      const response = await fetch(`${this.baseURL}/resolve/${feedbackId}`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to resolve feedback');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteFeedback(feedbackId: number): Promise<FeedbackResponse> {
    try {
      const response = await fetch(`${this.baseURL}/${feedbackId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete feedback');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const feedbackApi = new FeedbackAPI();
