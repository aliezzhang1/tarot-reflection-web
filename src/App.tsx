import { useEffect, useState } from "react";
import { AppLayout } from "./components/AppLayout";
import { DisclaimerGate } from "./components/DisclaimerGate";
import type { TarotSpreadId } from "./core/tarotSpreads";
import { assessHighRiskQuestion } from "./core/riskGuard";
import { DailyDrawPage } from "./pages/DailyDrawPage";
import { HomePage } from "./pages/HomePage";
import { ReadingDrawPage } from "./pages/ReadingDrawPage";
import { ReadingHistoryPage } from "./pages/ReadingHistoryPage";
import { ReadingResultPage } from "./pages/ReadingResultPage";
import { ReadingSetupPage } from "./pages/ReadingSetupPage";
import type { ReadingDraft, ReadingResult } from "./utils/readingFlow";
import { acknowledgeDisclaimer, hasAcknowledgedDisclaimer } from "./utils/storage";

type AppView = "home" | "setup" | "draw" | "result" | "history" | "daily-draw";
type ResultSource = "reading" | "daily-draw";

const initialDraft: ReadingDraft = {
  topic: "love",
  question: "",
};

function getViewFromHash(hash: string): AppView {
  if (hash.startsWith("#setup")) {
    return "setup";
  }

  if (hash.startsWith("#draw")) {
    return "draw";
  }

  if (hash.startsWith("#result")) {
    return "result";
  }

  if (hash.startsWith("#history")) {
    return "history";
  }

  if (hash.startsWith("#daily-draw")) {
    return "daily-draw";
  }

  return "home";
}

function navigateTo(hash: string) {
  if (typeof window !== "undefined") {
    window.location.hash = hash;
  }
}

function resetScrollPosition() {
  if (typeof window === "undefined") {
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function App() {
  const [view, setView] = useState<AppView>(() => {
    if (typeof window === "undefined") {
      return "home";
    }

    return getViewFromHash(window.location.hash);
  });
  const [draft, setDraft] = useState<ReadingDraft>(initialDraft);
  const [selectedSpreadId, setSelectedSpreadId] = useState<TarotSpreadId>("single-card");
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [resultSource, setResultSource] = useState<ResultSource>("reading");
  const [hasDisclaimerAck, setHasDisclaimerAck] = useState(() => hasAcknowledgedDisclaimer());
  const riskAssessment = assessHighRiskQuestion(draft.question);
  const shouldGateEntry = !hasDisclaimerAck && ["setup", "draw", "daily-draw"].includes(view);

  const syncDisclaimerAck = () => {
    acknowledgeDisclaimer();
    setHasDisclaimerAck(true);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const syncView = () => {
      setView(getViewFromHash(window.location.hash));
    };

    syncView();
    window.addEventListener("hashchange", syncView);

    return () => {
      window.removeEventListener("hashchange", syncView);

      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      resetScrollPosition();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [view]);

  useEffect(() => {
    if (view === "draw" && riskAssessment.shouldBlock) {
      navigateTo("#setup");
    }
  }, [view, riskAssessment.shouldBlock]);

  if (shouldGateEntry) {
    return (
      <AppLayout>
        <DisclaimerGate onAccept={syncDisclaimerAck} onBackHome={() => navigateTo("#home")} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {view === "setup" && (
        <ReadingSetupPage
          hasAcknowledgedDisclaimer={hasDisclaimerAck}
          onAcknowledgeDisclaimer={syncDisclaimerAck}
          onContinue={() => navigateTo("#draw")}
          onQuestionChange={(question) => setDraft((currentDraft) => ({ ...currentDraft, question }))}
          onSpreadChange={setSelectedSpreadId}
          onTopicChange={(topic) => setDraft((currentDraft) => ({ ...currentDraft, topic }))}
          question={draft.question}
          selectedSpreadId={selectedSpreadId}
          selectedTopic={draft.topic}
        />
      )}

      {view === "draw" && (
        <ReadingDrawPage
          draft={draft}
          onBack={() => navigateTo("#setup")}
          onComplete={(nextResult) => {
            setResultSource("reading");
            setResult(nextResult);
            navigateTo("#result");
          }}
          selectedSpreadId={selectedSpreadId}
        />
      )}

      {view === "daily-draw" && (
        <DailyDrawPage
          onComplete={(nextResult) => {
            setResultSource("daily-draw");
            setResult(nextResult);
            navigateTo("#result");
          }}
          onOpenCustomReading={() => navigateTo("#setup")}
        />
      )}

      {view === "result" && (
        <ReadingResultPage
          bottomPrimaryLabel={resultSource === "daily-draw" ? "回到每日一抽" : "返回准备页调整问题"}
          onBackHome={() => navigateTo("#home")}
          onBackToSetup={() => navigateTo(resultSource === "daily-draw" ? "#daily-draw" : "#setup")}
          result={result}
        />
      )}

      {view === "history" && (
        <ReadingHistoryPage
          onBackHome={() => navigateTo("#home")}
          onStartReading={() => navigateTo("#setup")}
        />
      )}

      {view === "home" && (
        <HomePage
          hasAcknowledgedDisclaimer={hasDisclaimerAck}
          onAcknowledgeDisclaimer={syncDisclaimerAck}
        />
      )}
    </AppLayout>
  );
}
