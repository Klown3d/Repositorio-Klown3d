import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create a simple ambient audio track using Web Audio API
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Using a data URI for a simple beep pattern - in production, use a real audio file
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initAudio = async () => {
    if (!audioContextRef.current && audioRef.current) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      // Create oscillators for ambient sound
      const oscillator1 = audioContextRef.current.createOscillator();
      const oscillator2 = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator1.type = "sawtooth";
      oscillator2.type = "square";
      oscillator1.frequency.setValueAtTime(55, audioContextRef.current.currentTime); // Low A
      oscillator2.frequency.setValueAtTime(82.5, audioContextRef.current.currentTime); // Low E
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      oscillator1.start();
      oscillator2.start();

      // Add frequency modulation for variation
      const lfo = audioContextRef.current.createOscillator();
      const lfoGain = audioContextRef.current.createGain();
      lfo.frequency.setValueAtTime(0.5, audioContextRef.current.currentTime);
      lfoGain.gain.setValueAtTime(10, audioContextRef.current.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator1.frequency);
      lfo.start();

      visualize();
    }
  };

  const visualize = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgba(20, 20, 20, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        // Punk color scheme - red to green gradient based on frequency
        const red = (dataArray[i] / 255) * 200 + 55;
        const green = (dataArray[i] / 255) * 150;
        
        ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgb(${red}, ${green}, 0)`;

        x += barWidth + 1;
      }
    };

    draw();
  };

  const toggleAudio = async () => {
    if (!isPlaying) {
      await initAudio();
      setIsPlaying(true);
    } else {
      if (audioContextRef.current) {
        await audioContextRef.current.suspend();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none opacity-30 z-0"
      />
      <Button
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-50 bg-primary hover:bg-primary/90 box-glow-red border-2 border-primary"
        size="icon"
      >
        {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </Button>
    </>
  );
};

export default AudioVisualizer;
