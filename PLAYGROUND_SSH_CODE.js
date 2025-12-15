// =====================================================
// MODULE SWITCHING
// =====================================================
function initModuleTabs() {
  // Module tab switching
  [moduleProjects, modulePlayground, moduleSSH].forEach(tab => {
    if (!tab) return;
    tab.addEventListener('click', () => {
      const moduleName = tab.dataset.module;
      switchModule(moduleName);
    });
  });

  // Load saved module
  const savedModule = localStorage.getItem('activeModule');
  if (savedModule && ['projects', 'playground', 'ssh'].includes(savedModule)) {
    switchModule(savedModule);
  }
}

function switchModule(moduleName) {
  activeModule = moduleName;
  localStorage.setItem('activeModule', moduleName);

  // Update tab states
  [moduleProjects, modulePlayground, moduleSSH].forEach(tab => {
    if (!tab) return;
    if (tab.dataset.module === moduleName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update navigation visibility
  if (projectsNav) projectsNav.classList.toggle('hidden', moduleName !== 'projects');
  if (playgroundNav) playgroundNav.classList.toggle('hidden', moduleName !== 'playground');
  if (sshNav) sshNav.classList.toggle('hidden', moduleName !== 'ssh');

  // Update panel visibility
  if (projectsPanel) projectsPanel.classList.toggle('active', moduleName === 'projects');
  if (playgroundPanel) playgroundPanel.classList.toggle('active', moduleName === 'playground');
  if (sshPanel) sshPanel.classList.toggle('active', moduleName === 'ssh');

  // Resize Monaco editor when switching to playground
  if (moduleName === 'playground' && monacoEditor) {
    setTimeout(() => {
      monacoEditor.layout();
    }, 100);
  }
}

// =====================================================
// JAVASCRIPT PLAYGROUND
// =====================================================
async function initPlayground() {
  if (!codeEditor || !runCodeBtn) return;

  // Show loading message
  codeEditor.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #a78bfa; font-size: 14px;"><p>⏳ Loading Monaco Editor...</p></div>';

  // Initialize Monaco Editor
  try {
    const monaco = await loadMonacoEditor();
    if (!monaco) {
      console.error('Failed to load Monaco Editor');
      codeEditor.innerHTML = '<textarea style="width:100%;height:100%;background:#111113;color:#e4e4e7;border:none;padding:16px;font-family:monospace;font-size:13px;outline:none;resize:none;" placeholder="// Monaco Editor failed to load\n// Write JavaScript here and press ⌘+Enter to run"></textarea>';
      return;
    }

    // Load saved code
    const savedCode = localStorage.getItem('playgroundCode') || `// Write JavaScript here - it runs automatically!
// Like RunJS/Quokka - just type and see results instantly

console.log('Hello, World!');

const sum = (a, b) => a + b;
console.log('Sum:', sum(5, 3));

// Try async/await
// const res = await fetch('https://api.github.com');
// console.log(await res.json());
`;

    // Define custom theme
    monaco.editor.defineTheme('tafil-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'a78bfa', fontStyle: 'bold' },
        { token: 'string', foreground: '10b981' },
        { token: 'number', foreground: 'f59e0b' },
        { token: 'operator', foreground: 'a78bfa' },
        { token: 'identifier', foreground: 'e4e4e7' },
      ],
      colors: {
        'editor.background': '#111113',
        'editor.foreground': '#e4e4e7',
        'editor.lineHighlightBackground': '#18181b',
        'editor.selectionBackground': 'rgba(139, 92, 246, 0.3)',
        'editorCursor.foreground': '#a78bfa',
        'editorWhitespace.foreground': '#3f3f46',
        'editorIndentGuide.activeBackground': '#3f3f46',
        'editor.lineNumberForeground': '#52525b',
        'editor.lineNumberActiveForeground': '#a1a1aa',
      }
    });

    // Configure TypeScript for better IntelliSense
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Create Monaco Editor instance
    monacoEditor = monaco.editor.create(codeEditor, {
      value: savedCode,
      language: 'javascript',
      theme: 'tafil-dark',
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontLigatures: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true
      },
      quickSuggestionsDelay: 50,
      parameterHints: { enabled: true, cycle: true },
      suggest: {
        showMethods: true,
        showFunctions: true,
        showConstructors: true,
        showFields: true,
        showVariables: true,
        showClasses: true,
        showStructs: true,
        showInterfaces: true,
        showModules: true,
        showProperties: true,
        showEvents: true,
        showOperators: true,
        showUnits: true,
        showValues: true,
        showConstants: true,
        showEnums: true,
        showEnumMembers: true,
        showKeywords: true,
        showWords: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showFolders: true,
        showTypeParameters: true,
        showSnippets: true,
        filterGraceful: true,
        localityBonus: true,
        shareSuggestSelections: true,
      },
      acceptSuggestionOnCommitCharacter: true,
      acceptSuggestionOnEnter: 'on',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
        highlightActiveIndentation: true
      },
      hover: {
        enabled: true,
        delay: 300,
        sticky: true
      },
      codeLens: false,
      folding: true,
      foldingStrategy: 'auto',
      showFoldingControls: 'always',
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoSurround: 'languageDefined',
      autoIndent: 'full',
    });

    // Auto-save on change with auto-run
    monacoEditor.onDidChangeModelContent(() => {
      const code = monacoEditor.getValue();
      localStorage.setItem('playgroundCode', code);

      // Auto-run with debounce
      if (isAutoRunEnabled && code.trim()) {
        if (autoRunStatus) {
          autoRunStatus.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span> Running...';
          autoRunStatus.style.color = '#f59e0b';
          autoRunStatus.style.background = 'rgba(245, 158, 11, 0.15)';
        }

        clearTimeout(autoRunTimeout);
        autoRunTimeout = setTimeout(() => {
          runCode().then(() => {
            if (isAutoRunEnabled) updateAutoRunStatus();
          });
        }, 500);
      }
    });

    // Run button
    runCodeBtn.addEventListener('click', runCode);

    // Toggle auto-run button
    if (toggleAutoRunBtn) {
      toggleAutoRunBtn.addEventListener('click', () => {
        isAutoRunEnabled = !isAutoRunEnabled;
        updateAutoRunStatus();
        showNotification(isAutoRunEnabled ? 'Auto-run enabled' : 'Auto-run disabled', 'info');
      });
    }

    // Clear output
    if (clearOutputBtn) {
      clearOutputBtn.addEventListener('click', () => {
        if (codeOutput) codeOutput.innerHTML = '<p class="text-xs" style="color: #52525b;">Output cleared</p>';
      });
    }

    // Keyboard shortcut: Cmd/Ctrl + Enter to run
    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runCode();
    });

    // Toggle auto-run with Cmd/Ctrl + Shift + R
    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyR, () => {
      isAutoRunEnabled = !isAutoRunEnabled;
      updateAutoRunStatus();
      showNotification(isAutoRunEnabled ? 'Auto-run enabled' : 'Auto-run disabled', 'info');
    });

    updateAutoRunStatus();

    // Initial run
    setTimeout(() => {
      if (monacoEditor.getValue().trim()) {
        runCode();
      }
    }, 1000);

    console.log('✅ Monaco Editor initialized');
  } catch (err) {
    console.error('Error initializing Monaco:', err);
    codeEditor.innerHTML = '<textarea style="width:100%;height:100%;background:#111113;color:#e4e4e7;border:none;padding:16px;font-family:monospace;font-size:13px;outline:none;">Monaco Editor failed to load. Please refresh.</textarea>';
  }
}

