// canvas-src.jsx - Excalidraw Canvas Component (bundled for offline use)
// Note: CSS is injected via build script banner
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Excalidraw, exportToBlob, exportToSvg } from '@excalidraw/excalidraw';

function ExcalidrawCanvas() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [viewMode, setViewMode] = useState(false); // Read-only mode
  const [dimensions, setDimensions] = useState({ width: '100%', height: '100%' });
  const containerRef = useRef(null);
  const [initialData, setInitialData] = useState({
    elements: [],
    appState: {
      theme: 'dark',
      viewBackgroundColor: '#0a0a0b',
      // Default stroke color to BLACK for visibility
      currentItemStrokeColor: '#000000',
      currentItemBackgroundColor: 'transparent',
      currentItemFillStyle: 'hachure',
      currentItemStrokeWidth: 1,
      currentItemRoughness: 1,
      currentItemOpacity: 100,
      currentItemFontFamily: 1,
      currentItemFontSize: 20,
      currentItemTextAlign: 'left',
      // For dark theme, use lighter stroke for contrast
      gridSize: null,
    },
  });
  const saveTimeoutRef = useRef(null);
  const currentModuleRef = useRef(null);

  // ResizeObserver for proper scaling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: `${width}px`, height: `${height}px` });
        
        // Refresh Excalidraw when size changes
        if (excalidrawAPI) {
          excalidrawAPI.refresh();
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [excalidrawAPI]);

  // Listen for messages from parent window
  useEffect(() => {
    const handleMessage = (event) => {
      const { type, data, moduleId, readOnly } = event.data || {};
      
      if (type === 'load') {
        currentModuleRef.current = moduleId;
        
        // Default appState with BLACK stroke for dark theme visibility
        const defaultAppState = {
          theme: 'dark',
          viewBackgroundColor: '#0a0a0b',
          currentItemStrokeColor: '#e4e4e7', // Light stroke on dark background
          currentItemBackgroundColor: 'transparent',
          currentItemFillStyle: 'hachure',
          currentItemStrokeWidth: 2,
          currentItemRoughness: 1,
        };
        
        // Update scene with new data
        if (excalidrawAPI) {
          const elements = data?.elements || [];
          const appState = {
            ...defaultAppState,
            ...data?.appState,
          };
          excalidrawAPI.updateScene({ elements, appState });
          excalidrawAPI.scrollToContent();
          excalidrawAPI.refresh();
        } else {
          // Set initial data for when component mounts
          setInitialData({
            elements: data?.elements || [],
            appState: {
              ...defaultAppState,
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
      } else if (type === 'setReadOnly') {
        // Handle read-only mode toggle
        setViewMode(readOnly === true);
      } else if (type === 'refresh') {
        // Force refresh on resize
        if (excalidrawAPI) {
          excalidrawAPI.refresh();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Signal ready to parent
    window.parent.postMessage({ type: 'ready' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, [excalidrawAPI]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (excalidrawAPI) {
        excalidrawAPI.refresh();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [excalidrawAPI]);

  // Auto-save on changes (only if not in view mode)
  const handleChange = useCallback((elements, appState) => {
    if (viewMode) return; // Don't save in read-only mode
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      const data = {
        elements: elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
          currentItemStrokeColor: appState.currentItemStrokeColor,
          currentItemBackgroundColor: appState.currentItemBackgroundColor,
          zoom: appState.zoom,
          scrollX: appState.scrollX,
          scrollY: appState.scrollY,
        },
        updatedAt: new Date().toISOString(),
      };
      
      window.parent.postMessage({ type: 'save', data }, '*');
    }, 500);
  }, [viewMode]);

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
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={initialData}
        onChange={handleChange}
        theme="dark"
        UIOptions={{
          canvasActions: {
            loadScene: !viewMode,
            saveAsImage: true,
            export: { saveFileToDisk: false },
            clearCanvas: !viewMode,
          },
          tools: {
            image: !viewMode,
          },
        }}
        viewModeEnabled={viewMode}
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
