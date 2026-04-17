import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X, ChevronRight, ChevronLeft, Phone, Mail, Check, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import func2url from "../../backend/func2url.json"

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
}

const STATUSES = [
  { id: "single", label: "Одинок(а)", emoji: "🌑" },
  { id: "couple_open", label: "Пара (открытые отношения)", emoji: "💞" },
  { id: "couple_closed", label: "Пара (закрытые отношения)", emoji: "💍" },
  { id: "married", label: "Женат / Замужем", emoji: "🫀" },
  { id: "complicated", label: "Всё сложно", emoji: "🌀" },
  { id: "divorced", label: "В разводе", emoji: "🍂" },
  { id: "widowed", label: "Вдов(а)", emoji: "🕊️" },
  { id: "exploring", label: "Просто изучаю", emoji: "👀" },
]

const GENDERS = ["Мужчина", "Женщина", "Небинарный", "Другое", "Не указывать"]
const EYE_COLORS = ["Карие", "Голубые", "Зелёные", "Серые", "Чёрные", "Разные"]

const EVERYDAY_INTERESTS = [
  "Кино и сериалы", "Музыка", "Путешествия", "Спорт", "Йога / медитация",
  "Кулинария", "Вино и гастрономия", "Книги", "Игры", "Искусство",
  "Танцы", "Активный отдых", "Фотография", "Мода", "Технологии",
  "Животные", "Клубная жизнь", "Домашний уют", "Фитнес", "Бизнес",
]

const INTIMATE_INTERESTS = [
  "Доминирование", "Подчинение", "БДСМ", "Связывание (бондаж)",
  "Ролевые игры", "Лёгкий флирт", "Эксгибиционизм", "Вуайеризм",
  "Фетиш", "Полиамория", "Свингерство", "Tantra и медленное", "Без ограничений",
]

