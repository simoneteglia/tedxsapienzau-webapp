import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Easing,
  Image,
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from "react-native";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Talk = {
  id: string;
  title: string;
  speaker: string;
  time: string;
  speakerBio: string;
};

const talks: Talk[] = [
  {
    id: "1",
    title: "Aurora Ruffino",
    speaker: "Attrice, scrittrice e ricercatrice filosofica ",
    time: "Artist",
    speakerBio:
      "Aurora Ruffino debutta con La solitudine dei numeri primi di Saverio Costanzo. Diplomata al Centro Sperimentale di Cinematografia, recita in Bianca come il latte, rossa come il sangue ed in Braccialetti Rossi. È la sirena di Ninyo di Gabriele Mainetti e protagonista di Noi. Esordisce nel 2024 con il primo romanzo Volevo salvare i colori. Sarà Santa Lucia nella prossima produzione di Martin Scorsese. ",
  },
  {
    id: "2",
    title: "Giuliana Mazzoni",
    speaker:
      "Professore Ordinario di Psicologia in quiescenza, Sapienza Università di Roma",
    time: "Speaker",
    speakerBio:
      "Giuliana Mazzoni è nota a livello internazionale per i suoi lavori sulla memoria umana (e in particolare la memoria di avvenimenti personali). Il suo lavoro sulla relazione tra memoria e testimonianza, le potenziali fallacie e le corrette metodologie di ascolto, ha avuto un’importante influenza sul mondo del diritto, soprattutto nei paesi di lingua spagnola e in Italia. ",
  },
  {
    id: "3",
    title: "Lorenzo Zazzeri",
    speaker: "Atleta professionista",
    time: "Speaker",
    speakerBio:
      "Lorenzo Zazzeri, nato a Firenze (1994), è l'attuale Capitano della Nazionale Italiana di Nuoto. Oltre agli straordinari successi sportivi, ha conseguito con lode la laurea in Scienze Motorie, Sport e Salute e il premio da parte del CONI come 'Atleta Eccellente/Eccellente Studente' nel 2023. È attualmente iscritto al terzo anno di Belle Arti all'indirizzo 'Arti Visive' e conduce il Podcast Sportiva-Mente. ",
  },
  {
    id: "4",
    title: "Alessandra Amato & Claudio Cocino",
    speaker:
      "Étoile e Primo Ballerino del corpo di ballo del Teatro dell’Opera di Roma ",
    time: "Artist",
    speakerBio:
      "Alessandra Amato è Étoile del Teatro dell’Opera di Roma dal 2016, nominata in seguito ad uno spettacolo de Il lago dei cigni. Consolida negli anni la sua partnership con Claudio Cocino, Primo Ballerino del teatro dell’opera di Roma dal 2017, nominato in seguito al balletto La bella addormentata. Nelle loro carriere interpretano i ruoli principali nei più importanti balletti del repertorio classico e del repertorio dei maggiori coreografi del ‘900 e contemporanei. ",
  },
  {
    id: "5",
    title: "Cristina Simone",
    speaker:
      "Professore Ordinario di Economia e Gestione delle Imprese, Sapienza Università di Roma",
    time: "Speaker",
    speakerBio:
      "Cristina Simone è un professore ordinario di Economia e Gestione delle Imprese alla Sapienza, dove coordina il PhD in Management, Banking e Commodity Science. Supervisiona il progetto Horizon MSCA-GeoPlaReg. Si occupa di management strategico, sistemi complessi, capitalismo digitale e rapporti impresa-territorio. È stata Visiting Professor all’ITBA in Argentina. ",
  },
  {
    id: "6",
    title: "Stefano Magno",
    speaker: "Chirurgo Senologo, Policlinico Univ. Gemelli di Roma ",
    time: "Speaker",
    speakerBio:
      "Stefano Magno è un chirurgo senologo e Direttore dell’Unità Operativa Semplice di Terapie Integrate in Senologia presso la Breast Unit della Fondazione Policlinico Gemelli di Roma. È inoltre coordinatore scientifico del Master di I livello in “Terapie Integrate nelle patologie oncologiche femminili” e ricopre il ruolo di segretario del Centro di Ricerca e Formazione nelle terapie integrate nelle neoplasie mammarie presso l’Università Cattolica del Sacro Cuore. ",
  },
  {
    id: "7",
    title: "Guido Chiefalo",
    speaker:
      "Designer, Art DIrector ℅ FAO e Professore di Brand Design, Sapienza Università di Roma ",
    time: "Speaker",
    speakerBio:
      "Guido Chiefalo é un designer nato a Roma nel 1986, opera nel campo della comunicazione visiva e della brand strategy. Attualmente ricopre il ruolo di Art Director alla FAO (Nazioni Unite) ed insegna “Brand Design” alla Sapienza Università di Roma (DCVM). Ha lavorato tra Milano, Londra e Roma, collaborando con agenzie come INAREA, McCann, Slamp e Soda Studio. ",
  },
  {
    id: "8",
    title: "Carolina Venosi",
    speaker:
      "Imprenditrice e Consulente, founder di Rome is More e Domenica Italiana ",
    time: "Speaker",
    speakerBio:
      "Carolina Venosi è consulente per startup e imprenditrice, nata e cresciuta a Roma. Dopo dieci anni di lavoro in aziende e agenzie di comunicazione, ha fondato il brand Rome is More, nato sui social media nel 2018, che spiega in modo ironico e divertente il dialetto e la cultura romanesca e che oggi è una start-up in crescita con uno store fisico e un'agenzia creativa tutta al femminile. ",
  },
];

