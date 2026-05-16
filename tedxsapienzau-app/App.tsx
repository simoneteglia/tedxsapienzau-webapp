import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Easing,
  Image,
  Linking,
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
  description: string;
  speakerBio: string;
  lastCaption: string;
  link?: string;
};

const talks: Talk[] = [
  {
    id: "1",
    title: "Aurora Ruffino",
    speaker: "Attrice, scrittrice e ricercatrice filosofica",
    time: "Speaker",
    description: "Attrice, scrittrice e ricercatrice filosofica.",
    speakerBio:
      "Aurora Ruffino debutta con La solitudine dei numeri primi di Saverio Costanzo. Diplomata al Centro Sperimentale di Cinematografia, recita in Bianca come il latte, rossa come il sangue ed in Braccialetti Rossi. E la sirena di Ninyo di Gabriele Mainetti e protagonista di Noi. Esordisce nel 2024 con il primo romanzo Volevo salvare i colori. Sara Santa Lucia nella prossima produzione di Martin Scorsese.",
    lastCaption:
      "Aurora Ruffino debutta con La solitudine dei numeri primi.",
  },
  {
    id: "2",
    title: "Giuliana Mazzoni",
    speaker:
      "Professore Ordinario di Psicologia in quiescenza, Sapienza Universita di Roma",
    time: "Speaker",
    description:
      "Professore Ordinario di Psicologia in quiescenza, Sapienza Universita di Roma.",
    speakerBio:
      "Giuliana Mazzoni e nota a livello internazionale per i suoi lavori sulla memoria umana, e in particolare la memoria di avvenimenti personali. Il suo lavoro sulla relazione tra memoria e testimonianza, le potenziali fallacie e le corrette metodologie di ascolto, ha avuto un'importante influenza sul mondo del diritto, soprattutto nei paesi di lingua spagnola e in Italia.",
    lastCaption:
      "La memoria umana e al centro del lavoro di Giuliana Mazzoni.",
  },
  {
    id: "3",
    title: "Lorenzo Zazzeri",
    speaker: "Atleta professionista",
    time: "Speaker",
    description: "Atleta professionista.",
    speakerBio:
      "Lorenzo Zazzeri, nato a Firenze nel 1994, e l'attuale Capitano della Nazionale Italiana di Nuoto. Oltre agli straordinari successi sportivi, ha conseguito con lode la laurea in Scienze Motorie, Sport e Salute e il premio da parte del CONI come \"Atleta Eccellente/Eccellente Studente\" nel 2023. E attualmente iscritto al terzo anno di Belle Arti all'indirizzo \"Arti Visive\" e conduce il Podcast Sportiva-Mente.",
    lastCaption:
      "Sport, studio e arti visive si incontrano nel percorso di Lorenzo Zazzeri.",
    link: "https://www.linkedin.com/in/lorenzo-zazzeri-oly-148b5b292/",
  },
  {
    id: "4",
    title: "Alessandra Amato & Claudio Cocino",
    speaker:
      "Etoile e Primo Ballerino del corpo di ballo del Teatro dell'Opera di Roma",
    time: "Artists",
    description:
      "Etoile e Primo Ballerino del corpo di ballo del Teatro dell'Opera di Roma.",
    speakerBio:
      "Alessandra Amato e Etoile del Teatro dell'Opera di Roma dal 2016, nominata in seguito ad uno spettacolo de Il lago dei cigni. Consolida negli anni la sua partnership con Claudio Cocino, Primo Ballerino del Teatro dell'Opera di Roma dal 2017, nominato in seguito al balletto La bella addormentata. Nelle loro carriere interpretano i ruoli principali nei piu importanti balletti del repertorio classico e del repertorio dei maggiori coreografi del '900 e contemporanei.",
    lastCaption:
      "Alessandra Amato e Claudio Cocino portano in scena il linguaggio della danza.",
  },
  {
    id: "5",
    title: "Cristina Simone",
    speaker:
      "Professore Ordinario di Economia e Gestione delle Imprese, Sapienza Universita di Roma",
    time: "Speaker",
    description:
      "Professore Ordinario di Economia e Gestione delle Imprese, Sapienza Universita di Roma.",
    speakerBio:
      "Cristina Simone e un professore ordinario di Economia e Gestione delle Imprese alla Sapienza, dove coordina il PhD in Management, Banking e Commodity Science. Supervisiona il progetto Horizon MSCA-GeoPlaReg. Si occupa di management strategico, sistemi complessi, capitalismo digitale e rapporti impresa-territorio. E Visiting Professor all'ITBA in Argentina.",
    lastCaption:
      "Cristina Simone studia management strategico, sistemi complessi e capitalismo digitale.",
  },
  {
    id: "6",
    title: "Stefano Magno",
    speaker: "Chirurgo Senologo",
    time: "Speaker",
    description: "Chirurgo Senologo.",
    speakerBio:
      "Stefano Magno e un chirurgo senologo e Direttore dell'Unita Operativa Semplice di Terapie Integrate in Senologia presso la Breast Unit della Fondazione Policlinico Gemelli di Roma. E inoltre coordinatore scientifico del Master di I livello in \"Terapie Integrate nelle patologie oncologiche femminili\" e ricopre il ruolo di segretario del Centro di Ricerca e Formazione nelle terapie integrate nelle neoplasie mammarie presso l'Universita Cattolica del Sacro Cuore.",
    lastCaption:
      "Stefano Magno lavora sulle terapie integrate in senologia.",
    link: "https://www.linkedin.com/in/stefano-magno-3b1b03a6/",
  },
  {
    id: "7",
    title: "Guido Chiefalo",
    speaker: "Designer e Professore",
    time: "Speaker",
    description: "Designer e Professore.",
    speakerBio:
      "Guido Chiefalo e un designer nato a Roma nel 1986, opera nel campo della comunicazione visiva e della brand strategy. Attualmente ricopre il ruolo di Art Director alla FAO, Nazioni Unite, ed insegna \"Brand Design\" alla Sapienza Universita di Roma, DCVM. Ha lavorato tra Milano, Londra e Roma, collaborando con agenzie come INAREA, McCann, Slamp e Soda Studio.",
    lastCaption:
      "Guido Chiefalo lavora tra comunicazione visiva e brand strategy.",
    link: "https://www.guifol.com",
  },
];

