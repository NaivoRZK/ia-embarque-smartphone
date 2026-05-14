import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import type { ScreenState } from '../../entities/ScreenState';

interface SetupViewProps {
  state: ScreenState;
  progress: number;
  errorMsg: string;
  onRetry: () => void;
}

function DownloadingView({ progress }: { progress: number }) {
  return (
    <View className="flex-1 justify-center items-center px-8 bg-primary">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="text-white text-xl font-bold mt-4 mb-2 text-center">
        Téléchargement...
      </Text>
      <Text className="text-white/80 text-sm text-center mb-6 leading-5">
        {progress}%
      </Text>
      <View className="w-4/5 h-2 bg-white/30 rounded-full overflow-hidden">
        <View
          className="h-full bg-white rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
}

function LoadingView({ progress }: { progress: number }) {
  return (
    <View className="flex-1 justify-center items-center px-8 bg-primary">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="text-white text-xl font-bold mt-4 mb-2 text-center">
        Chargement en cours...
      </Text>
      {progress > 0 && (
        <View className="w-4/5 h-2 bg-white/30 rounded-full overflow-hidden">
          <View
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      )}
    </View>
  );
}

function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View className="flex-1 justify-center items-center px-8 bg-primary">
      <Text className="text-white text-xl font-bold text-center">
        {'\u26A0\uFE0F'} Erreur
      </Text>
      <Text className="text-white/80 text-sm text-center mb-6 leading-5">
        {message}
      </Text>
      <TouchableOpacity
        className="bg-white px-8 py-3.5 rounded-full"
        onPress={onRetry}
      >
        <Text className="text-primary text-base font-semibold">
          {'\uD83D\uDD04'} Réessayer
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function SetupView({ state, progress, errorMsg, onRetry }: SetupViewProps) {
  switch (state) {
    case 'downloading':
      return <DownloadingView progress={progress} />;
    case 'loading':
      return <LoadingView progress={progress} />;
    case 'error':
      return <ErrorView message={errorMsg} onRetry={onRetry} />;
    default:
      return null;
  }
}