async function loadMonacoEditor() {
  return new Promise((resolve, reject) => {
    if (window.monaco) {
      resolve(window.monaco);
      return;
    }

    const loaderScript = document.createElement('script');
    loaderScript.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';

    loaderScript.onload = () => {
      let attempts = 0;
      const maxAttempts = 100;

      const checkRequire = setInterval(() => {
        attempts++;

        if (window.require && window.require.config) {
          clearInterval(checkRequire);

          try {
            window.require.config({
              paths: {
                vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
              }
            });

            window.require(['vs/editor/editor.main'], (monaco) => {
              window.monaco = monaco;
              resolve(monaco);
            }, (err) => {
              console.error('Error loading Monaco:', err);
              reject(err);
            });
          } catch (err) {
            reject(err);
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(checkRequire);
          reject(new Error('Monaco load timeout'));
        }
      }, 50);
    };

    loaderScript.onerror = () => reject(new Error('Failed to load Monaco loader'));

    document.head.appendChild(loaderScript);
  });
}

function updateAutoRunStatus() {
  if (!autoRunStatus) return;

  if (isAutoRunEnabled) {
    autoRunStatus.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Auto-run ⚡';
    autoRunStatus.style.color = '#a78bfa';
    autoRunStatus.style.background = 'rgba(139, 92, 246, 0.15)';
  } else {
    autoRunStatus.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Manual';
    autoRunStatus.style.color = '#71717a';
    autoRunStatus.style.background = 'rgba(255,255,255,0.05)';
  }
}

async function runCode() {
  if (!monacoEditor || !codeOutput) return Promise.resolve();

  const code = monacoEditor.getValue();
  if (!code.trim()) {
    codeOutput.innerHTML = '<p class="text-xs" style="color: #52525b;">No code to run</p>';
    return Promise.resolve();
  }

  const startTime = performance.now();

  codeOutput.innerHTML = '<p class="log" style="color: #a78bfa;">⚡ Running...</p>';

  try {
    const result = await window.electronAPI.executeJS(code);
    const duration = (performance.now() - startTime).toFixed(1);

    if (executionTimeEl) executionTimeEl.textContent = `${duration}ms`;

    if (result.success) {
      let outputHtml = '';

      if (result.logs && result.logs.length > 0) {
        result.logs.forEach(log => {
          const typeClass = log.type === 'error' ? 'error' : log.type === 'warn' ? 'warn' : log.type === 'info' ? 'info' : 'log';
          const icon = log.type === 'error' ? '❌' : log.type === 'warn' ? '⚠️' : log.type === 'info' ? 'ℹ️' : '✓';
          outputHtml += `<p class="${typeClass}">${icon} ${escapeHtml(log.message)}</p>`;
        });
      }

      if (result.result !== undefined && result.result !== 'undefined') {
        outputHtml += `<p class="info" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);"><strong>→</strong> ${escapeHtml(String(result.result))}</p>`;
      }

      if (!outputHtml) {
        outputHtml = '<p class="log" style="color: #52525b;">No output</p>';
      }

      codeOutput.innerHTML = outputHtml;
    } else {
      codeOutput.innerHTML = `<p class="error">❌ ${escapeHtml(result.error || 'Execution failed')}</p>`;
    }
  } catch (err) {
    console.error('Error running code:', err);
    codeOutput.innerHTML = `<p class="error">❌ ${escapeHtml(err.message || 'Failed to execute')}</p>`;
  }
}

// =====================================================
// SSH MODULE
// =====================================================
function initSSH() {
  if (typeof window.Terminal === 'undefined' || typeof window.FitAddon === 'undefined') {
    console.error('xterm.js not loaded');
    return;
  }

  terminal = new window.Terminal({
    cursorBlink: true,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: 13,
    theme: {
      background: '#0a0a0b',
      foreground: '#e4e4e7',
      cursor: '#a78bfa',
      black: '#000000',
      red: '#f43f5e',
      green: '#10b981',
      yellow: '#f59e0b',
      blue: '#0ea5e9',
      magenta: '#a78bfa',
      cyan: '#06b6d4',
      white: '#e4e4e7',
      brightBlack: '#52525b',
      brightRed: '#fb7185',
      brightGreen: '#34d399',
      brightYellow: '#fbbf24',
      brightBlue: '#38bdf8',
      brightMagenta: '#c4b5fd',
      brightCyan: '#22d3ee',
      brightWhite: '#fafafa'
    }
  });

  terminalFitAddon = new window.FitAddon.FitAddon();
  terminal.loadAddon(terminalFitAddon);

  if (window.WebLinksAddon) {
    terminal.loadAddon(new window.WebLinksAddon.WebLinksAddon());
  }

  terminal.open(document.getElementById('terminal'));
  terminalFitAddon.fit();

  terminal.writeln('\x1b[90m╭───────────────────────────────────────────────────────────╮\x1b[0m');
  terminal.writeln('\x1b[90m│\x1b[0m \x1b[1;36m🖥️  Tafil SSH Terminal\x1b[0m                                 \x1b[90m│\x1b[0m');
  terminal.writeln('\x1b[90m│\x1b[0m                                                           \x1b[90m│\x1b[0m');
  terminal.writeln('\x1b[90m│\x1b[0m \x1b[33mConnect to a host to begin an interactive session\x1b[0m      \x1b[90m│\x1b[0m');
  terminal.writeln('\x1b[90m│\x1b[0m \x1b[90mClick the "Connect" button on any SSH host card\x1b[0m        \x1b[90m│\x1b[0m');
  terminal.writeln('\x1b[90m╰───────────────────────────────────────────────────────────╯\x1b[0m');
  terminal.writeln('');

  // Event listeners
  if (addHostBtn) addHostBtn.addEventListener('click', showSSHHostModal);
  if (navAddHost) navAddHost.addEventListener('click', showSSHHostModal);
  if (sshEmptyAddBtn) sshEmptyAddBtn.addEventListener('click', showSSHHostModal);
  if (closeTerminalBtn) closeTerminalBtn.addEventListener('click', closeTerminal);
  if (disconnectSSHBtn) disconnectSSHBtn.addEventListener('click', disconnectSSH);
  if (closeSSHHostBtn) closeSSHHostBtn.addEventListener('click', hideSSHHostModal);
  if (cancelSSHHostBtn) cancelSSHHostBtn.addEventListener('click', hideSSHHostModal);
  if (saveSSHHostBtn) saveSSHHostBtn.addEventListener('click', saveSSHHost);
  if (browseSSHKeyBtn) browseSSHKeyBtn.addEventListener('click', browseSSHKey);

  // Auth radio buttons
  document.querySelectorAll('.ssh-auth-radio').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'key') {
        sshKeyFileSection.classList.remove('hidden');
        sshPasswordSection.classList.add('hidden');
      } else {
        sshKeyFileSection.classList.add('hidden');
        sshPasswordSection.classList.remove('hidden');
      }
    });
  });

  // SSH data listener
  window.electronAPI.onSSHData((_event, data) => {
    if (currentSSHSession && data.sessionId === currentSSHSession.id && terminal) {
      if (data.type === 'stdout') {
        terminal.write(data.data);
      } else if (data.type === 'stderr') {
        terminal.write(`\x1b[31m${data.data}\x1b[0m`);
      } else if (data.type === 'close') {
        terminal.write(data.data);
        currentSSHSession = null;
        renderSSHHosts();
      }
    }
  });
}

