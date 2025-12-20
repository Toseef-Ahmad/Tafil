// DSA Visualizer for Playground
// Provides data structure visualization for students learning DSA

class DSAVisualizer {
  constructor(container) {
    this.container = container;
    this.structures = new Map(); // Track all visualized structures
  }

  // Visualize a Stack
  visualizeStack(stack, name = 'Stack') {
    const id = `stack-${Date.now()}`;
    const data = Array.isArray(stack) ? stack : (stack.items || stack.data || []);
    
    const html = `
      <div class="dsa-visualizer-item" id="${id}" style="margin-bottom: 24px;">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold" style="color: #fafafa;">${name}</h3>
          <span class="text-xs px-2 py-1 rounded" style="background: rgba(139, 92, 246, 0.15); color: #a78bfa;">
            Size: ${data.length}
          </span>
        </div>
        <div class="stack-visualization" style="min-height: 200px; display: flex; flex-direction: column-reverse; gap: 4px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
          ${data.length === 0 ? 
            '<div class="text-center text-xs" style="color: #52525b; padding: 20px;">Stack is empty</div>' :
            data.map((item, idx) => `
              <div class="stack-item" style="
                padding: 12px 16px; 
                background: ${idx === data.length - 1 ? 'linear-gradient(135deg, #a78bfa, #8b5cf6)' : 'rgba(139, 92, 246, 0.2)'}; 
                border: 1px solid ${idx === data.length - 1 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.1)'};
                border-radius: 6px;
                color: #fafafa;
                font-family: 'JetBrains Mono', monospace;
                font-size: 13px;
                text-align: center;
                ${idx === data.length - 1 ? 'box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);' : ''}
              ">
                ${this.formatValue(item)}
                ${idx === data.length - 1 ? '<div class="text-xs mt-1" style="color: rgba(255,255,255,0.7);">TOP</div>' : ''}
              </div>
            `).join('')
          }
        </div>
      </div>
    `;
    
    this.structures.set(name, { type: 'stack', id, data });
    return html;
  }

