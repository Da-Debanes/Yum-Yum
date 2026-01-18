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

  onStep("CALLING");

  const callingTimer = setTimeout(() => {
    if (!isActive) return;
    onStep("SLIDE");
  }, callingDuration);

  const slideTimer = setTimeout(() => {
    if (!isActive) return;
    onStep("FLASH");
  }, callingDuration + slideDuration);

  const flashTimer = setTimeout(() => {
    if (!isActive) return;
    onStep("NONE");
    onComplete();
  }, callingDuration + slideDuration + flashDuration);

  return () => {
    isActive = false;
    clearTimeout(callingTimer);
    clearTimeout(slideTimer);
    clearTimeout(flashTimer);
  };
}