function loadSSHHosts() {
  const saved = localStorage.getItem('sshHosts');
  if (saved) {
    try {
      sshHosts = JSON.parse(saved);
      renderSSHHosts();
    } catch (err) {
      console.error('Error loading SSH hosts:', err);
    }
  } else {
    renderSSHHosts();
  }
}

function saveSSHHostsToStorage() {
  localStorage.setItem('sshHosts', JSON.stringify(sshHosts));
}

function renderSSHHosts() {
  if (!sshHostList || !sshEmptyState) return;

  if (sshHosts.length === 0) {
    sshHostList.innerHTML = '';
    sshEmptyState.classList.remove('hidden');
  } else {
    sshEmptyState.classList.add('hidden');
    sshHostList.innerHTML = sshHosts.map(host => createSSHHostCard(host)).join('');

    // Add event listeners
    sshHosts.forEach(host => {
      const connectBtn = document.getElementById(`ssh-connect-${host.id}`);
      const deleteBtn = document.getElementById(`ssh-delete-${host.id}`);

      if (connectBtn) {
        connectBtn.addEventListener('click', () => connectSSHHost(host));
      }
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteSSHHost(host.id));
      }
    });
  }

  // Update count
  const sshHostCount = document.getElementById('sshHostCount');
  if (sshHostCount) sshHostCount.textContent = sshHosts.length;
}