  // Visualize a Queue
  visualizeQueue(queue, name = 'Queue') {
    const id = `queue-${Date.now()}`;
    const data = Array.isArray(queue) ? queue : (queue.items || queue.data || []);
    
    const html = `
      <div class="dsa-visualizer-item" id="${id}" style="margin-bottom: 24px;">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold" style="color: #fafafa;">${name}</h3>
          <span class="text-xs px-2 py-1 rounded" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
            Size: ${data.length}
          </span>
        </div>
        <div class="queue-visualization" style="display: flex; gap: 4px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); min-height: 80px; align-items: center; flex-wrap: wrap;">
          ${data.length === 0 ? 
            '<div class="text-center text-xs w-full" style="color: #52525b; padding: 20px;">Queue is empty</div>' :
            data.map((item, idx) => `
              <div class="queue-item" style="
                padding: 12px 16px; 
                background: ${idx === 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(16, 185, 129, 0.2)'}; 
                border: 1px solid ${idx === 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.1)'};
                border-radius: 6px;
                color: #fafafa;
                font-family: 'JetBrains Mono', monospace;
                font-size: 13px;
                text-align: center;
                min-width: 60px;
                ${idx === 0 ? 'box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);' : ''}
              ">
                ${this.formatValue(item)}
                ${idx === 0 ? '<div class="text-xs mt-1" style="color: rgba(255,255,255,0.7);">FRONT</div>' : ''}
                ${idx === data.length - 1 ? '<div class="text-xs mt-1" style="color: rgba(255,255,255,0.7);">REAR</div>' : ''}
              </div>
            `).join('')
          }
        </div>
      </div>
    `;
    
    this.structures.set(name, { type: 'queue', id, data });
    return html;
  }

  // Visualize a Linked List
  visualizeLinkedList(head, name = 'Linked List') {
    const id = `linkedlist-${Date.now()}`;
    const nodes = [];
    let current = head;
    
    while (current && nodes.length < 50) { // Limit to prevent infinite loops
      nodes.push({
        value: current.val !== undefined ? current.val : (current.value !== undefined ? current.value : current.data),
        next: current.next
      });
      current = current.next;
      if (nodes.length >= 50) break; // Safety limit
    }
    
    const html = `
      <div class="dsa-visualizer-item" id="${id}" style="margin-bottom: 24px;">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold" style="color: #fafafa;">${name}</h3>
          <span class="text-xs px-2 py-1 rounded" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6;">
            Nodes: ${nodes.length}
          </span>
        </div>
        <div class="linkedlist-visualization" style="display: flex; gap: 8px; padding: 16px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); overflow-x: auto; align-items: center;">
          ${nodes.length === 0 ? 
            '<div class="text-center text-xs w-full" style="color: #52525b; padding: 20px;">List is empty (null)</div>' :
            nodes.map((node, idx) => `
              <div class="flex items-center gap-2">
                <div class="linkedlist-node" style="
                  padding: 12px 20px; 
                  background: linear-gradient(135deg, #3b82f6, #2563eb); 
                  border: 2px solid rgba(59, 130, 246, 0.4);
                  border-radius: 8px;
                  color: #fafafa;
                  font-family: 'JetBrains Mono', monospace;
                  font-size: 13px;
                  font-weight: 600;
                  min-width: 60px;
                  text-align: center;
                  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                  position: relative;
                ">
                  ${this.formatValue(node.value)}
                </div>
                ${idx < nodes.length - 1 ? `
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                ` : `
                  <div style="padding: 12px 8px; color: #52525b; font-family: 'JetBrains Mono', monospace; font-size: 12px;">null</div>
                `}
              </div>
            `).join('')
          }
        </div>
      </div>
    `;
    
    this.structures.set(name, { type: 'linkedlist', id, data: nodes });
    return html;
  }

  // Visualize a Binary Tree
  visualizeTree(root, name = 'Binary Tree') {
    const id = `tree-${Date.now()}`;
    
    // Convert tree to array representation for visualization
    const treeArray = this.treeToArray(root);
    
    const html = `
      <div class="dsa-visualizer-item" id="${id}" style="margin-bottom: 24px;">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold" style="color: #fafafa;">${name}</h3>
          <span class="text-xs px-2 py-1 rounded" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
            Nodes: ${treeArray.filter(n => n !== null).length}
          </span>
        </div>
        <div class="tree-visualization" style="padding: 20px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); overflow-x: auto;">
          ${this.renderTreeSVG(root)}
        </div>
      </div>
    `;
    
    this.structures.set(name, { type: 'tree', id, data: treeArray });
    return html;
  }

  // Visualize an Array with indices
  visualizeArray(arr, name = 'Array', highlightIndices = []) {
    const id = `array-${Date.now()}`;
    const data = Array.isArray(arr) ? arr : Object.values(arr);
    
    const html = `
      <div class="dsa-visualizer-item" id="${id}" style="margin-bottom: 24px;">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold" style="color: #fafafa;">${name}</h3>
          <span class="text-xs px-2 py-1 rounded" style="background: rgba(236, 72, 153, 0.15); color: #ec4899;">
            Length: ${data.length}
          </span>
        </div>
        <div class="array-visualization" style="display: flex; gap: 4px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap;">
          ${data.map((item, idx) => `
            <div class="array-item" style="
              padding: 12px 16px; 
              background: ${highlightIndices.includes(idx) ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'rgba(236, 72, 153, 0.2)'}; 
              border: 2px solid ${highlightIndices.includes(idx) ? 'rgba(236, 72, 153, 0.6)' : 'rgba(236, 72, 153, 0.1)'};
              border-radius: 6px;
              color: #fafafa;
              font-family: 'JetBrains Mono', monospace;
              font-size: 13px;
              text-align: center;
              min-width: 60px;
              position: relative;
              ${highlightIndices.includes(idx) ? 'box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4); transform: scale(1.05);' : ''}
            ">
              <div class="text-xs mb-1" style="color: rgba(255,255,255,0.6);">[${idx}]</div>
              <div style="font-weight: 600;">${this.formatValue(item)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    this.structures.set(name, { type: 'array', id, data });
    return html;
  }

  // Visualize a Graph (adjacency list)
  visualizeGraph(graph, name = 'Graph') {
    const id = `graph-${Date.now()}`;
    const nodes = Object.keys(graph);
    
    const html = `
      <div class="dsa-visualizer-item" id="${id}" style="margin-bottom: 24px;">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold" style="color: #fafafa;">${name}</h3>
          <span class="text-xs px-2 py-1 rounded" style="background: rgba(168, 85, 247, 0.15); color: #a855f7;">
            Nodes: ${nodes.length}
          </span>
        </div>
        <div class="graph-visualization" style="padding: 16px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
          ${nodes.map(node => {
            const neighbors = Array.isArray(graph[node]) ? graph[node] : Object.keys(graph[node] || {});
            return `
              <div class="graph-node" style="margin-bottom: 12px; padding: 12px; background: rgba(168, 85, 247, 0.1); border-radius: 6px; border-left: 3px solid #a855f7;">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm font-semibold" style="color: #a855f7;">${node}</span>
                  <span class="text-xs" style="color: #71717a;">→</span>
                  <div class="flex gap-2 flex-wrap">
                    ${neighbors.length === 0 ? 
                      '<span class="text-xs" style="color: #52525b;">No neighbors</span>' :
                      neighbors.map(neighbor => `
                        <span class="text-xs px-2 py-1 rounded" style="background: rgba(168, 85, 247, 0.2); color: #c4b5fd;">
                          ${neighbor}
                        </span>
                      `).join('')
                    }
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    
    this.structures.set(name, { type: 'graph', id, data: graph });
    return html;
  }

  // Helper methods
  formatValue(val) {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (typeof val === 'string') return `"${val}"`;
    if (typeof val === 'object') {
      try {
        const str = JSON.stringify(val);
        return str.length > 20 ? str.slice(0, 17) + '...' : str;
      } catch {
        return '[Object]';
      }
    }
    return String(val);
  }

  treeToArray(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    
    while (queue.length > 0 && result.length < 100) { // Safety limit
      const node = queue.shift();
      if (node) {
        result.push(node.val !== undefined ? node.val : (node.value !== undefined ? node.value : node.data));
        queue.push(node.left || null);
        queue.push(node.right || null);
      } else {
        result.push(null);
      }
    }
    
    return result;
  }

  renderTreeSVG(root) {
    if (!root) {
      return '<div class="text-center text-xs" style="color: #52525b; padding: 20px;">Tree is empty (null)</div>';
    }
    
    // Simple text-based tree visualization
    const levels = [];
    const queue = [{ node: root, level: 0, pos: 0 }];
    
    while (queue.length > 0 && levels.length < 10) {
      const { node, level, pos } = queue.shift();
      if (!node) continue;
      
      if (!levels[level]) levels[level] = [];
      levels[level].push({ val: node.val !== undefined ? node.val : (node.value !== undefined ? node.value : node.data), pos });
      
      if (node.left) queue.push({ node: node.left, level: level + 1, pos: pos * 2 });
      if (node.right) queue.push({ node: node.right, level: level + 1, pos: pos * 2 + 1 });
    }
    
    return levels.map((level, levelIdx) => `
      <div class="tree-level" style="display: flex; justify-content: center; gap: 8px; margin-bottom: 16px;">
        ${level.map((item, idx) => `
          <div class="tree-node" style="
            padding: 10px 16px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border: 2px solid rgba(245, 158, 11, 0.4);
            border-radius: 8px;
            color: #fafafa;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            font-weight: 600;
            min-width: 50px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
          ">
            ${this.formatValue(item.val)}
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  // Clear all visualizations
  clear() {
    this.structures.clear();
    if (this.container) {
      this.container.innerHTML = '<div class="text-center" style="color: #71717a; padding: 40px 20px;"><p class="text-sm font-medium mb-1">Visualizer Ready</p><p class="text-xs">Use data structure classes to visualize</p></div>';
    }
  }

  // Update a specific structure
  updateStructure(name, data) {
    const structure = this.structures.get(name);
    if (!structure) return;
    
    // Re-render based on type
    let html = '';
    switch (structure.type) {
      case 'stack':
        html = this.visualizeStack(data, name);
        break;
      case 'queue':
        html = this.visualizeQueue(data, name);
        break;
      case 'linkedlist':
        html = this.visualizeLinkedList(data, name);
        break;
      case 'tree':
        html = this.visualizeTree(data, name);
        break;
      case 'array':
        html = this.visualizeArray(data, name);
        break;
      case 'graph':
        html = this.visualizeGraph(data, name);
        break;
    }
    
    if (html && this.container) {
      const element = this.container.querySelector(`#${structure.id}`);
      if (element) {
        element.outerHTML = html;
      }
    }
  }
}

// Export for use in renderer
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DSAVisualizer;
}




