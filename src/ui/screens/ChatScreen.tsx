import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LlmService } from '../../logique/services/LlmService';
import { ModelService } from '../../logique/services/ModelService';
import { VoiceService } from '../../logique/services/VoiceService';
import { TtsService } from '../../logique/services/TtsService';
import { useChat } from '../../logique/hooks/useChat';
import { useVoice } from '../../logique/hooks/useVoice';
import { Header } from '../components/Header';
import { SetupView } from '../components/SetupView';
import { MessageList } from '../components/MessageList';
import { ChatInput } from '../components/ChatInput';
import type { ScreenState } from '../../entities/ScreenState';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const llmRef = useRef(new LlmService());
  const ttsRef = useRef(new TtsService());
  const voiceRef = useRef(new VoiceService());
  const modelServiceRef = useRef<ModelService | null>(null);

  useEffect(() => {
    ttsRef.current.init();
  }, []);

  useEffect(() => {
    const modelService = new ModelService(llmRef.current, (state, pct, err) => {
      setScreenState(state);
      setProgress(pct);
      if (err) setErrorMsg(err);
    });
    modelServiceRef.current = modelService;
    modelService.initialize();
  }, []);

  const { messages, isGenerating, isSpeaking, isLocked, doSend, resetMessages, cancelGeneration } = useChat(
    llmRef.current,
    ttsRef.current,
  );

  const handleStop = useCallback(() => {
    cancelGeneration();
  }, [cancelGeneration]);

  const handleReset = useCallback(() => {
    resetMessages();
    cancelGeneration();
  }, [resetMessages, cancelGeneration]);

  const handleVoiceResult = useCallback(
    (text: string) => {
      doSend(text);
    },
    [doSend],
  );

  const { isListening, voiceError, voiceAvailable, toggleMic, setupVoiceCallbacks } = useVoice(
    voiceRef.current,
    handleVoiceResult,
    false,
  );

  const handleMicPress = useCallback(() => {
    if (isLocked) {
      cancelGeneration();
      if (isListening) {
        toggleMic();
      }
      return;
    }
    toggleMic();
  }, [isLocked, isListening, toggleMic, cancelGeneration]);

  useEffect(() => {
    setupVoiceCallbacks();
    const voice = voiceRef.current;
    return () => {
      voice.destroy();
    };
  }, [setupVoiceCallbacks]);

  const handleSend = useCallback(() => {
    if (inputText.trim() && !isLocked) {
      doSend(inputText);
      setInputText('');
    }
  }, [inputText, isLocked, doSend]);

  const handleRetry = useCallback(() => {
    modelServiceRef.current?.initialize();
  }, []);

  if (screenState !== 'ready') {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <Header title="Tsaty" />
        <SetupView
          state={screenState}
          progress={progress}
          errorMsg={errorMsg}
          onRetry={handleRetry}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Header title="Tsaty" subtitle="Modèle local actif" />
      <MessageList messages={messages} isGenerating={isGenerating} />
      <ChatInput
        inputText={inputText}
        onInputChange={setInputText}
        onSend={handleSend}
        onStop={handleStop}
        onReset={handleReset}
        isGenerating={isGenerating}
        isSpeaking={isSpeaking}
        isListening={isListening}
        voiceError={voiceError}
        voiceAvailable={voiceAvailable}
        onMicPress={handleMicPress}
      />
    </KeyboardAvoidingView>
  );
}
