import React, { useState, useRef, useEffect } from 'react';
import { Upload, Type, Download, Moon, Sun, Settings, Loader, CheckCircle, AlertCircle, Share2, Save, RotateCcw, Trash2, BookMarked, Plus, Volume2, Volume, Music, Play, Pause } from 'lucide-react';

const BrandFlowULTIMATE = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('logo');
  const [showSettings, setShowSettings] = useState(false);
  const [showBrandKit, setShowBrandKit] = useState(false);
  const [showSoundPanel, setShowSoundPanel] = useState(false);

  // Core state
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Animation settings
  const [animationQuality, setAnimationQuality] = useState('high');
  const [animationDuration, setAnimationDuration] = useState('3');
  const [animationStyle, setAnimationStyle] = useState('elegant-fade');
  const [colorScheme, setColorScheme] = useState('pink');
  
  // ✨ SOUND FEATURES
  const [selectedSound, setSelectedSound] = useState('whoosh-elegant');
  const [soundVolume, setSoundVolume] = useState(70);
  const [soundTiming, setSoundTiming] = useState('start'); // start, beat, end
  const [enableSound, setEnableSound] = useState(true);
  const [playingPreview, setPlayingPreview] = useState(null);
  const audioRef = useRef(null);

  // Sound library - Professional effects for each animation style
  const soundLibrary = {
    'whoosh-elegant': {
      name: '✨ Elegant Whoosh',
      category: 'Transitions',
      duration: 0.8,
      description: 'Smooth, sophisticated transition sound'
    },
    'pop-bright': {
      name: '🔷 Bright Pop',
      category: 'Accent',
      duration: 0.3,
      description: 'Crisp, attention-grabbing pop'
    },
    'chime-success': {
      name: '🎵 Success Chime',
      category: 'Notification',
      duration: 1.2,
      description: 'Uplifting, celebratory sound'
    },
    'whoosh-power': {
      name: '⚡ Power Whoosh',
      category: 'Impact',
      duration: 0.6,
      description: 'Dynamic, energetic effect'
    },
    'glitch-digital': {
      name: '🔧 Digital Glitch',
      category: 'Modern',
      duration: 0.4,
      description: 'Tech-inspired glitch effect'
    },
    'shimmer-magic': {
      name: '✨ Magic Shimmer',
      category: 'Fantasy',
      duration: 1.0,
      description: 'Magical, ethereal sound'
    },
    'boom-bass': {
      name: '💥 Deep Boom',
      category: 'Impact',
      duration: 0.8,
      description: 'Powerful, dramatic bass hit'
    },
    'typewriter': {
      name: '⌨️ Typewriter',
      category: 'Mechanical',
      duration: 2.0,
      description: 'Classic typewriter keys'
    },
    'sparkle-light': {
      name: '💫 Sparkle',
      category: 'Soft',
      duration: 0.7,
      description: 'Delicate, light sparkle'
    },
    'wave-organic': {
      name: '🌊 Wave',
      category: 'Organic',
      duration: 1.5,
      description: 'Smooth, flowing wave'
    },
    'notification-bell': {
      name: '🔔 Bell Ring',
      category: 'Notification',
      duration: 0.6,
      description: 'Gentle bell notification'
    },
    'cyber-scan': {
      name: '🔍 Cyber Scan',
      category: 'Tech',
      duration: 1.2,
      description: 'Futuristic scanning sound'
    }
  };

  // Advanced features state
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [createdAnimations, setCreatedAnimations] = useState([]);
  const [animationPreview, setAnimationPreview] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [notification, setNotification] = useState(null);
  const [drafts, setDrafts] = useState([]);
  
  // Filters & Effects
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    glow: 0,
  });
  
  // Branding Kit
  const [brandingKit, setBrandingKit] = useState({
    name: 'My Brand',
    primaryColor: '#ec4899',
    secondaryColor: '#9333ea',
    fontFamily: 'Inter',
    logo: null,
  });
  const [brandingKits, setBrandingKits] = useState([]);
  
  const fileInputRef = useRef(null);
  const [exportFormat, setExportFormat] = useState('mp4');

  const colors = darkMode ? {
    bg: 'bg-black',
    surface: 'bg-neutral-900',
    text: 'text-white',
    textSecondary: 'text-neutral-300',
    accent: 'bg-pink-600 hover:bg-pink-700',
    accentBorder: 'border-pink-600',
    cardBg: 'bg-neutral-800',
    input: 'bg-neutral-800 text-white border-neutral-700',
  } : {
    bg: 'bg-white',
    surface: 'bg-pink-50',
    text: 'text-neutral-900',
    textSecondary: 'text-neutral-600',
    accent: 'bg-pink-600 hover:bg-pink-700',
    accentBorder: 'border-pink-600',
    cardBg: 'bg-pink-100',
    input: 'bg-white text-neutral-900 border-pink-200',
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ✨ SOUND PREVIEW FUNCTION
  const previewSound = (soundKey) => {
    if (playingPreview === soundKey) {
      setPlayingPreview(null);
      return;
    }
    
    setPlayingPreview(soundKey);
    // Simulate sound playing
    setTimeout(() => {
      setPlayingPreview(null);
    }, soundLibrary[soundKey].duration * 1000);
    
    showNotification(`Playing: ${soundLibrary[soundKey].name}`, 'success');
  };

  // History Management
  const addToHistory = (state) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousState = history[historyIndex - 1];
      restoreState(previousState);
      showNotification('Undone!', 'success');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      restoreState(nextState);
      showNotification('Redone!', 'success');
    }
  };

  const restoreState = (state) => {
    if (state.type === 'logo') {
      setLogoPreview(state.preview);
      setLogoFile(state.file);
    } else {
      setTextInput(state.text);
    }
    setAnimationPreview(state.animationPreview || null);
  };

  // Draft Management
  const saveDraft = () => {
    const draft = {
      id: Date.now(),
      type: activeTab,
      data: activeTab === 'logo' ? { preview: logoPreview } : { text: textInput },
      settings: { 
        animationQuality, animationDuration, animationStyle, colorScheme, filters,
        soundSettings: { selectedSound, soundVolume, soundTiming, enableSound }
      },
      timestamp: new Date().toLocaleString(),
    };
    setDrafts([draft, ...drafts]);
    showNotification('Draft saved with sound settings!', 'success');
  };

  const loadDraft = (draft) => {
    if (draft.type === 'logo') {
      setLogoPreview(draft.data.preview);
    } else {
      setTextInput(draft.data.text);
    }
    setAnimationQuality(draft.settings.animationQuality);
    setAnimationDuration(draft.settings.animationDuration);
    setAnimationStyle(draft.settings.animationStyle);
    setColorScheme(draft.settings.colorScheme);
    setFilters(draft.settings.filters);
    if (draft.settings.soundSettings) {
      setSelectedSound(draft.settings.soundSettings.selectedSound);
      setSoundVolume(draft.settings.soundSettings.soundVolume);
      setSoundTiming(draft.settings.soundSettings.soundTiming);
      setEnableSound(draft.settings.soundSettings.enableSound);
    }
    setActiveTab(draft.type);
    showNotification('Draft loaded with all settings!', 'success');
  };

  const deleteDraft = (id) => {
    setDrafts(drafts.filter(d => d.id !== id));
    showNotification('Draft deleted', 'success');
  };

  // Branding Kit Management
  const saveBrandingKit = () => {
    setBrandingKits([...brandingKits, { ...brandingKit, id: Date.now() }]);
    showNotification('Branding kit saved!', 'success');
  };

  const applyBrandingKit = (kit) => {
    setBrandingKit(kit);
    setAnimationQuality('ultra');
    showNotification(`Applied "${kit.name}" branding kit!`, 'success');
  };

  const deleteBrandingKit = (id) => {
    setBrandingKits(brandingKits.filter(k => k.id !== id));
    showNotification('Branding kit deleted', 'success');
  };

  // File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target.result);
        addToHistory({ type: 'logo', preview: event.target.result, file, animationPreview: null });
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter Application
  const getFilterStyle = () => ({
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) drop-shadow(0 0 ${filters.glow}px rgba(236, 72, 153, 0.5))`,
  });

  // Animation Generation
  const generateLogoAnimation = async () => {
    if (!logoPreview) {
      showNotification('Please upload an image first', 'error');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const animationData = {
        id: Date.now(),
        type: 'logo',
        preview: logoPreview,
        quality: animationQuality,
        duration: animationDuration,
        style: animationStyle,
        colorScheme,
        filters,
        soundEffect: enableSound ? selectedSound : null,
        soundVolume,
        soundTiming,
        timestamp: new Date().toLocaleString(),
        effects: ['glow', 'pulse', 'rotate', 'scale'],
        format: exportFormat,
      };
      
      setCreatedAnimations([animationData, ...createdAnimations]);
      setAnimationPreview(animationData);
      addToHistory({ type: 'logo', preview: logoPreview, file: logoFile, animationPreview: animationData });
      showNotification('Animation generated with sound effect! 🎵', 'success');
    } catch (error) {
      showNotification('Failed to generate animation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateTextAnimation = async () => {
    if (!textInput.trim()) {
      showNotification('Please enter text first', 'error');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const animationData = {
        id: Date.now(),
        type: 'text',
        text: textInput,
        quality: animationQuality,
        duration: animationDuration,
        style: animationStyle,
        colorScheme,
        filters,
        soundEffect: enableSound ? selectedSound : null,
        soundVolume,
        soundTiming,
        timestamp: new Date().toLocaleString(),
        effects: ['fadeIn', 'slide', 'typewriter', 'bounce'],
        format: exportFormat,
      };
      
      setCreatedAnimations([animationData, ...createdAnimations]);
      setAnimationPreview(animationData);
      addToHistory({ type: 'text', text: textInput, animationPreview: animationData });
      showNotification('Text animation created with sound! 🎵', 'success');
    } catch (error) {
      showNotification('Failed to create animation', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Download & Export
  const downloadAnimation = (animation) => {
    showNotification(`Download started (${exportFormat.toUpperCase()}) with sound! 🎵`, 'success');
    const link = document.createElement('a');
    if (animation.type === 'logo') {
      link.href = animation.preview;
      link.download = `logo-animation-${animation.id}-with-sound.${exportFormat}`;
    } else {
      link.download = `text-animation-${animation.id}-with-sound.${exportFormat}`;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Social Share
  const shareOnSocial = (platform) => {
    const platforms = {
      twitter: `https://twitter.com/intent/tweet?text=Check out my animated brand video with professional sound effects created with BrandFlow!`,
      facebook: `https://www.facebook.com/sharer/sharer.php`,
      instagram: `https://www.instagram.com/`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/`,
    };
    window.open(platforms[platform], '_blank', 'width=600,height=400');
    showNotification(`Shared on ${platform.toUpperCase()}!`, 'success');
  };

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${colors.surface} border-b ${colors.accentBorder} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`${colors.accent} w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
                ✨
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${colors.text}`}>BrandFlow Pro</h1>
                <p className={`text-xs ${colors.textSecondary}`}>Animation Creator + Sound Design 🎵</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setShowSoundPanel(!showSoundPanel)}
                className={`p-2 rounded-lg ${colors.surface} border border-pink-600 hover:scale-110 transition-all`}
                title="Sound Effects"
              >
                <Music className="w-5 h-5 text-pink-400" />
              </button>
              <button
                onClick={() => setShowBrandKit(!showBrandKit)}
                className={`p-2 rounded-lg ${colors.surface} border border-pink-600 hover:scale-110 transition-all`}
                title="Branding Kit"
              >
                <BookMarked className="w-5 h-5 text-pink-400" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg ${colors.surface} border border-pink-600 hover:scale-110 transition-all`}
                title="Settings"
              >
                <Settings className="w-5 h-5 text-pink-400" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${colors.surface} border border-pink-600 hover:scale-110 transition-all`}
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-pink-400" /> : <Moon className="w-5 h-5 text-pink-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 p-4 rounded-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-pulse z-50`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sound Panel */}
        {showSoundPanel && (
          <div className={`${colors.cardBg} rounded-2xl p-6 mb-6 border-2 border-pink-600`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${colors.text} flex items-center gap-2`}>
                <Music size={20} /> Sound Effects Library
              </h2>
              <button onClick={() => setShowSoundPanel(false)} className={`text-2xl ${colors.textSecondary}`}>✕</button>
            </div>

            {/* Sound Controls */}
            <div className={`${colors.surface} rounded-lg p-4 mb-6`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block ${colors.text} font-semibold mb-2 text-sm`}>Enable Sound</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableSound}
                      onChange={(e) => setEnableSound(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className={colors.textSecondary}>Add sound to animation</span>
                  </label>
                </div>

                <div>
                  <label className={`block ${colors.text} font-semibold mb-2 text-sm`}>Sound Timing</label>
                  <select
                    value={soundTiming}
                    onChange={(e) => setSoundTiming(e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${colors.input} text-sm`}
                    disabled={!enableSound}
                  >
                    <option value="start">At Start</option>
                    <option value="beat">On Beat</option>
                    <option value="end">At End</option>
                  </select>
                </div>

                <div>
                  <label className={`block ${colors.text} font-semibold mb-2 text-sm`}>Volume: {soundVolume}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(parseInt(e.target.value))}
                    className="w-full"
                    disabled={!enableSound}
                  />
                </div>
              </div>
            </div>

            {/* Sound Library Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {Object.entries(soundLibrary).map(([key, sound]) => (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedSound(key);
                    previewSound(key);
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedSound === key
                      ? 'border-pink-600 bg-pink-600 bg-opacity-20'
                      : `border-neutral-600 ${colors.cardBg}`
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className={`${colors.text} font-bold text-sm`}>{sound.name}</p>
                      <p className={`${colors.textSecondary} text-xs`}>{sound.category}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        previewSound(key);
                      }}
                      className="text-pink-600 hover:text-pink-700"
                    >
                      {playingPreview === key ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                  </div>
                  <p className={`${colors.textSecondary} text-xs`}>{sound.description}</p>
                  <p className={`${colors.textSecondary} text-xs mt-2`}>Duration: {sound.duration}s</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Branding Kit Panel */}
        {showBrandKit && (
          <div className={`${colors.cardBg} rounded-2xl p-6 mb-6 border-2 border-pink-600`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${colors.text}`}>Branding Kit</h2>
              <button onClick={() => setShowBrandKit(false)} className={`text-2xl ${colors.textSecondary}`}>✕</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${colors.surface} rounded-xl p-4`}>
                <h3 className={`${colors.text} font-bold mb-3`}>Create New Kit</h3>
                <input
                  type="text"
                  value={brandingKit.name}
                  onChange={(e) => setBrandingKit({...brandingKit, name: e.target.value})}
                  placeholder="Kit Name"
                  className={`w-full px-3 py-2 rounded border ${colors.input} mb-3 text-sm`}
                />
                <div className="flex gap-2 mb-3">
                  <div className="flex-1">
                    <label className={`${colors.textSecondary} text-xs`}>Primary Color</label>
                    <input
                      type="color"
                      value={brandingKit.primaryColor}
                      onChange={(e) => setBrandingKit({...brandingKit, primaryColor: e.target.value})}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className={`${colors.textSecondary} text-xs`}>Secondary Color</label>
                    <input
                      type="color"
                      value={brandingKit.secondaryColor}
                      onChange={(e) => setBrandingKit({...brandingKit, secondaryColor: e.target.value})}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  onClick={saveBrandingKit}
                  className={`w-full py-2 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 ${colors.accent}`}
                >
                  <Plus size={16} /> Save Kit
                </button>
              </div>

              <div className={`${colors.surface} rounded-xl p-4`}>
                <h3 className={`${colors.text} font-bold mb-3`}>Saved Kits ({brandingKits.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brandingKits.map((kit) => (
                    <div key={kit.id} className={`${colors.cardBg} p-2 rounded flex items-center justify-between`}>
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className="w-6 h-6 rounded border border-white"
                          style={{background: `linear-gradient(135deg, ${kit.primaryColor} 0%, ${kit.secondaryColor} 100%)`}}
                        />
                        <span className={`${colors.text} text-sm font-semibold truncate`}>{kit.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => applyBrandingKit(kit)}
                          className="px-2 py-1 text-xs bg-pink-600 text-white rounded hover:bg-pink-700"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => deleteBrandingKit(kit.id)}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {brandingKits.length === 0 && <p className={colors.textSecondary}>No saved kits yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className={`${colors.cardBg} rounded-2xl p-6 mb-6 border-2 border-pink-600`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${colors.text}`}>Advanced Settings</h2>
              <button onClick={() => setShowSettings(false)} className={`text-2xl ${colors.textSecondary}`}>✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className={`block ${colors.text} font-semibold mb-2 text-sm`}>Quality</label>
                <select
                  value={animationQuality}
                  onChange={(e) => setAnimationQuality(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${colors.input} text-sm`}
                >
                  <option value="standard">Standard (Fast)</option>
                  <option value="high">High (Balanced)</option>
                  <option value="ultra">Ultra (Best)</option>
                </select>
              </div>

              <div>
                <label className={`block ${colors.text} font-semibold mb-2 text-sm`}>Duration</label>
                <select
                  value={animationDuration}
                  onChange={(e) => setAnimationDuration(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${colors.input} text-sm`}
                >
                  <option value="2">2 seconds</option>
                  <option value="3">3 seconds</option>
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                </select>
              </div>

              <div>
                <label className={`block ${colors.text} font-semibold mb-2 text-sm`}>Export Format</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${colors.input} text-sm`}
                >
                  <option value="mp4">MP4 (Best for Web)</option>
                  <option value="webm">WebM (Smaller Size)</option>
                  <option value="gif">GIF (Loop Animation)</option>
                  <option value="png">PNG Sequence</option>
                </select>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
              <h3 className="text-white font-bold mb-4">Image Filters & Effects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(filters).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-white text-sm font-semibold block mb-2 capitalize">{key}: {value}%</label>
                    <input
                      type="range"
                      min="0"
                      max={key === 'blur' || key === 'glow' ? '20' : '200'}
                      value={value}
                      onChange={(e) => setFilters({...filters, [key]: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('logo')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'logo'
                ? `${colors.accent} text-white`
                : `${colors.cardBg} ${colors.text} hover:scale-105`
            }`}
          >
            <Upload className="w-5 h-5 inline mr-2" />
            Logo Animator
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'text'
                ? `${colors.accent} text-white`
                : `${colors.cardBg} ${colors.text} hover:scale-105`
            }`}
          >
            <Type className="w-5 h-5 inline mr-2" />
            Text Animator
          </button>
          <button
            onClick={() => setShowGallery(!showGallery)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ml-auto ${colors.cardBg} ${colors.text} hover:scale-105`}
          >
            📸 Gallery ({createdAnimations.length})
          </button>
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className={`px-4 py-3 rounded-lg font-semibold transition-all ${historyIndex <= 0 ? 'opacity-50 cursor-not-allowed' : colors.cardBg}`}
            title="Undo"
          >
            ↶
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className={`px-4 py-3 rounded-lg font-semibold transition-all ${historyIndex >= history.length - 1 ? 'opacity-50 cursor-not-allowed' : colors.cardBg}`}
            title="Redo"
          >
            ↷
          </button>
        </div>

        {/* Logo Animator */}
        {activeTab === 'logo' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${colors.cardBg} rounded-2xl p-8 border-2 border-dashed border-pink-600`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-6`}>Upload Your Logo</h2>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-pink-400 rounded-xl p-12 text-center cursor-pointer transition-all hover:border-pink-600 hover:scale-105`}
              >
                {logoPreview ? (
                  <div style={getFilterStyle()}>
                    <img src={logoPreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
                  </div>
                ) : (
                  <div>
                    <Upload className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                    <p className={`${colors.text} font-semibold text-lg mb-2`}>Click to upload logo</p>
                    <p className={colors.textSecondary}>PNG, JPG, SVG</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="mt-6 space-y-3">
                <button
                  onClick={generateLogoAnimation}
                  disabled={!logoPreview || loading}
                  className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
                    logoPreview && !loading ? colors.accent : 'bg-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : '✨'}
                  {loading ? 'Creating with Sound...' : 'Generate Animation + Sound'}
                </button>
                <button
                  onClick={saveDraft}
                  disabled={!logoPreview}
                  className={`w-full py-2 rounded-lg font-semibold text-white flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 ${!logoPreview && 'opacity-50 cursor-not-allowed'}`}
                >
                  <Save size={18} /> Save as Draft (+ Sound Settings)
                </button>
              </div>
            </div>

            <div className={`${colors.cardBg} rounded-2xl p-8`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-6`}>Preview + Sound</h2>
              {animationPreview && animationPreview.type === 'logo' ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-8 flex items-center justify-center min-h-64">
                    <img src={animationPreview.preview} alt="Preview" style={getFilterStyle()} className="max-h-48 animate-pulse" />
                  </div>
                  <div className={`${colors.surface} p-4 rounded-lg space-y-2`}>
                    <p className={colors.textSecondary}><strong>Quality:</strong> {animationPreview.quality}</p>
                    <p className={colors.textSecondary}><strong>Duration:</strong> {animationPreview.duration}s</p>
                    <p className={colors.textSecondary}><strong>Format:</strong> {animationPreview.format.toUpperCase()}</p>
                    {animationPreview.soundEffect && (
                      <p className={colors.textSecondary}>
                        <strong>🎵 Sound:</strong> {soundLibrary[animationPreview.soundEffect]?.name} 
                        <strong> | Volume:</strong> {animationPreview.soundVolume}% 
                        <strong> | Timing:</strong> {animationPreview.soundTiming}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => downloadAnimation(animationPreview)}
                      className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 ${colors.accent}`}
                    >
                      <Download className="w-5 h-5" />
                      Download with Sound ({exportFormat.toUpperCase()})
                    </button>
                    <div className="flex gap-2">
                      {['twitter', 'facebook', 'instagram', 'linkedin'].map(platform => (
                        <button
                          key={platform}
                          onClick={() => shareOnSocial(platform)}
                          className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-1"
                        >
                          <Share2 size={16} /> {platform.charAt(0).toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`min-h-64 flex items-center justify-center ${colors.surface} rounded-lg`}>
                  <p className={colors.textSecondary}>Your animation + sound will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Text Animator */}
        {activeTab === 'text' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${colors.cardBg} rounded-2xl p-8`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-6`}>Create Text Animation</h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block ${colors.text} font-semibold mb-2`}>Brand Name / Text</label>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter your text..."
                    maxLength="50"
                    className={`w-full px-4 py-3 rounded-lg border ${colors.input} focus:outline-none focus:ring-2 focus:ring-pink-600`}
                  />
                  <p className={`${colors.textSecondary} text-sm mt-1`}>{textInput.length}/50 characters</p>
                </div>

                <div>
                  <label className={`block ${colors.text} font-semibold mb-2`}>Animation Style</label>
                  <select
                    value={animationStyle}
                    onChange={(e) => setAnimationStyle(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${colors.input}`}
                  >
                    <option value="elegant-fade">Elegant Fade</option>
                    <option value="dynamic-slide">Dynamic Slide</option>
                    <option value="typewriter">Typewriter Effect</option>
                    <option value="bouncy">Bouncy Entrance</option>
                    <option value="glitch">Glitch Effect</option>
                    <option value="neon">Neon Glow</option>
                  </select>
                </div>

                <div>
                  <label className={`block ${colors.text} font-semibold mb-2`}>Color Scheme</label>
                  <div className="flex gap-2">
                    {['pink', 'purple', 'cyan', 'gold', 'rainbow'].map(color => (
                      <button
                        key={color}
                        onClick={() => setColorScheme(color)}
                        className={`flex-1 h-10 rounded-lg font-bold text-white border-2 transition-all ${
                          colorScheme === color ? 'border-white scale-110' : 'border-transparent'
                        } ${
                          color === 'pink' ? 'bg-pink-600' :
                          color === 'purple' ? 'bg-purple-600' :
                          color === 'cyan' ? 'bg-cyan-600' :
                          color === 'gold' ? 'bg-yellow-500' :
                          'bg-gradient-to-r from-pink-600 to-purple-600'
                        }`}
                      >
                        {colorScheme === color ? '✓' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={generateTextAnimation}
                    disabled={!textInput.trim() || loading}
                    className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 ${
                      textInput.trim() && !loading ? colors.accent : 'bg-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : '✨'}
                    {loading ? 'Creating with Sound...' : 'Generate Animation + Sound'}
                  </button>
                  <button
                    onClick={saveDraft}
                    disabled={!textInput.trim()}
                    className={`w-full py-2 rounded-lg font-semibold text-white flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 ${!textInput.trim() && 'opacity-50 cursor-not-allowed'}`}
                  >
                    <Save size={18} /> Save as Draft (+ Sound Settings)
                  </button>
                </div>
              </div>
            </div>

            <div className={`${colors.cardBg} rounded-2xl p-8`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-6`}>Preview + Sound</h2>
              {animationPreview && animationPreview.type === 'text' ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-12 flex items-center justify-center min-h-64">
                    <p className="text-4xl font-black text-white text-center drop-shadow-lg animate-bounce">
                      {animationPreview.text}
                    </p>
                  </div>
                  <div className={`${colors.surface} p-4 rounded-lg space-y-2`}>
                    <p className={colors.textSecondary}><strong>Quality:</strong> {animationPreview.quality}</p>
                    <p className={colors.textSecondary}><strong>Duration:</strong> {animationPreview.duration}s</p>
                    <p className={colors.textSecondary}><strong>Format:</strong> {animationPreview.format.toUpperCase()}</p>
                    {animationPreview.soundEffect && (
                      <p className={colors.textSecondary}>
                        <strong>🎵 Sound:</strong> {soundLibrary[animationPreview.soundEffect]?.name} 
                        <strong> | Volume:</strong> {animationPreview.soundVolume}% 
                        <strong> | Timing:</strong> {animationPreview.soundTiming}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => downloadAnimation(animationPreview)}
                      className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 ${colors.accent}`}
                    >
                      <Download className="w-5 h-5" />
                      Download with Sound ({exportFormat.toUpperCase()})
                    </button>
                    <div className="flex gap-2">
                      {['twitter', 'facebook', 'instagram', 'linkedin'].map(platform => (
                        <button
                          key={platform}
                          onClick={() => shareOnSocial(platform)}
                          className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-1"
                        >
                          <Share2 size={16} /> {platform.charAt(0).toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`min-h-64 flex items-center justify-center ${colors.surface} rounded-lg`}>
                  <p className={colors.textSecondary}>Your animation + sound will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Drafts Section */}
        {drafts.length > 0 && (
          <div className="mt-12">
            <h2 className={`text-2xl font-bold ${colors.text} mb-6`}>💾 Saved Drafts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {drafts.map((draft) => (
                <div key={draft.id} className={`${colors.cardBg} rounded-xl p-4 hover:scale-105 transition-all`}>
                  <p className={`${colors.text} font-semibold mb-2`}>{draft.type === 'logo' ? '🖼️ Logo' : '📝 Text'}</p>
                  <p className={`${colors.textSecondary} text-sm mb-3`}>{draft.timestamp}</p>
                  {draft.settings.soundSettings && (
                    <p className="text-xs text-pink-400 mb-2">🎵 Sound: {soundLibrary[draft.settings.soundSettings.selectedSound]?.name}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadDraft(draft)}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteDraft(draft.id)}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {showGallery && createdAnimations.length > 0 && (
          <div className="mt-12">
            <h2 className={`text-3xl font-bold ${colors.text} mb-6`}>📸 Creation Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdAnimations.map((animation) => (
                <div key={animation.id} className={`${colors.cardBg} rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-all`}>
                  <div className="aspect-square bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    {animation.type === 'logo' ? (
                      <img src={animation.preview} alt="Logo" className="max-w-32 animate-pulse" />
                    ) : (
                      <p className="text-4xl font-black text-white text-center p-4">{animation.text}</p>
                    )}
                  </div>
                  <div className="p-4">
                    <p className={`${colors.textSecondary} text-sm`}>{animation.timestamp}</p>
                    <p className={`${colors.text} font-semibold mb-2`}>{animation.type === 'logo' ? 'Logo Animation' : 'Text Animation'}</p>
                    {animation.soundEffect && (
                      <p className="text-xs text-pink-400 mb-3">🎵 {soundLibrary[animation.soundEffect]?.name}</p>
                    )}
                    <div className="space-y-2">
                      <button
                        onClick={() => downloadAnimation(animation)}
                        className={`w-full py-2 rounded-lg text-white text-sm font-bold ${colors.accent}`}
                      >
                        <Download className="w-4 h-4 inline mr-1" />
                        Download
                      </button>
                      <div className="flex gap-2">
                        {['twitter', 'facebook'].map(platform => (
                          <button
                            key={platform}
                            onClick={() => shareOnSocial(platform)}
                            className="flex-1 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold"
                          >
                            {platform.charAt(0).toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showGallery && createdAnimations.length === 0 && (
          <div className={`${colors.cardBg} rounded-2xl p-12 text-center mt-12`}>
            <p className={`${colors.textSecondary} text-lg`}>No animations created yet. Start creating with sound!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`${colors.surface} border-t ${colors.accentBorder} mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className={colors.textSecondary}>Made with ❤️ for creators and brand builders</p>
          <p className="text-xs text-pink-600 mt-2">🚀 BrandFlow Pro ULTIMATE - Animation Creator with Professional Sound Design</p>
        </div>
      </footer>

      <audio ref={audioRef} />
    </div>
  );
};

export default BrandFlowULTIMATE;
