"use client"

import { useState, useEffect, useRef } from "react"
import { Music, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
  autoPlay?: boolean
  showControls?: boolean
}

export function AudioPlayer({ autoPlay = false, showControls = true }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/dewa19.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.5

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      // We need to wait for user interaction before playing audio
      // This is just to set up the state correctly
      setIsPlaying(true)
    }
  }, [autoPlay])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      // Play might fail if there's no user interaction yet
      audioRef.current.play().catch((e) => {
        console.log("Audio play prevented by browser:", e)
      })
    }

    setIsPlaying(!isPlaying)
  }

  if (!showControls) return null

  return (
    <Button
      onClick={togglePlay}
      variant="outline"
      size="icon"
      className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 bg-white/80 backdrop-blur-sm border border-rose-200 shadow-md hover:bg-rose-100"
      aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
    >
      {isPlaying ? <VolumeX className="h-5 w-5 text-rose-500" /> : <Music className="h-5 w-5 text-rose-500" />}
    </Button>
  )
}
