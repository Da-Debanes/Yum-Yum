import assert from "node:assert/strict";
import { runTransitionSequence } from "../client/src/lib/transitionSequence";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTest() {
  const steps: string[] = [];
  let completeCount = 0;

  const flashDuration = 10;
  const callingDuration = 10;
  const slideDuration = 10;
  const totalDuration = callingDuration + slideDuration + flashDuration;

  const cleanup = runTransitionSequence({
    onStep: (step) => steps.push(step),
    onComplete: () => {
      completeCount += 1;
    },
    timings: {
      flashDuration,
      callingDuration,
      slideDuration,
    },
  });

  await sleep(totalDuration + 5);

  assert.equal(completeCount, 1, "onComplete should fire exactly once");
  assert.equal(steps.at(-1), "NONE", "final step should be NONE");
  assert.equal(steps[0], "CALLING", "first step should be CALLING");

  const stepsAfterComplete = steps.length;
  await sleep(totalDuration);

  assert.equal(completeCount, 1, "onComplete should not fire again");
  assert.equal(
    steps.length,
    stepsAfterComplete,
    "no additional steps should be emitted after completion",
  );

  cleanup();
  console.log("TransitionSequence test passed.");
}

runTest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
