/**
 * Step Tracker - Tracks execution steps for timeline visualization
 * 
 * Captures:
 * - Current executing line
 * - Variable state at each step
 * - Call stack changes
 * - Execution flow
 */

class StepTracker {
  constructor() {
    this.steps = [];
    this.currentStep = 0;
    this.isPlaying = false;
    this.speed = 1.0; // 0.5x, 1x, 2x, 5x
    this.callStack = [];
    this.variableSnapshots = new Map(); // line -> variables
  }

  /**
   * Add a new execution step
   */
  addStep(stepData) {
    const step = {
      id: this.steps.length + 1,
      line: stepData.line || 0,
      type: stepData.type || 'statement', // 'statement', 'function_call', 'return', 'error'
      variables: { ...stepData.variables } || {},
      callStack: [...this.callStack],
      timestamp: Date.now(),
      message: stepData.message || '',
      error: stepData.error || null
    };

    this.steps.push(step);
    this.variableSnapshots.set(step.line, { ...step.variables });
    return step;
  }

  /**
   * Push function call onto call stack
   */
  pushCallStack(functionName, line) {
    this.callStack.push({ name: functionName, line });
  }

  /**
   * Pop function call from call stack
   */
  popCallStack() {
    return this.callStack.pop();
  }

  /**
   * Get current step
   */
  getCurrentStep() {
    return this.steps[this.currentStep] || null;
  }

  /**
   * Move to next step
   */
  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      return this.getCurrentStep();
    }
    return null;
  }

  /**
   * Move to previous step
   */
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      return this.getCurrentStep();
    }
    return null;
  }

  /**
   * Jump to specific step
   */
  jumpToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStep = stepIndex;
      return this.getCurrentStep();
    }
    return null;
  }

  /**
   * Get variable changes between steps
   */
  getVariableChanges(fromStep, toStep) {
    if (!this.steps[fromStep] || !this.steps[toStep]) {
      return {};
    }

    const fromVars = this.steps[fromStep].variables || {};
    const toVars = this.steps[toStep].variables || {};
    const changes = {};

    // Find changed variables
    const allKeys = new Set([...Object.keys(fromVars), ...Object.keys(toVars)]);
    
    for (const key of allKeys) {
      const fromVal = fromVars[key];
      const toVal = toVars[key];
      
      if (JSON.stringify(fromVal) !== JSON.stringify(toVal)) {
        changes[key] = {
          from: fromVal,
          to: toVal,
          changed: true
        };
      }
    }

    return changes;
  }

  /**
   * Get variables at specific step
   */
  getVariablesAtStep(stepIndex) {
    const step = this.steps[stepIndex];
    return step ? step.variables : {};
  }

  /**
   * Clear all steps
   */
  reset() {
    this.steps = [];
    this.currentStep = 0;
    this.callStack = [];
    this.variableSnapshots.clear();
    this.isPlaying = false;
  }

  /**
   * Get execution summary
   */
  getSummary() {
    return {
      totalSteps: this.steps.length,
      currentStep: this.currentStep,
      hasErrors: this.steps.some(s => s.error),
      functionCalls: this.steps.filter(s => s.type === 'function_call').length,
      executionTime: this.steps.length > 0 
        ? this.steps[this.steps.length - 1].timestamp - this.steps[0].timestamp
        : 0
    };
  }

  /**
   * Export steps for serialization
   */
  export() {
    return {
      steps: this.steps,
      callStack: this.callStack,
      summary: this.getSummary()
    };
  }

  /**
   * Import steps from serialized data
   */
  import(data) {
    this.steps = data.steps || [];
    this.callStack = data.callStack || [];
    this.currentStep = 0;
  }
}

module.exports = StepTracker;




