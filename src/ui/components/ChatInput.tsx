import { TextInput, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ChatInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onSend: () => void;
  isGenerating: boolean;
  isListening: boolean;
  voiceError: string;
  onMicPress: () => void;
}

export function ChatInput({
  inputText,
  onInputChange,
  onSend,
  isGenerating,
  isListening,
  voiceError,
  onMicPress,
}: ChatInputProps) {
  const micButtonStyle = isListening
    ? 'bg-user-surface border border-user'
    : 'bg-neutral-100 border border-neutral-200';

  const canSend = inputText.trim().length > 0 && !isGenerating;
  const sendButtonStyle = canSend ? 'bg-primary' : 'bg-primary-light';

  return (
    <View className="bg-white border-t border-neutral-200">
      {voiceError.length > 0 && (
        <Text className="text-user text-xs text-center px-3 pt-1 pb-0.5">
          {voiceError}
        </Text>
      )}
      <View className="flex-row items-end px-2 pt-1">
        <TouchableOpacity
          className={`w-11 h-11 rounded-full justify-center items-center mr-1.5 ${micButtonStyle}`}
          onPress={onMicPress}
          disabled={isGenerating}
        >
          <Text className="text-xl">
            {isListening ? '\u23F9' : '\uD83C\uDFA4'}
          </Text>
        </TouchableOpacity>

        <TextInput
          className="flex-1 min-h-[40px] max-h-[120px] bg-neutral-100 rounded-full px-4 py-2.5 text-base text-neutral-700 mr-1.5 border border-neutral-200"
          value={inputText}
          onChangeText={onInputChange}
          placeholder="Écrivez votre message..."
          placeholderTextColor="#999"
          multiline
          maxLength={4096}
          editable={!isGenerating}
        />

        <TouchableOpacity
          className={`w-11 h-11 rounded-full justify-center items-center ${sendButtonStyle}`}
          onPress={onSend}
          disabled={!canSend}
        >
          {isGenerating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white text-xl font-bold">{'\u2191'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