function createSSHHostCard(host) {
  const isConnected = currentSSHSession && currentSSHSession.hostId === host.id;
  const authIcon = host.authMethod === 'key' ? '🔑' : '🔒';

  return `
    <div class="ssh-host-card ${isConnected ? 'connected' : ''}" data-host-id="${host.id}">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-semibold text-sm truncate" style="color: #fafafa;">${escapeHtml(host.name)}</h3>
            ${isConnected ? '<span class="text-xs px-1.5 py-0.5 rounded" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">Connected</span>' : ''}
          </div>
          <p class="text-xs truncate" style="color: #71717a;">${escapeHtml(host.hostname)}:${host.port}</p>
        </div>
        <span class="text-base" title="${host.authMethod === 'key' ? 'SSH Key' : 'Password'}">${authIcon}</span>
      </div>

      <div class="flex items-center gap-2 mb-4">
        <span class="text-xs px-2.5 py-1 rounded-full" style="background: rgba(255,255,255,0.05); color: #a1a1aa; border: 1px solid rgba(255,255,255,0.06);">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; vertical-align: middle; margin-right: 4px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${escapeHtml(host.username)}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button id="ssh-connect-${host.id}" class="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]" style="background: ${isConnected ? 'rgba(16, 185, 129, 0.15)' : 'linear-gradient(135deg, #10b981, #059669)'}; color: ${isConnected ? '#10b981' : 'white'}; border: ${isConnected ? '1px solid rgba(16, 185, 129, 0.3)' : 'none'};">
          ${isConnected ? 'Open Terminal' : 'Connect'}
        </button>
        <button id="ssh-delete-${host.id}" class="px-3 py-2.5 rounded-lg text-xs font-medium transition-all" style="background: rgba(244, 63, 94, 0.15); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.2);" title="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `;
}