type Sponsor = {
  name: string;
  logo?: ImageSourcePropType;
  isLarge?: boolean;
};

const sponsors: Sponsor[] = [
  { name: "Unicredit", logo: require("./assets/sponsors/unicredit.jpg"), isLarge: true },
  { name: "Autocentri Balduina", logo: require("./assets/sponsors/autocentri-2.png"), isLarge: true },
  { name: "Hyper Foundry", logo: require("./assets/sponsors/Hyper-Foundry.png") },
  { name: "Direzione Lavoro", logo: require("./assets/sponsors/direzione-lavoro.png") },
  { name: "Dotcampus", logo: require("./assets/sponsors/dotcampus.png") },
  { name: "Pioda", logo: require("./assets/sponsors/pioda.png") },
  { name: "Il Parioli", logo: require("./assets/sponsors/IlParioli_ML_Pos_Nero SENZA SFONDO.png") },
  { name: "Tucano", logo: require("./assets/sponsors/tucano.png") }, // Testo (il file scaricato è .html)
  { name: "Famo Cose", logo: require("./assets/sponsors/FAMO COSE LOGO.png") } // Testo (il file scaricato è .html)
];

type TabKey = "Talks" | "Sponsors" | "Live";
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
        <SectionHeader title="Talks" subtitle="" />

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
          subtitle="Partners and brands supporting TEDxSapienzaU."
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
                  minHeight: isDesktop ? 180 : 150,  // Più alti
                  borderColor: "rgba(255,255,255,0.7)", // Bordo più luminoso
                }
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
          <Animated.Text style={[styles.transcriptCurrentLine, { color: currentToGrayColor }]}>
            {currentCaption}
          </Animated.Text>
        ) : (
          <Text style={styles.transcriptCurrentLine}>
            {currentCaption}
          </Text>
        )}

        {/* Incoming caption (appears below current) */}
        {transitioning && incomingCaption ? (
          <Text style={styles.transcriptCurrentLine}>
            {incomingCaption}
          </Text>
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
          <Text style={styles.backButtonText}>Back to talks</Text>
        </Pressable>

        <SectionHeader title={talk.title} subtitle={talk.description} />

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
          <Text style={styles.detailCardTitle}>Profilo</Text>
          <Text style={styles.detailCardText}>{talk.description}</Text>
          <Text style={styles.detailCardTitle}>Bio</Text>
          <Text style={styles.detailCardText}>{talk.speakerBio}</Text>
          {talk.link ? (
            <Pressable
              style={styles.profileLinkButton}
              onPress={() => Linking.openURL(talk.link as string)}
            >
              <Ionicons name="open-outline" size={16} color={brand.white} />
              <Text style={styles.profileLinkText}>Link pubblico</Text>
            </Pressable>
          ) : null}
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
          subtitle={`Now on stage: ${talk.title}`}
        />
        <LiveTranscriptPanel
          currentCaption={currentCaption}
          incomingCaption={incomingCaption}
          history={captionHistory}
          colorAnim={colorAnim}
        />
      </View>
    </PageLayout>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("Talks");
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
      setActiveTab("Talks");
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
      if (activeTab === "Talks") color = brand.green;
      else if (activeTab === "Sponsors") color = brand.blue;
      else if (activeTab === "Live") color = brand.peach;

      document.body.style.backgroundColor = color;
      const metaThemeColor = document.querySelector("meta[name='theme-color']");
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", color);
      }
    }
  }, [activeTab, view]);

  const tabs: Array<{ key: TabKey; icon: keyof typeof Ionicons.glyphMap }> = [
    { key: "Talks", icon: "mic" },
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
                <View style={styles.tabBar}>
                  {tabs.map((tab) => {
                    const isActive = tab.key === "Talks";
                    const pair = tabColorPairs[tab.key];
                    const color = brand.white;
                    return (
                      <View
                        key={tab.key}
                        style={[
                          styles.tabButton,
                          isActive && styles.tabButtonActive,
                          isActive && { backgroundColor: pair.bg },
                        ]}
                      >
                        <View
                          style={[
                            styles.tabIconBadge,
                          ]}
                        >
                          <Ionicons name={tab.icon} size={17} color={color} />
                        </View>
                        <Text style={[styles.tabLabel, { color }]}>
                          {tab.key}
                        </Text>
                      </View>
                    );
                  })}
                </View>
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
              <View style={styles.tabBar}>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  const pair = tabColorPairs[tab.key];
                  const color = brand.white;
                  return (
                    <Pressable
                      key={tab.key}
                      style={[
                        styles.tabButton,
                        isActive && styles.tabButtonActive,
                        isActive && { backgroundColor: pair.bg },
                      ]}
                      onPress={() => navigateToTab(tab.key)}
                    >
                      <View
                        style={[
                          styles.tabIconBadge,
                        ]}
                      >
                        <Ionicons name={tab.icon} size={17} color={color} />
                      </View>
                      <Text style={[styles.tabLabel, { color }]}>
                        {tab.key}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </SafeAreaView>
          </>
        )}
      </View>
    </View>
  );
}

