import { useGameStore } from '../../stores/gameStore'

export function Settings() {
  const { 
    settings, 
    updateSettings, 
    isSettingsOpen, 
    setSettingsOpen,
    saveProgress,
    loadProgress
  } = useGameStore()
  
  if (!isSettingsOpen) return null
  
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl w-[90%] max-w-lg overflow-hidden border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold">SETTINGS</h2>
            <p className="text-purple-200 text-sm">Customize your experience</p>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="text-white/80 hover:text-white text-3xl font-light"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Graphics Quality */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">GRAPHICS QUALITY</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((quality) => (
                <button
                  key={quality}
                  onClick={() => updateSettings({ graphicsQuality: quality })}
                  className={`
                    flex-1 py-2 px-4 rounded-lg font-semibold capitalize transition-all
                    ${settings.graphicsQuality === quality 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                  `}
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>
          
          {/* Music Volume */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">
              MUSIC VOLUME: {Math.round(settings.musicVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.musicVolume * 100}
              onChange={(e) => updateSettings({ musicVolume: Number(e.target.value) / 100 })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          
          {/* SFX Volume */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">
              SOUND EFFECTS: {Math.round(settings.sfxVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.sfxVolume * 100}
              onChange={(e) => updateSettings({ sfxVolume: Number(e.target.value) / 100 })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          
          {/* Toggles */}
          <div className="space-y-4">
            <ToggleSetting
              label="SHOW MINIMAP"
              enabled={settings.showMinimap}
              onChange={(v) => updateSettings({ showMinimap: v })}
            />
            <ToggleSetting
              label="SHOW DAMAGE INDICATORS"
              enabled={settings.showDamage}
              onChange={(v) => updateSettings({ showDamage: v })}
            />
            <ToggleSetting
              label="CONTROLLER VIBRATION"
              enabled={settings.controllerEnabled}
              onChange={(v) => updateSettings({ controllerEnabled: v })}
            />
          </div>
          
          {/* Save/Load */}
          <div className="border-t border-white/10 pt-4 flex gap-3">
            <button
              onClick={() => {
                saveProgress()
                alert('Game saved!')
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              💾 SAVE GAME
            </button>
            <button
              onClick={() => {
                loadProgress()
                alert('Game loaded!')
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              📂 LOAD GAME
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-800 px-6 py-3 text-center">
          <span className="text-white/40 text-sm">Press ESC to close</span>
        </div>
      </div>
    </div>
  )
}

function ToggleSetting({ label, enabled, onChange }: { label: string; enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/80">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`
          w-14 h-8 rounded-full transition-all relative
          ${enabled ? 'bg-green-500' : 'bg-gray-600'}
        `}
      >
        <div 
          className={`
            absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all
            ${enabled ? 'left-7' : 'left-1'}
          `}
        />
      </button>
    </div>
  )
}