async function connectSSHHost(host) {
  try {
    // If already connected, just show terminal
    if (currentSSHSession && currentSSHSession.hostId === host.id) {
      showTerminal(host.name);
      return;
    }

    showNotification(`Connecting to ${host.name}...`, 'info');

    if (terminal) {
      terminal.clear();
      terminal.writeln(`\x1b[33mConnecting to ${host.name} (${host.hostname}:${host.port})...\x1b[0m`);
    }

    showTerminal(host.name);

    const result = await window.electronAPI.connectSSHHost(host);

    if (result.success) {
      currentSSHSession = {
        id: result.sessionId,
        hostId: host.id,
        host: host
      };

      showNotification(`Connected to ${host.name}`, 'success');

      if (terminal) {
        terminal.clear();
        terminal.writeln(`\x1b[32m✓ Successfully connected to ${host.name}!\x1b[0m`);
        terminal.writeln(`\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m`);
        terminal.writeln(`\x1b[90m  Host:\x1b[0m ${host.hostname}:${host.port}`);
        terminal.writeln(`\x1b[90m  User:\x1b[0m ${host.username}`);
        terminal.writeln(`\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m`);
        terminal.writeln('');
        terminal.writeln('\x1b[1;32m🚀 Interactive SSH Terminal Ready!\x1b[0m');
        terminal.writeln('\x1b[90mYou can now type commands and interact with your server.\x1b[0m');
        terminal.writeln('\x1b[90mTry: \x1b[0m\x1b[33mls\x1b[0m\x1b[90m, \x1b[0m\x1b[33mpwd\x1b[0m\x1b[90m, \x1b[0m\x1b[33mcd\x1b[0m\x1b[90m, etc.\x1b[0m');
        terminal.writeln('');
        terminal.focus();
        setTimeout(() => terminal.write('\x1b[1;36m▶ \x1b[0m'), 200);
      }

      // Handle terminal input
      if (terminal) {
        const inputHandler = (data) => {
          if (currentSSHSession && currentSSHSession.id === result.sessionId) {
            window.electronAPI.sendSSHInput(result.sessionId, data);
          }
        };
        terminal.onData(inputHandler);
      }

      renderSSHHosts();
    } else {
      showNotification(result.error || 'Connection failed', 'error');
      if (terminal) {
        terminal.writeln(`\x1b[31m✗ Connection failed: ${result.error || 'Unknown error'}\x1b[0m`);
      }
    }
  } catch (err) {
    console.error('Error connecting to SSH:', err);
    showNotification('Connection failed', 'error');
    if (terminal) {
      terminal.writeln(`\x1b[31m✗ Error: ${err.message}\x1b[0m`);
    }
  }
}

