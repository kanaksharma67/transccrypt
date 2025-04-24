import React, { useEffect, useRef, useState } from 'react';

const SamuraiMask: React.FC = () => {
  // Refs
  const faceContainerRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  const securityLockRef = useRef<HTMLDivElement>(null);
  const sizeControlRef = useRef<HTMLInputElement>(null);
  const glowControlRef = useRef<HTMLInputElement>(null);
  const themeControlRef = useRef<HTMLSelectElement>(null);
  const touchAreaRef = useRef<HTMLDivElement>(null);

  // State
  const [faceSize, setFaceSize] = useState(100);
  const [mouseX, setMouseX] = useState(window.innerWidth / 2);
  const [mouseY, setMouseY] = useState(window.innerHeight / 2);
  const [faceAngle, setFaceAngle] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [currentExpression, setCurrentExpression] = useState('neutral');
  const [glowIntensity, setGlowIntensity] = useState(0.8);
  const [themeIndex, setThemeIndex] = useState(0);

  // Constants
  const themes = [
    { primary: '#ff2a2a', secondary: '#00ff88', name: 'Classic' },
    { primary: '#00a8ff', secondary: '#ff00aa', name: 'Cyber Blue' },
    { primary: '#aa00ff', secondary: '#00ffaa', name: 'Neon Purple' },
    { primary: '#ffaa00', secondary: '#00aaff', name: 'Solar Gold' },
  ];

  // Initialize component
  useEffect(() => {
    updateFaceSize();
    centerPupils();
    window.addEventListener('resize', handleResize);
    
    // Start animation loop
    let animationFrameId: number;
    const animate = (timestamp: number) => {
      updateAnimation(timestamp);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Update face size when faceSize changes
  useEffect(() => {
    updateFaceSize();
  }, [faceSize]);

  // Update glow effects when glowIntensity changes
  useEffect(() => {
    updateGlowEffects();
  }, [glowIntensity]);

  // Update theme when themeIndex changes
  useEffect(() => {
    updateTheme();
  }, [themeIndex]);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
      updateCursorFollower(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMouseX(e.touches[0].clientX);
        setMouseY(e.touches[0].clientY);
        updateCursorFollower(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Update face size based on slider
  const updateFaceSize = () => {
    if (!faceRef.current || !leftEyeRef.current || !rightEyeRef.current || 
        !leftPupilRef.current || !rightPupilRef.current) return;

    const baseSize = faceSize;
    faceRef.current.style.width = `${baseSize}px`;
    faceRef.current.style.height = `${baseSize * 1.3}px`;
    
    // Eye sizes
    const eyeSize = baseSize * 0.25;
    leftEyeRef.current.style.width = `${eyeSize}px`;
    leftEyeRef.current.style.height = `${eyeSize}px`;
    rightEyeRef.current.style.width = `${eyeSize}px`;
    rightEyeRef.current.style.height = `${eyeSize}px`;
    
    // Pupil sizes
    const pupilSize = eyeSize * 0.5;
    leftPupilRef.current.style.width = `${pupilSize}px`;
    leftPupilRef.current.style.height = `${pupilSize}px`;
    rightPupilRef.current.style.width = `${pupilSize}px`;
    rightPupilRef.current.style.height = `${pupilSize}px`;
  };

  // Center pupils initially
  const centerPupils = () => {
    if (!leftPupilRef.current || !rightPupilRef.current) return;
    leftPupilRef.current.style.transform = 'translate(-50%, -50%)';
    rightPupilRef.current.style.transform = 'translate(-50%, -50%)';
  };

  // Update glow effects
  const updateGlowEffects = () => {
    if (!faceRef.current || !leftEyeRef.current || !rightEyeRef.current || 
        !leftPupilRef.current || !rightPupilRef.current) return;

    faceRef.current.style.boxShadow = `
      inset 0 0 ${30 * glowIntensity}px rgba(255, 42, 42, 0.3),
      0 0 ${50 * glowIntensity}px rgba(255, 42, 42, 0.5),
      0 0 ${100 * glowIntensity}px rgba(0, 255, 136, 0.3)`;
    
    [leftEyeRef.current, rightEyeRef.current].forEach(eye => {
      eye.style.boxShadow = `
        inset 0 0 ${20 * glowIntensity}px rgba(255, 42, 42, 0.5),
        0 0 ${30 * glowIntensity}px rgba(255, 42, 42, 0.7)`;
    });
    
    [leftPupilRef.current, rightPupilRef.current].forEach(pupil => {
      pupil.style.boxShadow = `
        0 0 ${20 * glowIntensity}px ${themes[themeIndex].secondary},
        inset 0 0 ${10 * glowIntensity}px rgba(0, 255, 136, 0.5)`;
    });
  };

  // Update theme
  const updateTheme = () => {
    if (!securityLockRef.current || !faceRef.current) return;
    
    const theme = themes[themeIndex];
    faceRef.current.style.setProperty('--primary-color', theme.primary);
    faceRef.current.style.setProperty('--secondary-color', theme.secondary);
    
    if (!isLocked) {
      securityLockRef.current.style.color = theme.primary;
    }
  };

  // Update cursor follower position
  const updateCursorFollower = (x: number, y: number) => {
    if (!cursorFollowerRef.current) return;
    cursorFollowerRef.current.style.left = `${x}px`;
    cursorFollowerRef.current.style.top = `${y}px`;
  };

  // Animation loop
  const updateAnimation = (timestamp: number) => {
    if (!faceRef.current || !leftEyeRef.current || !rightEyeRef.current || 
        !leftPupilRef.current || !rightPupilRef.current || !mouthRef.current) return;

    const faceRect = faceRef.current.getBoundingClientRect();
    const faceCenterX = faceRect.left + faceRect.width / 2;
    const faceCenterY = faceRect.top + faceRect.height / 2;
    
    // Calculate distance and angle from face center to mouse
    const dx = mouseX - faceCenterX;
    const dy = mouseY - faceCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Face rotation based on horizontal mouse position
    const newFaceAngle = dx * 0.03;
    setFaceAngle(newFaceAngle);
    faceRef.current.style.transform = `rotate(${newFaceAngle}deg)`;
    
    // Eye tracking
    updateEyeTracking(leftEyeRef.current, leftPupilRef.current);
    updateEyeTracking(rightEyeRef.current, rightPupilRef.current);
    
    // Mouth animation based on security state and expression
    if (currentExpression === 'neutral') {
      if (isLocked) {
        const mouthOpen = Math.min(distance / 100, 0.3);
        mouthRef.current.style.height = `${15 + mouthOpen * 5}%`;
        mouthRef.current.style.borderRadius = `0 0 ${50 - mouthOpen * 10}% ${50 - mouthOpen * 10}% / 0 0 ${100 - mouthOpen * 20}% ${100 - mouthOpen * 20}%`;
      } else {
        const mouthOpen = Math.min(distance / 100, 0.5);
        mouthRef.current.style.height = `${15 + mouthOpen * 10}%`;
        mouthRef.current.style.borderRadius = `0 0 ${50 - mouthOpen * 20}% ${50 - mouthOpen * 20}% / 0 0 ${100 - mouthOpen * 40}% ${100 - mouthOpen * 40}%`;
      }
    }
  };

  // Update eye tracking for a single eye
  const updateEyeTracking = (eye: HTMLDivElement, pupil: HTMLDivElement) => {
    const eyeRect = eye.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;
    
    // Calculate angle and distance to mouse
    const dx = mouseX - eyeCenterX;
    const dy = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), eyeRect.width * 0.3);
    const angle = Math.atan2(dy, dx);
    
    // Update pupil position
    pupil.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance / 2}px), calc(-50% + ${Math.sin(angle) * distance / 2}px)`;
  };

  // Toggle security lock
  const toggleSecurityLock = () => {
    if (!securityLockRef.current) return;
    
    const newLockedState = !isLocked;
    setIsLocked(newLockedState);
    
    if (newLockedState) {
      securityLockRef.current.textContent = "LOCKED";
      securityLockRef.current.style.color = themes[themeIndex].secondary;
      securityLockRef.current.style.animation = "lockEngage 0.5s ease";
    } else {
      securityLockRef.current.textContent = "SECURE";
      securityLockRef.current.style.color = themes[themeIndex].primary;
      securityLockRef.current.style.animation = "";
    }
  };

  // Set facial expression
  const setExpression = (expression: string) => {
    setCurrentExpression(expression);
  };

  // Handle resize
  const handleResize = () => {
    updateFaceSize();
    centerPupils();
  };

  // Handle size control change
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFaceSize(parseInt(e.target.value));
  };

  // Handle glow control change
  const handleGlowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlowIntensity(parseInt(e.target.value) / 100);
  };

  // Handle theme change
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setThemeIndex(parseInt(e.target.value));
  };

  // Handle previous theme
  const handlePrevTheme = () => {
    setThemeIndex((prev) => Math.max(0, prev - 1));
    if (themeControlRef.current) {
      themeControlRef.current.selectedIndex = Math.max(0, themeControlRef.current.selectedIndex - 1);
    }
  };

  // Handle next theme
  const handleNextTheme = () => {
    setThemeIndex((prev) => Math.min(themes.length - 1, prev + 1));
    if (themeControlRef.current) {
      themeControlRef.current.selectedIndex = Math.min(themes.length - 1, themeControlRef.current.selectedIndex + 1);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden font-mono text-green-400">
      {/* Controls */}
      <div className="fixed top-5 w-full flex justify-center gap-5 z-50 flex-wrap">
        <div className="flex flex-col items-center bg-gray-900/80 p-2 rounded border border-red-500 shadow-lg shadow-red-500/50 min-w-[150px]">
          <label className="mb-1 text-xs uppercase tracking-wider">Mask Size</label>
          <input 
            type="range" 
            ref={sizeControlRef}
            min="50" 
            max="200" 
            value={faceSize} 
            onChange={handleSizeChange}
            className="w-[150px] h-1 bg-gray-800 rounded border border-red-500 outline-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:shadow-green-400"
            aria-label="Adjust mask size"
          />
        </div>
        
        <div className="flex flex-col items-center bg-gray-900/80 p-2 rounded border border-red-500 shadow-lg shadow-red-500/50 min-w-[150px]">
          <label className="mb-1 text-xs uppercase tracking-wider">Glow Intensity</label>
          <input 
            type="range" 
            ref={glowControlRef}
            min="0" 
            max="100" 
            value={glowIntensity * 100} 
            onChange={handleGlowChange}
            className="w-[150px] h-1 bg-gray-800 rounded border border-red-500 outline-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:shadow-green-400"
            aria-label="Adjust glow intensity"
          />
        </div>
        
        <div className="flex flex-col items-center bg-gray-900/80 p-2 rounded border border-red-500 shadow-lg shadow-red-500/50 min-w-[150px]">
          <label className="mb-1 text-xs uppercase tracking-wider">Color Theme</label>
          <select 
            ref={themeControlRef}
            onChange={handleThemeChange}
            value={themeIndex}
            className="w-full bg-gray-800 text-green-400 border border-red-500 rounded px-2 py-1 text-sm outline-none"
            aria-label="Select color theme"
          >
            {themes.map((theme, index) => (
              <option key={index} value={index}>{theme.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col items-center bg-gray-900/80 p-2 rounded border border-red-500 shadow-lg shadow-red-500/50 min-w-[150px]">
          <label className="mb-1 text-xs uppercase tracking-wider">Expressions</label>
          <div className="flex gap-2">
            <button 
              onClick={() => setExpression('angry')}
              className="px-2 py-1 bg-gray-800/50 hover:bg-gray-700 rounded border border-red-500"
              aria-label="Angry expression"
            >
              😠
            </button>
            <button 
              onClick={() => setExpression('happy')}
              className="px-2 py-1 bg-gray-800/50 hover:bg-gray-700 rounded border border-red-500"
              aria-label="Happy expression"
            >
              😊
            </button>
            <button 
              onClick={() => setExpression('surprised')}
              className="px-2 py-1 bg-gray-800/50 hover:bg-gray-700 rounded border border-red-500"
              aria-label="Surprised expression"
            >
              😲
            </button>
            <button 
              onClick={() => setExpression('neutral')}
              className="px-2 py-1 bg-gray-800/50 hover:bg-gray-700 rounded border border-red-500"
              aria-label="Neutral expression"
            >
              😐
            </button>
          </div>
        </div>
      </div>

      {/* Face Container */}
      <div 
        ref={faceContainerRef}
        className="absolute flex justify-center items-center"
        style={{
          transformOrigin: 'center',
          transition: 'transform 0.3s ease',
        }}
      >
        <div
          ref={faceRef}
          className={`relative bg-gray-800 rounded-[50%_50%_45%_45%_/_60%_60%_40%_40%] border-2 border-gray-700 overflow-hidden transition-all
            ${currentExpression === 'angry' ? 'expression-angry' : ''}
            ${currentExpression === 'happy' ? 'expression-happy' : ''}
            ${currentExpression === 'surprised' ? 'expression-surprised' : ''}
          `}
          style={{
            '--primary-color': themes[themeIndex].primary,
            '--secondary-color': themes[themeIndex].secondary,
            '--bg-color': '#0a0a0a',
            '--face-color': '#1a1a1a',
            '--metal-color': '#333333',
          } as React.CSSProperties}
          tabIndex={0}
          role="button"
          aria-label="Samurai mask security toggle"
          onClick={toggleSecurityLock}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleSecurityLock();
            }
          }}
        >
          {/* Mask plates */}
          <div className="absolute bg-gray-700 border border-red-500 shadow-[inset_0_0_10px_rgba(0,0,0,0.5),_0_0_10px_var(--primary-color)] w-[80%] h-[20%] top-[-5%] left-[10%] rounded-[50%_50%_0_0_/_100%_100%_0_0] border-b-0"></div>
          <div className="absolute bg-gray-700 border border-red-500 shadow-[inset_0_0_10px_rgba(0,0,0,0.5),_0_0_10px_var(--primary-color)] w-[25%] h-[30%] bottom-[25%] left-[5%] rounded-[0_50%_50%_0_/_0_50%_50%_0]"></div>
          <div className="absolute bg-gray-700 border border-red-500 shadow-[inset_0_0_10px_rgba(0,0,0,0.5),_0_0_10px_var(--primary-color)] w-[25%] h-[30%] bottom-[25%] right-[5%] rounded-[50%_0_0_50%_/_50%_0_0_50%]"></div>
          <div className="absolute bg-gray-700 border border-red-500 shadow-[inset_0_0_10px_rgba(0,0,0,0.5),_0_0_10px_var(--primary-color)] w-[60%] h-[15%] bottom-[-5%] left-[20%] rounded-[0_0_50%_50%_/_0_0_100%_100%] border-t-0"></div>
          
          {/* Security lock */}
          <div 
            ref={securityLockRef}
            className="absolute w-[30%] h-[15%] top-[10%] left-[35%] bg-gray-700 border-2 border-red-500 rounded flex justify-center items-center font-bold uppercase tracking-wider text-xs text-red-500 shadow-lg shadow-red-500/50 transition-all"
          >
            SECURE
          </div>
          
          {/* Circuit lines */}
          <svg className="absolute top-0 left-0 w-full h-full stroke-green-400/20 stroke-1 fill-none pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M20,20 L80,20 L80,80 L20,80 Z" />
            <path d="M30,30 L70,30 L70,70 L30,70 Z" />
            <path d="M40,40 L60,40 L60,60 L40,60 Z" />
            <circle cx="50" cy="50" r="10" />
            <line x1="50" y1="20" x2="50" y2="80" />
            <line x1="20" y1="50" x2="80" y2="50" />
          </svg>
          
          {/* HUD elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute w-full h-px bg-green-400/10 top-[30%] left-0"></div>
            <div className="absolute w-full h-px bg-green-400/10 top-[70%] left-0"></div>
            <div className="absolute w-px h-full bg-green-400/10 top-0 left-[30%]"></div>
            <div className="absolute w-px h-full bg-green-400/10 top-0 left-[70%]"></div>
            <div className="absolute text-xs text-green-400 top-[10%] left-[10%] [text-shadow:0_0_5px_var(--secondary-color)]">BUSHIDO-OS v5.2.1</div>
            <div className="absolute text-xs text-green-400 top-[10%] right-[10%] text-right [text-shadow:0_0_5px_var(--secondary-color)]">STATUS: SECURE</div>
            <div className="absolute text-xs text-green-400 bottom-[10%] left-[10%] [text-shadow:0_0_5px_var(--secondary-color)]">DEFENSE MODE: ACTIVE</div>
            <div className="absolute text-xs text-green-400 bottom-[10%] right-[10%] text-right [text-shadow:0_0_5px_var(--secondary-color)]">THREAT LEVEL: 0%</div>
          </div>

          {/* Eyes */}
          <div className="absolute w-full h-[30%] flex justify-around top-[30%]">
            <div 
              ref={leftEyeRef}
              className="relative bg-black rounded-full overflow-hidden border-2 border-gray-700"
            >
              <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,#300000_0%,#000_70%)] rounded-full"></div>
              <div 
                ref={leftPupilRef}
                className="absolute rounded-full [box-shadow:0_0_20px_var(--secondary-color),inset_0_0_10px_rgba(0,255,136,0.5)]"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${themes[themeIndex].secondary} 0%, #000 70%)`,
                }}
              ></div>
              <div className="absolute w-full h-full [background:linear-gradient(rgba(0,255,136,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.1)_1px,transparent_1px)] [background-size:10px_10px] rounded-full"></div>
            </div>
            <div 
              ref={rightEyeRef}
              className="relative bg-black rounded-full overflow-hidden border-2 border-gray-700"
            >
              <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,#300000_0%,#000_70%)] rounded-full"></div>
              <div 
                ref={rightPupilRef}
                className="absolute rounded-full [box-shadow:0_0_20px_var(--secondary-color),inset_0_0_10px_rgba(0,255,136,0.5)]"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${themes[themeIndex].secondary} 0%, #000 70%)`,
                }}
              ></div>
              <div className="absolute w-full h-full [background:linear-gradient(rgba(0,255,136,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.1)_1px,transparent_1px)] [background-size:10px_10px] rounded-full"></div>
            </div>
          </div>

          {/* Mouth */}
          <div className="absolute w-[50%] h-[15%] bottom-[20%] left-1/2 transform -translate-x-1/2">
            <div 
              ref={mouthRef}
              className="w-full h-[15%] bg-black rounded-[0_0_50%_50%_/_0_0_100%_100%] border-2 border-gray-700 border-t-0 relative overflow-hidden transition-[height,border-radius] duration-200"
            >
              <div className="before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[30%] before:bg-red-500 before:opacity-30"></div>
              <div className="absolute top-0 left-0 w-full h-full flex justify-around">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-[8%] h-[40%] bg-white rounded-b-sm [box-shadow:0_0_5px_var(--secondary-color)]"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile touch controls */}
      <div 
        ref={touchAreaRef}
        className="fixed bottom-0 left-0 w-full h-[100px] bg-black/20 hidden justify-around items-center z-[1000] md:hidden"
      >
        <button 
          onClick={toggleSecurityLock}
          className="w-[60px] h-[60px] rounded-full bg-white/10 flex justify-center items-center text-2xl border-2 border-green-400 select-none touch-manipulation"
          aria-label="Toggle security lock"
        >
          🔒
        </button>
        <button 
          onClick={handlePrevTheme}
          className="w-[60px] h-[60px] rounded-full bg-white/10 flex justify-center items-center text-2xl border-2 border-green-400 select-none touch-manipulation"
          aria-label="Previous theme"
        >
          ◀
        </button>
        <button 
          onClick={handleNextTheme}
          className="w-[60px] h-[60px] rounded-full bg-white/10 flex justify-center items-center text-2xl border-2 border-green-400 select-none touch-manipulation"
          aria-label="Next theme"
        >
          ▶
        </button>
      </div>
      
      {/* Cursor follower */}
      <div 
        ref={cursorFollowerRef}
        className="fixed w-5 h-5 rounded-full pointer-events-none mix-blend-screen z-[100] transition-transform duration-100"
        style={{
          background: `radial-gradient(circle at center, ${themes[themeIndex].secondary} 0%, transparent 70%)`,
        }}
      ></div>
      
      {/* Status text */}
      <div className="fixed bottom-5 w-full text-center text-xs text-green-400 [text-shadow:0_0_5px_var(--secondary-color)]">
        SECURE ACCESS MODE: ENGAGED | BIOMETRIC SCANNING: ACTIVE
      </div>
    </div>
  );
};

export default SamuraiMask;