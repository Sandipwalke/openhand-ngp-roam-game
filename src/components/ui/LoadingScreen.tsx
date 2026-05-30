interface LoadingScreenProps {
  progress: number
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const displayProgress = Math.min(100, Math.round(progress))
  
  return (
    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="text-6xl mb-6 animate-bounce">🏎️</div>
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2">
          YAVATMAL <span className="text-blue-400">3D</span>
        </h1>
        <p className="text-gray-400 mb-8">Loading...</p>
        
        {/* Progress bar */}
        <div className="w-72 mx-auto">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transition-all duration-300"
              style={{ 
                width: `${displayProgress}%`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite'
              }}
            />
          </div>
          
          {/* Progress text */}
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500">Loading assets</span>
            <span className="text-white font-mono">{displayProgress}%</span>
          </div>
        </div>
        
        {/* Loading tips */}
        <div className="mt-12 text-gray-500 text-sm">
          {displayProgress < 30 && <p>Initializing 3D engine...</p>}
          {displayProgress >= 30 && displayProgress < 60 && <p>Loading city assets...</p>}
          {displayProgress >= 60 && displayProgress < 90 && <p>Preparing vehicles...</p>}
          {displayProgress >= 90 && <p>Almost ready...</p>}
        </div>
      </div>
      
      {/* Version */}
      <div className="absolute bottom-4 text-gray-600 text-xs">
        v1.0.0
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}