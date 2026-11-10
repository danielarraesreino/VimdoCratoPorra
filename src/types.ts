export interface ScriptSegment {
  id: string;
  title: string;
  subtitle: string;
  timeframe: string;
  category: 'video' | 'carrossel' | 'custom';
  spokenText: string;
  rawMarkdown: string;
}

export interface VoiceProfile {
  id: string;
  name: string;
  desc: string;
  voiceName: string;
  style: string;
}

export interface SlideData {
  number: number;
  title: string;
  subtitle: string;
  content: string;
  spokenAudioText: string;
  iconName: string;
}