type Sponsor = {
  name: string;
  logo?: ImageSourcePropType;
  isLarge?: boolean;
};

const sponsors: Sponsor[] = [
  {
    name: "Unicredit",
    logo: require("./assets/sponsors/unicredit.jpg"),
    isLarge: true,
  },
  {
    name: "Autocentri Balduina",
    logo: require("./assets/sponsors/autocentri-2.png"),
    isLarge: true,
  },
  { name: "Pioda", logo: require("./assets/sponsors/pioda.png") },
  { name: "Tucano", logo: require("./assets/sponsors/tucano.png") }, // Testo (il file scaricato è .html)
  { name: "Famo Cose", logo: require("./assets/sponsors/FAMO COSE LOGO.png") }, // Testo (il file scaricato è .html)
  { name: "Dotcampus", logo: require("./assets/sponsors/dotcampus.png") },
  {
    name: "Hyper Foundry",
    logo: require("./assets/sponsors/Hyper-Foundry.png"),
  },
  {
    name: "Direzione Lavoro",
    logo: require("./assets/sponsors/direzione-lavoro.png"),
  },
  {
    name: "Big Jellyfish",
    logo: require("./assets/sponsors/bigjellyfish_colore.png"),
  },
  { name: "AVIS", logo: require("./assets/sponsors/Avis.png") },
  { name: "JESAP", logo: require("./assets/sponsors/JESAP.webp") },
  { name: "Thesis4U", logo: require("./assets/sponsors/Thesis4U.png") },
  { name: "VAF", logo: require("./assets/sponsors/VAF.png") },
  {
    name: "Il Parioli",
    logo: require("./assets/sponsors/IlParioli_ML_Pos_Nero SENZA SFONDO.png"),
  },
  {
    name: "Radio Sapienza",
    logo: require("./assets/sponsors/RadioSapienza.png"),
  },
  { name: "Underpark Radio", logo: require("./assets/sponsors/UPR.png") },
  { name: "Kortpress", logo: require("./assets/sponsors/Kortpress.png") },
  { name: "NAM", logo: require("./assets/sponsors/NAM.png") },
  { name: "Parlamento Europeo", logo: require("./assets/sponsors/PE.jpg") },
  {
    name: "Regione Lazio",
    logo: require("./assets/sponsors/RegioneLazio.webp"),
  },
  { name: "Commissione Europea", logo: require("./assets/sponsors/CE.webp") },
  { name: "CNEL", logo: require("./assets/sponsors/CNEL.jpg") },
  { name: "CNR", logo: require("./assets/sponsors/CNR.webp") },
  {
    name: "Città Metropolitana Roma Capitale",
    logo: require("./assets/sponsors/CMR.png"),
  },
  { name: "Roma", logo: require("./assets/sponsors/Roma2.png") },
  { name: "Inps", logo: require("./assets/sponsors/INPS.jpg") },
  { name: "UNPLI", logo: require("./assets/sponsors/unpli.png") },
];

