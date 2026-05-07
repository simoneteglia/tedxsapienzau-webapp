import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Easing,
  Image,
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
};

const talks: Talk[] = [
  {
    id: "1",
    title: "Future Ideas",
    speaker: "Giulia R.",
    time: "starting at: 16:30",
    description: "A short journey into ideas that can reshape the next decade.",
    speakerBio:
      "Innovation strategist and startup mentor, Giulia helps early-stage teams turn bold ideas into products people actually use.",
    lastCaption:
      "L immaginazione non e evasione, e il primo passo per costruire.",
  },
  {
    id: "2",
    title: "Design Shift",
    speaker: "Marco P.",
    time: "starting now",
    description:
      "How design can become a social language, not only a visual one.",
    speakerBio:
      "Product designer and creative director, Marco works at the intersection of digital experiences, culture, and accessibility.",
    lastCaption:
      "Il design non decora: mette ordine nel caos e crea nuove possibilita.",
  },
  {
    id: "3",
    title: "Creativity",
    speaker: "Sara N.",
    time: "starting at: 17:10",
    description: "Creativity as a method to solve real and urgent problems.",
    speakerBio:
      "Educator and author, Sara builds creative learning programs for universities, nonprofits, and youth communities.",
    lastCaption:
      "La creativita e allenamento quotidiano, non ispirazione casuale.",
  },
  {
    id: "4",
    title: "Human Tech",
    speaker: "Lorenzo V.",
    time: "starting at: 17:50",
    description: "Technology that supports people, communities and trust.",
    speakerBio:
      "Tech policy researcher focused on ethical AI, Lorenzo collaborates with civic institutions on responsible innovation.",
    lastCaption:
      "La tecnologia migliore e quella che ti restituisce tempo e relazioni.",
  },
  {
    id: "5",
    title: "New Cities",
    speaker: "Francesca B.",
    time: "starting at: 18:20",
    description: "Urban futures built around participation and accessibility.",
    speakerBio:
      "Urban planner and civic designer, Francesca leads participatory projects on mobility and inclusive public spaces.",
    lastCaption:
      "Le citta del futuro si progettano con chi le vive ogni giorno.",
  },
  {
    id: "6",
    title: "AI + People",
    speaker: "Alessio C.",
    time: "starting at: 19:00",
    description:
      "A practical look at collaboration between AI systems and humans.",
    speakerBio:
      "AI engineer and speaker, Alessio helps organizations integrate language models into everyday workflows.",
    lastCaption:
      "L AI ha valore quando amplifica il giudizio umano, non quando lo sostituisce.",
  },
];

const sponsors = ["Enel", "Google", "Acea", "TIM", "Fastweb", "Rai"];

type TabKey = "Talks" | "Sponsors" | "Live";
type AppView = "tabs" | "talkDetail";
// ─── Live API configuration ──────────────────────────────────────────────────
// NOTE: In production, API_KEY must never ship inside the client app.
// Move consumer-token issuance to a backend proxy and pass only the token here.
const API_BASE_URL = "ws://localhost:8080";
const API_KEY = ""; // <-- insert your AUTH_API_KEY here (server-to-server only!)
const SESSION_ID = ""; // <-- insert the live-session ID created by the backend
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
              key={sponsor}
              style={[
                styles.sponsorCard,
                isDesktop && styles.sponsorCardDesktop,
              ]}
            >
              <Text style={styles.sponsorText}>{sponsor}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </PageLayout>
  );
}

function LiveLyricsPanel({
  leadText,
  currentCaption,
  previousCaption,
  incomingCaption,
  transitionAnim,
  colorAnim,
}: {
  leadText: string;
  currentCaption: string;
  previousCaption: string | null;
  incomingCaption: string | null;
  transitionAnim: Animated.Value;
  colorAnim: Animated.Value;
}) {
  const transitioning = Boolean(incomingCaption);
  const transitioningCurrentToGrayY = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -LYRICS_SLOT_HEIGHT],
  });
  const transitioningCurrentToGrayColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [brand.white, "rgba(255,255,255,0.72)"],
  });
  const incomingTranslateY = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [LYRICS_SLOT_HEIGHT, 0],
  });
  const incomingOpacity = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.captionCard}>
      <Text style={styles.captionLead}>{leadText}</Text>
      <View style={styles.captionLyricsArea}>
        {transitioning ? (
          <Animated.Text
            numberOfLines={3}
            style={[
              styles.captionPreviousLine,
              {
                color: transitioningCurrentToGrayColor,
                transform: [{ translateY: transitioningCurrentToGrayY }],
              },
            ]}
          >
            {currentCaption}
          </Animated.Text>
        ) : previousCaption ? (
          <Text numberOfLines={3} style={styles.captionPreviousLineStatic}>
            {previousCaption}
          </Text>
        ) : null}

        {transitioning && incomingCaption ? (
          <Animated.Text
            numberOfLines={3}
            style={[
              styles.captionCurrentLine,
              {
                opacity: incomingOpacity,
                transform: [{ translateY: incomingTranslateY }],
              },
            ]}
          >
            {incomingCaption}
          </Animated.Text>
        ) : (
          <Text numberOfLines={3} style={styles.captionCurrentLine}>
            {currentCaption}
          </Text>
        )}
      </View>
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
          <Text style={styles.detailCardTitle}>About this talk</Text>
          <Text style={styles.detailCardText}>{talk.description}</Text>
          <Text style={styles.detailCardTitle}>Speaker bio</Text>
          <Text style={styles.detailCardText}>{talk.speakerBio}</Text>
        </View>
      </ScrollView>
    </PageLayout>
  );
}

