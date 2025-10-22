import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, X, MessageSquare } from 'lucide-react';

const VoiceAssistant = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: 'Hello! I\'m Qwipo, your AI retail assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [volume, setVolume] = useState(0.7);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          handleVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleVoiceCommand = async (command) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: command,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Process command and generate response
    const response = await processCommand(command.toLowerCase());
    
    const assistantMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      text: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    speakText(response);
  };

  const processCommand = async (command) => {
    // Simple command processing
    if (command.includes('stock') || command.includes('inventory')) {
      return 'I can help you check your stock levels. You currently have 142 products with 3 items running low on stock. Would you like me to show you the low stock items?';
    }
    
    if (command.includes('sales') || command.includes('revenue')) {
      return 'Your sales are looking great! You\'ve sold ₹45,000 worth of products this week, which is 15% higher than last week.';
    }
    
    if (command.includes('order') || command.includes('reorder')) {
      return 'I can help you place orders. Which products would you like to reorder? I can also suggest products based on your sales patterns.';
    }
    
    if (command.includes('analytics') || command.includes('report')) {
      return 'Your analytics show that Maggi Noodles and Coca Cola are your top-selling products. Would you like me to generate a detailed report?';
    }
    
    if (command.includes('help')) {
      return 'I can help you with stock management, sales analytics, order processing, and product recommendations. Just tell me what you need!';
    }
    
    return 'I understand you said "' + command + '". Could you please be more specific about what you\'d like me to help you with?';
  };

  const speakText = (text) => {
    if (!synthRef.current) return;

    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = volume;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleVolume = () => {
    if (synthRef.current) {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      } else {
        setVolume(volume === 0 ? 0.7 : 0);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-dark-100 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Qwipo AI Assistant</h1>
              <p className="text-dark-400 text-sm">Your retail intelligence companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-primary text-dark-100'
                    : 'bg-dark-200 text-white'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-dark-200' : 'text-dark-400'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Current transcript */}
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-primary/20 text-primary">
                <p className="text-sm">{transcript}</p>
                <p className="text-xs mt-1 text-primary/70">Listening...</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-dark-300">
          {/* Voice visualization */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <motion.button
                onClick={isListening ? stopListening : startListening}
                disabled={isSpeaking}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : isSpeaking
                    ? 'bg-primary text-dark-100'
                    : 'bg-primary/20 text-primary hover:bg-primary/30'
                }`}
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </motion.button>

              {/* Sound waves animation */}
              {isListening && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-20 h-20 border-2 border-primary/30 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={toggleVolume}
              className={`p-3 rounded-full transition-all duration-300 ${
                volume === 0 ? 'bg-red-500/20 text-red-400' : 'bg-dark-200 text-dark-400 hover:bg-dark-300'
              }`}
            >
              {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={isListening ? stopListening : startListening}
              className="px-6 py-3 bg-primary text-dark-100 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {isListening ? 'Stop Listening' : 'Start Voice Command'}
            </button>
          </div>

          {/* Quick commands */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              'Check stock levels',
              'Show sales analytics',
              'Place new order',
              'Generate report'
            ].map((command) => (
              <button
                key={command}
                onClick={() => handleVoiceCommand(command)}
                className="p-2 text-xs bg-dark-200 text-dark-400 rounded-lg hover:bg-dark-300 transition-colors"
              >
                {command}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceAssistant;