type TabKey = "Guests" | "Sponsors" | "Live";
type AppView = "tabs" | "talkDetail";
// ─── Live API configuration ──────────────────────────────────────────────────
// The webapp fetches consumer tokens and session IDs from the backend proxy.
// No API_KEY is needed client-side.
const BACKEND_BASE_URL = "https://tedxsapienzau-hf-live.onrender.com";
const API_BASE_URL = "https://tedxapi.hyper-foundry.com";
const LIVE_CAPTION_INTERVAL_MS = 3000; // Buffer captions for 3 seconds before displaying
// ──────────────────────────────────────────────────────────────────────────────
const LYRICS_SLOT_HEIGHT = 150;
const brand = {
  black: "#050505",
  white: "#ffffff",
  ink: "#161616",
  purple: "#a578c3",
  green: "#88de86",
  peach: "#ffc299",
  pink: "#ef7fb0",
  blue: "#7acbee",
  yellow: "#fff4a4",
};
const serpentoniBackgrounds = [
  require("./assets/serpentoni-pink-green.png"),
  require("./assets/serpentoni-blue-yellow.png"),
  require("./assets/serpentoni-purple-peach.png"),
] satisfies ImageSourcePropType[];
const serpentoniDesktopBackgrounds = [
  require("./assets/serpentoni-desktop-pink-green.png"),
  require("./assets/serpentoni-desktop-blue-yellow.png"),
  require("./assets/serpentoni-desktop-purple-peach.png"),
] satisfies ImageSourcePropType[];
const eventLogo = require("./assets/logo_white.png");
type LiveCaptionState = {
  current: string;
  previous: string | null;
  incoming: string | null;
  history: string[];
};

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function PageLayout({
  children,
  backgroundSource = serpentoniBackgrounds[0],
  desktopBackgroundSource,
  showHeader = true,
}: {
  children: ReactNode;
  backgroundSource?: ImageSourcePropType;
  desktopBackgroundSource?: ImageSourcePropType;
  showHeader?: boolean;
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const resolvedBackgroundSource =
    isDesktop && desktopBackgroundSource
      ? desktopBackgroundSource
      : backgroundSource;

  return (
    <View style={styles.pageSurface}>
      <Image
        source={resolvedBackgroundSource}
        resizeMode="cover"
        style={styles.pageBackgroundImage}
      />
      <View style={styles.pageDimmer} />
      <SafeAreaView style={styles.screenSafeArea}>
        {showHeader ? (
          <View style={styles.topBrandBar}>
            <View style={styles.brandLockup}>
              <Image
                source={eventLogo}
                resizeMode="contain"
                style={styles.headerLogo}
              />
            </View>
          </View>
        ) : null}
        {children}
      </SafeAreaView>
    </View>
  );
}

function LoadingScreen({ onReady }: { onReady: () => void }) {
  const fullText = "Welcome to\nTEDxSapienzaU\n2026 !";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const typeTimer = setInterval(() => {
      index += 1;
      setDisplayText(fullText.slice(0, index));

      if (index >= fullText.length) {
        clearInterval(typeTimer);
        timers.push(
          setTimeout(() => {
            onReady();
          }, 1800),
        );
      }
    }, 42);

    return () => {
      clearInterval(typeTimer);
      timers.forEach(clearTimeout);
    };
  }, [fullText, onReady]);

  return (
    <PageLayout
      backgroundSource={serpentoniBackgrounds[2]}
      desktopBackgroundSource={serpentoniDesktopBackgrounds[2]}
      showHeader={false}
    >
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTypedText}>
          {displayText}
          {displayText.length < fullText.length ? "|" : ""}
        </Text>
      </View>
    </PageLayout>
  );
}