const tabColorPairs: Record<TabKey, { bg: string; active: string }> = {
  Talks: { bg: brand.green, active: brand.pink },
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
  let textBuffer = "";

  async function connect() {
    if (stopped) return;

    // ── 1. Obtain consumer token + session ID from the backend ───────────────
    let consumerToken: string;
    let sessionId: string;
    try {
      const tokenRes = await fetch(`${BACKEND_BASE_URL}/consumer-token`);
      if (!tokenRes.ok) throw new Error(`consumer-token HTTP ${tokenRes.status}`);
      const tokenData = await tokenRes.json();
      consumerToken = tokenData.consumer_token;

      const sessionRes = await fetch(`${BACKEND_BASE_URL}/session-id`);
      if (!sessionRes.ok) throw new Error(`session-id HTTP ${sessionRes.status}`);
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
      console.log(
        `[LiveWS] Connessione chiusa (code ${closeEvent.code}). Riconnessione in 5s…`,
      );
      socket = null;
      if (flushTimer !== null) {
        clearInterval(flushTimer);
        flushTimer = null;
      }
      if (!stopped) {
        reconnectTimer = setTimeout(connect, 5000);
      }
    };
  }

  // Kick off the first connection attempt
  connect();

  // Return a teardown function
  return () => {
    stopped = true;
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
    }
    if (flushTimer !== null) {
      clearInterval(flushTimer);
    }
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
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
    backgroundColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  sponsorCardDesktop: {
    width: "31.5%",
    height: 130,
  },
  sponsorDot: {},
  sponsorText: { color: brand.white, fontSize: 20, fontWeight: "900" },
  tabBarSafeArea: {
    backgroundColor: "transparent",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.34)",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.24)",
    borderRightColor: "rgba(255,255,255,0.24)",
    backgroundColor: "rgba(255,255,255,0.20)",
    minHeight: 76,
    marginHorizontal: 14,
    marginBottom: 10,
    borderRadius: 22,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.26,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
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
  tabIconBadge: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: { fontWeight: "900", fontSize: 12 },
});
