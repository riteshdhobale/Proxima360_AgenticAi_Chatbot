export interface ChatRequest {
  message: string;
  session_id?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  message_type: 'query' | 'allocation_preview' | 'allocation_confirmed' | 'allocation_rejected';
  sql?: string;
  current_values?: any;
  proposed_values?: any;
}

export interface ChatResponse {
  session_id?: string;
  response?: string | any[];
  sql?: string;
  renderType?: 'text' | 'allocation-preview';
  allocationId?: number;
  // Conversational response fields
  is_conversational?: boolean;
  // Allocation preview fields
  preview_message?: string;
  pending?: boolean;
  current_values?: any;
  proposed_values?: any;
  error?: string;
  conversation_history?: ChatMessage[];
  status?: string;
  result?: string;
  message?: string;
  // Enhanced AI fields
  insights?: {
    trends: string[];
    alerts: string[];
    recommendations: string[];
    metrics: any;
    predictions: string[];
  };
  smart_recommendations?: {
    immediate_actions: any[];
    strategic_insights: string[];
    optimization_opportunities: any[];
    risk_alerts: any[];
    predicted_outcomes: string[];
  };
  monitoring_data?: {
    critical_alerts: any[];
    trend_analysis: any[];
    performance_metrics: any;
    predictive_insights: string[];
  };
}

export interface ConversationSession {
  session_id: string;
  last_activity: string;
  message_count: number;
  last_message_preview: string;
}

export interface ConversationListResponse {
  sessions: ConversationSession[];
}


const API_BASE_URL = 'http://127.0.0.1:8000';

export const sendChatMessage = async (message: string, sessionId?: string): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling FastAPI backend:', error);
    throw error;
  }
};

export const confirmAllocation = async (sql: string, sessionId?: string, action: 'approve' | 'reject' = 'approve'): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        session_id: sessionId,
        action
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error confirming allocation:', error);
    throw error;
  }
};

export const getConversationHistory = async (sessionId: string): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/${sessionId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting conversation history:', error);
    throw error;
  }
};

export const createNewConversation = async (): Promise<{ session_id: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/new`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating new conversation:', error);
    throw error;
  }
};

export const getAllConversations = async (): Promise<ConversationListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting all conversations:', error);
    throw error;
  }
};

export const loadConversation = async (sessionId: string): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/${sessionId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading conversation:', error);
    throw error;
  }
};

// Enhanced AI Endpoints
export const getDashboardInsights = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/insights`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting dashboard insights:', error);
    throw error;
  }
};

export const optimizeAllocation = async (options: { warehouse_id?: string; type?: string } = {}): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error optimizing allocation:', error);
    throw error;
  }
};

export const predictDemand = async (sku_id: string, weeks: number = 4): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sku_id, weeks }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error predicting demand:', error);
    throw error;
  }
};

export const startMonitoring = async (sessionId?: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/monitor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error starting monitoring:', error);
    throw error;
  }
};