function showTerminal(hostName) {
  if (!sshTerminalPanel || !sshHostsView) return;

  sshHostsView.style.display = 'none';
  sshTerminalPanel.classList.add('active');

  if (terminalHostName) terminalHostName.textContent = hostName || 'Connected';

  setTimeout(() => {
    if (terminalFitAddon) {
      terminalFitAddon.fit();
      setTimeout(() => terminalFitAddon.fit(), 100);
    }
    if (terminal) {
      terminal.focus();
      terminal.scrollToBottom();
    }
  }, 100);

  setTimeout(() => {
    if (terminal) terminal.focus();
  }, 300);
}

function closeTerminal() {
  if (!sshTerminalPanel || !sshHostsView) return;

  disconnectSSH();
  sshTerminalPanel.classList.remove('active');
  sshHostsView.style.display = 'block';

  renderSSHHosts();
}

async function disconnectSSH() {
  if (currentSSHSession) {
    try {
      await window.electronAPI.disconnectSSH(currentSSHSession.id);
      showNotification('SSH connection closed', 'info');
    } catch (err) {
      console.error('Error disconnecting SSH:', err);
    }
    currentSSHSession = null;
  }

  if (terminal) {
    terminal.writeln('\r\n\x1b[33mDisconnected.\x1b[0m');
    terminal.writeln('Terminal ready. Connect to an SSH host to begin.');
  }

  renderSSHHosts();
}

function showSSHHostModal() {
  if (!sshHostModal) return;

  // Reset form
  if (sshHostName) sshHostName.value = '';
  if (sshHostname) sshHostname.value = '';
  if (sshUsername) sshUsername.value = '';
  if (sshPort) sshPort.value = '22';
  if (sshKeyPath) sshKeyPath.value = '';
  if (sshPassword) sshPassword.value = '';

  const keyRadio = document.querySelector('input[name="sshAuth"][value="key"]');
  if (keyRadio) keyRadio.checked = true;
  if (sshKeyFileSection) sshKeyFileSection.classList.remove('hidden');
  if (sshPasswordSection) sshPasswordSection.classList.add('hidden');

  sshHostModal.classList.remove('hidden');
}

function hideSSHHostModal() {
  if (sshHostModal) sshHostModal.classList.add('hidden');
}

async function browseSSHKey() {
  try {
    const result = await window.electronAPI.selectSSHKeyFile();
    if (result && result.filePath && sshKeyPath) {
      sshKeyPath.value = result.filePath;
    }
  } catch (err) {
    console.error('Error selecting SSH key:', err);
    showNotification('Failed to select key file', 'error');
  }
}

async function saveSSHHost() {
  const name = sshHostName?.value.trim();
  const hostname = sshHostname?.value.trim();
  const username = sshUsername?.value.trim();
  const port = parseInt(sshPort?.value) || 22;
  const authMethod = document.querySelector('input[name="sshAuth"]:checked')?.value || 'key';
  const keyPath = sshKeyPath?.value.trim();
  const password = sshPassword?.value;

  if (!name || !hostname || !username) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (authMethod === 'key' && !keyPath) {
    showNotification('Please select an SSH key file', 'error');
    return;
  }

  if (authMethod === 'password' && !password) {
    showNotification('Please enter a password', 'error');
    return;
  }

  const host = {
    id: Date.now().toString(),
    name,
    hostname,
    username,
    port,
    authMethod,
    keyPath: authMethod === 'key' ? keyPath : null,
    password: authMethod === 'password' ? password : null,
  };

  try {
    const result = await window.electronAPI.saveSSHHost(host);
    if (result.success) {
      sshHosts.push(host);
      saveSSHHostsToStorage();
      renderSSHHosts();
      hideSSHHostModal();
      showNotification(`Host "${name}" saved successfully`, 'success');
    } else {
      showNotification(result.error || 'Failed to save host', 'error');
    }
  } catch (err) {
    console.error('Error saving SSH host:', err);
    showNotification('Failed to save host', 'error');
  }
}

async function deleteSSHHost(hostId) {
  const host = sshHosts.find(h => h.id === hostId);
  if (!host) return;

  if (!confirm(`Delete SSH host "${host.name}"?`)) return;

  sshHosts = sshHosts.filter(h => h.id !== hostId);
  saveSSHHostsToStorage();
  renderSSHHosts();
  showNotification(`Host "${host.name}" deleted`, 'info');
}