function TalksScreen({ onOpenLive }: { onOpenLive: (talk: Talk) => void }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const nowPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(nowPulse, {
          toValue: 1.1,
          duration: 720,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(nowPulse, {
          toValue: 1,
          duration: 720,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [nowPulse]);

  return (
    <PageLayout desktopBackgroundSource={serpentoniDesktopBackgrounds[0]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isDesktop && styles.scrollContainerDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Guests" subtitle="I protagonisti di questa edizione." />

        <View style={[styles.talksGrid, isDesktop && styles.talksGridDesktop]}>
          {talks.map((talk, index) => (
            <Pressable
              key={talk.id}
              style={[
                styles.talkCard,
                talk.time === "starting now" && styles.talkCardNow,
                isDesktop && styles.talkCardDesktop,
              ]}
              onPress={() => onOpenLive(talk)}
            >
              <Text
                style={styles.cardTitle}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.82}
              >
                {talk.title}
              </Text>
              <Text style={styles.cardSpeaker}>{talk.speaker}</Text>
              {talk.time === "starting now" ? (
                <Animated.View
                  style={[
                    styles.nowStatusRow,
                    { transform: [{ scale: nowPulse }] },
                  ]}
                >
                  <View style={styles.nowBadgeDot} />
                  <Text style={styles.cardTimeNow}>starting now</Text>
                </Animated.View>
              ) : (
                <Text style={styles.cardTime}>{talk.time}</Text>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </PageLayout>
  );
}
function SponsorsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <PageLayout
      backgroundSource={serpentoniBackgrounds[1]}
      desktopBackgroundSource={serpentoniDesktopBackgrounds[1]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isDesktop && styles.scrollContainerDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Sponsors"
          subtitle="Partners e patrocini che ci sostengono."
        />
        <View
          style={[styles.sponsorsGrid, isDesktop && styles.sponsorsGridDesktop]}
        >
          {sponsors.map((sponsor, index) => (
            <View
              key={sponsor.name}
              style={[
                styles.sponsorCard,
                isDesktop && styles.sponsorCardDesktop,
                // Logica per fare Unicredit e Balduina più grandi!
                sponsor.isLarge && {
                  width: isDesktop ? "48%" : "100%", // Più larghi
                  minHeight: isDesktop ? 180 : 150, // Più alti
                  borderColor: "rgba(255,255,255,0.7)", // Bordo più luminoso
                },
              ]}
            >
              {sponsor.logo ? (
                <Image
                  source={sponsor.logo}
                  style={{ width: "80%", height: "80%", resizeMode: "contain" }}
                />
              ) : (
                <Text style={styles.sponsorText}>{sponsor.name}</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </PageLayout>
  );
}

function LiveTranscriptPanel({
  currentCaption,
  incomingCaption,
  history,
  colorAnim,
}: {
  currentCaption: string;
  incomingCaption: string | null;
  history: string[];
  colorAnim: Animated.Value;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const transitioning = Boolean(incomingCaption);
  const currentToGrayColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [brand.white, "rgba(255,255,255,0.5)"],
  });

  // Auto-scroll to bottom when new content arrives, unless user is reading history
  useEffect(() => {
    if (!isUserScrolling.current) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [currentCaption, incomingCaption, history.length]);

  const handleScrollBeginDrag = () => {
    isUserScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
  };

  const handleScrollEndDrag = () => {
    // Resume auto-scroll after 5 seconds of inactivity
    scrollTimeout.current = setTimeout(() => {
      isUserScrolling.current = false;
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 5000);
  };

  return (
    <View style={styles.captionCard}>
      <ScrollView
        ref={scrollRef}
        style={styles.transcriptScroll}
        contentContainerStyle={styles.transcriptContent}
        showsVerticalScrollIndicator={true}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
      >
        {/* All past captions */}
        {history.map((line, i) => (
          <Text key={i} style={styles.transcriptHistoryLine}>
            {line}
          </Text>
        ))}

        {/* Current caption — fades to gray when a new one arrives */}
        {transitioning ? (
          <Animated.Text
            style={[
              styles.transcriptCurrentLine,
              { color: currentToGrayColor },
            ]}
          >
            {currentCaption}
          </Animated.Text>
        ) : (
          <Text style={styles.transcriptCurrentLine}>{currentCaption}</Text>
        )}

        {/* Incoming caption (appears below current) */}
        {transitioning && incomingCaption ? (
          <Text style={styles.transcriptCurrentLine}>{incomingCaption}</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

function TalkDetailScreen({
  talk,
  onBack,
}: {
  talk: Talk;
  onBack: () => void;
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <PageLayout desktopBackgroundSource={serpentoniDesktopBackgrounds[0]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isDesktop && styles.scrollContainerDesktopNarrow,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={16} color={brand.white} />
          <Text style={styles.backButtonText}>Back to guests</Text>
        </Pressable>

        <SectionHeader title={talk.title} subtitle={talk.speaker} />

        {/* <View style={styles.liveImageWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.liveImage}
          />
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View> */}

        <View style={styles.detailCard}>
          <Text style={styles.detailCardTitle}>Bio</Text>
          <Text style={styles.detailCardText}>{talk.speakerBio}</Text>
        </View>
      </ScrollView>
    </PageLayout>
  );
}

function LivePageScreen({
  talk,
  currentCaption,
  incomingCaption,
  captionHistory,
  colorAnim,
}: {
  talk: Talk;
  currentCaption: string;
  incomingCaption: string | null;
  captionHistory: string[];
  colorAnim: Animated.Value;
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [showInfoPopup, setShowInfoPopup] = useState(() => {
    try {
      return localStorage.getItem("tedx_live_popup_dismissed") !== "true";
    } catch {
      return true;
    }
  });

  const dismissPopup = useCallback(() => {
    setShowInfoPopup(false);
    try {
      localStorage.setItem("tedx_live_popup_dismissed", "true");
    } catch {
      // ignore
    }
  }, []);

  return (
    <PageLayout
      backgroundSource={serpentoniBackgrounds[2]}
      desktopBackgroundSource={serpentoniDesktopBackgrounds[2]}
    >
      <View
        style={[
          styles.liveContainer,
          isDesktop && styles.scrollContainerDesktopNarrow,
        ]}
      >
        <SectionHeader
          title="Live"
          subtitle="Segui in tempo reale la traduzione del talk."
        />
        <LiveTranscriptPanel
          currentCaption={currentCaption}
          incomingCaption={incomingCaption}
          history={captionHistory}
          colorAnim={colorAnim}
        />
      </View>

      <Modal
        visible={showInfoPopup}
        transparent
        animationType="fade"
        onRequestClose={dismissPopup}
      >
        <View style={styles.infoPopupOverlay}>
          <View style={[styles.infoPopupCard, isDesktop && styles.infoPopupCardDesktop]}>
            <Text style={styles.infoPopupTitle}>🎙️ Live</Text>
            <Text style={styles.infoPopupText}>
              Qui puoi seguire in tempo reale la traduzione di ciò che viene detto sul palco.
            </Text>
            <Text style={styles.infoPopupText}>
              Il testo apparirà automaticamente e si aggiornerà ogni pochi secondi. Puoi rileggere il testo precedente scorrendo il testo.
            </Text>
            <Text style={styles.infoPopupText}>
              Resta su questa pagina per non perdere nulla!
            </Text>
            <Pressable
              style={styles.infoPopupButton}
              onPress={dismissPopup}
            >
              <Text style={styles.infoPopupButtonText}>OK!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </PageLayout>
  );
}

function LiquidGlassTabBar({
  tabs,
  activeTab,
  onTabPress,
  interactive = true,
}: {
  tabs: Array<{ key: TabKey; icon: keyof typeof Ionicons.glyphMap }>;
  activeTab: TabKey;
  onTabPress?: (tab: TabKey) => void;
  interactive?: boolean;
}) {
  const [tabLayouts, setTabLayouts] = useState<Record<string, { x: number; width: number }>>({});
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const hasInitialized = useRef(false);

  useEffect(() => {
    const layout = tabLayouts[activeTab];
    if (!layout) return;

    if (!hasInitialized.current) {
      // First render: set position immediately without animation
      indicatorX.setValue(layout.x);
      indicatorWidth.setValue(layout.width);
      hasInitialized.current = true;
      // Fade in the indicator
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();
      return;
    }

    // Animate the glass blob to the new position
    Animated.parallel([
      Animated.spring(indicatorX, {
        toValue: layout.x,
        damping: 18,
        stiffness: 180,
        mass: 0.8,
        useNativeDriver: false,
      }),
      Animated.spring(indicatorWidth, {
        toValue: layout.width,
        damping: 18,
        stiffness: 180,
        mass: 0.8,
        useNativeDriver: false,
      }),
    ]).start();
  }, [activeTab, indicatorX, indicatorWidth, glowOpacity, tabLayouts]);

  const pair = tabColorPairs[activeTab];

  return (
    <View style={styles.tabBar}>
      {/* Bar glass inner border */}
      <View pointerEvents="none" style={styles.tabBarGlassBorder} />
      {/* Bar top shine reflection */}
      <View pointerEvents="none" style={styles.tabBarGlassShine} />
      {/* Liquid glass sliding indicator */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.liquidGlassIndicator,
          {
            left: indicatorX,
            width: indicatorWidth,
            opacity: glowOpacity,
            backgroundColor: pair.bg,
          },
        ]}
      >
        {/* Inner glow layer */}
        <View style={styles.liquidGlassInnerGlow} />
        {/* Top shine reflection */}
        <View style={styles.liquidGlassShine} />
      </Animated.View>

      {/* Tab buttons */}
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const color = isActive ? brand.black : brand.white;
        const ButtonComponent = interactive ? Pressable : View;
        return (
          <ButtonComponent
            key={tab.key}
            style={[
              styles.tabButton,
              isActive && styles.tabButtonActive,
            ]}
            onLayout={(e: { nativeEvent: { layout: { x: number; width: number } } }) => {
              const { x, width } = e.nativeEvent.layout;
              setTabLayouts((prev) => {
                if (prev[tab.key]?.x === x && prev[tab.key]?.width === width) return prev;
                return { ...prev, [tab.key]: { x, width } };
              });
            }}
            {...(interactive && onTabPress ? { onPress: () => onTabPress(tab.key) } : {})}
          >
            <View style={styles.tabIconBadge}>
              <Ionicons name={tab.icon} size={17} color={color} />
            </View>
            <Text style={[styles.tabLabel, { color }]}>
              {tab.key}
            </Text>
          </ButtonComponent>
        );
      })}
    </View>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("Guests");
  const [view, setView] = useState<AppView>("tabs");
  const [selectedTalk, setSelectedTalk] = useState<Talk>(talks[0]);
  const [liveCaptions, setLiveCaptions] = useState<LiveCaptionState>({
    current: "In attesa della trascrizione live\u2026",
    previous: null,
    incoming: null,
    history: [],
  });

  const transitionAnim = useState(new Animated.Value(0))[0];
  const colorAnim = useState(new Animated.Value(0))[0];
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const introOpacity = useRef(new Animated.Value(1)).current;
  const appIntroOpacity = useRef(new Animated.Value(0)).current;
  const isAnimatingCaptionRef = useRef(false);
  const queuedCaptionRef = useRef<string | null>(null);

  const finishIntro = useCallback(() => {
    Animated.parallel([
      Animated.timing(introOpacity, {
        toValue: 0,
        duration: 850,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(appIntroOpacity, {
        toValue: 1,
        duration: 850,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLoading(false);
      introOpacity.setValue(1);
      appIntroOpacity.setValue(0);
    });
  }, [appIntroOpacity, introOpacity]);

  const transitionScreen = useCallback(
    (updateScreen: () => void) => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 160,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        updateScreen();
        Animated.timing(screenOpacity, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      });
    },
    [screenOpacity],
  );

  const navigateToTab = useCallback(
    (tab: TabKey) => {
      if (view === "tabs" && activeTab === tab) {
        return;
      }
      transitionScreen(() => {
        setView("tabs");
        setActiveTab(tab);
      });
    },
    [activeTab, transitionScreen, view],
  );

  const openTalkDetail = useCallback(
    (talk: Talk) => {
      transitionScreen(() => {
        setSelectedTalk(talk);
        setView("talkDetail");
      });
    },
    [transitionScreen],
  );

  const goBackToTalks = useCallback(() => {
    transitionScreen(() => {
      setView("tabs");
      setActiveTab("Guests");
    });
  }, [transitionScreen]);

  useEffect(() => {
    const animateToCaption = (incomingText: string) => {
      if (isAnimatingCaptionRef.current) {
        queuedCaptionRef.current = incomingText;
        return;
      }

      isAnimatingCaptionRef.current = true;
      setLiveCaptions((prev) => {
        if (incomingText === prev.current) {
          isAnimatingCaptionRef.current = false;
          return prev;
        }
        return { ...prev, incoming: incomingText };
      });

      transitionAnim.setValue(0);
      colorAnim.setValue(0);
      Animated.parallel([
        Animated.timing(transitionAnim, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start(() => {
        setLiveCaptions((prev) => {
          if (!prev.incoming) {
            return prev;
          }
          return {
            previous: prev.current,
            current: prev.incoming,
            incoming: null,
            history: [...prev.history, prev.current],
          };
        });
        transitionAnim.setValue(0);
        colorAnim.setValue(0);
        isAnimatingCaptionRef.current = false;

        if (queuedCaptionRef.current) {
          const nextText = queuedCaptionRef.current;
          queuedCaptionRef.current = null;
          animateToCaption(nextText);
        }
      });
    };

    const stopConsumer = startLiveConsumer((incomingText) => {
      animateToCaption(incomingText);
    });
    return stopConsumer;
  }, [transitionAnim, colorAnim]);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      let color = brand.black;
      if (isLoading) {
        color = "#63437a";
      } else {
        if (activeTab === "Guests") color = "#9d4172";
        else if (activeTab === "Sponsors") color = "#4c8597";
        else if (activeTab === "Live") color = "#63437a";
      }

      document.body.style.backgroundColor = color;
      const metaThemeColor = document.querySelector("meta[name='theme-color']");
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", color);
      }
    }
  }, [activeTab, view, isLoading]);

  const tabs: Array<{ key: TabKey; icon: keyof typeof Ionicons.glyphMap }> = [
    { key: "Guests", icon: "mic" },
    { key: "Sponsors", icon: "ribbon" },
    { key: "Live", icon: "radio" },
  ];

  const tabScreen = useMemo(() => {
    if (activeTab === "Sponsors") {
      return <SponsorsScreen />;
    }
    if (activeTab === "Live") {
      return (
        <LivePageScreen
          talk={talks[1]}
          currentCaption={liveCaptions.current}
          incomingCaption={liveCaptions.incoming}
          captionHistory={liveCaptions.history}
          colorAnim={colorAnim}
        />
      );
    }
    return <TalksScreen onOpenLive={openTalkDetail} />;
  }, [
    activeTab,
    liveCaptions.current,
    liveCaptions.incoming,
    liveCaptions.history,
    colorAnim,
    openTalkDetail,
  ]);

  return (
    <View style={styles.appRoot}>
      <StatusBar style="light" />
      <View style={styles.appFrame}>
        {isLoading ? (
          <>
            <Animated.View
              style={[
                styles.screenTransition,
                styles.introAppPreview,
                { opacity: appIntroOpacity },
              ]}
            >
              <TalksScreen onOpenLive={openTalkDetail} />
              <SafeAreaView style={styles.tabBarSafeArea}>
                <LiquidGlassTabBar
                  tabs={tabs}
                  activeTab="Guests"
                  interactive={false}
                />
              </SafeAreaView>
            </Animated.View>
            <Animated.View
              pointerEvents="none"
              style={[styles.introOverlay, { opacity: introOpacity }]}
            >
              <LoadingScreen onReady={finishIntro} />
            </Animated.View>
          </>
        ) : view === "talkDetail" ? (
          <Animated.View
            style={[styles.screenTransition, { opacity: screenOpacity }]}
          >
            <TalkDetailScreen talk={selectedTalk} onBack={goBackToTalks} />
          </Animated.View>
        ) : (
          <>
            <Animated.View
              style={[styles.screenTransition, { opacity: screenOpacity }]}
            >
              {tabScreen}
            </Animated.View>
            <SafeAreaView style={styles.tabBarSafeArea}>
              <LiquidGlassTabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabPress={navigateToTab}
              />
            </SafeAreaView>
          </>
        )}
      </View>
    </View>
  );
}

const tabColorPairs: Record<TabKey, { bg: string; active: string }> = {
  Guests: { bg: brand.green, active: brand.pink },
  Sponsors: { bg: brand.blue, active: brand.yellow },
  Live: { bg: brand.peach, active: brand.purple },
};

/**
 * Fetches a consumer token and session ID from the backend proxy, then opens
 * the events WebSocket and forwards translated text to the onText callback.
 *
 * Text is buffered for LIVE_CAPTION_INTERVAL_MS (3 s) before being flushed
 * to the UI, matching the serverTest.js behaviour.
 *
 * The returned function tears down the connection (safe to call multiple times).
 */
function startLiveConsumer(onText: (text: string) => void): () => void {
  let socket: WebSocket | null = null;
  let stopped = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let flushTimer: ReturnType<typeof setInterval> | null = null;
  let sessionCheckTimer: ReturnType<typeof setInterval> | null = null; // 👈 Nuova variabile
  let textBuffer = "";

  async function connect() {
    if (stopped) return;

    // ── 1. Obtain consumer token + session ID from the backend ───────────────
    let consumerToken: string;
    let sessionId: string;
    try {
      const tokenRes = await fetch(`${BACKEND_BASE_URL}/consumer-token`);
      if (!tokenRes.ok)
        throw new Error(`consumer-token HTTP ${tokenRes.status}`);
      const tokenData = await tokenRes.json();
      consumerToken = tokenData.consumer_token;

      const sessionRes = await fetch(`${BACKEND_BASE_URL}/session-id`);
      if (!sessionRes.ok)
        throw new Error(`session-id HTTP ${sessionRes.status}`);
      const sessionData = await sessionRes.json();
      sessionId = sessionData.session_id;

      if (!consumerToken || !sessionId) {
        throw new Error("Missing consumerToken or sessionId from backend");
      }
      console.log(`[LiveWS] Token ottenuto per la sessione: ${sessionId}`);
    } catch (err) {
      console.error("[LiveWS] Errore nel recupero del token dal backend:", err);
      if (!stopped) {
        reconnectTimer = setTimeout(connect, 8000);
      }
      return;
    }

    if (stopped) return;

    // ── 2. Open the events WebSocket ─────────────────────────────────────────
    const wsBaseUrl = API_BASE_URL.replace(/^http/, "ws");
    const wsUrl = `${wsBaseUrl}/v1/live-sessions/${sessionId}/events?token=${encodeURIComponent(consumerToken)}`;
    socket = new WebSocket(wsUrl);

    sessionCheckTimer = setInterval(async () => {
      try {
        const checkRes = await fetch(`${BACKEND_BASE_URL}/session-id`);
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          // Se l'ID remoto è diverso da quello a cui siamo connessi...
          if (checkData.session_id && checkData.session_id !== sessionId) {
            console.log("🔄 La regia ha cambiato lingua! Riconnessione in corso...");
            clearInterval(sessionCheckTimer!);
            if (socket) socket.close(); // 👈 Forzare la chiusura fa ripartire connect() automaticamente!
          }
        }
      } catch (err) {
        // Ignora errori di rete temporanei
      }
    }, 5000);
    // 🟢 FINE BLOCCO

    socket.onopen = () => {
      console.log("[LiveWS] Connesso allo stream di traduzioni.");

      // Flush the text buffer to the UI every LIVE_CAPTION_INTERVAL_MS
      flushTimer = setInterval(() => {
        const trimmed = textBuffer.trim();
        if (trimmed.length > 0) {
          console.log(`[LiveWS] Flush buffer → "${trimmed}"`);
          onText(trimmed);
          textBuffer = "";
        }
      }, LIVE_CAPTION_INTERVAL_MS);
    };

    socket.onmessage = (event) => {
      try {
        const raw =
          typeof event.data === "string" ? event.data : String(event.data);
        const msg = JSON.parse(raw) as {
          event?: string;
          status?: string;
          translated_text?: string;
          source_text?: string;
        };

        // Only handle translation_final events — skip ping/pong and everything else
        if (msg.event !== "translation_final") return;

        const status = msg.status ?? "ok";

        if (status === "translation_error") return; // skip errors silently

        // 'ok': use translated_text
        // 'source_already_target': the spoken language matches target → use source_text
        const text =
          status === "source_already_target"
            ? (msg.source_text ?? "")
            : (msg.translated_text ?? "");

        if (text) {
          textBuffer += text + " ";
        }
      } catch (parseErr) {
        console.warn("[LiveWS] Errore nel parsing del messaggio:", parseErr);
      }
    };

    socket.onerror = (errorEvent) => {
      console.error("[LiveWS] Errore WebSocket:", errorEvent);
    };

    socket.onclose = (closeEvent) => {
      console.log(`[LiveWS] Connessione chiusa (code ${closeEvent.code}). Riconnessione in 5s…`);
      socket = null;
      if (flushTimer !== null) clearInterval(flushTimer);
      if (sessionCheckTimer !== null) clearInterval(sessionCheckTimer); // 👈 Puliamo il radar

      if (!stopped) {
        reconnectTimer = setTimeout(connect, 5000);
      }
    };
  }

  connect();

  // Return a teardown function
  return () => {
    stopped = true;
    if (reconnectTimer !== null) clearTimeout(reconnectTimer);
    if (flushTimer !== null) clearInterval(flushTimer);
    if (sessionCheckTimer !== null) clearInterval(sessionCheckTimer); // 👈 Puliamo il radar
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      socket.close();
    }
  };
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: "#202020",
  },
  appFrame: {
    flex: 1,
    width: "100%",
    backgroundColor: brand.black,
    overflow: "hidden",
  },
  screenTransition: { flex: 1 },
  introAppPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  introOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  pageSurface: {
    flex: 1,
    backgroundColor: brand.black,
    overflow: "hidden",
  },
  pageBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  pageDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.34)",
  },
  screenSafeArea: { flex: 1 },
  topBrandBar: {
    minHeight: 58,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderBottomColor: "rgba(255,255,255,0.14)",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  brandLockup: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  headerLogo: {
    width: 174,
    height: 28,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 38,
  },
  welcomeTitle: {
    color: brand.black,
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
  },
  welcomeMain: {
    color: brand.white,
    fontSize: 28,
    lineHeight: 31,
    fontWeight: "900",
    textAlign: "center",
  },
  welcomeYear: {
    color: brand.white,
    fontSize: 30,
    lineHeight: 33,
    fontWeight: "900",
    textAlign: "center",
  },
  welcomeTypedText: {
    color: brand.white,
    fontSize: 31,
    lineHeight: 34,
    fontWeight: "900",
    textAlign: "center",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 116,
  },
  scrollContainerDesktop: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    paddingHorizontal: 40,
    paddingTop: 72,
  },
  scrollContainerDesktopNarrow: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: 40,
    paddingTop: 72,
  },
  sectionHeader: {
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    color: brand.white,
    fontSize: 48,
    lineHeight: 52,
    fontWeight: "900",
    textAlign: "center",
  },
  sectionSubtitle: {
    color: brand.white,
    marginTop: 5,
    marginBottom: 18,
    fontSize: 12,
    lineHeight: 15,
    maxWidth: 260,
    alignSelf: "center",
    textAlign: "center",
  },
  talksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  talksGridDesktop: {
    gap: 18,
  },
  talkCard: {
    width: "47%",
    minHeight: 142,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.36)",
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  talkCardNow: {
    borderColor: "rgba(255,255,255,0.82)",
    backgroundColor: "rgba(136,222,134,0.34)",
    shadowOpacity: 0.42,
    shadowRadius: 24,
  },
  talkCardDesktop: {
    width: "31.5%",
    minHeight: 176,
    padding: 18,
  },
  cardColorBlock: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: brand.black,
  },
  cardTitle: {
    color: brand.white,
    fontWeight: "900",
    fontSize: 18,
    lineHeight: 20,
  },
  cardSpeaker: {
    color: brand.white,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
    marginTop: 5,
  },
  cardTime: {
    color: brand.white,
    marginTop: "auto",
    fontSize: 10,
    paddingTop: 10,
    fontWeight: "700",
  },
  nowStatusRow: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: 10,
  },
  cardTimeNow: {
    color: brand.white,
    fontSize: 11,
    fontWeight: "900",
  },
  nowBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#ff2e3f",
  },
  previousButton: {
    marginTop: 18,
    alignSelf: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  previousButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  backButton: {
    marginBottom: 16,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.36)",
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backButtonText: { color: brand.white, fontSize: 12, fontWeight: "900" },
  liveImageWrap: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  liveImage: { width: "100%", aspectRatio: 1.8 },
  liveBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#ff2e3f",
  },
  liveText: { color: "#ffffff", fontSize: 20, fontWeight: "700" },
  captionCard: {
    borderRadius: 22,
    width: "100%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.38)",
    backgroundColor: "rgba(255,255,255,0.22)",
    padding: 16,
    flex: 1,
    overflow: "hidden",
  },
  liveContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },
  transcriptScroll: {
    flex: 1,
  },
  transcriptContent: {
    paddingBottom: 12,
  },
  transcriptHistoryLine: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 6,
  },
  transcriptCurrentLine: {
    color: brand.white,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 6,
  },
  detailCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.38)",
    backgroundColor: "rgba(255,255,255,0.22)",
    padding: 20,
  },
  detailCardTitle: {
    color: brand.white,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 6,
  },
  detailCardText: {
    color: brand.white,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  profileLinkButton: {
    alignSelf: "flex-start",
    marginTop: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.36)",
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  profileLinkText: {
    color: brand.white,
    fontSize: 12,
    fontWeight: "900",
  },

  sponsorsGrid: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  sponsorsGridDesktop: {
    gap: 18,
  },
  sponsorCard: {
    width: "47%",
    height: 100,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.36)",
    backgroundColor: brand.white,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  sponsorCardDesktop: {
    width: "31.5%",
    height: 130,
  },
  sponsorDot: {},
  sponsorText: { color: brand.black, fontSize: 20, fontWeight: "900" },
  tabBarSafeArea: {
    backgroundColor: "transparent",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBar: {
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(0,0,0,0.35)",
    // @ts-ignore — web-only backdropFilter
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    minHeight: 76,
    marginHorizontal: 14,
    marginBottom: 10,
    borderRadius: 22,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    alignItems: "center" as const,
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    minWidth: 78,
    minHeight: 54,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tabButtonActive: {
    paddingHorizontal: 22,
  },
  tabBarGlassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    // subtle inner highlight on top edge
    borderTopColor: "rgba(255,255,255,0.22)",
  },
  tabBarGlassShine: {
    position: "absolute",
    top: 0,
    left: "15%",
    right: "15%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
  },
  liquidGlassIndicator: {
    position: "absolute",
    top: 6,
    bottom: 6,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#ffffff",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  liquidGlassInnerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  liquidGlassShine: {
    position: "absolute",
    top: 0,
    left: "10%",
    right: "10%",
    height: "45%",
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  tabIconBadge: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: { fontWeight: "900", fontSize: 12 },

  infoPopupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.60)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  infoPopupCard: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(30,20,45,0.92)",
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
  },
  infoPopupCardDesktop: {
    maxWidth: 440,
    padding: 30,
  },
  infoPopupTitle: {
    color: brand.white,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
  },
  infoPopupText: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 10,
  },
  infoPopupButton: {
    marginTop: 14,
    borderRadius: 999,
    backgroundColor: brand.peach,
    paddingHorizontal: 40,
    paddingVertical: 13,
    shadowColor: brand.peach,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  infoPopupButtonText: {
    color: brand.black,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
