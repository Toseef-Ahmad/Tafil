// canvas-src.jsx - Excalidraw Canvas Component (bundled for offline use)
// Note: CSS is injected via build script banner
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Excalidraw, exportToBlob, exportToSvg } from '@excalidraw/excalidraw';

function ExcalidrawCanvas() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [initialData, setInitialData] = useState({
    elements: [],
    appState: {
      theme: 'dark',
      viewBackgroundColor: '#0a0a0b',
    },
  });
  const saveTimeoutRef = useRef(null);
  const currentModuleRef = useRef(null);

  // Listen for messages from parent window
  useEffect(() => {
    const handleMessage = (event) => {
      const { type, data, moduleId } = event.data || {};
      
      if (type === 'load') {
        currentModuleRef.current = moduleId;
        
        // Update scene with new data
        if (excalidrawAPI) {
          const elements = data?.elements || [];
          const appState = {
            theme: 'dark',
            viewBackgroundColor: '#0a0a0b',
            ...data?.appState,
          };
          excalidrawAPI.updateScene({ elements, appState });
          excalidrawAPI.scrollToContent();
        } else {
          // Set initial data for when component mounts
          setInitialData({
            elements: data?.elements || [],
            appState: {
              theme: 'dark',
              viewBackgroundColor: '#0a0a0b',
              ...data?.appState,
            },
          });
        }
      } else if (type === 'export-png') {
        exportCanvas('png');
      } else if (type === 'export-svg') {
        exportCanvas('svg');
      } else if (type === 'clear') {
        if (excalidrawAPI) {
          excalidrawAPI.resetScene();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Signal ready to parent
    window.parent.postMessage({ type: 'ready' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, [excalidrawAPI]);

  // Auto-save on changes
  const handleChange = useCallback((elements, appState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      const data = {
        elements: elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
          zoom: appState.zoom,
          scrollX: appState.scrollX,
          scrollY: appState.scrollY,
        },
        updatedAt: new Date().toISOString(),
      };
      
      window.parent.postMessage({ type: 'save', data }, '*');
    }, 500);
  }, []);

  // Export canvas
  const exportCanvas = async (format) => {
    if (!excalidrawAPI) return;
    
    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      
      if (format === 'png') {
        const blob = await exportToBlob({
          elements,
          appState,
          files: excalidrawAPI.getFiles(),
          mimeType: 'image/png',
          quality: 1,
        });
        
        const reader = new FileReader();
        reader.onloadend = () => {
          window.parent.postMessage({ 
            type: 'exported', 
            format: 'png',
            data: reader.result 
          }, '*');
        };
        reader.readAsDataURL(blob);
      } else if (format === 'svg') {
        const svg = await exportToSvg({
          elements,
          appState,
          files: excalidrawAPI.getFiles(),
        });
        window.parent.postMessage({ 
          type: 'exported', 
          format: 'svg',
          data: svg.outerHTML 
        }, '*');
      }
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={initialData}
        onChange={handleChange}
        theme="dark"
        UIOptions={{
          canvasActions: {
            loadScene: true,
            saveAsImage: true,
            export: { saveFileToDisk: false },
          },
        }}
        viewModeEnabled={false}
        zenModeEnabled={false}
        gridModeEnabled={false}
        langCode="en"
      />
    </div>
  );
}

// Render the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<ExcalidrawCanvas />);
