import { StarField } from "@/components/StarField"
import { ChevronDown, Heart, Flame, Sparkles, Shield, BotIcon as Robot } from "lucide-react"
import { ChatbotModal } from "@/components/ChatbotModal"
import { RegisterModal } from "@/components/RegisterModal"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Index() {
  const [isHeadingVisible, setIsHeadingVisible] = useState(false)
  const [isAboutVisible, setIsAboutVisible] = useState(false)
  const [isServicesVisible, setIsServicesVisible] = useState(false)
  const [isServicesTitleVisible, setIsServicesTitleVisible] = useState(false)
  const [blurAmount, setBlurAmount] = useState(0)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [initialHeight, setInitialHeight] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const aboutSectionRef = useRef<HTMLElement>(null)
  const aboutContentRef = useRef<HTMLDivElement>(null)
  const servicesSectionRef = useRef<HTMLElement>(null)
  const servicesContentRef = useRef<HTMLDivElement>(null)
  const servicesTitleRef = useRef<HTMLHeadingElement>(null)
  const contactSectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef(0)
  const lastScrollRef = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    if (initialHeight === 0) {
      setInitialHeight(window.innerHeight)
    }
  }, [initialHeight])

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const maxBlur = 8
          const triggerHeight = initialHeight * 1.2
          const newBlurAmount = Math.min(maxBlur, (scrollRef.current / triggerHeight) * maxBlur)

          setBlurAmount(newBlurAmount)

          lastScrollRef.current = scrollRef.current
          ticking.current = false
        })

        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [initialHeight])

  useEffect(() => {
    const headingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeadingVisible(true)
          if (headingRef.current) headingObserver.unobserve(headingRef.current)
        }
      },
      { threshold: 0.1 },
    )

    if (headingRef.current) headingObserver.observe(headingRef.current)

    const aboutObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAboutVisible(true)
          if (aboutContentRef.current) aboutObserver.unobserve(aboutContentRef.current)
        }
      },
      { threshold: 0.1 },
    )

    if (aboutContentRef.current) aboutObserver.observe(aboutContentRef.current)

    const servicesObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsServicesVisible(true)
          if (servicesContentRef.current) servicesObserver.unobserve(servicesContentRef.current)
        }
      },
      { threshold: 0.1 },
    )

    if (servicesContentRef.current) servicesObserver.observe(servicesContentRef.current)

    const servicesTitleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsServicesTitleVisible(true)
          if (servicesTitleRef.current) servicesTitleObserver.unobserve(servicesTitleRef.current)
        }
      },
      { threshold: 0.1 },
    )

    if (servicesTitleRef.current) servicesTitleObserver.observe(servicesTitleRef.current)

    return () => {
      if (headingRef.current) headingObserver.unobserve(headingRef.current)
      if (aboutContentRef.current) aboutObserver.unobserve(aboutContentRef.current)
      if (servicesContentRef.current) servicesObserver.unobserve(servicesContentRef.current)
      if (servicesTitleRef.current) servicesTitleObserver.unobserve(servicesTitleRef.current)
    }
  }, [])

  const scaleFactor = 1 + blurAmount / 16
  const warpSpeedStyle = {
    transform: `scale(${scaleFactor})`,
    transition: "transform 0.2s ease-out",
  }

  const scrollToAbout = () => {
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const openChatbot = () => setIsChatbotOpen(true)
  const closeChatbot = () => setIsChatbotOpen(false)
  const openRegister = () => setIsRegisterOpen(true)
  const closeRegister = () => setIsRegisterOpen(false)

  const heroStyle = {
    height: initialHeight ? `${initialHeight}px` : "100vh",
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-black" style={heroStyle}>
        <div className="absolute top-6 right-6 z-10 flex space-x-3">
          <Button
            onClick={openRegister}
            variant="outline"
            size="sm"
            className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors"
          >
            Присоединиться
          </Button>
        </div>

        <div className="absolute inset-0" style={warpSpeedStyle}>
          <StarField blurAmount={blurAmount} />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 60% 40%, rgba(236,72,153,0.18) 0%, rgba(168,85,247,0.12) 40%, transparent 70%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div
              className="backdrop-blur-sm px-6 py-4 rounded-lg inline-block relative"
              style={{
                background: "radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
              }}
            >
              <h1 className="text-4xl font-bold text-white md:text-6xl font-heading">
                Desire{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #f472b6, #c084fc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Universe
                </span>{" "}
                <span role="img" aria-label="fire">🔥</span>
              </h1>
              <p className="mt-4 text-lg text-gray-300 md:text-xl px-4 max-w-xs mx-auto md:max-w-none">
                Дейтинг без границ — только для взрослых
              </p>
              <Button
                onClick={openRegister}
                size="sm"
                className="mt-6 transition-colors"
                style={{
                  background: "linear-gradient(90deg, #ec4899, #a855f7)",
                  border: "none",
                  color: "#fff",
                }}
              >
                Начать бесплатно
              </Button>
            </div>
          </div>

          <div
            className="absolute bottom-20 animate-bounce cursor-pointer"
            onClick={scrollToAbout}
            role="button"
            aria-label="Прокрутить вниз"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") scrollToAbout()
            }}
          >
            <ChevronDown className="h-8 w-8 text-white" />
          </div>
        </div>
      </section>

      {/* О приложении */}
      <section ref={aboutSectionRef} id="about" className="py-20 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div
            ref={aboutContentRef}
            className={cn(
              "max-w-4xl mx-auto transition-all duration-1000 ease-out",
              isAboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div
                className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-7xl"
                style={{
                  background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
                  boxShadow: "0 0 60px rgba(236,72,153,0.4)",
                }}
              >
                🔥
              </div>
              <div className="space-y-4 text-center md:text-left px-4 md:px-0">
                <h2 className="text-3xl font-bold font-heading">О приложении</h2>
                <div className="space-y-4 max-w-2xl">
                  <p className="text-gray-300">
                    <span style={{ color: "#f472b6" }}>Desire Universe</span> — это пространство для раскрепощённых взрослых,
                    которые ищут искренние связи, флирт и незабываемые знакомства.
                  </p>
                  <p className="text-gray-300">
                    Мы создали место, где можно быть собой: открыто говорить о своих интересах,
                    желаниях и предпочтениях без осуждения и табу.
                  </p>
                  <p className="text-gray-300">
                    Умный алгоритм подбирает совместимых партнёров на основе твоих интересов и предпочтений —
                    никаких случайных совпадений, только те, кто тебя поймёт.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center md:justify-start">
                  <Button
                    onClick={openRegister}
                    size="sm"
                    className="w-[160px] mx-auto sm:mx-0 transition-colors"
                    style={{
                      background: "linear-gradient(90deg, #ec4899, #a855f7)",
                      border: "none",
                      color: "#fff",
                    }}
                  >
                    Начать бесплатно
                  </Button>
                  <Button
                    onClick={openChatbot}
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors w-[160px] mx-auto sm:mx-0 flex items-center justify-center"
                  >
                    <Robot className="mr-1 h-4 w-4" />
                    Задать вопрос
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Возможности */}
      <section ref={servicesSectionRef} id="services" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2
            ref={servicesTitleRef}
            className={cn(
              "mb-12 text-center text-3xl font-bold font-heading transition-all duration-1000 ease-out",
              isServicesTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            Что тебя ждёт
          </h2>
          <div
            ref={servicesContentRef}
            className={cn(
              "max-w-5xl mx-auto transition-all duration-1000 ease-out",
              isServicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                className="rounded-lg p-6 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.1) 100%)",
                  border: "1px solid rgba(236,72,153,0.25)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(236,72,153,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(236,72,153,0.25)")}
              >
                <div className="flex items-center mb-4">
                  <Flame className="h-7 w-7 mr-4" style={{ color: "#f472b6" }} aria-hidden="true" />
                  <h3 className="text-xl font-semibold font-heading">Горячие знакомства</h3>
                </div>
                <p className="text-gray-300">
                  Анкеты с открытыми интересами: ищи тех, кто разделяет твои желания и готов к смелым экспериментам.
                </p>
              </div>

              <div
                className="rounded-lg p-6 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.1) 100%)",
                  border: "1px solid rgba(168,85,247,0.25)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)")}
              >
                <div className="flex items-center mb-4">
                  <Heart className="h-7 w-7 mr-4" style={{ color: "#c084fc" }} aria-hidden="true" />
                  <h3 className="text-xl font-semibold font-heading">Умный матчинг</h3>
                </div>
                <p className="text-gray-300">
                  Алгоритм анализирует твои предпочтения и подбирает совместимых партнёров — больше не нужно листать сотни анкет.
                </p>
              </div>

              <div
                className="rounded-lg p-6 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.1) 100%)",
                  border: "1px solid rgba(236,72,153,0.25)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(236,72,153,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(236,72,153,0.25)")}
              >
                <div className="flex items-center mb-4">
                  <Shield className="h-7 w-7 mr-4" style={{ color: "#f472b6" }} aria-hidden="true" />
                  <h3 className="text-xl font-semibold font-heading">Анонимность и защита</h3>
                </div>
                <p className="text-gray-300">
                  Полная конфиденциальность данных, размытые фото до взаимного лайка и верификация аккаунтов — безопасность на первом месте.
                </p>
              </div>

              <div
                className="rounded-lg p-6 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.1) 100%)",
                  border: "1px solid rgba(168,85,247,0.25)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)")}
              >
                <div className="flex items-center mb-4">
                  <Sparkles className="h-7 w-7 mr-4" style={{ color: "#c084fc" }} aria-hidden="true" />
                  <h3 className="text-xl font-semibold font-heading">Приватный чат</h3>
                </div>
                <p className="text-gray-300">
                  Зашифрованные сообщения, исчезающие фото и видеозвонки — общайся так, как тебе комфортно.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section
        ref={contactSectionRef}
        id="contact"
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #1a0a1e 0%, #0d0d0d 100%)",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2
            ref={headingRef}
            className={cn(
              "mb-4 text-3xl md:text-5xl font-bold font-heading text-white transition-all duration-1000 ease-out",
              isHeadingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            Готов начать?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Регистрация займёт 2 минуты. Первый месяц — бесплатно.
          </p>
          <Button
            onClick={openRegister}
            className="text-white border-none text-base px-10 py-6"
            style={{ background: "linear-gradient(90deg, #ec4899, #a855f7)" }}
          >
            Зарегистрироваться 🔥
          </Button>
          <p className="text-gray-600 text-xs mt-6">Только для лиц старше 18 лет</p>
        </div>
      </section>

      <ChatbotModal isOpen={isChatbotOpen} onClose={closeChatbot} />
      <RegisterModal isOpen={isRegisterOpen} onClose={closeRegister} />
    </div>
  )
}
