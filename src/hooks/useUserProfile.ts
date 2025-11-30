"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserProfile } from "@/types"
import { storage, STORAGE_KEYS } from "@/lib/storage"

export function useUserProfile() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "Usuário",
    email: "",
    height: 170,
    weight: 70,
    age: 25,
    activityLevel: "moderate",
    goal: "maintain",
    createdAt: "",
    updatedAt: "",
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Carregar perfil do localStorage
    const storedProfile = storage.get<UserProfile>(STORAGE_KEYS.USER_PROFILE)

    if (storedProfile) {
      setProfile(storedProfile)
      setIsLoaded(true)
    } else {
      // Se não tem perfil, redirecionar para login
      const authToken = storage.get(STORAGE_KEYS.AUTH_TOKEN)
      if (!authToken) {
        router.push("/login")
      }
    }
  }, [router])

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    setProfile(updatedProfile)
    storage.setImmediate(STORAGE_KEYS.USER_PROFILE, updatedProfile)
  }

  return {
    profile,
    updateProfile,
    isLoaded,
  }
}