function LivePageScreen({
  talk,
  currentCaption,
  previousCaption,
  incomingCaption,
  transitionAnim,
  colorAnim,
}: {
  talk: Talk;
  currentCaption: string;
  previousCaption: string | null;
  incomingCaption: string | null;
  transitionAnim: Animated.Value;
  colorAnim: Animated.Value;
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <PageLayout
      backgroundSource={serpentoniBackgrounds[2]}
      desktopBackgroundSource={serpentoniDesktopBackgrounds[2]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isDesktop && styles.scrollContainerDesktopNarrow,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Live"
          subtitle={`Now on stage: ${talk.title} by ${talk.speaker}.`}
        />
        <LiveLyricsPanel
          leadText={`Traduzione live di ${talk.speaker}`}
          currentCaption={currentCaption}
          previousCaption={previousCaption}
          incomingCaption={incomingCaption}
          transitionAnim={transitionAnim}
          colorAnim={colorAnim}
        />
      </ScrollView>
    </PageLayout>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("Talks");
  const [view, setView] = useState<AppView>("tabs");
  const [selectedTalk, setSelectedTalk] = useState<Talk>(talks[0]);
  const [liveCaptions, setLiveCaptions] = useState<LiveCaptionState>({
    current: "Waiting for live transcript...",
    previous: null,
    incoming: null,
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
          previousCaption={liveCaptions.previous}
          incomingCaption={liveCaptions.incoming}
          transitionAnim={transitionAnim}
          colorAnim={colorAnim}
        />
      );
    }
    return <TalksScreen onOpenLive={openTalkDetail} />;
  }, [
    activeTab,
    liveCaptions.current,
    liveCaptions.previous,
    liveCaptions.incoming,
    transitionAnim,
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
 * Fetches a short-lived consumer token from the live API, then opens the
 * events WebSocket and forwards translated_text to the onText callback.
 *
 * The returned function tears down the connection (safe to call multiple times).
 */
function startLiveConsumer(onText: (text: string) => void): () => void {
  let socket: WebSocket | null = null;
  let stopped = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  // Validate config before attempting any network call
  if (!API_KEY || !SESSION_ID) {
    console.warn(
      "[LiveWS] API_KEY or SESSION_ID is not configured. " +
        "Set the constants at the top of App.tsx to enable live captions.",
    );
    return () => {};
  }

  async function connect() {
    if (stopped) return;

    // ── 1. Obtain a consumer token ───────────────────────────────────────────
    let eventsWsUrl: string;
    let consumerToken: string;
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/live-sessions/${SESSION_ID}/consumer-tokens`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ttl_seconds: 900 }),
        },
      );

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`HTTP ${response.status}: ${body}`);
      }

      const data = await response.json();
      eventsWsUrl = data.events_ws_url as string;
      consumerToken = data.consumer_token as string;
      console.log("[LiveWS] Consumer token obtained, connecting to events WS…");
    } catch (err) {
      console.error("[LiveWS] Failed to obtain consumer token:", err);
      if (!stopped) {
        reconnectTimer = setTimeout(connect, 8000);
      }
      return;
    }

    if (stopped) return;

    // ── 2. Open the events WebSocket ─────────────────────────────────────────
    // Append the consumer token as a query parameter
    const wsUrl = `${eventsWsUrl}?token=${encodeURIComponent(consumerToken)}`;
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("[LiveWS] Connected to events stream.");
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

        // Only handle translation_final events
        if (msg.event !== "translation_final") return;

        const status = msg.status ?? "ok";

        if (status === "translation_error") {
          // Service could not produce a translation — skip silently
          console.warn(
            "[LiveWS] translation_error received, skipping segment.",
          );
          return;
        }

        // 'ok': use translated_text
        // 'source_already_target': translated_text mirrors source_text — still display it
        const text = msg.translated_text ?? msg.source_text ?? "";
        if (text) {
          console.log(`[LiveWS] ${status} → "${text}"`);
          onText(text);
        }
      } catch (parseErr) {
        console.warn("[LiveWS] Could not parse message:", parseErr);
      }
    };

    socket.onerror = (errorEvent) => {
      console.error("[LiveWS] WebSocket error:", errorEvent);
    };

    socket.onclose = (closeEvent) => {
      console.log(
        `[LiveWS] Connection closed (code ${closeEvent.code}). Reconnecting in 5s…`,
      );
      socket = null;
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
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  brandLockup: {
    alignItems: "center",
    justifyContent: "center",
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
    minHeight: 118,
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
    minHeight: 150,
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
    fontSize: 19,
    lineHeight: 20,
  },
  cardSpeaker: {
    color: brand.white,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
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
    padding: 20,
    minHeight: 360,
    overflow: "hidden",
  },
  detailCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.38)",
    backgroundColor: "rgba(255,255,255,0.22)",
    padding: 20,
    minHeight: 360,
  },
  detailCardTitle: {
    color: brand.white,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
  },
  detailCardText: {
    color: brand.white,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
  captionLead: { color: brand.white, fontWeight: "900", fontSize: 18 },
  captionLyricsArea: {
    marginTop: 14,
    height: LYRICS_SLOT_HEIGHT * 2 + 6,
    overflow: "hidden",
    position: "relative",
  },
  captionCurrentLine: {
    color: brand.white,
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 34,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: LYRICS_SLOT_HEIGHT,
  },
  captionPreviousLine: {
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 32,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: LYRICS_SLOT_HEIGHT,
  },
  captionPreviousLineStatic: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 32,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: LYRICS_SLOT_HEIGHT,
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
