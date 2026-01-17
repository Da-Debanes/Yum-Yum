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
  maxBossesOnScreen: 2,
  maxBossBubblesOnScreen: 2,

  // Transition Sequence
  transitionFlashDuration: 400,
  transitionCallingDuration: 400,
  transitionSlideDuration: 400,
  
  // Chaos Sabotage
  sabotageWhileTypingEnabled: true,
  sabotageWhileTypingIntervalMs: 6000,
  sabotageWhileTypingChance: 0.3,
  maxInsertedLength: 3,
  
  // Time Check
  timeCheckUpdateIntervalMs: 1000,
  
  // Undo/Life Advice
  lifeAdviceEnabled: true,
  
  // Easter Eggs
  blueUnderlineProbability: 0.2,
  correctWordUnderlineChance: 0.3,
  correctWordMinLength: 4,
  correctWordTooltipEnabled: true,
  maxUnderlinesAtOnce: 5,
  
  // Features
  enableFocusGaslighting: true,
  enableSabotage: true,
  enableBlueUnderline: true
};
