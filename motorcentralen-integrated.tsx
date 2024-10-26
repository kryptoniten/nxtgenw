'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Sparkles, ArrowRight, Volume2, RotateCcw, X, Car, User, Eye, EyeOff, ChevronUp, ChevronDown, Info, Phone, Mail, Search, ChevronLeft, ChevronRight, Calendar, Fuel, Gauge, MessageSquare, CheckSquare, FileText, Calculator, RefreshCcw, Download } from "lucide-react"
import { useState, useMemo, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const primaryColor = "#1D3455"

export default function MotorcentralenIntegrated() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [showCarImages, setShowCarImages] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" })
  const [isVisible, setIsVisible] = useState(true)
  const [selectedCar, setSelectedCar] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
  const [showLoanCalculator, setShowLoanCalculator] = useState(false)
  const [showBookingOptions, setShowBookingOptions] = useState(false)
  const [showTestDriveBooking, setShowTestDriveBooking] = useState(false)
  const [showMeetingBooking, setShowMeetingBooking] = useState(false)
  const [showSellerChat, setShowSellerChat] = useState(false)
  const [showDataHandlingInfo, setShowDataHandlingInfo] = useState(false)
  const scrollContainerRef = useRef(null)
  const [chatbotMessages, setChatbotMessages] = useState([
    { role: "assistant", content: "Hej! Jag är säljarens AI-assistent. Hur kan jag hjälpa dig idag?" },
  ])
  const [chatInputValue, setChatInputValue] = useState("")
  const [conversation, setConversation] = useState([
    { role: "assistant", content: "Hej! Välkommen till Motorcentralen. Hur kan jag hjälpa dig idag?" },
    { role: "user", content: "Har ni några röda bilar inne?" },
    { role: "assistant", content: "Ja, vi har faktiskt flera röda bilar i lager just nu. Är det någon speciell modell eller typ av bil du är intresserad av? Jag kan hjälpa dig att filtrera vårt utbud baserat på färg och andra egenskaper." },
    { role: "user", content: "Jag letar efter en röd kombi. Vad har ni för alternativ?" },
    { role: "assistant", content: "Utmärkt! Vi har några röda kombibilar tillgängliga. Nedan har jag valt ut några alternativ:" },
  ])
  const [buyingStage, setBuyingStage] = useState(1) 
  const [showMeetingTimes, setShowMeetingTimes] = useState(false)
  const [selectedMeetingTime, setSelectedMeetingTime] = useState(null)
  const [isStepperSticky, setIsStepperSticky] = useState(false)
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false) 
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false) 
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [downPayment, setDownPayment] = useState(0)
  const [loanPeriod, setLoanPeriod] = useState(60)
  const [interestRate, setInterestRate] = useState(3.5)
  const [monthlyPayment, setMonthlyPayment] = useState(0)

  const handleStopGeneration = () => {
    setIsGenerating(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const togglePreview = () => {
    setIsPreviewing(!isPreviewing)
  }

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value })
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (acceptPrivacyPolicy) {
      setShowContactForm(false)
      setIsBookingConfirmed(true) 
      setBuyingStage(4)
    }
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    setConversation(prev => [
      ...prev,
      { role: "user", content: inputValue },
      { role: "assistant", content: "Tack för din fråga. Låt mig kolla det för dig." }
    ])
    setInputValue("")
    setBuyingStage(prevStage => Math.min(prevStage + 1, 4)) 
  }

  const handleChatbotSend = () => {
    if (chatInputValue.trim() === "") return

    const newUserMessage = { role: "user", content: chatInputValue }
    let newAssistantMessage

    if (chatInputValue.toLowerCase().includes("boka") || chatInputValue.toLowerCase().includes("provkörning") || chatInputValue.toLowerCase().includes("möte")) {
      newAssistantMessage = { role: "assistant", content: "Vill du boka en provkörning eller ett möte med säljaren? Välj ett alternativ:" }
      setChatbotMessages(prev => [...prev, newUserMessage, newAssistantMessage])
      setShowBookingOptions(true)
    } else {
      newAssistantMessage = { role: "assistant", content: "Tack för din fråga. Jag ska hjälpa dig med det." }
      setChatbotMessages(prev => [...prev, newUserMessage, newAssistantMessage])
    }
  }

  const handleMoreInfo = (car) => {
    setSelectedCar(car)
    setBuyingStage(2)
    setTimeout(() => {
      const carDetailsSection = document.getElementById('car-details-section')
      if (carDetailsSection) {
        carDetailsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const handleShowBookingOptions = () => {
    setShowBookingOptions(true);
    setTimeout(() => {
      const bookingOptionsSection = document.getElementById('booking-options');
      if (bookingOptionsSection) {
        bookingOptionsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  const handleBookTestDrive = () => {
    setShowTestDriveBooking(true)
    setShowMeetingBooking(false)
    setShowBookingOptions(false)
    setChatbotMessages(prev => [...prev, { role: "assistant", content: "Här kan du boka en provkörning:" }])
    setTimeout(() => {
      const bookingCard = document.getElementById('booking-card')
      if (bookingCard) {
        bookingCard.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const handleBookMeeting = () => {
    setShowMeetingBooking(true)
    setShowTestDriveBooking(false)
    setShowBookingOptions(false)
    setChatbotMessages(prev => [...prev, { role: "assistant", content: "Här kan du boka ett möte med säljaren:" }])
    setTimeout(() => {
      const bookingCard = document.getElementById('booking-card')
      if (bookingCard) {
        bookingCard.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const handleShowAdditionalInfo = () => {
    setShowAdditionalInfo(!showAdditionalInfo)
  }


  const scrollToLoanCalculator = () => {
    setTimeout(() => {
      const loanCalculatorSection = document.getElementById('loan-calculator')
      if (loanCalculatorSection) {
        loanCalculatorSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const scrollToBookingTimes = () => {
    setShowTestDriveBooking(true)
    setShowMeetingBooking(false)
    setTimeout(() => {
      const bookingCard = document.getElementById('booking-card')
      if (bookingCard) {
        bookingCard.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  let carData = [
    {
      id: 1,
      name: "Volkswagen Passat",
      type: "Kombi",
      price: 399000,
      image: "/placeholder.svg?height=150&width=200",
      fuelType: "Hybrid",
      transmission: "Automat",
      mileage: "0 km (ny)",
      year: 2024,
      brand: "Volkswagen",
      color: "Röd",
      seller: {
        name: "Anna Andersson",
        image: "/placeholder.svg?height=200&width=200",
        phone: "070-123 45 67",
        email: "anna.andersson@motorcentralen.se"
      },
      annualTax: 1860,
      nextInspection: "2026-05-15",
      insuranceClass: 13,
      co2Emissions: 32,
      electricRange: 62,
      totalPower: 218
    },
    {
      id: 2,
      name: "Skoda Octavia",
      type: "Kombi",
      price: 359000,
      image: "/placeholder.svg?height=150&width=200",
      fuelType: "Bensin",
      transmission: "Manuell",
      mileage: "0 km (ny)",
      year: 2024,
      brand: "Skoda",
      color: "Röd",
      seller: {
        name: "Erik Eriksson",
        image: "/placeholder.svg?height=200&width=200",
        phone: "070-234 56 78",
        email: "erik.eriksson@motorcentralen.se"
      },
      annualTax: 1548,
      nextInspection: "2026-06-30",
      insuranceClass: 12,
      co2Emissions: 130,
      electricRange: 0,
      totalPower: 150
    },
    {
      id: 3,
      name: "Audi A4 Avant",
      type: "Kombi",
      price: 499000,
      image: "/placeholder.svg?height=150&width=200",
      fuelType: "Diesel",
      transmission: "Automat",
      mileage: "0 km (ny)",
      year: 2024,
      brand: "Audi",
      color: "Röd",
      seller: {
        name: "Maria Nilsson",
        image: "/placeholder.svg?height=200&width=200",
        phone: "070-345 67 89",
        email: "maria.nilsson@motorcentralen.se"
      },
      annualTax: 2092,
      nextInspection: "2026-07-15",
      insuranceClass: 14,
      co2Emissions: 143,
      electricRange: 0,
      totalPower: 204
    },
    {
      id: 4,
      name: "Volkswagen Golf",
      type: "Halvkombi",
      price: 329000,
      image: "/placeholder.svg?height=150&width=200",
      fuelType: "Bensin",
      transmission: "Manuell",
      mileage: "0 km (ny)",
      year: 2024,
      brand: "Volkswagen",
      color: "Blå",
      seller: {
        name: "Johan Svensson",
        image: "/placeholder.svg?height=200&width=200",
        phone: "070-456 78 90",
        email: "johan.svensson@motorcentralen.se"
      },
      annualTax: 1460,
      nextInspection: "2026-08-15",
      insuranceClass: 12,
      co2Emissions: 121,
      electricRange: 0,
      totalPower: 130
    },
    {
      id: 5,
      name: "Skoda Superb",
      type: "Sedan",
      price: 449000,
      image: "/placeholder.svg?height=150&width=200",
      fuelType: "Hybrid",
      transmission: "Automat",
      mileage: "0 km (ny)",
      year: 2024,
      brand: "Skoda",
      color: "Silver",
      seller: {
        name: "Lisa Andersson",
        image: "/placeholder.svg?height=200&width=200",
        phone: "070-567 89 01",
        email: "lisa.andersson@motorcentralen.se"
      },
      annualTax: 1760,
      nextInspection: "2026-09-30",
      insuranceClass: 13,
      co2Emissions: 35,
      electricRange: 55,
      totalPower: 218
    },
    {
      id: 6,
      name: "Audi Q5",
      type:  "SUV",
      price: 599000,
      image: "/placeholder.svg?height=150&width=200",
      fuelType: "Diesel",
      transmission: "Automat",
      mileage: "0 km (ny)",
      year: 2024,
      brand: "Audi",
      color: "Svart",
      seller: {
        name: "Anders Nilsson",
        image: "/placeholder.svg?height=200&width=200",
        phone: "070-678 90 12",
        email: "anders.nilsson@motorcentralen.se"
      },
      annualTax: 2292,
      nextInspection: "2026-10-15",
      insuranceClass: 15,
      co2Emissions: 163,
      electricRange: 0,
      totalPower: 204
    },
    {
      id: 7,
      name: "Volkswagen ID.4",
      type: "SUV",
      price: 549000,
      image: "/placeholder.svg?height=150&width=200",
      fuelType: "El",
      transmission: "Automat",
      mileage: "0 km (ny)",
      year: 2024,
      brand: "Volkswagen",
      color: "Vit",
      seller: {
        name: "Emma Karlsson",
        image: "/placeholder.svg?height=200&width=200",
        phone: "070-789 01 23",
        email: "emma.karlsson@motorcentralen.se"
      },
      annualTax: 360,
      nextInspection: "2026-11-30",
      insuranceClass: 14,
      co2Emissions: 0,
      electricRange: 520,
      totalPower: 204
    },
    {
      id: 8,
      name: "Skoda Enyaq",
      type: "SUV",
      price: 569000,
      image: "/placeholder.svg?height=150&width=200",
      fuelType: "El",
      transmission: "Automat",
      mileage: "0 km (ny)",
      year: 2024,
      brand: "Skoda",
      color:  "Grön",
      seller: {
        name: "Oscar Lindberg",
        image: "/placeholder.svg?height=200&width=200",
        phone: "070-890 12 34",
        email: "oscar.lindberg@motorcentralen.se"
      },
      annualTax: 360,
      nextInspection: "2026-12-15",
      insuranceClass: 14,
      co2Emissions: 0,
      electricRange: 530,
      totalPower: 204
    },
    {
      id: 9,
      name: "Audi e-tron",
      type: "SUV",
      price: 799000,
      image: "/placeholder.svg?height=150&width=200",
      fuelType: "El",
      transmission: "Automat",
      mileage: "0 km (ny)",
      year: 2024,
      brand: "Audi",
      color: "Grå",
      seller: {
        name: "Sofia Bergström",
        image: "/placeholder.svg?height=200&width=200",
        phone: "070-901 23 45",
        email: "sofia.bergstrom@motorcentralen.se"
      },
      annualTax: 360,
      nextInspection: "2027-01-31",
      insuranceClass: 16,
      co2Emissions: 0,
      electricRange: 436,
      totalPower: 300
    }
  ]

  carData = carData.map(car => ({
    ...car,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600"
    ]
  }))

  const filteredCars = useMemo(() => {
    return carData.filter(car => 
      (searchTerm === "" || 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.fuelType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.price.toString().includes(searchTerm) ||
        car.color.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeFilters.length === 0 ||
        activeFilters.includes(car.fuelType.toUpperCase()) ||
        activeFilters.includes(car.transmission.toUpperCase()) ||
        activeFilters.includes(car.type.toUpperCase()) ||
        activeFilters.includes(car.brand.toUpperCase()) ||
        activeFilters.includes(car.color.toUpperCase()))
    )
  }, [searchTerm, activeFilters])

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setIsStepperSticky(offset > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatbotMessages]);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selectedMeetingTime) {
      setBuyingStage(3)
    }
  }, [selectedMeetingTime])

  useEffect(() => {
    if (selectedCar) {
      const principal = selectedCar.price - downPayment
      const monthlyRate = interestRate / 100 / 12
      const numberOfPayments = loanPeriod
      const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      setMonthlyPayment(Math.round(monthlyPayment))
    }
  }, [selectedCar, downPayment, loanPeriod, interestRate])

  const handleResetConversation = () => {
    setChatbotMessages([
      { role: "assistant", content: "Hej! Jag är säljarens AI-assistent. Hur kan jag hjälpa dig idag?" }
    ]);
  }

  const handleDownloadConversation = () => {
    const conversationText = chatbotMessages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const MeetingTimesSelector = ({ onSelectTime }) => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const handleTimeSelection = (time) => {
      onSelectTime(time)
      setTimeout(() => {
        const confirmButton = document.getElementById('confirm-booking')
        if (confirmButton) {
          confirmButton.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
    
    return (
      <div className="grid grid-cols-7 gap-2">
        {[...Array(7)].map((_, index) => {
          const date = new Date(today.getTime() + index * 24 * 60 * 60 * 1000)
          return (
            <div key={index} className="text-center">
              <p className="text-sm font-medium">{date.toLocaleDateString('sv-SE', { weekday: 'short' })}</p>
              <p className="text-xs">{date.getDate()}</p>
              <div className="space-y-1 mt-1">
                {['10:00', '13:00', '15:00'].map((time) => (
                  <button
                    key={time}
                    className="w-full text-xs bg-[#1D3455] text-white py-1 rounded hover:bg-[#1D3455]/80"
                    onClick={() => handleTimeSelection(`${date.toLocaleDateString('sv-SE')} ${time}`)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white text-[#1D3455] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-[#1D3455]" />
              <h1 className="text-2xl sm:text-3xl font-bold">Motorcentralen</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#1D3455] hover:bg-[#1D3455]/10"
                onClick={togglePreview}
              >
                {isPreviewing ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                <span className="hidden sm:inline ml-2">
                  {isPreviewing ? "Dölj källa" : "Visa källa"}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#1D3455] hover:bg-[#1D3455]/10"
              >
                <RotateCcw className="h-5 w-5" />
                <span className="hidden sm:inline ml-2">Återställ</span>
              </Button>
              <Dialog open={showDataHandlingInfo} onOpenChange={setShowDataHandlingInfo}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#1D3455] hover:bg-[#1D3455]/10"
                  >
                    <FileText className="h-5 w-5" />
                    <span className="hidden sm:inline ml-2">Datahantering</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hur vi hanterar din data</DialogTitle>
                    <DialogDescription>
                      Vi på Motorcentralen värnar om din integritet och hanterar all personlig information med största försiktighet. 
                      All data som samlas in används endast för att förbättra din upplevelse och för att ge dig bästa möjliga service. 
                      Vi delar aldrig din information med tredje part utan ditt uttryckliga samtycke.
                      För mer information, vänligen läs vår fullständiga integritetspolicy på vår hemsida.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <div className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isStepperSticky ? 'opacity-100 shadow-md' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
            <div className="flex items-center justify-between">
              {['Sök', 'Välj bil', 'Boka', 'Bekräfta'].map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    buyingStage > index 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : buyingStage === index + 1 
                        ? 'bg-[#1D3455] border-[#1D3455] text-white' 
                        : 'border-gray-300 text-gray-300'
                  }`}>
                    {buyingStage > index ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium hidden sm:inline ${
                    buyingStage === index + 1 ? 'text-[#1D3455]' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                  {index < 3 && (
                    <div className={`w-4 sm:w-12 h-0.5 mx-2 ${
                      buyingStage > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.main
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.section
              id="stage-0"
              className="space-y-4 bg-[#1D3455]/5 p-6 rounded-lg relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Chatta med vår nya AI-assistent</h2>
                  <p className="text-sm text-[#1D3455]/70 mb-4">Vår AI-assistent kan hjälpa dig att hitta rätt bil, svara på frågor om vårt utbud, och guida dig genom köpprocessen. Ställ en fråga för att komma igång!</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#1D3455] hover:bg-[#1D3455]/10"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </div>
              <AnimatePresence>
                {isVisible && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {conversation.map((message, index) => (
                      <div key={index} className={cn(
                        "p-4 rounded-lg mb-2",
                        message.role === "assistant" 
                          ? "bg-[#1D3455]/10" 
                          : "bg-[#2A4A7F] ml-auto max-w-[80%] text-white"
                      )}>
                        {message.role === "assistant" && (
                          <div className="flex items-center mb-2">
                            <Sparkles className="w-5 h-5 mr-2 text-[#1D3455]" />
                            <span className="font-semibold">Motorcentralen</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2 w-full mt-4">
                      <div className="relative flex-grow">
                        <Input
                          className="w-full bg-[#1D3455]/10 border-[#1D3455]/20 text-[#1D3455] placeholder-[#1D3455]/50 pr-24"
                          placeholder="Skriv ett meddelande..."
                          value={inputValue}
                          onChange={handleInputChange}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessage()
                            }
                          }}
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                          <Button
                            className="h-8 w-8 p-0 bg-[#1D3455] text-white hover:bg-[#1D3455]/90 border border-[#1D3455]/20"
                            onClick={handleSendMessage}
                          >
                            <ArrowRight className="w-4 h-4" />
                            <span className="sr-only">Skicka meddelande</span>
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#1D3455] hover:bg-[#1D3455]/10"
                      >
                        <Volume2 className="h-5 w-5" />
                        <span className="sr-only">Ljud</span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            <motion.section
              id="stage-0"
              className="bg-[#1D3455]/5 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Sök och filtrera bilar</h2>
              <div className="mb-4 relative">
                <Input
                  type="text"
                  placeholder="Sök efter bilmärke, modell, bränsletyp, färg..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#1D3455]/10 border-[#1D3455]/20 text-[#1D3455] placeholder-[#1D3455]/50"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D3455]/50" />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {["HYBRID", "BENSIN", "DIESEL", "AUTOMAT", "KOMBI", "VOLKSWAGEN", "SKODA", "AUDI"].map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilters.includes(filter) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter(filter)}
                    className={cn(
                      "text-xs",
                      activeFilters.includes(filter)
                        ? "bg-[#1D3455] text-white hover:bg-[#1D3455]/90"
                        : "text-[#1D3455] hover:bg-[#1D3455]/10"
                    )}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              <Carousel className="w-full">
                <CarouselContent>
                  {filteredCars.map((car) => (
                    <CarouselItem key={car.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="bg-white p-4 rounded-lg shadow">
                        <img src={car.image} alt={car.name} className="w-full h-40 object-cover mb-2 rounded" />
                        <h3 className="font-semibold text-lg mb-1">{car.name}</h3>
                        <p className="font-bold mb-2">{car.price.toLocaleString()} SEK</p>
                        <p className="text-sm text-[#1D3455]/80 mb-1">{car.type} • {car.fuelType}</p>
                        <p className="text-sm text-[#1D3455]/80 mb-2">{car.transmission} • {car.color}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-[#1D3455] text-white hover:bg-[#1D3455]/90 border border-[#1D3455]/20"
                          onClick={() => handleMoreInfo(car)}
                        >
                          <Info className="w-4 h-4 mr-2" />
                          Mer information
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </motion.section>

            {selectedCar && (
              <>
                <motion.section
                  id="car-details-section"
                  className="bg-white p-6 rounded-lg shadow-lg mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">{selectedCar.name}</h2>
                    <img src={selectedCar.images[0]} alt={`${selectedCar.name}`} className="w-full h-[500px] object-contain rounded-lg mb-6" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button 
                        onClick={() => {
                          setBuyingStage(2)
                          setTimeout(() => {
                            const sellerCard = document.getElementById('seller-card')
                            if (sellerCard) {
                              sellerCard.scrollIntoView({ behavior: 'smooth' })
                            }
                          }, 100)
                        }} 
                        className="w-full bg-[#1D3455] text-white hover:bg-[#1D3455]/90"
                      >
                        Kontakta säljare
                      </Button>
                      <Button 
                        onClick={scrollToBookingTimes}
                        className="w-full bg-[#1D3455] text-white hover:bg-[#1D3455]/90"
                      >
                        Boka provkörning
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowLoanCalculator(!showLoanCalculator)
                          if (!showLoanCalculator) {
                            scrollToLoanCalculator()
                          }
                        }} 
                        variant="outline" 
                        className="w-full"
                      >
                        {showLoanCalculator ? "Dölj lånekalkylator" : "Visa lånekalkylator"}
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowAdditionalInfo(!showAdditionalInfo)
                          if (!showAdditionalInfo) {
                            setTimeout(() => {
                              const additionalInfoCard = document.getElementById('additional-info-card')
                              if (additionalInfoCard) {
                                additionalInfoCard.scrollIntoView({ behavior: 'smooth' })
                              }
                            }, 100)
                          }
                        }} 
                        variant="outline" 
                        className="w-full"
                      >
                        {showAdditionalInfo ? "Dölj detaljer" : "Visa detaljer"}
                      </Button>
                    </div>

                    {showLoanCalculator && (
                      <div id="loan-calculator" className="mt-6 bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Lånekalkylator</h3>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Kontantinsats: {downPayment.toLocaleString()} SEK</label>
                            <Slider
                              min={0}
                              max={selectedCar.price}
                              step={1000}
                              value={[downPayment]}
                              onValueChange={(value) => setDownPayment(value[0])}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Låneperiod: {loanPeriod} månader</label>
                            <Slider
                              min={12}
                              max={120}
                              step={12}
                              value={[loanPeriod]}
                              onValueChange={(value) => setLoanPeriod(value[0])}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Ränta: {interestRate.toFixed(2)}%</label>
                            <Slider
                              min={0}
                              max={10}
                              step={0.1}
                              value={[interestRate]}
                              onValueChange={(value) => setInterestRate(value[0])}
                            />
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-lg font-semibold">Uppskattad månadskostnad:</p>
                            <p className="text-3xl font-bold text-[#1D3455]">{monthlyPayment.toLocaleString()} SEK</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {showAdditionalInfo && (
                      <motion.div
                        id="additional-info-card"
                        className="mt-6 bg-white p-6 rounded-lg shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl font-semibold mb-4">Detaljerad information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold mb-2">Bildetaljer</h4>
                            <ul className="space-y-2 text-sm">
                              <li><span className="font-medium">Pris:</span> {selectedCar.price.toLocaleString()} SEK</li>
                              <li><span className="font-medium">Årsmodell:</span> {selectedCar.year}</li>
                              <li><span className="font-medium">Miltal:</span> {selectedCar.mileage}</li>
                              <li><span className="font-medium">Färg:</span> {selectedCar.color}</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold mb-2">Prestanda</h4>
                            <ul className="space-y-2 text-sm">
                              <li><span className="font-medium">Bränsletyp:</span> {selectedCar.fuelType}</li>
                              <li><span className="font-medium">Växellåda:</span> {selectedCar.transmission}</li>
                              <li><span className="font-medium">CO2-utsläpp:</span> {selectedCar.co2Emissions} g/km</li>
                              <li><span className="font-medium">Total effekt:</span> {selectedCar.totalPower} hk</li>
                              {selectedCar.electricRange > 0 && (
                                <li><span className="font-medium">Elektrisk räckvidd:</span> {selectedCar.electricRange} km</li>
                              )}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-2">Ägandekostnader</h4>
                          <ul className="space-y-2 text-sm">
                            <li><span className="font-medium">Årlig vägskatt:</span> {selectedCar.annualTax} SEK</li>
                            <li><span className="font-medium">Nästa besiktning:</span> {selectedCar.nextInspection}</li>
                            <li><span className="font-medium">Försäkringsklass:</span> {selectedCar.insuranceClass}</li>
                          </ul>
                        </div>
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-2">Utrustning</h4>
                          <ul className="space-y-2 text-sm grid grid-cols-2 gap-4">
                            <li>• Klimatanläggning</li>
                            <li>• Parkeringssensorer</li>
                            <li>• Backkamera</li>
                            <li>• Navigationssystem</li>
                            <li>• Bluetooth</li>
                            <li>• Eluppvärmda säten</li>
                            <li>• Adaptiv farthållare</li>
                            <li>• LED-strålkastare</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}

                  </div>
                </motion.section>

                <motion.section
                  id="stage-2"
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <div id="seller-card" className="bg-gray-100 p-4 rounded-lg"> 
                      <h3 className="text-lg font-semibold mb-4">Säljare</h3>
                      <div className="flex items-center space-x-4 mb-4">
                        <img src={selectedCar.seller.image} alt={selectedCar.seller.name} className="w-16 h-16 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold">{selectedCar.seller.name}</p>
                          <p className="text-sm text-gray-600">{selectedCar.seller.email}</p>
                          <p className="text-sm text-gray-600">{selectedCar.seller.phone}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Button 
                          onClick={() => {
                            setShowSellerChat(!showSellerChat)
                            if (!showSellerChat) {
                              setTimeout(() => {
                                const sellerChatSection = document.getElementById('seller-chat')
                                if (sellerChatSection) {
                                  sellerChatSection.scrollIntoView({ behavior: 'smooth' })
                                }
                              }, 100)
                            }
                          }} 
                          variant="outline" 
                          className="w-full"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {showSellerChat ? "Stäng chat" : "Chatta"}
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Phone className="w-4 h-4 mr-2" />
                          Ring
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Maila
                        </Button>
                      </div>
                    </div>


                    {showSellerChat && (
                      <div id="seller-chat" className="bg-gray-100 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Chatta med säljaren</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#1D3455] hover:bg-[#1D3455]/10"
                            onClick={handleResetConversation}
                          >
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Återställ
                          </Button>
                        </div>
                        <div className="bg-white rounded-lg p-4 h-64 overflow-y-auto mb-4 chat-messages">
                          {chatbotMessages.map((message, index) => (
                            <div
                              key={index}
                              className={`mb-4 ${
                                message.role === "assistant" ? "text-left" : "text-right"
                              }`}
                            >
                              <div
                                className={`inline-block p-2 rounded-lg ${
                                  message.role === "assistant"
                                    ? "bg-[#1D3455]/10 text-[#1D3455]"
                                    : "bg-[#1D3455] text-white"
                                }`}
                              >
                                {message.content}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                          <Input
                            type="text"
                            placeholder="Skriv ditt meddelande..."
                            value={chatInputValue}
                            onChange={(e) => setChatInputValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleChatbotSend();
                              }
                            }}
                            className="flex-grow"
                          />
                          <Button onClick={handleChatbotSend} className="bg-[#1D3455] text-white hover:bg-[#1D3455]/90">
                            Skicka
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Button onClick={handleBookTestDrive} className="w-full bg-[#1D3455] text-white hover:bg-[#1D3455]/90">
                            Boka provkörning
                          </Button>
                          <Button onClick={handleBookMeeting} className="w-full bg-[#1D3455] text-white hover:bg-[#1D3455]/90">
                            Boka möte med säljare
                          </Button>
                        </div>
                      </div>
                    )}

                    {(showTestDriveBooking || showMeetingBooking) && (
                      <div id="booking-card" className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">
                          {showTestDriveBooking ? "Boka provkörning" : "Boka möte med säljare"}
                        </h3>
                        <MeetingTimesSelector onSelectTime={(time) => setSelectedMeetingTime(time)} />
                        {selectedMeetingTime && (
                          <>
                            <p>Du har valt tid: {selectedMeetingTime}</p>
                            <Button 
                              onClick={() => {
                                setShowContactForm(true)
                                setTimeout(() => {
                                  const contactInfoSection = document.getElementById('contact-information')
                                  if (contactInfoSection) {
                                    contactInfoSection.scrollIntoView({ behavior: 'smooth' })
                                  }
                                }, 100)
                              }} 
                              className="mt-2 w-full bg-[#1D3455] text-white hover:bg-[#1D3455]/90"
                            >
                              Gå vidare
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                  </div>
                </motion.section>
              </>
            )}

            {showContactForm && (
              <motion.section
                id="contact-information"
                className="bg-[#1D3455]/5 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-4">Kontaktinformation</h2>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Namn</label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={contactInfo.name}
                      onChange={handleContactInfoChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">E-post</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={contactInfo.email}
                      onChange={handleContactInfoChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefon</label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={contactInfo.phone}
                      onChange={handleContactInfoChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="privacy-policy"
                        checked={acceptPrivacyPolicy}
                        onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
                        className="rounded border-gray-300 text-[#1D3455] focus:ring-[#1D3455]"
                      />
                      <label htmlFor="privacy-policy" className="text-sm text-gray-700">
                        Jag godkänner att denna webbplats lagrar och bearbetar mina uppgifter enligt{' '}
                        <a href="#" className="text-[#1D3455] underline">integritetspolicy</a>.
                      </label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#1D3455] text-white hover:bg-[#1D3455]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!acceptPrivacyPolicy}
                    >
                      Bekräfta bokning
                    </Button>
                  </div>
                </form>
              </motion.section>
            )}
            {isBookingConfirmed && (
              <motion.section
                className="bg-[#1D3455] text-white p-8 rounded-lg shadow-lg relative mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2A4A7F] rounded-bl-full"></div>
                <div className="relative z-10">
                  <CheckSquare className="w-16 h-16 mb-4 text-green-400" />
                  <h2 className="text-3xl font-bold mb-4">Tack för din bokning!</h2>
                  <p className="text-lg mb-4">Din bokning är nu bekräftad. Motorcentralen kommer att kontakta dig så snart som möjligt för att bekräfta detaljerna.</p>
                  <p className="text-lg">En bekräftelse har skickats till din e-postadress. Vänligen kontrollera din inkorg (och eventuellt skräppostmappen) för mer information.</p>
                </div>
              </motion.section>
            )}
          </motion.main>
        </AnimatePresence>
      </div>
      {showFloatingButton && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-[#1D3455] text-white hover:bg-[#1D3455]/90 shadow-lg"
          aria-label="Gå till huvudchatten"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}
    </div>
  )
}