import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { StarField } from "@/components/StarField"
import func2url from "../../backend/func2url.json"

interface UserProfile {
  id: number
  verify_method: string
  verify_value: string
  is_verified: boolean
  relationship_status: string | null
  name: string | null
  age: number | null
  gender: string | null
  height: number | null
  weight: number | null
  eye_color: string | null
  city: string | null
  about_me: string | null
  photos: string[]
  everyday_interests: string[]
  intimate_interests: string[]
}

const STATUS_LABELS: Record<string, string> = {
  single: "Одинок(а)",
  couple_open: "Пара (открытые отношения)",
  couple_closed: "Пара (закрытые отношения)",
  married: "Женат / Замужем",
  complicated: "Всё сложно",
  divorced: "В разводе",
  widowed: "Вдов(а)",
  exploring: "Просто изучаю",
}

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const userId = localStorage.getItem("du_user_id")
    if (!userId) {
      navigate("/")
      return
    }

    fetch(`${func2url["get-profile"]}?user_id=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setProfile(data)
        }
      })
      .catch(() => setError("Ошибка загрузки профиля"))
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🔥</div>
          <p className="text-gray-400">Загружаем твой профиль...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Профиль не найден"}</p>
          <Button onClick={() => navigate("/")} style={{ background: "linear-gradient(90deg,#ec4899,#a855f7)" }} className="text-white border-none">
            На главную
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero bg */}
      <div className="relative h-48 overflow-hidden">
        <StarField blurAmount={0} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.25) 0%, rgba(168,85,247,0.15) 50%, transparent 100%)" }} />
        <div className="absolute top-4 left-4">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="sm"
            className="bg-transparent text-white border-white/40 hover:bg-white hover:text-black text-xs"
          >
            ← На главную
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-20 pb-16 relative z-10">
        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-32 h-32 rounded-full border-4 overflow-hidden flex items-center justify-center text-5xl mb-4"
            style={{
              borderColor: "rgba(236,72,153,0.6)",
              background: profile.photos.length > 0 ? "transparent" : "linear-gradient(135deg,#ec4899,#a855f7)",
              boxShadow: "0 0 40px rgba(236,72,153,0.4)",
            }}
          >
            {profile.photos.length > 0 ? (
              <img src={profile.photos[0]} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              "🔥"
            )}
          </div>
          <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
            {profile.name || "Аноним"}
            {profile.is_verified && (
              <span className="text-sm px-2 py-0.5 rounded-full text-white font-normal" style={{ background: "linear-gradient(90deg,#ec4899,#a855f7)" }}>
                ✓ Верифицирован
              </span>
            )}
          </h1>
          {profile.city && <p className="text-gray-400 mt-1">📍 {profile.city}</p>}
          {profile.relationship_status && (
            <p className="text-gray-500 text-sm mt-1">{STATUS_LABELS[profile.relationship_status] || profile.relationship_status}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {profile.age && (
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)" }}>
              <p className="text-xl font-bold">{profile.age}</p>
              <p className="text-xs text-gray-400">лет</p>
            </div>
          )}
          {profile.height && (
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
              <p className="text-xl font-bold">{profile.height}</p>
              <p className="text-xs text-gray-400">см</p>
            </div>
          )}
          {profile.weight && (
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)" }}>
              <p className="text-xl font-bold">{profile.weight}</p>
              <p className="text-xs text-gray-400">кг</p>
            </div>
          )}
        </div>

        {/* Additional info */}
        {(profile.gender || profile.eye_color) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {profile.gender && (
              <span className="px-3 py-1 rounded-full text-sm text-gray-300" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {profile.gender}
              </span>
            )}
            {profile.eye_color && (
              <span className="px-3 py-1 rounded-full text-sm text-gray-300" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                👁 {profile.eye_color}
              </span>
            )}
          </div>
        )}

        {/* About */}
        {profile.about_me && (
          <div className="mb-6 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">О себе</h3>
            <p className="text-gray-200 text-sm leading-relaxed">{profile.about_me}</p>
          </div>
        )}

        {/* Photos */}
        {profile.photos.length > 1 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Фотографии</h3>
            <div className="grid grid-cols-3 gap-2">
              {profile.photos.slice(1).map((src, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-800">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Everyday interests */}
        {profile.everyday_interests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Интересы</h3>
            <div className="flex flex-wrap gap-2">
              {profile.everyday_interests.map((item) => (
                <span key={item} className="px-3 py-1.5 rounded-full text-sm" style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)", color: "#f9a8d4" }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Intimate interests — only visible to user themselves */}
        {profile.intimate_interests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Желания</h3>
            <p className="text-xs text-gray-600 mb-3">Видны только совместимым пользователям</p>
            <div className="flex flex-wrap gap-2">
              {profile.intimate_interests.map((item) => (
                <span key={item} className="px-3 py-1.5 rounded-full text-sm" style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#d8b4fe" }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={() => { localStorage.removeItem("du_user_id"); navigate("/") }}
          variant="outline"
          className="w-full bg-transparent text-gray-500 border-gray-800 hover:border-red-500/50 hover:text-red-400 transition-colors"
        >
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  )
}
