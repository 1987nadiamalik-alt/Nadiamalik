
import { Question, DigitType, QuizCategory, AbacusRule, MultiplicationLevel } from '../types';

class AbacusState {
  isSmallFriendNeeded(current: number, add: number): boolean {
    const c = current % 10;
    const a = add;
    if (a > 0) {
      const lowerBeads = c < 5 ? c : c - 5;
      return (lowerBeads + a >= 5) && (c < 5);
    } else {
      const lowerBeads = c < 5 ? c : c - 5;
      return (lowerBeads + a < 0) && (c >= 5);
    }
  }

  isBigFriendNeeded(current: number, add: number): boolean {
    const c = current % 10;
    const a = add;
    if (a > 0) return (c + a >= 10);
    return (c + a < 0);
  }
}

export const generateAdditionQuestion = (rowCount: number, digitType: DigitType, rule: AbacusRule): Question => {
  const rows: number[] = [];
  let currentTotal = 0;
  const state = new AbacusState();

  for (let i = 0; i < rowCount; i++) {
    let nextVal: number = 0;
    let attempts = 0;

    while (attempts < 100) {
      attempts++;
      let val: number;
      if (digitType === 'single') val = Math.floor(Math.random() * 9) + 1;
      else if (digitType === 'double') val = Math.floor(Math.random() * 90) + 10;
      else val = Math.random() > 0.5 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 90) + 10;

      const isSub = i > 0 && Math.random() > 0.4;
      const signedVal = isSub ? -val : val;

      if (currentTotal + signedVal < 0 || currentTotal + signedVal > 100) continue;

      if (rule === 'small-friends') {
        const absVal = Math.abs(signedVal) % 10;
        if (absVal > 4 || absVal === 0) continue;
        if (!state.isSmallFriendNeeded(currentTotal, signedVal) && attempts < 50) continue;
      } else if (rule === 'big-friends') {
        if (!state.isBigFriendNeeded(currentTotal, signedVal) && attempts < 50) continue;
      } else if (rule === 'mixed-friends') {
        const absVal = Math.abs(signedVal) % 10;
        if (absVal < 6) continue;
        if (!state.isBigFriendNeeded(currentTotal, signedVal) && attempts < 50) continue;
      }

      nextVal = signedVal;
      break;
    }

    if (nextVal === 0) nextVal = currentTotal > 50 ? -1 : 1;
    rows.push(nextVal);
    currentTotal += nextVal;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    rows,
    answer: currentTotal,
    category: 'addition',
    rule,
  };
};

export const generateMultiplicationQuestion = (level: MultiplicationLevel): Question => {
  let a: number, b: number;
  let attempts = 0;
  
  while (attempts < 200) {
    attempts++;
    switch (level) {
      case '1x1': // Result 2 digits (10-81)
        a = Math.floor(Math.random() * 8) + 2;
        b = Math.floor(Math.random() * 8) + 2;
        if (a * b >= 10) break;
        continue;
      case '2x1': // Result 3 digits (100-891)
        a = Math.floor(Math.random() * 90) + 10;
        b = Math.floor(Math.random() * 9) + 1;
        if (a * b >= 100 && a * b < 1000) break;
        continue;
      case '3x1': // Result 4 digits (multiplier restricted to 2, 3, 4, 5)
        a = Math.floor(Math.random() * 900) + 100;
        b = Math.floor(Math.random() * 4) + 2; // Generates 2, 3, 4, or 5
        if (a * b >= 1000 && a * b < 10000) break;
        continue;
      case '2x2': // Result 3 or 4 digits
        a = Math.floor(Math.random() * 90) + 10;
        b = Math.floor(Math.random() * 90) + 10;
        if (a * b >= 100) break;
        continue;
      default:
        a = 2; b = 5;
    }
    return {
      id: Math.random().toString(36).substr(2, 9),
      rows: [a, b],
      answer: a * b,
      category: 'multiplication',
      multLevel: level,
    };
  }
  
  return { id: 'fallback', rows: [100, 5], answer: 500, category: 'multiplication', multLevel: level };
};

export const generateQuizSet = (settings: { category: QuizCategory, rule: AbacusRule, multLevel: MultiplicationLevel, count: number, rowCount: number, digitType: DigitType }): Question[] => {
  return Array.from({ length: settings.count }, () => {
    if (settings.category === 'multiplication') {
      return generateMultiplicationQuestion(settings.multLevel);
    }
    return generateAdditionQuestion(settings.rowCount, settings.digitType, settings.rule);
  });
};
