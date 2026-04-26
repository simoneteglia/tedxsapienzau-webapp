import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

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
    id: '1',
    title: 'Future Ideas',
    speaker: 'Giulia R.',
    time: 'starting at: 16:30',
    description: 'A short journey into ideas that can reshape the next decade.',
    speakerBio: 'Innovation strategist and startup mentor, Giulia helps early-stage teams turn bold ideas into products people actually use.',
    lastCaption: 'L immaginazione non e evasione, e il primo passo per costruire.',
  },
  {
    id: '2',
    title: 'Design Shift',
    speaker: 'Marco P.',
    time: 'starting now',
    description: 'How design can become a social language, not only a visual one.',
    speakerBio: 'Product designer and creative director, Marco works at the intersection of digital experiences, culture, and accessibility.',
    lastCaption: 'Il design non decora: mette ordine nel caos e crea nuove possibilita.',
  },
  {
    id: '3',
    title: 'Creativity',
    speaker: 'Sara N.',
    time: 'starting at: 17:10',
    description: 'Creativity as a method to solve real and urgent problems.',
    speakerBio: 'Educator and author, Sara builds creative learning programs for universities, nonprofits, and youth communities.',
    lastCaption: 'La creativita e allenamento quotidiano, non ispirazione casuale.',
  },
  {
    id: '4',
    title: 'Human Tech',
    speaker: 'Lorenzo V.',
    time: 'starting at: 17:50',
    description: 'Technology that supports people, communities and trust.',
    speakerBio: 'Tech policy researcher focused on ethical AI, Lorenzo collaborates with civic institutions on responsible innovation.',
    lastCaption: 'La tecnologia migliore e quella che ti restituisce tempo e relazioni.',
  },
  {
    id: '5',
    title: 'New Cities',
    speaker: 'Francesca B.',
    time: 'starting at: 18:20',
    description: 'Urban futures built around participation and accessibility.',
    speakerBio: 'Urban planner and civic designer, Francesca leads participatory projects on mobility and inclusive public spaces.',
    lastCaption: 'Le citta del futuro si progettano con chi le vive ogni giorno.',
  },
  {
    id: '6',
    title: 'AI + People',
    speaker: 'Alessio C.',
    time: 'starting at: 19:00',
    description: 'A practical look at collaboration between AI systems and humans.',
    speakerBio: 'AI engineer and speaker, Alessio helps organizations integrate language models into everyday workflows.',
    lastCaption: 'L AI ha valore quando amplifica il giudizio umano, non quando lo sostituisce.',
  },
];

const sponsors = ['Enel', 'Google', 'Acea', 'TIM', 'Fastweb', 'Rai'];

type TabKey = 'Talks' | 'Sponsors' | 'Live';
type AppView = 'tabs' | 'talkDetail';
const MOCK_WS_URL = 'ws://localhost:8080';
const LYRICS_SLOT_HEIGHT = 150;
type LiveCaptionState = {
  current: string;
  previous: string | null;
  incoming: string | null;
};

function PageLayout({ children }: { children: ReactNode }) {
  return (
    <View style={styles.gradient}>
      <SafeAreaView style={styles.screenSafeArea}>
        <View style={styles.topBrandBar}>
          <Text style={styles.brandTed}>TEDx</Text>
          <Text style={styles.brandName}>SapienzaU</Text>
        </View>
        {children}
      </SafeAreaView>
    </View>
  );
}

function LoadingScreen() {
  return (
    <PageLayout>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeMain}>TEDxSapienzaU</Text>
        <Text style={styles.welcomeYear}>On The Brink</Text>
      </View>
    </PageLayout>
  );
}

