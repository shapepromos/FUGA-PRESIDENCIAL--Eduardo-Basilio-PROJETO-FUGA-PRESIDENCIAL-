/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { Trophy, Play, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- PIXEL ART MATRICES ---
const P = 'transparent'; // Vazio
const S = '#ffcc99';     // Pele
const H = '#ffdd44';     // Cabelo loiro Trump
const HG = '#aaaaaa';    // Cabelo/Barba cinza Lula
const HB = '#333333';    // Cabelo Bolsonaro
const B = '#003366';     // Terno Azul
const BK = '#111111';    // Terno Preto
const R = '#cc0000';     // Gravata Vermelha
const W = '#ffffff';     // Camisa branca / Olho
const K = '#000000';     // Sapato / Pupila
const G = '#228B22';     // Verde Bandeira Br / Faixa
const Y = '#FFD700';     // Amarelo Bandeira Br / Faixa
const AZ = '#0000FF';    // Azul Bandeira Br
const OR = '#FF8C00';    // Laranja/Pele Irã
const TR = '#8B4513';    // Marrom
const RE = '#DE2110';    // Vermelho China

const TRUMP_MATRIX = [
  [P,P,P,P,P,P,H,H,H,H,P,P,P,P,P,P],
  [P,P,P,P,P,H,H,H,H,H,H,P,P,P,P,P],
  [P,P,P,P,H,H,H,H,H,H,H,H,P,P,P,P],
  [P,P,P,P,H,S,S,S,S,S,S,H,P,P,P,P],
  [P,P,P,P,S,W,K,S,S,W,K,S,P,P,P,P],
  [P,P,P,P,S,S,S,S,S,S,S,S,P,P,P,P],
  [P,P,P,P,P,S,S,S,S,S,S,P,P,P,P,P],
  [P,P,P,P,P,B,B,W,W,B,B,P,P,P,P,P],
  [P,P,P,B,B,B,B,R,R,B,B,B,B,P,P,P],
  [P,P,S,B,B,B,B,R,R,B,B,B,B,S,P,P],
  [P,P,S,B,B,B,B,R,R,B,B,B,B,S,P,P],
  [P,P,P,B,B,B,B,B,B,B,B,B,B,P,P,P],
  [P,P,P,B,B,B,B,B,B,B,B,B,B,P,P,P],
  [P,P,P,P,B,B,P,P,P,P,B,B,P,P,P,P],
  [P,P,P,P,B,B,P,P,P,P,B,B,P,P,P,P],
  [P,P,P,K,K,K,P,P,P,P,K,K,K,P,P,P]
];

const LULA_MATRIX = [
  [P,P,P,P,P,HG,HG,HG,HG,HG,P,P,P,P,P],
  [P,P,P,P,HG,HG,HG,HG,HG,HG,HG,P,P,P,P],
  [P,P,P,HG,HG,HG,HG,HG,HG,HG,HG,HG,P,P,P],
  [P,P,P,HG,S,S,S,S,S,S,S,HG,P,P,P],
  [P,P,P,S,W,K,S,S,S,W,K,S,P,P,P],
  [P,P,P,S,S,S,S,S,S,S,S,S,P,P,P],
  [P,P,P,HG,HG,HG,HG,HG,HG,HG,HG,P,P,P,P],
  [P,P,P,BK,BK,W,W,BK,BK,P,P,P,P,P],
  [P,BK,BK,BK,BK,R,R,BK,BK,BK,BK,P,P],
  [P,S,BK,BK,BK,R,R,BK,BK,BK,BK,S,P],
  [P,S,BK,BK,BK,R,R,BK,BK,BK,BK,S,P],
  [P,P,BK,BK,BK,BK,BK,BK,BK,BK,P,P,P],
  [P,P,BK,BK,BK,BK,BK,BK,BK,BK,P,P,P],
  [P,P,P,BK,BK,P,P,P,BK,BK,P,P,P,P],
  [P,P,P,BK,BK,P,P,P,BK,BK,P,P,P,P],
  [P,P,K,K,K,P,P,P,K,K,K,P,P,P,P]
];

const BOLSONARO_MATRIX = [
  [P,P,P,P,P,HB,HB,HB,HB,HB,P,P,P,P,P],
  [P,P,P,P,HB,HB,HB,HB,HB,HB,HB,P,P,P,P],
  [P,P,P,P,HB,S,S,S,S,S,HB,P,P,P,P],
  [P,P,P,P,S,W,K,S,S,W,K,S,P,P,P,P],
  [P,P,P,P,S,S,S,S,S,S,S,S,P,P,P,P],
  [P,P,P,P,P,S,S,S,S,S,S,P,P,P,P,P],
  [P,P,P,P,BK,BK,G,Y,BK,BK,P,P,P,P],
  [P,P,BK,BK,BK,G,Y,BK,BK,BK,BK,P,P],
  [P,S,BK,BK,BK,G,Y,BK,BK,BK,BK,S,P],
  [P,S,BK,BK,BK,G,Y,BK,BK,BK,BK,S,P],
  [P,P,BK,BK,BK,G,Y,BK,BK,BK,BK,P,P],
  [P,P,BK,BK,BK,BK,BK,BK,BK,BK,P,P],
  [P,P,P,BK,BK,P,P,P,BK,BK,P,P,P,P],
  [P,P,P,BK,BK,P,P,P,BK,BK,P,P,P,P],
  [P,P,K,K,K,P,P,P,K,K,K,P,P,P,P]
];

const CHINA_MATRIX = [
  [P,P,P,P,P,HB,HB,HB,HB,HB,P,P,P,P,P],
  [P,P,P,P,HB,HB,HB,HB,HB,HB,HB,P,P,P,P],
  [P,P,P,P,HB,S,S,S,S,S,HB,P,P,P,P],
  [P,P,P,P,S,W,K,S,S,W,K,S,P,P,P,P],
  [P,P,P,P,S,S,S,S,S,S,S,S,P,P,P,P],
  [P,P,P,P,P,S,S,S,S,S,S,P,P,P,P,P],
  [P,P,P,P,BK,BK,BK,BK,BK,BK,P,P,P,P],
  [P,P,BK,BK,BK,BK,BK,BK,BK,BK,BK,P,P],
  [P,S,BK,BK,BK,RE,RE,BK,BK,BK,BK,S,P],
  [P,S,BK,BK,BK,RE,RE,BK,BK,BK,BK,S,P],
  [P,P,BK,BK,BK,BK,BK,BK,BK,BK,P,P,P],
  [P,P,BK,BK,BK,BK,BK,BK,BK,BK,P,P,P],
  [P,P,P,BK,BK,P,P,P,BK,BK,P,P,P,P],
  [P,P,P,BK,BK,P,P,P,BK,BK,P,P,P,P],
  [P,P,K,K,K,P,P,P,K,K,K,P,P,P,P]
];

const IRAN_MATRIX = [
  [P,P,P,P,BK,BK,BK,BK,BK,P,P,P,P,P],
  [P,P,P,BK,BK,BK,BK,BK,BK,BK,P,P,P,P],
  [P,P,BK,BK,S,S,S,S,S,BK,BK,P,P,P],
  [P,P,BK,BK,W,K,S,W,K,BK,BK,P,P,P],
  [P,P,P,S,S,S,S,S,S,S,P,P,P,P,P],
  [P,P,P,HG,HG,HG,HG,HG,HG,P,P,P,P,P],
  [P,P,BK,BK,BK,BK,BK,BK,BK,BK,P,P,P],
  [P,P,BK,BK,BK,BK,BK,BK,BK,BK,P,P,P],
  [P,S,BK,BK,BK,TR,TR,BK,BK,BK,S,P,P],
  [P,S,BK,BK,BK,TR,TR,BK,BK,BK,S,P,P],
  [P,P,BK,BK,BK,BK,BK,BK,BK,BK,P,P,P],
  [P,P,BK,BK,BK,BK,BK,BK,BK,BK,P,P,P],
  [P,P,P,BK,BK,P,P,P,BK,BK,P,P,P,P],
  [P,P,P,BK,BK,P,P,P,BK,BK,P,P,P,P],
  [P,P,K,K,K,P,P,P,K,K,K,P,P,P,P]
];

const FLAG_USA = [
  [B,W,B,W,B,R,R,R,R,R],
  [W,B,W,B,W,W,W,W,W,W],
  [B,W,B,W,B,R,R,R,R,R],
  [W,W,W,W,W,W,W,W,W,W],
  [R,R,R,R,R,R,R,R,R,R],
  [W,W,W,W,W,W,W,W,W,W]
];

const FLAG_BR = [
  [G,G,G,G,G,G,G,G,G,G],
  [G,G,G,G,Y,Y,G,G,G,G],
  [G,G,Y,Y,AZ,AZ,Y,Y,G,G],
  [G,G,Y,Y,AZ,AZ,Y,Y,G,G],
  [G,G,G,G,Y,Y,G,G,G,G],
  [G,G,G,G,G,G,G,G,G,G]
];

const FLAG_CN = [
  [RE,RE,RE,RE,RE,RE,RE,RE,RE,RE],
  [RE,Y,RE,RE,RE,RE,RE,RE,RE,RE],
  [RE,RE,RE,RE,RE,RE,RE,RE,RE,RE],
  [RE,RE,RE,RE,RE,RE,RE,RE,RE,RE],
  [RE,RE,RE,RE,RE,RE,RE,RE,RE,RE],
  [RE,RE,RE,RE,RE,RE,RE,RE,RE,RE]
];

const FLAG_IR = [
  [G,G,G,G,G,G,G,G,G,G],
  [W,W,W,W,R,W,W,W,W,W],
  [W,W,W,R,R,R,W,W,W,W],
  [W,W,W,W,R,W,W,W,W,W],
  [R,R,R,R,R,R,R,R,R,R],
  [R,R,R,R,R,R,R,R,R,R]
];

type GameState = 'START' | 'PLAYING' | 'GAMEOVER';

interface RankingEntry {
  name: string;
  score: number;
}

const PLAYER_SIZE = 40;
const INITIAL_SPEED = 2.5;
const ENEMY_BASE_SPEED = 1.8;
const SPEED_INCREMENT = 0.0001;

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef({ x: 100, y: 100, vx: 0, vy: 0 });
  const enemiesRef = useRef<any[]>([]);
  const particlesRef = useRef<any[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const timerRef = useRef(0);
  const dpadRef = useRef({ up: false, down: false, left: false, right: false, x: 0, y: 0 });
  const shakeRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextBeatRef = useRef(0);
  const lastSpawnCountRef = useRef(0);

  // Procedural Soundtrack: War Beat
  const playBeat = () => {
    if (!audioCtxRef.current || gameState !== 'PLAYING') return;
    const ctx = audioCtxRef.current;
    
    // Kick Drum
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);

    // Snare (Noise)
    if (Math.random() > 0.5) {
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.1, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
    }
  };

  // Audio System (Web Audio API)
  const playSound = (freq: number, type: OscillatorType, duration: number) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context not supported", e);
    }
  };

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('fuga_ranking');
    if (saved) setRanking(JSON.parse(saved));
  }, []);

  const saveRanking = (name: string, finalScore: number) => {
    const newRanking = [...ranking, { name: name || 'AAA', score: finalScore }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    setRanking(newRanking);
    localStorage.setItem('fuga_ranking', JSON.stringify(newRanking));
    setShowNameInput(false);
  };

  const drawMatrix = (ctx: CanvasRenderingContext2D, matrix: string[][], x: number, y: number, scale: number) => {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 'transparent') {
          ctx.fillStyle = matrix[r][c];
          ctx.fillRect(x + c * scale, y + r * scale, scale, scale);
        }
      }
    }
  };

  const startGame = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    playSound(440, 'square', 0.1);
    
    setGameState('PLAYING');
    setScore(0);
    timerRef.current = Date.now();
    shakeRef.current = 0;
    particlesRef.current = [];
    nextBeatRef.current = 0;
    lastSpawnCountRef.current = 0;
    
    const width = containerRef.current?.clientWidth || window.innerWidth;
    const height = containerRef.current?.clientHeight || window.innerHeight;
    
    playerRef.current = { 
      x: width / 2 - PLAYER_SIZE / 2, 
      y: height / 2 - PLAYER_SIZE / 2, 
      vx: 0, 
      vy: 0 
    };
    const pool = ['LULA', 'BOLSONARO', 'CHINA', 'IRAN'];
    const initialType = pool[Math.floor(Math.random() * pool.length)];
    enemiesRef.current = [
      { x: 50, y: 50, type: initialType }
    ];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current[e.key.toLowerCase()] = true;
    const handleKeyUp = (e: KeyboardEvent) => delete keysRef.current[e.key.toLowerCase()];
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let animationFrame: number;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }

      // 1. INPUT (Keyboard + Analog)
      let dx = 0;
      let dy = 0;
      if (keysRef.current['arrowup'] || keysRef.current['w']) dy -= 1;
      if (keysRef.current['arrowdown'] || keysRef.current['s']) dy += 1;
      if (keysRef.current['arrowleft'] || keysRef.current['a']) dx -= 1;
      if (keysRef.current['arrowright'] || keysRef.current['d']) dx += 1;

      // Analog Support
      if (dpadRef.current.x !== 0 || dpadRef.current.y !== 0) {
        dx = dpadRef.current.x;
        dy = dpadRef.current.y;
      }

      if (dx !== 0 && dy !== 0) {
        const mag = Math.sqrt(dx * dx + dy * dy);
        dx /= mag; dy /= mag;
      }

      playerRef.current.x += dx * INITIAL_SPEED;
      playerRef.current.y += dy * INITIAL_SPEED;

      // Particles when moving
      if (dx !== 0 || dy !== 0) {
        if (Math.random() > 0.8) {
          particlesRef.current.push({
            x: playerRef.current.x + PLAYER_SIZE / 2,
            y: playerRef.current.y + PLAYER_SIZE,
            life: 1.0,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1
          });
        }
      }

      playerRef.current.x = Math.max(0, Math.min(canvas.width - PLAYER_SIZE, playerRef.current.x));
      playerRef.current.y = Math.max(0, Math.min(canvas.height - PLAYER_SIZE, playerRef.current.y));

      // 2. ENEMIES & LOGIC
      const elapsed = (Date.now() - timerRef.current) / 1000;
      setScore(elapsed);

      // Music Beat
      if (elapsed > nextBeatRef.current) {
        playBeat();
        nextBeatRef.current += 0.4;
      }
      
      const enemySpeed = ENEMY_BASE_SPEED + (elapsed * SPEED_INCREMENT * 150);

      // Spawn a new enemy every 10 seconds
      const currentSpawnInterval = Math.floor(elapsed / 10);
      if (currentSpawnInterval > lastSpawnCountRef.current) {
        lastSpawnCountRef.current = currentSpawnInterval;
        const pool = ['LULA', 'BOLSONARO', 'CHINA', 'IRAN'];
        const selectedType = pool[Math.floor(Math.random() * pool.length)];
        let sx = 0;
        let sy = 0;
        if (Math.random() > 0.5) {
          sx = Math.random() > 0.5 ? -30 : canvas.width + 30;
          sy = Math.random() * canvas.height;
        } else {
          sx = Math.random() * canvas.width;
          sy = Math.random() > 0.5 ? -30 : canvas.height + 30;
        }
        enemiesRef.current.push({ x: sx, y: sy, type: selectedType });
        playSound(220, 'sine', 0.25); // Alert sound
        shakeRef.current = 5;
      }

      enemiesRef.current.forEach(enemy => {
        const edx = playerRef.current.x - enemy.x;
        const edy = playerRef.current.y - enemy.y;
        const dist = Math.sqrt(edx * edx + edy * edy);
        
        // COLLISION (adjusted hitbox)
        if (dist < 28) {
          playSound(100, 'sawtooth', 0.3);
          shakeRef.current = 15;
          setGameState('GAMEOVER');
          if (elapsed > (ranking[2]?.score || 0) || ranking.length < 3) {
            setShowNameInput(true);
          }
        }

        if (dist > 0) {
          enemy.x += (edx / dist) * enemySpeed;
          enemy.y += (edy / dist) * enemySpeed;
        }
      });

      // Separation Force logic to prevent enemy overlapping (mesclarem)
      const MIN_SEPARATION = 38; // px
      for (let i = 0; i < enemiesRef.current.length; i++) {
        for (let j = i + 1; j < enemiesRef.current.length; j++) {
          const e1 = enemiesRef.current[i];
          const e2 = enemiesRef.current[j];
          const sepX = e2.x - e1.x;
          const sepY = e2.y - e1.y;
          const sepDist = Math.sqrt(sepX * sepX + sepY * sepY);
          
          if (sepDist < MIN_SEPARATION) {
            const overlap = MIN_SEPARATION - sepDist;
            const pushX = sepDist === 0 ? 1 : sepX / sepDist;
            const pushY = sepDist === 0 ? 0 : sepY / sepDist;
            
            e1.x -= pushX * overlap * 0.5;
            e1.y -= pushY * overlap * 0.5;
            e2.x += pushX * overlap * 0.5;
            e2.y += pushY * overlap * 0.5;
          }
        }
      }

      // Constrain enemies to stay in boundary
      enemiesRef.current.forEach(enemy => {
        enemy.x = Math.max(-10, Math.min(canvas.width - 30, enemy.x));
        enemy.y = Math.max(-10, Math.min(canvas.height - 30, enemy.y));
      });

      // 3. DRAW
      ctx.save();
      
      // Screen Shake
      if (shakeRef.current > 0) {
        const sx = (Math.random() - 0.5) * shakeRef.current;
        const sy = (Math.random() - 0.5) * shakeRef.current;
        ctx.translate(sx, sy);
        shakeRef.current *= 0.9;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for(let i=0; i<canvas.width; i+=40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
      for(let j=0; j<canvas.height; j+=40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke(); }

      // Particles
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.02;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.2})`;
        ctx.fillRect(p.x, p.y, 4, 4);
        if (p.life <= 0) particlesRef.current.splice(i, 1);
      });

      const scale = 2.5;
      drawMatrix(ctx, TRUMP_MATRIX, playerRef.current.x, playerRef.current.y, scale);
      drawMatrix(ctx, FLAG_USA, playerRef.current.x + 10, playerRef.current.y - 25, 2);
      ctx.fillStyle = '#666'; ctx.fillRect(playerRef.current.x + 8, playerRef.current.y - 25, 2, 20);

      enemiesRef.current.forEach(enemy => {
        let matrix = LULA_MATRIX;
        let flag = FLAG_BR;
        if (enemy.type === 'BOLSONARO') { matrix = BOLSONARO_MATRIX; flag = FLAG_BR; }
        if (enemy.type === 'CHINA') { matrix = CHINA_MATRIX; flag = FLAG_CN; }
        if (enemy.type === 'IRAN') { matrix = IRAN_MATRIX; flag = FLAG_IR; }
        
        drawMatrix(ctx, matrix, enemy.x, enemy.y, scale);
        drawMatrix(ctx, flag, enemy.x + 10, enemy.y - 25, 2);
        ctx.fillStyle = '#666'; ctx.fillRect(enemy.x + 8, enemy.y - 25, 2, 20);
      });

      ctx.restore();
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [gameState, ranking]);

  const enemyCount = enemiesRef.current?.length || 1;
  const defcon = Math.max(1, Math.min(5, 6 - enemyCount));
  const isHighThreat = enemyCount >= 4;

  const secondsToHms = (d: number) => {
    const m = Math.floor(d / 60);
    const s = Math.floor(d % 60);
    const ms = Math.floor((d % 1) * 100);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  // Joystick Logic
  const handleJoystick = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = rect.width / 2;
    
    if (dist > 5) {
      dpadRef.current.x = Math.max(-1, Math.min(1, dx / maxDist));
      dpadRef.current.y = Math.max(-1, Math.min(1, dy / maxDist));
    }
  };

  const endJoystick = () => {
    dpadRef.current.x = 0;
    dpadRef.current.y = 0;
  };

  return (
    <div className="w-full h-full bg-zinc-950 text-zinc-100 flex flex-col font-sans overflow-hidden">
      
      {/* Header Section */}
      <header className="flex justify-between items-center px-6 md:px-12 py-6 md:py-8 geo-border border-b bg-zinc-950 z-10">
        <div className="flex flex-col gap-1 min-w-[120px]">
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Live Survival</span>
          <div className="text-2xl md:text-4xl font-mono font-bold text-emerald-400 tabular tabular-nums">
            {secondsToHms(score)}
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-lg md:text-2xl font-black tracking-tighter uppercase italic">Fuga Presidencial</h1>
          <div className="h-1 w-16 md:w-24 bg-emerald-500 mx-auto mt-1"></div>
        </div>
        
        <div className="flex flex-col items-end gap-1 min-w-[120px]">
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Oponentes</span>
          <div className={`text-2xl md:text-4xl font-mono font-bold ${isHighThreat ? 'text-red-500' : 'text-emerald-400'}`}>{enemyCount.toString().padStart(2, '0')}</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row justify-center items-center relative gap-8 p-4 md:p-10 overflow-hidden">
        
        {/* Ranking Sidebar (Hidden on small screens if not needed) */}
        <div className="hidden lg:block w-64 geo-card p-6 self-start mt-4">
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-800 pb-2 font-bold">Top 3 Hall of Fame</h3>
          <div className="space-y-4">
            {ranking.length === 0 ? (
              <p className="text-zinc-600 text-[10px] uppercase">No records found</p>
            ) : (
              ranking.map((entry, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-zinc-500 font-mono text-xs">0{i+1}</span>
                  <span className="font-bold text-sm truncate max-w-[100px]">{entry.name}</span>
                  <span className="text-emerald-400 font-mono text-sm tabular">{entry.score.toFixed(1)}s</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Central Game Canvas Container */}
        <div 
          ref={containerRef}
          className={`relative flex-1 w-full max-w-[1000px] h-full max-h-[700px] bg-zinc-900 geo-border border-8 rounded-lg shadow-2xl overflow-hidden flex items-center justify-center transition-colors duration-500 ${isHighThreat ? 'border-red-900/50' : 'border-zinc-800'}`}
        >
          {/* Grass Background Simulation Overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Enemy Pursuit Alert UI overlay */}
          {gameState === 'PLAYING' && (
            <div className={`absolute top-4 left-4 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border backdrop-blur-sm transition-colors ${isHighThreat ? 'border-red-500' : 'border-emerald-500/30'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${isHighThreat ? 'bg-red-600' : 'bg-emerald-600'}`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${isHighThreat ? 'text-red-500' : 'text-emerald-500'}`}>
                {isHighThreat ? 'ALERTA MÁXIMO: COALIZÃO GLOBAL' : 'Fuga Ativa: Desvie das Ameaças'}
              </span>
            </div>
          )}

          {/* GAME SCREENS */}
          <AnimatePresence>
            {gameState === 'START' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-md"
              >
                <div className="geo-card p-10 flex flex-col items-center max-w-sm w-full bg-zinc-900 border-zinc-700">
                  <Trophy size={48} className="text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                  <h2 className="pixel-text text-3xl mb-1 text-white">Fuga Geral</h2>
                  <p className="text-zinc-500 mb-8 text-center text-sm">Controle Trump e fuja de seus perseguidores...</p>
                  
                  <div className="w-full mb-8">
                    <label className="text-[10px] uppercase text-zinc-500 mb-2 block font-bold text-center tracking-widest">Identidade do Agente</label>
                    <input 
                      type="text" 
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value.toUpperCase().slice(0, 10))}
                      className="w-full p-4 rounded-xl border border-zinc-800 bg-zinc-950 focus:border-emerald-500 focus:outline-none pixel-text text-center text-white placeholder:text-zinc-800"
                      placeholder="DIGITE SEU NOME"
                    />
                  </div>

                  <button 
                    onClick={startGame}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Play fill="currentColor" size={20} />
                    <span className="pixel-text text-lg">Iniciar Operação</span>
                  </button>
                </div>
              </motion.div>
            )}

            {gameState === 'GAMEOVER' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-red-950/60 backdrop-blur-md"
              >
                <div className="geo-card p-10 flex flex-col items-center max-w-sm w-full bg-zinc-900 border-red-900/50">
                  <h2 className="pixel-text text-4xl mb-2 text-red-500">Neutralizado</h2>
                  <div className="text-zinc-400 mb-8 flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest mb-1">Tempo de Resistência</span>
                    <span className="text-3xl font-mono font-bold text-white tabular">{score.toFixed(2)}s</span>
                  </div>

                  {showNameInput ? (
                    <div className="w-full space-y-4 mb-2">
                      <input 
                        autoFocus
                        type="text" 
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value.toUpperCase().slice(0, 10))}
                        className="w-full p-4 rounded-xl border border-zinc-800 bg-zinc-950 focus:border-emerald-500 focus:outline-none pixel-text text-center text-white"
                        placeholder="SEU NOME"
                        onKeyDown={(e) => e.key === 'Enter' && saveRanking(playerName, score)}
                      />
                      <button 
                        onClick={() => saveRanking(playerName, score)}
                        className="w-full bg-emerald-600 py-4 rounded-xl pixel-text text-white font-bold"
                      >
                        Confirmar Recorde
                      </button>
                    </div>
                  ) : (
                    <div className="w-full space-y-4">
                      <button 
                        onClick={startGame}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all"
                      >
                        <RotateCcw size={20} />
                        <span className="pixel-text">Reiniciar</span>
                      </button>
                      <button 
                        onClick={() => setGameState('START')}
                        className="w-full text-zinc-500 hover:text-zinc-300 text-[10px] pixel-text py-2"
                      >
                        Voltar ao Menu
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instruction Sidebar */}
        <div className="hidden lg:block w-64 geo-card p-6 self-end mb-4">
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2 font-bold">Diretrizes</h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-medium">
            A operação inicia com <span className="text-white font-bold">1 oponente</span>.
            <br/><br/>
            A cada <span className="text-white font-bold">10 segundos</span>, um novo inimigo (Lula, Bolsonaro, China ou Irã) surge aleatoriamente no cerco.
            <br/><br/>
            Sobreviva a todo custo!
          </p>
        </div>
      </main>

      {/* Bottom Control Panel (Virtual Analog Stick) */}
      <footer className="h-64 md:h-72 bg-zinc-900/50 geo-border border-t flex justify-center items-center py-6 px-4 md:px-12 relative">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Navegação Tática (Touch Analog)</span>
          <div 
            className="w-32 h-32 md:w-40 md:h-40 bg-zinc-800 rounded-full border-4 border-zinc-700 shadow-inner flex items-center justify-center touch-none relative"
            onPointerMove={handleJoystick}
            onPointerUp={endJoystick}
            onPointerLeave={endJoystick}
          >
            <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-emerald-600/40 border-2 border-emerald-500 rounded-full flex items-center justify-center pointer-events-none"
              style={{
                transform: `translate(${dpadRef.current.x * 40}px, ${dpadRef.current.y * 40}px)`
              }}
            >
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute right-4 md:right-12 bottom-8 hidden sm:flex flex-col items-end">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-3 font-bold">Status da Operação</div>
          <div className="flex gap-4">
            <div className="px-3 py-1 bg-zinc-900 rounded geo-border text-[10px] font-mono text-emerald-500 tabular">FROG_INVADER_V2</div>
            <div className={`px-3 py-1 bg-zinc-900 rounded geo-border text-[10px] font-mono tabular ${isHighThreat ? 'text-red-500' : 'text-blue-500'}`}>DEFCON: 0{defcon}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
