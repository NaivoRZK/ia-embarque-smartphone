import { Text, TextInput, View, TouchableOpacity } from 'react-native';

interface ChatInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onSend: () => void;
  onStop: () => void;
  onReset: () => void;
  isGenerating: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  voiceError: string;
  voiceAvailable: boolean;
  onMicPress: () => void;
}

function Waveform() {
  return (
    <View className="flex-row items-end h-3 gap-[2px]">
      <View className="w-[2px] h-1.5 bg-white rounded-full" />
      <View className="w-[2px] h-2.5 bg-white rounded-full" />
      <View className="w-[2px] h-1 bg-white rounded-full" />
      <View className="w-[2px] h-3 bg-white rounded-full" />
      <View className="w-[2px] h-1.5 bg-white rounded-full" />
      <View className="w-[2px] h-2 bg-white rounded-full" />
    </View>
  );
}

export function ChatInput({
  inputText,
  onInputChange,
  onSend,
  onStop,
  onReset,
  isGenerating,
  isSpeaking,
  isListening,
  voiceError,
  voiceAvailable,
  onMicPress,
}: ChatInputProps) {
  const isLocked = isGenerating || isSpeaking;
  const canSend = inputText.trim().length > 0 && !isLocked;
  const sendButtonStyle = canSend ? 'bg-primary' : 'bg-neutral-200';

  return (
    <View className="bg-white border-t border-neutral-100">
      {voiceError.length > 0 && (
        <View className="px-4 pt-1.5">
          <View className="bg-user-surface rounded-lg px-3 py-1.5">
            <View className="flex-row items-center gap-1.5">
              <View className="w-1.5 h-1.5 bg-user rounded-full" />
              <Text className="text-xs text-user">{voiceError}</Text>
            </View>
          </View>
        </View>
      )}
      <View className="flex-row items-end px-3 pt-1.5 pb-2 gap-x-2">
        {voiceAvailable && (
          <TouchableOpacity
            className={`w-9 h-9 rounded-full justify-center items-center ${
              isListening
                ? 'bg-primary border-2 border-primary'
                : 'bg-transparent border border-neutral-300'
            }`}
            onPress={onMicPress}
          >
            {isListening ? <Waveform /> : <Text className="text-base opacity-50">🎤</Text>}
          </TouchableOpacity>
        )}

        <View className="flex-1 bg-neutral-100 rounded-2xl px-3.5 border border-neutral-200">
          <TextInput
            className="min-h-[36px] max-h-[100px] py-2 text-base text-neutral-800"
            value={inputText}
            onChangeText={onInputChange}
            placeholder="Écrivez votre message..."
            placeholderTextColor="#aaa"
            multiline
            maxLength={4096}
            editable={!isLocked}
          />
        </View>

        {!isLocked && (
          <TouchableOpacity
            className="w-9 h-9 rounded-full justify-center items-center bg-transparent border border-neutral-300"
            onPress={onReset}
          >
            <Text className="text-base opacity-50">↺</Text>
          </TouchableOpacity>
        )}

        {isSpeaking ? (
          <TouchableOpacity
            className="w-9 h-9 rounded-full justify-center items-center bg-red-500"
            onPress={onStop}
          >
            <Text className="text-white text-base font-bold">■</Text>
          </TouchableOpacity>
        ) : isGenerating ? (
          <View className="w-9 h-9 rounded-full justify-center items-center bg-primary">
            <View className="flex-row gap-[2px]">
              <View className="w-0.5 h-2 bg-white rounded-full" />
              <View className="w-0.5 h-3 bg-white rounded-full" />
              <View className="w-0.5 h-2 bg-white rounded-full" />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            className={`w-9 h-9 rounded-full justify-center items-center ${sendButtonStyle}`}
            onPress={onSend}
            disabled={!canSend}
          >
            <Text className="text-white text-base font-bold">↑</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
