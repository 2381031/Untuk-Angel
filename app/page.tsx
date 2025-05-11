"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, ArrowRight, Gift, Stars, Music, VolumeX, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

export default function Home() {
  const [step, setStep] = useState(0)
  const [showFinalMessage, setShowFinalMessage] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [musicStarted, setMusicStarted] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })
  const [moveCount, setMoveCount] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const totalSteps = 5

  const messages = [
    "Hai Angel pacarku...",
    "ada sesuatu untukmu nih..",
    "Eh, Sebentar lagi ya sayang...",
    "Masih satu kali klik lagi..",
    "Sedikit lagi..."
  ]

  const romanticMessages = [
    "Untukmu Sayangku ❤️",
    "Aku bingung mau bilang apa ke kamu..",
    "Karna kamu adalah bintang terindah di langit hidupku",
    "Aku beruntung ketemu kamu..",
    "karna kamu... hidupku berwarna dan mempunyai arti",
    "Kamu adalah alasan aku tersenyum setiap pagi",
    "Bersamamu, aku menemukan arti kebahagiaan yang sesungguhnya",
    "Cintaku padamu lebih dalam dari samudera",
    "Kamu adalah mimpi terindah yang menjadi nyata dalam hidupku",
    "Makasih ya sayangku telah hadir dihidupku",
    "Salam dari Andre pacar kamu❤️❤️",
    "Mulai Lagi"
  ]

  // Tambahkan array untuk foto-foto
  const photos = [
    "/photos/photo1.jpg",
    "/photos/photo2.jpg",
    "/photos/photo3.jpg"
  ]

  useEffect(() => {
    // Create audio element
    try {
      audioRef.current = new Audio("/aku-milikmu.mp3")
      audioRef.current.loop = true
      audioRef.current.volume = 0.5
      audioRef.current.preload = "auto"

      // Add event listener for user interaction
      const handleUserInteraction = () => {
        if (audioRef.current && !musicStarted) {
          audioRef.current.play().catch(error => {
            console.log("Playback prevented:", error)
          })
          setMusicStarted(true)
        }
      }

      // Add event listeners for user interaction
      document.addEventListener('click', handleUserInteraction)
      document.addEventListener('touchstart', handleUserInteraction)
      document.addEventListener('keydown', handleUserInteraction)

      // Clean up on unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('touchstart', handleUserInteraction)
        document.removeEventListener('keydown', handleUserInteraction)
      }
    } catch (error) {
      console.error("Error initializing audio:", error)
    }
  }, [musicStarted])

  useEffect(() => {
    if (showFinalMessage) {
      // Trigger confetti when final message is shown
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f43f5e", "#ec4899", "#be185d", "#e11d48", "#be123c"],
      })

      // Show floating hearts
      setShowHearts(true)

      // Play music when final message is shown
      if (audioRef.current) {
        audioRef.current.currentTime = 0 // Reset to start of song
        const playPromise = audioRef.current.play()
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Autoplay started successfully
            setMusicStarted(true)
          }).catch(error => {
            // Auto-play was prevented
            console.log("Autoplay prevented:", error)
            // Show a "Play" button so that user can start playback manually
            setMusicStarted(false)
          })
        }
      }
    }
  }, [showFinalMessage])

  useEffect(() => {
    if (step === totalSteps - 1) {
      // Set posisi awal ke tengah
      setButtonPosition({ x: 75, y: 0 })
      setMoveCount(0) // Reset moveCount
    }
  }, [step])

  const moveButton = () => {
    if (step === totalSteps - 1 && moveCount < 4) {
      // Posisi yang sudah ditentukan untuk setiap langkah
      const positions = [
        { x: 200, y: 0 },   // Ujung kanan atas
        { x: 0, y: 0 },     // Ujung kiri atas
        { x: 200, y: 60 },  // Ujung kanan bawah
        { x: 75, y: 0 }     // Kembali ke posisi awal (tengah)
      ]
      
      setButtonPosition(positions[moveCount])
      setMoveCount(prev => prev + 1)
    }
  }

  const handleClick = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else if (moveCount >= 4) {
      setShowFinalMessage(true)
    }
  }

  useEffect(() => {
    if (step === totalSteps - 1) {
      moveButton()
    }
  }, [step])

  const resetJourney = () => {
    setStep(0)
    setShowFinalMessage(false)
    setShowHearts(false)
    setMoveCount(0)
    setButtonPosition({ x: 75, y: 0 })
  }

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (musicStarted) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((e) => {
        console.log("Audio play prevented by browser:", e)
      })
    }

    setMusicStarted(!musicStarted)
  }

  // Generate random hearts for the final message
  const generateHearts = () => {
    const hearts = []
    for (let i = 0; i < 30; i++) {
      const size = Math.random() * 20 + 10
      const left = Math.random() * 100
      const top = Math.random() * 100
      const delay = Math.random() * 5
      const duration = Math.random() * 10 + 10

      hearts.push(
        <div
          key={i}
          className="absolute text-rose-300 opacity-30 animate-float"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            fontSize: `${size}px`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        >
          ❤️
        </div>,
      )
    }
    return hearts
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-rose-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-200 opacity-30">
          <Heart size={40} />
        </div>
        <div className="absolute bottom-10 right-10 text-pink-200 opacity-30">
          <Heart size={40} />
        </div>
        <div className="absolute top-1/4 right-1/4 text-pink-200 opacity-30">
          <Stars size={40} />
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-pink-200 opacity-30">
          <Music size={40} />
        </div>
      </div>

      {/* Music control button */}
      <Button
        onClick={toggleMusic}
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 bg-white/80 backdrop-blur-sm border border-rose-200 shadow-md hover:bg-rose-100"
        aria-label={musicStarted ? "Matikan musik" : "Putar musik"}
      >
        {musicStarted ? <VolumeX className="h-5 w-5 text-rose-500" /> : <Music className="h-5 w-5 text-rose-500" />}
      </Button>

      {/* Floating hearts when final message is shown */}
      {showHearts && generateHearts()}

      <AnimatePresence mode="wait">
        {!showFinalMessage ? (
          <motion.div
            key="journey"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-rose-200 max-w-md w-full text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
                {step === 0 ? (
                  <Heart className="text-rose-500" size={32} />
                ) : step === 1 ? (
                  <Gift className="text-rose-500" size={32} />
                ) : step === 2 ? (
                  <Stars className="text-rose-500" size={32} />
                ) : step === 3 ? (
                  <Music className="text-rose-500" size={32} />
                ) : (
                  <Heart className="text-rose-500" size={32} fill="#f43f5e" />
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-rose-600 mb-4">{messages[step]}</h2>

            <div className="flex items-center justify-center mb-6">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={cn("w-3 h-3 rounded-full mx-1", index <= step ? "bg-rose-500" : "bg-rose-200")}
                />
              ))}
            </div>

            <p className="mt-4 text-rose-500 text-sm italic mb-6">
              {step === 0
                ? "Klik selanjutnya sayang"
                : step === 1
                  ? "Masih penasaran?"
                  : step === 2
                    ? "Sabar ya sayang..."
                    : step === 3
                      ? "Hampir sampai..."
                      : "Sedikit lagi..."}
            </p>

            <div className="relative h-12">
              <Button
                onClick={handleClick}
                onMouseEnter={moveButton}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full text-lg shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
                style={{
                  position: step === totalSteps - 1 ? 'absolute' : 'relative',
                  left: step === totalSteps - 1 ? `${buttonPosition.x}px` : '50%',
                  top: step === totalSteps - 1 ? `${buttonPosition.y}px` : '50%',
                  transform: step === totalSteps - 1 ? 'none' : 'translate(-50%, -50%)',
                  transition: 'all 0.3s ease',
                  zIndex: 10,
                  cursor: step === totalSteps - 1 && moveCount < 4 ? 'not-allowed' : 'pointer'
                }}
              >
                Klik Sini
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-rose-200 max-w-md w-full text-center relative"
          >
            <div className="absolute -top-5 -left-5 bg-rose-500 rounded-full p-3 shadow-lg">
              <Heart className="text-white" size={24} fill="white" />
            </div>

            <div className="absolute -top-5 -right-5 bg-rose-500 rounded-full p-3 shadow-lg">
              <Heart className="text-white" size={24} fill="white" />
            </div>

            <div className="space-y-6">
              {romanticMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
                  className="space-y-4"
                >
                  <p className={cn(
                    "text-lg",
                    index === 0 ? "text-rose-600 font-bold text-3xl" : 
                    index === romanticMessages.length - 1 ? "mt-8" : 
                    "text-rose-500"
                  )}>
                    {index === romanticMessages.length - 1 ? (
                      <Button
                        onClick={resetJourney}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full text-lg shadow-lg transition-all hover:shadow-xl"
                      >
                        {message}
                      </Button>
                    ) : index === 0 ? (
                      message
                    ) : (
                      message.split('sayangku').map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && <span className="text-rose-500">sayangku</span>}
                        </span>
                      ))
                    )}
                  </p>
                  
                  {/* Tambahkan foto setelah pesan tertentu */}
                  {index === 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg"
                    >
                      <img
                        src={photos[0]}
                        alt="Foto romantis"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                  {index === 5 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg"
                    >
                      <img
                        src={photos[1]}
                        alt="Foto romantis"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                  {index === 8 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg"
                    >
                      <img
                        src={photos[2]}
                        alt="Foto romantis"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
