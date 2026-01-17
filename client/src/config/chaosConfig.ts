export const chaosConfig = {
  // Friends Phase
  typingDebounce: 500, // ms after typing stops before friends suggest
  friendSuggestionInterval: 3000, // ms between suggestions
  rejectionsToManagers: 5, // number of rejections before switching
  
  // Managers Phase
  managerTransitionDuration: 3000, // ms for the cinematic transition
  chaosPopupCooldown: 15000, // ms between focus popups
  gaslightingProbability: 0.3, // chance of sabotage occurring
  sabotageFrequency: 3000, // ms between sabotage checks
  
  // Easter Eggs
  blueUnderlineProbability: 0.2, // chance of a "correct" word getting underlined
  
  // Features
  enableFocusGaslighting: true,
  enableSabotage: true,
  enableBlueUnderline: true
};
