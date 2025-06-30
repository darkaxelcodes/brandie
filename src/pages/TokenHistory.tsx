import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  ArrowLeft, 
  Download, 
  Plus, 
  Minus, 
  RefreshCw,
  Clock,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { tokenService, TokenTransaction } from '../lib/tokenService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTokens } from '../contexts/TokenContext';

export const TokenHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { tokenBalance, refreshTokenBalance } = useTokens();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'used' | 'added'>('all');

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const history = await tokenService.getTransactionHistory(user.id);
      setTransactions(history);
    } catch (error) {
      console.error('Error loading token history:', error);
      showToast('error', 'Failed to load token history');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'used') return transaction.amount < 0;
    if (filter === 'added') return transaction.amount > 0;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getActionTypeLabel = (actionType: string) => {
    // Map action types to more user-friendly labels
    const actionLabels: Record<string, string> = {
      'ai_logo_generation': 'Logo Generation',
      'ai_color_generation': 'Color Palette Generation',
      'ai_typography_generation': 'Typography Generation',
      'ai_voice_generation': 'Voice Generation',
      'ai_guidelines_generation': 'Guidelines Generation',
      'ai_chat_response': 'AI Chat Response',
      'ai_strategy_suggestion': 'Strategy Suggestion',
      'ai_compliance_check': 'Compliance Check',
      'purchase': 'Token Purchase',
      'admin_grant': 'Admin Grant'
    };
    
    return actionLabels[actionType] || actionType;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Coins className="w-8 h-8 text-amber-600" />
              AI Token History
            </h1>
            <p className="text-gray-600 mt-1">
              Track your AI token usage and purchases
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={loadTransactions}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
            <Button
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600"
            >
              <Plus className="w-4 h-4" />
              <span>Buy Tokens</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Token Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-xl">
                <Coins className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-600">Current Balance</p>
                <h2 className="text-3xl font-bold text-gray-900">{tokenBalance} Tokens</h2>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                className="bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Purchase Tokens</span>
              </Button>
              <p className="text-xs text-center text-amber-700">
                Each AI action costs 1 token
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'all' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('used')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'used' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Used
                </button>
                <button
                  onClick={() => setFilter('added')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'added' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Added
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading transaction history...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Coins className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'You haven\'t used or purchased any tokens yet.' 
                  : filter === 'used'
                  ? 'You haven\'t used any tokens yet.'
                  : 'You haven\'t added any tokens yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(transaction.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getActionTypeLabel(transaction.action_type)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {transaction.description || transaction.action_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <span className={`inline-flex items-center ${
                          transaction.amount > 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? (
                            <Plus className="w-4 h-4 mr-1" />
                          ) : (
                            <Minus className="w-4 h-4 mr-1" />
                          )}
                          {Math.abs(transaction.amount)} token{Math.abs(transaction.amount) !== 1 ? 's' : ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Token Usage Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About AI Tokens</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              AI tokens are used to power the AI features in Brandie. Each AI action costs 1 token.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-medium text-blue-900 mb-2">Actions that use tokens:</h3>
              <ul className="grid md:grid-cols-2 gap-2 text-blue-800">
                <li className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>AI Logo Generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>AI Color Palette Generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>AI Typography Recommendation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>AI Voice Analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>AI Guidelines Generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>AI Chat Responses</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>AI Strategy Suggestions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>AI Compliance Checking</span>
                </li>
              </ul>
            </div>
            
            <p className="text-gray-600">
              You can purchase more tokens at any time. New users receive 50 tokens upon signup.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TokenHistory;