function TalksScreen({ onOpenLive }: { onOpenLive: (talk: Talk) => void }) {
  return (
    <PageLayout>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>TALKS</Text>
        <Text style={styles.sectionSubtitle}>
          Questo breve testo spiega che ci sono le captions istantanee e il riassunto ad ogni talk.
        </Text>

        <View style={styles.talksGrid}>
          {talks.map((talk) => (
            <Pressable key={talk.id} style={styles.talkCard} onPress={() => onOpenLive(talk)}>
              <Text style={styles.cardTitle}>{talk.title.toUpperCase()}</Text>
              <Text style={styles.cardSpeaker}>{talk.speaker}</Text>
              <Text style={styles.cardTime}>{talk.time}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </PageLayout>
  );
}

function SponsorsScreen() {
  return (
    <PageLayout>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>SPONSORS</Text>
        <Text style={styles.sectionSubtitle}>Partners and brands supporting TEDxSapienzaU.</Text>
        <View style={styles.sponsorsGrid}>
          {sponsors.map((sponsor) => (
            <View key={sponsor} style={styles.sponsorCard}>
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
    outputRange: ['#ffffff', '#cfcfcf'],
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
              { opacity: incomingOpacity, transform: [{ translateY: incomingTranslateY }] },
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
  return (
    <PageLayout>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={16} color="#ffffff" />
          <Text style={styles.backButtonText}>Back to talks</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>{talk.title.toUpperCase()}</Text>
        <Text style={styles.sectionSubtitle}>{talk.description}</Text>

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
  return (
    <PageLayout>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>LIVE</Text>
        <Text style={styles.sectionSubtitle}>
          Now on stage: {talk.title} by {talk.speaker}.
        </Text>
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
  const [activeTab, setActiveTab] = useState<TabKey>('Talks');
  const [view, setView] = useState<AppView>('tabs');
  const [selectedTalk, setSelectedTalk] = useState<Talk>(talks[0]);
  const [liveCaptions, setLiveCaptions] = useState<LiveCaptionState>({
    current: 'Waiting for live transcript...',
    previous: null,
    incoming: null,
  });

  const transitionAnim = useState(new Animated.Value(0))[0];
  const colorAnim = useState(new Animated.Value(0))[0];
  const isAnimatingCaptionRef = useRef(false);
  const queuedCaptionRef = useRef<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

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

    const stopConsumer = startMockServerConsumer((incomingText) => {
      animateToCaption(incomingText);
    });
    return stopConsumer;
  }, [transitionAnim, colorAnim]);

  const tabs: Array<{ key: TabKey; icon: keyof typeof Ionicons.glyphMap }> = [
    { key: 'Talks', icon: 'mic' },
    { key: 'Sponsors', icon: 'ribbon' },
    { key: 'Live', icon: 'radio' },
  ];

  const tabScreen = useMemo(() => {
    if (activeTab === 'Sponsors') {
      return <SponsorsScreen />;
    }
    if (activeTab === 'Live') {
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
    return (
      <TalksScreen
        onOpenLive={(talk) => {
          setSelectedTalk(talk);
          setView('talkDetail');
        }}
      />
    );
  }, [activeTab, liveCaptions.current, liveCaptions.previous, liveCaptions.incoming, transitionAnim, colorAnim]);

  return (
    <View style={styles.appRoot}>
      <StatusBar style="light" />
      {isLoading ? (
        <LoadingScreen />
      ) : view === 'talkDetail' ? (
        <TalkDetailScreen
          talk={selectedTalk}
          onBack={() => {
            setView('tabs');
            setActiveTab('Talks');
          }}
        />
      ) : (
        <>
          {tabScreen}
          <SafeAreaView style={styles.tabBarSafeArea}>
            <View style={styles.tabBar}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                const color = isActive ? '#ffffff' : '#c18fa0';
                return (
                  <Pressable key={tab.key} style={styles.tabButton} onPress={() => setActiveTab(tab.key)}>
                    <Ionicons name={tab.icon} size={20} color={color} />
                    <Text style={[styles.tabLabel, { color }]}>{tab.key}</Text>
                  </Pressable>
                );
              })}
            </View>
          </SafeAreaView>
        </>
      )}
    </View>
  );
}

function startMockServerConsumer(onText: (text: string) => void) {
  const socket = new WebSocket(MOCK_WS_URL);

  socket.onopen = () => {
    console.log(`[MockWS] Connected to ${MOCK_WS_URL}`);
  };

  socket.onmessage = (event) => {
    const text = typeof event.data === 'string' ? event.data : String(event.data);
    console.log(`[MockWS] ${text}`);
    onText(text);
  };

  socket.onerror = (event) => {
    console.log('[MockWS] Connection error', event);
  };

  socket.onclose = () => {
    console.log('[MockWS] Disconnected');
  };

  return () => {
    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
      socket.close();
    }
  };
}

const styles = StyleSheet.create({
  appRoot: { flex: 1, backgroundColor: '#150209' },
  gradient: {
    flex: 1,
    backgroundColor: '#5f0c22',
    shadowColor: '#000',
  },
  screenSafeArea: { flex: 1 },
  topBrandBar: {
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderBottomColor: 'rgba(255,255,255,0.1)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 3,
  },
  brandTed: { color: '#e10613', fontWeight: '700' },
  brandName: { color: '#e6d3d9', fontWeight: '500' },
  welcomeContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  welcomeTitle: { color: '#ffffff', fontSize: 36, fontWeight: '700', textAlign: 'center' },
  welcomeMain: { color: '#ffffff', fontSize: 46, fontWeight: '800', textAlign: 'center' },
  welcomeYear: { color: '#ffffff', fontSize: 44, fontWeight: '800', textAlign: 'center' },
  scrollContainer: { paddingHorizontal: 20, paddingVertical: 14, paddingBottom: 28 },
  sectionTitle: { color: '#ffffff', fontSize: 44, fontWeight: '900' },
  sectionSubtitle: { color: '#f0d5de', marginTop: 4, marginBottom: 16, fontSize: 14, lineHeight: 18 },
  talksGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  talkCard: {
    width: '47%',
    minHeight: 125,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.09)',
    padding: 12,
  },
  cardTitle: { color: '#ffffff', fontWeight: '800', fontSize: 26 },
  cardSpeaker: { color: '#ffffff', opacity: 0.9, fontSize: 16 },
  cardTime: { color: '#f0d5de', marginTop: 'auto', fontSize: 13, paddingTop: 8 },
  previousButton: {
    marginTop: 18,
    alignSelf: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  previousButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 12, letterSpacing: 0.5 },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  liveImageWrap: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  liveImage: { width: '100%', aspectRatio: 1.8 },
  liveBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  liveDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: '#ff2e3f' },
  liveText: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  captionCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: 20,
    minHeight: 360,
  },
  detailCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: 20,
    gap: 10,
  },
  detailCardTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800', marginTop: 8 },
  detailCardText: { color: '#f3dbe2', fontSize: 16, lineHeight: 22 },
  captionLead: { color: '#e2c2cc', fontWeight: '700', fontSize: 20 },
  captionLyricsArea: {
    marginTop: 14,
    height: LYRICS_SLOT_HEIGHT * 2 + 6,
    overflow: 'hidden',
    position: 'relative',
  },
  captionCurrentLine: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 34,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: LYRICS_SLOT_HEIGHT,
  },
  captionPreviousLine: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 32,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: LYRICS_SLOT_HEIGHT,
  },
  captionPreviousLineStatic: {
    color: '#cfcfcf',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 32,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: LYRICS_SLOT_HEIGHT,
  },
  sponsorsGrid: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  sponsorCard: {
    width: '47%',
    height: 100,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsorText: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  tabBarSafeArea: {
    backgroundColor: '#1c0910',
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    backgroundColor: '#1c0910',
    height: 74,
    paddingBottom: 8,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: { alignItems: 'center', justifyContent: 'center', gap: 3, minWidth: 72 },
  tabLabel: { fontWeight: '700', fontSize: 11 },
});
