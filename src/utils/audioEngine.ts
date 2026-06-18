let audioCtx: AudioContext | null = null;

/**
 * Generates and plays ambient Brown Noise using the Web Audio API.
 * Brown noise has more energy at lower frequencies, making it sound like a deep waterfall or ocean roar.
 * It's excellent for blocking out distractions and focusing.
 * 
 * Returns a cleanup function to stop the noise.
 */
export function playAmbientBrownNoise(): () => void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return () => {}; // Not supported

    audioCtx = new AudioContextClass();

    const bufferSize = 2 * audioCtx.sampleRate; // 2 seconds of noise buffer
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Generate Brown Noise using a first-order integrator (low-pass filter) on white noise
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }
    
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true; // Seamless loop
    
    // Add a Biquad lowpass filter for extra warmth and to remove any harsh high frequencies
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; // 400 Hz cutoff
    
    // Master gain for the noise
    const gainNode = audioCtx.createGain();
    // Start at 0 volume and fade in over 2 seconds for a gentle start
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 2);
    
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    noiseSource.start(0);
    
    return () => {
      // Fade out over 1 second before stopping
      if (audioCtx && audioCtx.state === 'running') {
        gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
        
        setTimeout(() => {
          try {
            noiseSource.stop();
            noiseSource.disconnect();
            filter.disconnect();
            gainNode.disconnect();
            audioCtx?.close();
            audioCtx = null;
          } catch (e) {
            console.error("Audio cleanup error", e);
          }
        }, 1000);
      }
    };
  } catch (e) {
    console.error("Audio API error:", e);
    return () => {};
  }
}
