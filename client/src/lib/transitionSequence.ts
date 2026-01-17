export type TransitionStep = "FLASH" | "CALLING" | "SLIDE" | "NONE";

interface TransitionTimings {
  flashDuration: number;
  callingDuration: number;
  slideDuration: number;
}

interface TransitionSequenceOptions {
  onStep: (step: TransitionStep) => void;
  onComplete: () => void;
  timings: TransitionTimings;
}

export function runTransitionSequence({
  onStep,
  onComplete,
  timings,
}: TransitionSequenceOptions) {
  let isActive = true;
  const { flashDuration, callingDuration, slideDuration } = timings;

  const flashTimer = setTimeout(() => {
    if (isActive) onStep("CALLING");
  }, flashDuration);

  const callingTimer = setTimeout(() => {
    if (isActive) onStep("SLIDE");
  }, flashDuration + callingDuration);

  const slideTimer = setTimeout(() => {
    if (!isActive) return;
    onStep("NONE");
    onComplete();
  }, flashDuration + callingDuration + slideDuration);

  return () => {
    isActive = false;
    clearTimeout(flashTimer);
    clearTimeout(callingTimer);
    clearTimeout(slideTimer);
  };
}
