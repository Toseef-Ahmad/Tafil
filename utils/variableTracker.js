/**
 * Variable Tracker - Tracks variable state changes during execution
 * 
 * Features:
 * - Live variable tracking
 * - Scope detection (global/local/closure)
 * - Historical snapshots
 * - Change highlighting
 */

class VariableTracker {
  constructor() {
    this.variables = new Map(); // variableName -> VariableInfo
    this.scopes = new Map(); // scopeId -> { variables: Set, parent: scopeId }
    this.currentScope = 'global';
    this.scopeStack = ['global'];
    this.history = []; // Array of snapshots
  }

  /**
   * Variable info structure
   */
  createVariableInfo(name, value, scope = 'global', type = null) {
    return {
      name,
      value: this.deepClone(value),
      scope,
      type: type || this.inferType(value),
      line: null, // Will be set when variable is used
      changed: false,
      history: [] // Track value changes over time
    };
  }

  /**
   * Infer variable type
   */
  inferType(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return typeof value;
  }

  /**
   * Deep clone value (for tracking)
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }
    return obj;
  }

  /**
   * Set variable value
   */
  setVariable(name, value, line = null) {
    const existing = this.variables.get(name);
    const currentScope = this.scopeStack[this.scopeStack.length - 1];

    if (existing) {
      // Variable exists - check if value changed
      const oldValue = existing.value;
      const changed = JSON.stringify(oldValue) !== JSON.stringify(value);
      
      existing.value = this.deepClone(value);
      existing.line = line;
      existing.changed = changed;
      existing.scope = currentScope;

      if (changed) {
        existing.history.push({
          from: oldValue,
          to: value,
          line,
          timestamp: Date.now()
        });
      }
    } else {
      // New variable
      const info = this.createVariableInfo(name, value, currentScope);
      info.line = line;
      this.variables.set(name, info);
      
      // Add to current scope
      if (!this.scopes.has(currentScope)) {
        this.scopes.set(currentScope, { variables: new Set(), parent: null });
      }
      this.scopes.get(currentScope).variables.add(name);
    }

    return this.variables.get(name);
  }

  /**
   * Get variable value
   */
  getVariable(name) {
    return this.variables.get(name);
  }

  /**
   * Get all variables in current scope
   */
  getVariablesInScope(scope = null) {
    const targetScope = scope || this.currentScope;
    const scopeInfo = this.scopes.get(targetScope);
    
    if (!scopeInfo) return [];

    const vars = [];
    for (const varName of scopeInfo.variables) {
      const varInfo = this.variables.get(varName);
      if (varInfo) vars.push(varInfo);
    }
    return vars;
  }

  /**
   * Get all variables (all scopes)
   */
  getAllVariables() {
    const vars = [];
    for (const [name, info] of this.variables.entries()) {
      vars.push(info);
    }
    return vars;
  }

  /**
   * Enter new scope (function call, block, etc.)
   */
  enterScope(scopeId, parentScope = null) {
    this.scopeStack.push(scopeId);
    this.currentScope = scopeId;
    
    if (!this.scopes.has(scopeId)) {
      this.scopes.set(scopeId, {
        variables: new Set(),
        parent: parentScope || this.scopeStack[this.scopeStack.length - 2]
      });
    }
  }

  /**
   * Exit current scope
   */
  exitScope() {
    if (this.scopeStack.length > 1) {
      this.scopeStack.pop();
      this.currentScope = this.scopeStack[this.scopeStack.length - 1];
    }
  }

  /**
   * Create snapshot of current state
   */
  createSnapshot(stepId = null) {
    const snapshot = {
      stepId,
      timestamp: Date.now(),
      variables: {},
      scopes: {}
    };

    // Snapshot all variables
    for (const [name, info] of this.variables.entries()) {
      snapshot.variables[name] = {
        value: this.deepClone(info.value),
        scope: info.scope,
        type: info.type,
        changed: info.changed
      };
    }

    // Snapshot scope structure
    for (const [scopeId, scopeInfo] of this.scopes.entries()) {
      snapshot.scopes[scopeId] = {
        variables: Array.from(scopeInfo.variables),
        parent: scopeInfo.parent
      };
    }

    this.history.push(snapshot);
    return snapshot;
  }

  /**
   * Get snapshot at specific step
   */
  getSnapshotAtStep(stepId) {
    return this.history.find(s => s.stepId === stepId) || null;
  }

  /**
   * Get changed variables since last snapshot
   */
  getChangedVariables() {
    const changed = [];
    for (const [name, info] of this.variables.entries()) {
      if (info.changed) {
        changed.push(info);
      }
    }
    return changed;
  }

  /**
   * Reset all tracking
   */
  reset() {
    this.variables.clear();
    this.scopes.clear();
    this.currentScope = 'global';
    this.scopeStack = ['global'];
    this.history = [];
  }

  /**
   * Get variable by scope hierarchy (for closure resolution)
   */
  findVariableInScopeHierarchy(name) {
    // Search from current scope up to global
    for (let i = this.scopeStack.length - 1; i >= 0; i--) {
      const scope = this.scopeStack[i];
      const scopeInfo = this.scopes.get(scope);
      
      if (scopeInfo && scopeInfo.variables.has(name)) {
        return this.variables.get(name);
      }
    }
    return null;
  }

  /**
   * Export state for serialization
   */
  export() {
    return {
      variables: Array.from(this.variables.entries()),
      scopes: Array.from(this.scopes.entries()).map(([id, info]) => ({
        id,
        variables: Array.from(info.variables),
        parent: info.parent
      })),
      currentScope: this.currentScope,
      scopeStack: this.scopeStack,
      history: this.history
    };
  }

  /**
   * Import state from serialized data
   */
  import(data) {
    this.variables = new Map(data.variables || []);
    this.scopes = new Map(
      (data.scopes || []).map(item => [
        item.id,
        {
          variables: new Set(item.variables),
          parent: item.parent
        }
      ])
    );
    this.currentScope = data.currentScope || 'global';
    this.scopeStack = data.scopeStack || ['global'];
    this.history = data.history || [];
  }
}

module.exports = VariableTracker;


