export const chaosConfig = {
  // Friends Phase
  typingDebounce: 300,
  friendSuggestionInterval: 2000,
  rejectionsToManagers: 5,
  friendsSuggestWhileTyping: true,
  friendsWhileTypingIntervalMs: 3000,
  friendsWhileTypingChance: 0.7,
  
  // Managers Phase
  managerTransitionDuration: 3000,
  chaosPopupCooldown: 15000,
  gaslightingProbability: 0.3,
  sabotageFrequency: 3000,
  bossSpawnSafeMarginPx: 20,
  bossSpawnHeaderExclusionPx: 60,
  bossRandomSpawnEnabled: true,
  
  // Chaos Sabotage
  sabotageWhileTypingEnabled: true,
  sabotageWhileTypingIntervalMs: 4000,
  sabotageWhileTypingChance: 0.4,
  
  // Time Check
  timeCheckUpdateIntervalMs: 500,
  
  // Easter Eggs
  blueUnderlineProbability: 0.2,
  correctWordUnderlineChance: 0.3,
  correctWordMinLength: 4,
  correctWordTooltipEnabled: true,
  
  // Features
  enableFocusGaslighting: true,
  enableSabotage: true,
  enableBlueUnderline: true
};
