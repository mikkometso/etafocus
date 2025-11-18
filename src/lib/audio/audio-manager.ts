/**
 * Audio Manager - Handles sound playback using Web Audio API
 * Supports built-in browser-generated sounds for timer notifications
 */

export type SoundType = 'default' | 'beep' | 'chime'

/**
 * Play a notification sound using Web Audio API
 * @param soundType - The type of sound to play ('default', 'beep', or 'chime')
 * @param durationSeconds - Target duration in seconds (1, 2, or 3)
 * @returns Promise that resolves when the sound finishes playing
 */
export async function playNotificationSound(
  soundType: SoundType = 'default',
  durationSeconds: number = 1
): Promise<void> {
  try {
    const audioContext = new AudioContext()

    switch (soundType) {
      case 'beep':
        await playBeep(audioContext, durationSeconds)
        break
      case 'chime':
        await playChime(audioContext, durationSeconds)
        break
      case 'default':
      default:
        await playDefault(audioContext, durationSeconds)
        break
    }

    // Close the audio context to free up resources
    await audioContext.close()
  } catch (error) {
    console.error('Failed to play notification sound:', error)
    throw error
  }
}

/**
 * Play a default notification sound (single tone)
 * @param audioContext - The audio context to use
 * @param targetDuration - Target duration in seconds (scales the base 0.5s sound)
 */
async function playDefault(audioContext: AudioContext, targetDuration: number = 1): Promise<void> {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // Base duration is 0.5s, scale to target
  const scale = targetDuration / 0.5
  const totalDuration = 0.5 * scale
  const fadeIn = 0.01 * scale
  const sustainEnd = (0.5 - 0.02) * scale

  // Configure the sound: 800Hz sine wave
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime)

  // Envelope: fade in and out to avoid clicks
  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + fadeIn)
  gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + sustainEnd)
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + totalDuration)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + totalDuration)

  // Wait for the sound to finish
  return new Promise((resolve) => {
    oscillator.onended = () => resolve()
  })
}

/**
 * Play a beep sound (double beep pattern)
 * @param audioContext - The audio context to use
 * @param targetDuration - Target duration in seconds (scales the base 0.4s sound)
 */
async function playBeep(audioContext: AudioContext, targetDuration: number = 1): Promise<void> {
  // Base total duration is 0.4s (150ms beep + 100ms gap + 150ms beep)
  const scale = targetDuration / 0.4
  const beepDuration = 0.15 * scale
  const gapDuration = 0.1 * scale
  const fadeTime = 0.01 * scale

  const playTone = (startTime: number, frequency: number, duration: number) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(frequency, startTime)

    // Envelope
    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + fadeTime)
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + duration - fadeTime)
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration)

    return oscillator
  }

  // Create double beep pattern: 880Hz beep, pause, 880Hz beep
  const currentTime = audioContext.currentTime
  playTone(currentTime, 880, beepDuration)
  const secondBeep = playTone(currentTime + beepDuration + gapDuration, 880, beepDuration)

  // Wait for the second beep to finish
  return new Promise((resolve) => {
    secondBeep.onended = () => resolve()
  })
}

/**
 * Play a chime sound (ascending three-note pattern)
 * @param audioContext - The audio context to use
 * @param targetDuration - Target duration in seconds (scales the base 0.7s sound)
 */
async function playChime(audioContext: AudioContext, targetDuration: number = 1): Promise<void> {
  // Base total duration is 0.7s (notes at 0, 0.15, 0.3 with last note duration 0.4)
  const scale = targetDuration / 0.7
  const note1Duration = 0.3 * scale
  const note2Start = 0.15 * scale
  const note2Duration = 0.3 * scale
  const note3Start = 0.3 * scale
  const note3Duration = 0.4 * scale
  const fadeIn = 0.01 * scale

  const playTone = (startTime: number, frequency: number, duration: number) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, startTime)

    // Envelope with longer release for bell-like sound
    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(0.25, startTime + fadeIn)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration)

    return oscillator
  }

  // Create ascending chime pattern: C5 (523Hz), E5 (659Hz), G5 (784Hz)
  const currentTime = audioContext.currentTime
  playTone(currentTime, 523.25, note1Duration)
  playTone(currentTime + note2Start, 659.25, note2Duration)
  const lastNote = playTone(currentTime + note3Start, 783.99, note3Duration)

  // Wait for the last note to finish
  return new Promise((resolve) => {
    lastNote.onended = () => resolve()
  })
}

/**
 * Window interface with webkit-prefixed AudioContext for legacy browser support
 */
interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext
}

/**
 * Check if the Web Audio API is supported in the current browser
 */
export function isAudioSupported(): boolean {
  return typeof AudioContext !== 'undefined' || typeof (window as WebkitWindow).webkitAudioContext !== 'undefined'
}
