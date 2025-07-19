import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, History, Plus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AllocationChart } from "./AllocationChart";
import { sendChatMessage, confirmAllocation, createNewConversation, ChatMessage, getAllConversations, loadConversation, ConversationSession, getDashboardInsights, optimizeAllocation, predictDemand, startMonitoring } from "../services/chatService";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  hasChart?: boolean;
  quickReplies?: string[];
  data?: any[];
  sql?: string;
  renderType?: 'text' | 'allocation-preview';
  allocationId?: number;
  // Allocation preview data
  current_values?: any;
  proposed_values?: any;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `🤖 **Welcome to Proxima360 AI - Your Intelligent Supply Chain Assistant!**

I'm your advanced agentic AI that goes beyond traditional software. I can help you with:

🔍 **Smart Analysis**: Inventory optimization, demand forecasting, trend analysis
📊 **Proactive Monitoring**: Real-time alerts, risk detection, performance insights  
🎯 **Strategic Recommendations**: Cost optimization, service improvements, data-driven decisions
💡 **Interactive Intelligence**: Natural language queries, predictive analytics, automated insights

**🚀 Try these powerful commands:**
• "Show me inventory status for SKU 100010001"
• "Analyze sales trends for the last month"
• "Optimize my warehouse allocation"
• "Start monitoring my inventory"
• "Generate dashboard insights"
• "Predict demand for SKU 100020001"

What would you like to explore first?`,
      timestamp: new Date(),
      quickReplies: [
        '📊 Dashboard Insights',
        '🔍 Check Inventory Status',
        '📈 Analyze Sales Trends',
        '🎯 Optimize Allocation',
        '🤖 Start AI Monitoring',
        '🔮 Predict Demand'
      ],
      renderType: 'text'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [allConversations, setAllConversations] = useState<ConversationSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showConversationList, setShowConversationList] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  // Initialize with a new conversation on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load all existing conversations
        await loadAllConversations();

        // Create a new conversation for the current session
        const { session_id } = await createNewConversation();
        setSessionId(session_id);

        // Add a dynamic AI greeting with current insights
        setTimeout(async () => {
          try {
            // Get dashboard insights to show in welcome message
            const dashboardData = await getDashboardInsights();

            let insightsSummary = '';
            if (dashboardData.dashboard_summary) {
              const summary = dashboardData.dashboard_summary;
              insightsSummary = `\n📊 **Current Status Overview:**
• Inventory Health Score: ${summary.inventory_health_score || 'Calculating...'}%
• Total Inventory: ${summary.total_inventory_value || 0} units
• Critical Items: ${summary.critical_items_count || 0} requiring attention
• Weekly Sales: ${summary.weekly_sales || 0} units sold

${dashboardData.urgent_actions?.length ?
                  '\n🚨 **Urgent Actions:**\n' + dashboardData.urgent_actions.slice(0, 2).map(action => `• ${action}`).join('\n') :
                  '\n✅ **All systems operating normally**'
                }`;
            }

            const enhancedGreeting: Message = {
              id: 'ai-insights-' + Date.now(),
              type: 'bot',
              content: `🎯 **Live Business Insights Ready!**${insightsSummary}

💡 **What would you like to explore?**`,
              timestamp: new Date(),
              quickReplies: [
                '🔍 Deep Dive Analysis',
                '⚡ Show Critical Alerts',
                '🎯 Optimization Plan',
                '📈 Trend Analysis',
                '🤖 AI Recommendations'
              ]
            };

            setMessages(prev => [...prev, enhancedGreeting]);
          } catch (error) {
            console.log('Dashboard data not available, using standard greeting');
          }
        }, 2000); // Show after 2 seconds

      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    initializeApp();
  }, []);

  const loadAllConversations = async () => {
    try {
      const { sessions } = await getAllConversations();
      setAllConversations(sessions);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMessage = (messageId: string) => {
    const messageRef = messageRefs.current[messageId];
    if (messageRef) {
      messageRef.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add a highlight effect
      messageRef.style.backgroundColor = '#eff6ff';
      setTimeout(() => {
        messageRef.style.backgroundColor = '';
      }, 2000);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatResponse = (data: any[]): string => {
    if (!data || data.length === 0) {
      return "No data found for your query.";
    }
    if (Array.isArray(data) && data.length > 0) {
      const keys = Object.keys(data[0]);
      let formatted = "Here are the results:\n\n";
      formatted += keys.join(" | ") + "\n";
      formatted += keys.map(() => "---").join(" | ") + "\n";
      const displayData = data.slice(0, 10);
      displayData.forEach(row => {
        formatted += keys.map(key => row[key] || "").join(" | ") + "\n";
      });
      if (data.length > 10) {
        formatted += `\n... and ${data.length - 10} more rows`;
      }
      return formatted;
    }
    return JSON.stringify(data, null, 2);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage(content, sessionId);

      // Update session ID if it was provided
      if (response.session_id && response.session_id !== sessionId) {
        setSessionId(response.session_id);
      }

      // Update conversation history
      if (response.conversation_history) {
        setConversationHistory(response.conversation_history);
      }

      // Refresh conversation list to update last activity
      loadAllConversations();

      // Check if this is an allocation preview
      if (response.pending && response.preview_message) {
        const previewMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.preview_message,
          timestamp: new Date(),
          sql: response.sql,
          renderType: 'allocation-preview',
          allocationId: Date.now(), // Use timestamp as temp ID
          current_values: response.current_values,
          proposed_values: response.proposed_values
        };
        setMessages(prev => [...prev, previewMessage]);
      } else {
        // Enhanced AI Response Processing
        let botContent = '';
        let quickReplies: string[] = [];

        // Handle error responses
        if (response.error) {
          botContent = `❌ **Error**: ${response.error}`;
          quickReplies = ['Try different query', 'Get help', 'Start over'];
        }
        // Handle conversational responses
        else if (response.is_conversational) {
          botContent = (typeof response.response === 'string') ? response.response : 'Thanks for your message! How can I help you?';
          // Add contextual quick replies for conversational responses
          quickReplies = [
            'Show inventory status',
            'Get dashboard insights',
            'Monitor critical items',
            'Help me optimize'
          ];
        }
        else {
          // Process regular query response with AI enhancements
          if (typeof response.response === 'string') {
            botContent = response.response;
          } else {
            botContent = formatResponse(response.response);
          }

          // Add AI insights to the response
          if (response.insights || response.smart_recommendations || response.monitoring_data) {
            botContent += '\n\n🤖 **AI ANALYSIS COMPLETE:**\n';

            // Add critical alerts
            if (response.monitoring_data?.critical_alerts?.length) {
              botContent += '\n🚨 **CRITICAL ALERTS:**\n';
              response.monitoring_data.critical_alerts.slice(0, 3).forEach(alert => {
                botContent += `• ${alert.message} - ${alert.action_required}\n`;
              });
            }

            // Add immediate actions
            if (response.smart_recommendations?.immediate_actions?.length) {
              botContent += '\n⚡ **IMMEDIATE ACTIONS:**\n';
              response.smart_recommendations.immediate_actions.slice(0, 3).forEach(action => {
                botContent += `• ${action.action} (${action.priority} priority) - ${action.timeline}\n`;
              });
            }

            // Add insights and trends
            if (response.insights?.alerts?.length || response.insights?.trends?.length) {
              botContent += '\n📊 **BUSINESS INSIGHTS:**\n';
              [...(response.insights.alerts || []), ...(response.insights.trends || [])].slice(0, 4).forEach(insight => {
                botContent += `• ${insight}\n`;
              });
            }

            // Add strategic recommendations
            if (response.smart_recommendations?.strategic_insights?.length) {
              botContent += '\n💡 **STRATEGIC RECOMMENDATIONS:**\n';
              response.smart_recommendations.strategic_insights.slice(0, 3).forEach(insight => {
                botContent += `• ${insight}\n`;
              });
            }

            // Add optimization opportunities
            if (response.smart_recommendations?.optimization_opportunities?.length) {
              botContent += '\n🎯 **OPTIMIZATION OPPORTUNITIES:**\n';
              response.smart_recommendations.optimization_opportunities.slice(0, 2).forEach(opp => {
                botContent += `• ${opp.description} - ${opp.suggestion}\n`;
              });
            }

            // Add key metrics
            if (response.insights?.metrics) {
              botContent += '\n📈 **KEY METRICS:**\n';
              Object.entries(response.insights.metrics).forEach(([key, value]) => {
                if (typeof value === 'number') {
                  botContent += `• ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${value}\n`;
                }
              });
            }

            // Enhanced quick replies based on AI analysis
            quickReplies = [
              '🔍 Get More Details',
              '📊 Dashboard Insights',
              '🎯 Optimize Further',
              '🤖 Start Monitoring',
              '📈 Analyze Trends'
            ];
          } else {
            // Standard quick replies for basic queries
            quickReplies = ['Show SQL query', 'Export data', 'Ask another question'];
          }
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: botContent,
          timestamp: new Date(),
          data: Array.isArray(response.response) ? response.response : undefined,
          sql: response.sql,
          renderType: response.renderType || 'text',
          allocationId: response.allocationId,
          quickReplies
        };
        setMessages(prev => [...prev, botMessage]);
      }

      toast({
        title: response.pending ? "Allocation Preview Ready" : "Query executed successfully",
        description: response.pending ? "Please review and approve/reject" : `Found ${response.response?.length || 0} results`,
      });

    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please check if the backend is running and try again.',
        timestamp: new Date(),
        quickReplies: ['Try again', 'Check connection']
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to connect to the backend service",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    // Enhanced quick reply handling for AI features
    if (reply === 'Show SQL query') {
      const lastBotMessage = messages.filter(m => m.type === 'bot').pop();
      if (lastBotMessage?.sql) {
        const sqlMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: `Here's the SQL query that was executed:\n\n\`\`\`sql\n${lastBotMessage.sql}\n\`\`\``,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, sqlMessage]);
      }
    } else if (reply.includes('📊 Dashboard Insights')) {
      handleSendMessage('Get dashboard insights and show me the overall performance metrics');
    } else if (reply.includes('🔍 Check Inventory Status')) {
      handleSendMessage('Show me inventory status for SKU 100010001 with detailed analysis');
    } else if (reply.includes('📈 Analyze Sales Trends')) {
      handleSendMessage('Analyze sales trends for the last 4 weeks with predictions');
    } else if (reply.includes('🎯 Optimize Allocation')) {
      handleSendMessage('Run AI optimization analysis to balance my inventory');
    } else if (reply.includes('🤖 Start AI Monitoring')) {
      handleSendMessage('Start proactive monitoring for critical alerts and opportunities');
    } else if (reply.includes('🔮 Predict Demand')) {
      handleSendMessage('Predict demand for SKU 100010001 for the next 4 weeks');
    } else if (reply.includes('🔍 Get More Details')) {
      handleSendMessage('Provide more detailed analysis and breakdown of the current data');
    } else if (reply.includes('🎯 Optimize Further')) {
      handleSendMessage('Show me additional optimization opportunities and cost savings');
    } else if (reply === 'Get help') {
      const helpMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: `🆘 **Need Help? Here's what I can do:**

**📊 Analytics & Insights:**
• "Show inventory for SKU [number]"
• "Analyze sales trends for [time period]"
• "Generate dashboard insights"

**🤖 AI Features:**
• "Optimize my allocation"
• "Predict demand for SKU [number]"
• "Start monitoring inventory"

**💡 Smart Commands:**
• "What should I do?" - Get prioritized recommendations
• "Monitor inventory" - Activate proactive alerts
• "Optimize warehouse [name]" - Target specific locations

Just ask me anything in natural language!`,
        timestamp: new Date(),
        quickReplies: [
          '📊 Dashboard Insights',
          '🔍 Check Inventory Status',
          '🎯 Optimize Allocation',
          '🤖 Start AI Monitoring'
        ]
      };
      setMessages(prev => [...prev, helpMessage]);
    } else {
      handleSendMessage(reply);
    }
  };

  const handleAllocationAction = async (allocationId: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        // Find the message with this allocation ID to get the SQL
        const allocationMessage = messages.find(m => m.allocationId === allocationId);
        if (allocationMessage?.sql) {
          const response = await confirmAllocation(allocationMessage.sql, sessionId, 'approve');

          // Update conversation history if provided
          if (response.conversation_history) {
            setConversationHistory(response.conversation_history);
          }

          // Refresh conversation list
          loadAllConversations();

          const confirmationMessage: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content: response.status === 'success'
              ? '✅ Allocation confirmed and executed successfully!'
              : `❌ Error executing allocation: ${response.error}`,
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, confirmationMessage]);

          toast({
            title: response.status === 'success' ? "Allocation Approved" : "Error",
            description: response.status === 'success'
              ? "The allocation has been executed successfully"
              : response.error,
            variant: response.status === 'success' ? "default" : "destructive"
          });
        }
      } else {
        // Reject action
        const allocationMessage = messages.find(m => m.allocationId === allocationId);
        if (allocationMessage?.sql) {
          const response = await confirmAllocation(allocationMessage.sql, sessionId, 'reject');

          // Update conversation history if provided
          if (response.conversation_history) {
            setConversationHistory(response.conversation_history);
          }

          // Refresh conversation list
          loadAllConversations();

          const rejectionMessage: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content: '❌ Allocation rejected. No changes were made to the database.',
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, rejectionMessage]);

          toast({
            title: "Allocation Rejected",
            description: "The allocation has been cancelled",
            variant: "default"
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to process allocation action",
        variant: "destructive",
      });
    }
  };

  const createNewChat = async () => {
    try {
      const { session_id } = await createNewConversation();
      setSessionId(session_id);
      setMessages([{
        id: '1',
        type: 'bot',
        content: 'Hello! I\'m your Proxima360 AI assistant. I can help you with SQL queries, inventory analysis, and logistics insights. Ask me anything about your data!',
        timestamp: new Date(),
        quickReplies: ['Show inventory levels', 'Sales performance by store', 'Generate weekly report', 'Stock analysis'],
        renderType: 'text'
      }]);
      setConversationHistory([]);

      // Refresh the conversation list to include the new conversation
      await loadAllConversations();

      toast({
        title: "New Conversation",
        description: "Started a new conversation session",
      });
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive",
      });
    }
  };

  const switchToConversation = async (targetSessionId: string) => {
    try {
      // Load the conversation history from the backend
      const { conversation_history } = await loadConversation(targetSessionId);

      // Convert backend conversation history to frontend messages
      const convertedMessages = conversation_history?.map((msg: ChatMessage, index: number) => ({
        id: `${targetSessionId}_${index}`,
        type: msg.role === 'user' ? 'user' as const : 'bot' as const,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        sql: msg.sql,
        renderType: msg.message_type === 'allocation_preview' ? 'allocation-preview' as const : 'text' as const,
        current_values: msg.current_values,
        proposed_values: msg.proposed_values,
        quickReplies: msg.role === 'assistant' ? ['Show SQL query', 'Export data', 'Ask another question'] : undefined
      })) || [];

      // Add the initial bot message if the conversation is empty
      const messagesWithInit = convertedMessages.length === 0 ? [{
        id: '1',
        type: 'bot' as const,
        content: 'Hello! I\'m your Proxima360 AI assistant. I can help you with SQL queries, inventory analysis, and logistics insights. Ask me anything about your data!',
        timestamp: new Date(),
        quickReplies: ['Show inventory levels', 'Sales performance by store', 'Generate weekly report', 'Stock analysis'],
        renderType: 'text' as const
      }] : convertedMessages;

      // Update the current session
      setSessionId(targetSessionId);
      setMessages(messagesWithInit);
      setConversationHistory(conversation_history || []);

      // Close the conversation list
      setShowConversationList(false);

      toast({
        title: "Conversation Loaded",
        description: `Switched to conversation with ${conversation_history?.length || 0} messages`,
      });
    } catch (error) {
      console.error('Error switching conversation:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-full bg-transparent relative">
      {/* Premium Background for Chat Interface */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 backdrop-blur-sm"></div>

      {/* Conversation List Side Panel */}
      {showConversationList && (
        <div className="w-1/4 border-r border-white/10 bg-black/30 backdrop-blur-xl flex flex-col relative z-10 shadow-2xl">
          {/* Glass morphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">All Conversations</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConversationList(false)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                ✕
              </Button>
            </div>
            <p className="text-sm text-white/60 mt-1">
              {allConversations.length} conversations • Click to switch
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">
            {allConversations.length === 0 ? (
              <div className="text-center text-white/50 mt-8">
                <History size={48} className="mx-auto mb-4 opacity-30" />
                <p>No conversations yet</p>
                <p className="text-xs mt-2">Start chatting to create your first conversation</p>
              </div>
            ) : (
              allConversations.map((conversation) => (
                <div
                  key={conversation.session_id}
                  className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all cursor-pointer group hover:border-white/20 hover:scale-[1.02] hover:shadow-xl ${conversation.session_id === sessionId ? 'border-blue-400/50 bg-blue-500/10 ring-1 ring-blue-400/30' : ''
                    }`}
                  onClick={() => switchToConversation(conversation.session_id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <Bot className="text-white" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          Session {conversation.session_id.split('_')[1]}
                        </p>
                        <p className="text-xs text-white/60">
                          {conversation.message_count} messages
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-white/50">
                      {new Date(conversation.last_activity).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-white/80 line-clamp-2 mb-3">
                    {conversation.last_message_preview}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {conversation.message_type === 'allocation_confirmed' && (
                        <span className="inline-block px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-400/30">
                          ✅ Confirmed
                        </span>
                      )}
                      {conversation.message_type === 'allocation_rejected' && (
                        <span className="inline-block px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-400/30">
                          ❌ Rejected
                        </span>
                      )}
                      {conversation.message_type === 'allocation_preview' && (
                        <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-400/30">
                          ⏳ Preview
                        </span>
                      )}
                      {conversation.sql && (
                        <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30">
                          SQL
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to jump →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className={`flex flex-col transition-all duration-500 ${showConversationList && showHistory ? 'w-1/2' :
        showConversationList ? 'w-3/4' :
          showHistory ? 'w-2/3' : 'w-full'
        } relative z-10`}>
        {/* Enhanced Header with Professional Styling */}
        <div className="px-8 py-6 border-b border-slate-700/30 bg-gradient-to-r from-blue-600/95 via-purple-600/95 to-indigo-600/95 backdrop-blur-xl relative overflow-hidden">
          {/* Premium Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/15 via-purple-400/15 to-indigo-400/15"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl ring-2 ring-white/30">
                <Bot className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg tracking-tight">Proxima360 AI Assistant</h1>
                <p className="text-blue-100/90 text-sm font-medium mt-1">Logistics & Allocation Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-white/90 hover:bg-white/20 backdrop-blur-sm hover:text-white transition-all duration-300 rounded-2xl border border-white/20 px-4 py-2"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowConversationList(!showConversationList);
                  if (!showConversationList) {
                    loadAllConversations();
                  }
                }}
                className={`text-white/90 hover:bg-white/20 backdrop-blur-sm hover:text-white transition-all duration-300 rounded-2xl border border-white/20 px-4 py-2 ${showConversationList ? 'bg-white/20' : ''}`}
              >
                <History size={18} className="mr-2" />
                <span className="text-sm font-medium">Conversations ({allConversations.length})</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className={`text-white/90 hover:bg-white/20 backdrop-blur-sm hover:text-white transition-all duration-300 rounded-2xl border border-white/20 px-4 py-2 ${showHistory ? 'bg-white/20' : ''}`}
              >
                <Bot size={18} className="mr-2" />
                <span className="text-sm font-medium">Chat History ({conversationHistory.length})</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={createNewChat}
                className="text-white/90 hover:bg-white/20 backdrop-blur-sm hover:text-white transition-all duration-300 rounded-2xl border border-white/20 px-4 py-2"
              >
                <Plus size={18} className="mr-2" />
                <span className="text-sm font-medium">New Chat</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Chat Messages Area with Professional Spacing */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-gradient-to-b from-slate-900/20 via-slate-900/10 to-slate-900/20 backdrop-blur-sm relative">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}></div>
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
            backgroundSize: '25px 25px'
          }}></div>

          {messages.map((message) => (
            <div
              key={message.id}
              ref={(el) => messageRefs.current[message.id] = el}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-500 relative z-10 group animate-in fade-in slide-in-from-bottom-4`}
            >
              <div className={`max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-6 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Enhanced Avatar Design */}
                  <div className={`w-12 h-12 rounded-3xl flex items-center justify-center shadow-xl backdrop-blur-sm flex-shrink-0 ring-2 transition-all duration-300 group-hover:scale-105 ${message.type === 'user'
                    ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 ring-blue-400/40'
                    : 'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 ring-purple-400/40'
                    }`}>
                    {message.type === 'user' ? (
                      <User className="text-white drop-shadow-sm" size={20} />
                    ) : (
                      <Bot className="text-white drop-shadow-sm" size={20} />
                    )}
                  </div>
                  <div className={`flex flex-col space-y-4 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <Card className={`px-6 py-5 backdrop-blur-xl border-0 shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative overflow-hidden transition-all duration-300 group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] ${message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500/25 via-blue-600/20 to-purple-500/25 text-white rounded-[28px] rounded-br-lg'
                      : 'bg-slate-800/80 text-white border border-slate-700/50 rounded-[28px] rounded-bl-lg'
                      }`}>
                      {/* Enhanced Background Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent pointer-events-none rounded-[28px]"></div>
                      {message.renderType === 'allocation-preview' ? (
                        <div className="space-y-4">
                          <p className="font-semibold text-primary">{message.content}</p>

                          {/* Show SQL Query */}
                          <div className="bg-muted p-3 rounded-md">
                            <h4 className="font-semibold text-sm text-muted-foreground mb-2">SQL Query to Execute:</h4>
                            <pre className="text-xs bg-slate-900 dark:bg-slate-800 text-green-400 p-2 rounded overflow-x-auto">
                              {message.sql}
                            </pre>
                          </div>

                          {/* Show Changes Preview */}
                          {message.current_values && message.proposed_values && (
                            <div className="border border-primary/20 rounded-md p-3 bg-primary/5">
                              <h4 className="font-semibold text-sm text-primary mb-3">Changes Preview:</h4>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <h5 className="font-semibold text-foreground mb-2">Current Values:</h5>
                                  <div className="space-y-1">
                                    {Object.entries(message.current_values).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-muted-foreground">{key}:</span>
                                        <span className="font-mono text-foreground">{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-semibold text-destructive mb-2">Proposed Changes:</h5>
                                  <div className="space-y-1">
                                    {Object.entries(message.proposed_values).map(([key, value]) => (
                                      <div key={key} className="flex justify-between bg-destructive/10 px-2 py-1 rounded">
                                        <span className="text-destructive font-semibold">{key}:</span>
                                        <span className="font-mono text-destructive">{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Approval Buttons */}
                          <div className="flex gap-3 mt-4">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
                              onClick={() => handleAllocationAction(message.allocationId!, 'approve')}
                            >
                              ✅ Approve & Execute
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAllocationAction(message.allocationId!, 'reject')}
                            >
                              ❌ Reject & Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                          {message.content}
                        </pre>
                      )}
                    </Card>

                    {message.hasChart && (
                      <div className="w-full max-w-2xl">
                        <AllocationChart />
                      </div>
                    )}

                    {message.quickReplies && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {message.quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickReply(reply)}
                            className="text-sm bg-slate-700/50 hover:bg-blue-500/20 hover:border-blue-400/50 border-slate-600/50 text-slate-300 hover:text-white rounded-xl px-4 py-2 transition-all duration-300 backdrop-blur-sm shadow-md hover:shadow-lg"
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    )}

                    <span className="text-xs text-slate-400 mt-3 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Bot className="text-white" size={16} />
                </div>
                <Card className="p-4 bg-slate-50 border-slate-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Enhanced Input Area with Professional Styling */}
        <div className="px-8 py-6 border-t border-slate-700/30 bg-slate-900/60 backdrop-blur-xl relative">
          {/* Multi-layer Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-purple-500/6 to-indigo-500/8"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>

          <div className="flex space-x-4 relative z-10">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your inventory, sales, or generate reports..."
                className="w-full border-slate-700/50 focus:border-blue-400/50 bg-slate-800/60 backdrop-blur-sm text-white placeholder:text-slate-400 rounded-2xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 shadow-lg"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(inputValue)}
              />
              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
            </div>
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={isTyping || !inputValue.trim()}
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 border border-blue-400/20 min-w-[80px]"
            >
              <Send size={20} className={isTyping ? 'animate-pulse' : ''} />
            </Button>
          </div>
        </div>
      </div>

      {/* History Side Panel */}
      {showHistory && (
        <div className="w-1/3 border-l border-white/10 bg-black/30 backdrop-blur-xl flex flex-col relative shadow-2xl">
          {/* Premium background overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Conversation History</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
              >
                ✕
              </Button>
            </div>
            <p className="text-sm text-white/60 mt-1">
              {conversationHistory.length} messages • Click to jump to message
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">
            {conversationHistory.length === 0 ? (
              <div className="text-center text-white/50 mt-8">
                <History size={48} className="mx-auto mb-4 opacity-30" />
                <p>No conversation history yet</p>
                <p className="text-xs mt-2">Start chatting to see your message history here</p>
              </div>
            ) : (
              conversationHistory.map((msg, index) => (
                <div
                  key={msg.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all cursor-pointer group hover:border-white/20 hover:scale-[1.02] hover:shadow-xl"
                  onClick={() => {
                    // Find corresponding message in the current chat
                    const correspondingMessage = messages.find(m =>
                      m.content.includes(msg.content.substring(0, 50)) ||
                      (msg.role === 'user' && m.type === 'user' && m.content === msg.content)
                    );
                    if (correspondingMessage) {
                      scrollToMessage(correspondingMessage.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                        }`}>
                        {msg.role === 'user' ? (
                          <User className="text-white" size={14} />
                        ) : (
                          <Bot className="text-white" size={14} />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${msg.role === 'user' ? 'text-blue-300' : 'text-purple-300'
                        }`}>
                        {msg.role === 'user' ? 'You' : 'Assistant'}
                      </span>
                    </div>
                    <span className="text-xs text-white/50">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-sm text-white/90 line-clamp-3 group-hover:line-clamp-none transition-all mb-3">
                    {msg.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {msg.message_type === 'allocation_confirmed' && (
                        <span className="inline-block px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-400/30">
                          ✅ Confirmed
                        </span>
                      )}
                      {msg.message_type === 'allocation_rejected' && (
                        <span className="inline-block px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-400/30">
                          ❌ Rejected
                        </span>
                      )}
                      {msg.message_type === 'allocation_preview' && (
                        <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-400/30">
                          ⏳ Preview
                        </span>
                      )}
                      {msg.sql && (
                        <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30">
                          SQL
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to jump →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
