export const chaosConfig = {
  // Friends Phase
  typingDebounce: 300,
  friendSuggestionInterval: 5000, // Slower for clean demo
  rejectionsToManagers: 5,
  friendsSuggestWhileTyping: true,
  friendsWhileTypingIntervalMs: 8000, // Much slower
  friendsWhileTypingChance: 0.5,
  
  // Managers Phase
  managerTransitionDuration: 3000,
  chaosPopupCooldown: 30000, // Longer cooldown
  gaslightingProbability: 0.2,
  sabotageFrequency: 5000,
  bossSpawnSafeMarginPx: 40,
  bossSpawnHeaderExclusionPx: 80,
  bossRandomSpawnEnabled: true,
  maxBossesOnScreen: 1,
  maxBossBubblesOnScreen: 1,
  
  // Chaos Sabotage
  sabotageWhileTypingEnabled: true,
  sabotageWhileTypingIntervalMs: 10000,
  sabotageWhileTypingChance: 0.2,
  
  // Time Check
  timeCheckUpdateIntervalMs: 1000,
  
  // Undo/Life Advice
  lifeAdviceEnabled: true,
  
  // Easter Eggs
  blueUnderlineProbability: 0.1,
  correctWordUnderlineChance: 0.2,
  correctWordMinLength: 4,
  correctWordTooltipEnabled: true,
  
  // Features
  enableFocusGaslighting: true,
  enableSabotage: true,
  enableBlueUnderline: true
};