const FEATURES = [
  {
    emoji: "🔒",
    title: "Полная анонимность",
    desc: "Твои фото скрыты до взаимного лайка. Никто не узнает о тебе без твоего согласия. Дополнительные настройки конфиденциальности — в профиле.",
  },
  {
    emoji: "🤖",
    title: "Умный ИИ-матчинг",
    desc: "Алгоритм анализирует твои интересы, поведение и предпочтения — и находит именно тех, кто совпадёт с тобой по-настоящему. Не угадывает — вычисляет.",
  },
  {
    emoji: "💬",
    title: "Приватные чаты",
    desc: "Сквозное шифрование, исчезающие сообщения и фото. Переписка удаляется автоматически — никаких следов.",
  },
  {
    emoji: "✅",
    title: "Верифицированные профили",
    desc: "Значок верификации подтверждает, что перед тобой реальный человек. Никаких ботов, фейков и пустых анкет.",
  },
  {
    emoji: "🔥",
    title: "Hot-режим",
    desc: "Специальный раздел для тех, кто хочет больше. Только верифицированные пользователи с совпадающими интересами.",
  },
  {
    emoji: "🌍",
    title: "Без границ",
    desc: "Ищи по геолокации или по всему миру — встречай интересных людей где угодно.",
  },
]

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [verifyMethod, setVerifyMethod] = useState<"phone" | "email">("email")
  const [verifyValue, setVerifyValue] = useState("")
  const [verifyCode, setVerifyCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const [status, setStatus] = useState("")
  const [profile, setProfile] = useState({
    name: "", age: "", gender: "", height: "", weight: "", eyeColor: "", city: "", aboutMe: "",
  })
  const [photos, setPhotos] = useState<string[]>([])
  const [everydaySelected, setEverydaySelected] = useState<string[]>([])
  const [intimateSelected, setIntimateSelected] = useState<string[]>([])

  const handleSendCode = async () => {
    if (!verifyValue.trim()) return
    setApiLoading(true)
    setApiError("")
    try {
      const res = await fetch(func2url["send-verify-code"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: verifyMethod, value: verifyValue.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (data.error) setApiError(data.error)
      else setCodeSent(true)
    } catch {
      setApiError("Ошибка сети, попробуй ещё раз")
    } finally {
      setApiLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!verifyCode.trim()) return
    setApiLoading(true)
    setApiError("")
    try {
      const res = await fetch(func2url["check-verify-code"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: verifyMethod, value: verifyValue.trim().toLowerCase(), code: verifyCode.trim() }),
      })
      const data = await res.json()
      if (data.error) {
        setApiError(data.error)
      } else {
        setUserId(data.user_id)
        localStorage.setItem("du_user_id", String(data.user_id))
        setStep(1)
      }
    } catch {
      setApiError("Ошибка сети, попробуй ещё раз")
    } finally {
      setApiLoading(false)
    }
  }

  const handleFinish = async () => {
    if (!userId) return
    setApiLoading(true)
    setApiError("")
    try {
      const res = await fetch(func2url["save-profile"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          relationship_status: status,
          name: profile.name,
          age: profile.age ? parseInt(profile.age) : null,
          gender: profile.gender,
          height: profile.height ? parseInt(profile.height) : null,
          weight: profile.weight ? parseInt(profile.weight) : null,
          eye_color: profile.eyeColor,
          city: profile.city,
          about_me: profile.aboutMe,
          photos,
          everyday_interests: everydaySelected,
          intimate_interests: intimateSelected,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setApiError(data.error)
      } else {
        onClose()
        navigate("/profile")
      }
    } catch {
      setApiError("Ошибка сети, попробуй ещё раз")
    } finally {
      setApiLoading(false)
    }
  }

  const toggleEveryday = (item: string) =>
    setEverydaySelected((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item])

  const toggleIntimate = (item: string) =>
    setIntimateSelected((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) setPhotos((prev) => [...prev, ev.target!.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (idx: number) => setPhotos((prev) => prev.filter((_, i) => i !== idx))

  if (!isOpen) return null

  const progress = step === 0 ? 0 : Math.round((step / 6) * 100)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #0d0d0d 100%)", border: "1px solid rgba(236,72,153,0.25)" }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <span className="text-lg font-bold font-heading" style={{ background: "linear-gradient(90deg,#f472b6,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Desire Universe
            </span>
            {step > 0 && <p className="text-xs text-gray-500 mt-0.5">Шаг {step} из 6</p>}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step > 0 && (
          <div className="mx-6 mb-4 h-1 rounded-full bg-gray-800">
            <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#ec4899,#a855f7)" }} />
          </div>
        )}

        <div className="px-6 pb-6 overflow-y-auto max-h-[70vh]">

          {apiError && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm">{apiError}</div>
          )}

          {/* STEP 0 */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">Добро пожаловать 🔥</h2>
                <p className="text-gray-400 mt-1 text-sm">Подтверди себя — это займёт 30 секунд</p>
              </div>
              <div className="flex gap-2">
                {(["email", "phone"] as const).map((m) => (
                  <button key={m} onClick={() => { setVerifyMethod(m); setCodeSent(false); setVerifyValue(""); setApiError("") }}
                    className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all",
                      verifyMethod === m ? "text-white border-pink-500 bg-pink-500/15" : "text-gray-400 border-gray-700 hover:border-gray-500")}>
                    {m === "email" ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                    {m === "email" ? "Email" : "Телефон"}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <Label className="text-gray-300 text-sm">{verifyMethod === "email" ? "Твой email" : "Номер телефона"}</Label>
                <div className="flex gap-2">
                  <Input value={verifyValue} onChange={(e) => setVerifyValue(e.target.value)}
                    placeholder={verifyMethod === "email" ? "you@example.com" : "+7 900 000 00 00"}
                    className="bg-gray-900 border-gray-700 text-white placeholder-gray-600 focus:border-pink-500"
                    type={verifyMethod === "email" ? "email" : "tel"} disabled={apiLoading} />
                  <Button onClick={handleSendCode} disabled={!verifyValue.trim() || apiLoading}
                    className="shrink-0 text-white border-none" style={{ background: "linear-gradient(90deg,#ec4899,#a855f7)" }}>
                    {apiLoading ? "..." : codeSent ? "Снова" : "Код"}
                  </Button>
                </div>
                {codeSent && (
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Код из {verifyMethod === "email" ? "письма" : "SMS"}</Label>
                    <Input value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="• • • • • •"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600 focus:border-pink-500 tracking-widest text-center text-lg"
                      maxLength={6} disabled={apiLoading} />
                  </div>
                )}
              </div>
              {codeSent && (
                <Button onClick={handleVerify} disabled={verifyCode.length < 4 || apiLoading}
                  className="w-full text-white border-none" style={{ background: "linear-gradient(90deg,#ec4899,#a855f7)" }}>
                  {apiLoading ? "Проверяем..." : <>Подтвердить и продолжить <ChevronRight className="ml-1 h-4 w-4" /></>}
                </Button>
              )}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">Твой статус</h2>
                <p className="text-gray-400 mt-1 text-sm">Расскажи другим, в каком ты положении прямо сейчас</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {STATUSES.map((s) => (
                  <button key={s.id} onClick={() => setStatus(s.id)}
                    className={cn("flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all text-sm",
                      status === s.id ? "border-pink-500 bg-pink-500/15 text-white" : "border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-500")}>
                    <span className="text-xl">{s.emoji}</span>
                    <span className="font-medium leading-tight">{s.label}</span>
                    {status === s.id && <Check className="ml-auto h-4 w-4 text-pink-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">О себе</h2>
                <p className="text-gray-400 mt-1 text-sm">Базовая информация для твоего профиля</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-gray-300 text-xs">Имя / Псевдоним</Label>
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-gray-900 border-gray-700 text-white focus:border-pink-500" placeholder="Как к тебе обращаться?" />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-300 text-xs flex items-center gap-1">
                    Возраст <span className="text-pink-400 font-bold">(18+)</span>
                  </Label>
                  <Input value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    type="number" min="18" max="99"
                    className="bg-gray-900 border-pink-500/40 text-white focus:border-pink-500" placeholder="Только 18+" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Пол</Label>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map((g) => (
                    <button key={g} onClick={() => setProfile({ ...profile, gender: g })}
                      className={cn("px-3 py-1.5 rounded-full text-xs border transition-all",
                        profile.gender === g ? "border-pink-500 bg-pink-500/15 text-white" : "border-gray-700 text-gray-400 hover:border-gray-500")}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-gray-300 text-xs">Рост (см)</Label>
                  <Input value={profile.height} onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    type="number" className="bg-gray-900 border-gray-700 text-white focus:border-pink-500" placeholder="170" />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-300 text-xs">Вес (кг)</Label>
                  <Input value={profile.weight} onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    type="number" className="bg-gray-900 border-gray-700 text-white focus:border-pink-500" placeholder="65" />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-300 text-xs">Глаза</Label>
                  <select value={profile.eyeColor} onChange={(e) => setProfile({ ...profile, eyeColor: e.target.value })}
                    className="w-full rounded-md border border-gray-700 bg-gray-900 text-white text-sm px-3 py-2 focus:outline-none focus:border-pink-500">
                    <option value="">...</option>
                    {EYE_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Город</Label>
                <Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white focus:border-pink-500" placeholder="Москва, Санкт-Петербург..." />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-300 text-xs">О себе (необязательно)</Label>
                <textarea value={profile.aboutMe} onChange={(e) => setProfile({ ...profile, aboutMe: e.target.value })}
                  className="w-full rounded-md border border-gray-700 bg-gray-900 text-white text-sm px-3 py-2 min-h-[70px] focus:outline-none focus:border-pink-500 resize-none placeholder-gray-600"
                  placeholder="Пару слов о себе — всё что захочешь..." />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">Фотографии</h2>
                <p className="text-gray-400 mt-1 text-sm">Добавь до 6 фото — первое станет главным</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {photos.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-700">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white hover:bg-red-500/80 transition-colors">
                      <Trash2 className="h-3 w-3" />
                    </button>
                    {idx === 0 && <span className="absolute bottom-1 left-1 text-xs bg-pink-500/80 text-white px-1.5 py-0.5 rounded-full">Главное</span>}
                  </div>
                ))}
                {photos.length < 6 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 transition-colors">
                    <Plus className="h-6 w-6 text-gray-600" />
                    <span className="text-xs text-gray-600 mt-1">Добавить</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Для получения значка <span className="text-pink-400">✓ Верифицирован</span>, который виден другим пользователям,
                потребуется дополнительная фотоверификация личности — инструкция придёт на почту после регистрации.
              </p>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">Твои интересы</h2>
                <p className="text-gray-400 mt-1 text-sm">Что ты любишь в обычной жизни? Выбери всё, что нравится</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {EVERYDAY_INTERESTS.map((item) => (
                  <button key={item} onClick={() => toggleEveryday(item)}
                    className={cn("px-3 py-1.5 rounded-full text-sm border transition-all",
                      everydaySelected.includes(item) ? "border-pink-500 bg-pink-500/20 text-white" : "border-gray-700 text-gray-400 hover:border-gray-500")}>
                    {everydaySelected.includes(item) && "✓ "}{item}
                  </button>
                ))}
              </div>
              {everydaySelected.length > 0 && <p className="text-xs text-gray-500">Выбрано: {everydaySelected.length}</p>}
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">Твои желания 🔥</h2>
                <p className="text-gray-400 mt-1 text-sm">Только для тебя и тех, с кем ты решишь поделиться. Без осуждения.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {INTIMATE_INTERESTS.map((item) => (
                  <button key={item} onClick={() => toggleIntimate(item)}
                    className={cn("px-3 py-1.5 rounded-full text-sm border transition-all",
                      intimateSelected.includes(item) ? "border-purple-500 bg-purple-500/20 text-white" : "border-gray-700 text-gray-400 hover:border-gray-500")}>
                    {intimateSelected.includes(item) && "✓ "}{item}
                  </button>
                ))}
              </div>
              {intimateSelected.length > 0 && <p className="text-xs text-gray-500">Выбрано: {intimateSelected.length}</p>}
              <p className="text-xs text-gray-600">Эти данные видны только совместимым пользователям и только если ты разрешишь это в настройках.</p>
            </div>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">Ты почти внутри ✨</h2>
                <p className="text-gray-400 mt-1 text-sm">Вот что тебя ждёт в Desire Universe</p>
              </div>
              <div className="space-y-3">
                {FEATURES.map((f) => (
                  <div key={f.title} className="flex gap-4 p-4 rounded-xl" style={{ background: "rgba(236,72,153,0.07)", border: "1px solid rgba(236,72,153,0.15)" }}>
                    <span className="text-2xl shrink-0">{f.emoji}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{f.title}</p>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleFinish} disabled={apiLoading}
                className="w-full text-white border-none text-base py-5"
                style={{ background: "linear-gradient(90deg,#ec4899,#a855f7)" }}>
                {apiLoading ? "Сохраняем..." : "Войти в Desire Universe 🔥"}
              </Button>
            </div>
          )}

        </div>

        {step > 0 && step < 6 && (
          <div className="flex justify-between items-center px-6 pb-6 pt-2">
            <button onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-gray-500 hover:text-white text-sm transition-colors">
              <ChevronLeft className="h-4 w-4" /> Назад
            </button>
            <Button onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !status}
              className="text-white border-none px-6"
              style={{ background: "linear-gradient(90deg,#ec4899,#a855f7)" }}>
              {step === 5 ? "Завершить" : "Далее"} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
