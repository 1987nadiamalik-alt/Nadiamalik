
export type DigitType = 'single' | 'double' | 'mixed';
export type QuizCategory = 'addition' | 'multiplication';
export type AbacusRule = 'standard' | 'small-friends' | 'big-friends' | 'mixed-friends';
export type MultiplicationLevel = '1x1' | '2x1' | '3x1' | '2x2';

export interface Question {
  id: string;
  rows: number[];
  answer: number;
  category: QuizCategory;
  rule?: AbacusRule;
  multLevel?: MultiplicationLevel;
}

export interface QuizSettings {
  category: QuizCategory;
  rule: AbacusRule;
  multLevel: MultiplicationLevel;
  questionCount: number;
  timePerQuestion: number;
  digitType: DigitType;
  rowCount: number;
  enableAudio: boolean;
}

export type QuizStatus = 'idle' | 'running' | 'paused' | 'finished';
