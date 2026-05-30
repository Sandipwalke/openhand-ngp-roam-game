// Audio Manager for game sounds
// Uses Web Audio API for engine sounds and ambient audio

class AudioManager {
  private audioContext: AudioContext | null = null
  private engineOscillator: OscillatorNode | null = null
  private engineGain: GainNode | null = null
  private ambientGain: GainNode | null = null
  private isInitialized = false
  
  initialize() {
    if (this.isInitialized) return
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Engine sound setup
      this.engineOscillator = this.audioContext.createOscillator()
      this.engineGain = this.audioContext.createGain()
      
      this.engineOscillator.type = 'sawtooth'
      this.engineOscillator.frequency.value = 80
      this.engineGain.gain.value = 0
      
      this.engineOscillator.connect(this.engineGain)
      this.engineGain.connect(this.audioContext.destination)
      this.engineOscillator.start()
      
      this.isInitialized = true
      console.log('Audio manager initialized')
    } catch (e) {
      console.warn('Audio not available:', e)
    }
  }
  
  updateEngineSound(speed: number, throttle: boolean) {
    if (!this.engineOscillator || !this.engineGain) return
    
    // Base frequency increases with speed
    const baseFreq = 60 + (speed / 5)
    const freq = throttle ? baseFreq * 1.5 : baseFreq
    
    // Volume based on speed
    const volume = Math.min(0.15, (speed / 200) * 0.2)
    
    this.engineOscillator.frequency.setTargetAtTime(freq, this.audioContext!.currentTime, 0.1)
    this.engineGain.gain.setTargetAtTime(volume, this.audioContext!.currentTime, 0.05)
  }
  
  playCollision() {
    if (!this.audioContext) return
    
    // Create collision sound
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.type = 'square'
    osc.frequency.value = 100
    gain.gain.value = 0.3
    
    osc.connect(gain)
    gain.connect(this.audioContext.destination)
    
    osc.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)
    
    osc.start()
    osc.stop(this.audioContext.currentTime + 0.2)
  }
  
  playPickup() {
    if (!this.audioContext) return
    
    // Create pickup sound
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.type = 'sine'
    gain.gain.value = 0.2
    
    osc.connect(gain)
    gain.connect(this.audioContext.destination)
    
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)
    
    osc.start()
    osc.stop(this.audioContext.currentTime + 0.2)
  }
  
  setMasterVolume(volume: number) {
    if (this.engineGain) {
      this.engineGain.gain.value = volume
    }
  }
  
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }
  
  dispose() {
    if (this.engineOscillator) {
      this.engineOscillator.stop()
      this.engineOscillator.disconnect()
    }
    if (this.audioContext) {
      this.audioContext.close()
    }
  }
}

export const audioManager = new AudioManager()