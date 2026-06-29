"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MessageCircle, X, Send, PawPrint, PhoneCall } from "lucide-react";
import clsx from "clsx";
import { useLocale } from "@/i18n/LocaleProvider";
import { useOpenState } from "@/hooks/useOpenState";
import { dayLabel, formatHourLabel, EMERGENCY_REFERRAL } from "@/config/clinic";
import { Button } from "@/components/ui/Button";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}-${Date.now()}`;
}

export function ChatWidget() {
  const { t, locale } = useLocale();
  const openState = useOpenState();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTriage, setShowTriage] = useState(false);
  const [callbackContext, setCallbackContext] = useState<null | { isEmergency: boolean }>(null);
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackReason, setCallbackReason] = useState("");
  const [callbackError, setCallbackError] = useState("");
  const [callbackSending, setCallbackSending] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen || initialized.current) return;
    initialized.current = true;

    // Seeds the greeting once, the first time the widget is opened, from
    // locale and live open/closed state, neither of which is known at
    // render time before the visitor has interacted.
    if (openState.isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([{ id: nextId(), role: "assistant", content: t.chat.greetingOpen }]);
    } else {
      const nextOpenLabel = openState.nextOpen
        ? `${dayLabel(openState.nextOpen.day, locale)} ${formatHourLabel(openState.nextOpen.open, locale)}`
        : "";
      const greeting = `${t.chat.greetingClosedPrefix} ${nextOpenLabel}. ${t.chat.greetingClosedSuffix}`;
      setMessages([{ id: nextId(), role: "assistant", content: greeting }]);
      setShowTriage(true);
    }
  }, [isOpen, openState, t, locale]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    function openFromOutside() {
      setIsOpen(true);
    }
    window.addEventListener("touraine:open-chat", openFromOutside);
    return () => window.removeEventListener("touraine:open-chat", openFromOutside);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, showTriage, callbackContext, callbackSubmitted]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setIsOpen(false);
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setShowTriage(false);
    const userMsg: ChatMessage = { id: nextId(), role: "user", content: trimmed };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: data.reply ?? t.chat.error }]);
    } catch {
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: t.chat.error }]);
    } finally {
      setLoading(false);
    }
  }

  function handleTriage(isEmergency: boolean) {
    setShowTriage(false);
    if (isEmergency) {
      const text = t.chat.emergencyMessage
        .replace("{name}", EMERGENCY_REFERRAL.name)
        .replace("{phone}", EMERGENCY_REFERRAL.phone);
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: text }]);
      setCallbackContext({ isEmergency: true });
    } else {
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: t.chat.callbackPrompt }]);
      setCallbackContext({ isEmergency: false });
    }
  }

  async function submitCallback(e: React.FormEvent) {
    e.preventDefault();
    if (!callbackName.trim() || !callbackPhone.trim() || !callbackReason.trim()) {
      setCallbackError(t.rendezVous.errors.required);
      return;
    }
    setCallbackError("");
    setCallbackSending(true);
    try {
      await fetch("/api/callbacks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: callbackName,
          phone: callbackPhone,
          reason: callbackReason,
          isEmergency: callbackContext?.isEmergency ?? false,
        }),
      });
      setCallbackSubmitted(true);
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: t.chat.callbackSuccess }]);
      setCallbackContext(null);
    } catch {
      setCallbackError(t.chat.error);
    } finally {
      setCallbackSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label={isOpen ? t.chat.closeLabel : t.chat.openLabel}
        className={clsx(
          "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-500 text-cream shadow-[0_12px_28px_-10px_rgba(184,93,51,0.65)] transition-transform duration-200 hover:scale-105 active:scale-95 motion-reduce:transition-none sm:bottom-6 sm:right-6"
        )}
      >
        {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          onKeyDown={handleKeyDown}
          className="animate-fade-up fixed bottom-24 right-5 z-50 flex h-[min(32rem,70vh)] w-[min(23rem,90vw)] flex-col overflow-hidden rounded-2xl border border-border bg-paper shadow-2xl sm:bottom-28 sm:right-6"
        >
          <header className="flex items-center justify-between gap-3 bg-forest-800 px-4 py-3 text-cream">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta-500">
                <PawPrint className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p id={titleId} className="text-sm font-semibold leading-tight">
                  {t.chat.widgetLabel}
                </p>
                <p className="text-xs leading-tight text-sage-200">
                  {openState.isOpen ? t.chat.openBadge : t.chat.closedBadge}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t.chat.closeLabel}
              className="rounded-full p-1.5 hover:bg-forest-700"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((m) => (
              <div
                key={m.id}
                className={clsx(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "assistant"
                    ? "bg-sage-100 text-ink-900"
                    : "ml-auto bg-forest-700 text-cream"
                )}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="max-w-[85%] rounded-2xl bg-sage-100 px-3.5 py-2.5 text-sm text-ink-500">
                {t.chat.thinking}
              </div>
            )}

            {showTriage && (
              <div className="flex flex-wrap gap-2">
                <Button size="md" variant="secondary" onClick={() => handleTriage(true)}>
                  {t.chat.emergencyButton}
                </Button>
                <Button size="md" variant="ghost" onClick={() => handleTriage(false)}>
                  {t.chat.notEmergencyButton}
                </Button>
              </div>
            )}

            {callbackContext && !callbackSubmitted && (
              <form onSubmit={submitCallback} className="space-y-2 rounded-xl border border-border bg-cream p-3">
                <div>
                  <label htmlFor="cb-name" className="text-xs font-medium text-ink-700">
                    {t.chat.callbackName}
                  </label>
                  <input
                    id="cb-name"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border-strong bg-paper px-2.5 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-terracotta-500"
                  />
                </div>
                <div>
                  <label htmlFor="cb-phone" className="text-xs font-medium text-ink-700">
                    {t.chat.callbackPhone}
                  </label>
                  <input
                    id="cb-phone"
                    type="tel"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border-strong bg-paper px-2.5 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-terracotta-500"
                  />
                </div>
                <div>
                  <label htmlFor="cb-reason" className="text-xs font-medium text-ink-700">
                    {t.chat.callbackReason}
                  </label>
                  <textarea
                    id="cb-reason"
                    value={callbackReason}
                    onChange={(e) => setCallbackReason(e.target.value)}
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-border-strong bg-paper px-2.5 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-terracotta-500"
                  />
                </div>
                {callbackError && (
                  <p role="alert" className="text-xs text-danger-600">
                    {callbackError}
                  </p>
                )}
                <Button type="submit" size="md" className="w-full justify-center" disabled={callbackSending}>
                  <PhoneCall className="h-4 w-4" aria-hidden="true" />
                  {t.chat.callbackSubmit}
                </Button>
              </form>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-paper p-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              {t.chat.inputPlaceholder}
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chat.inputPlaceholder}
              className="flex-1 rounded-full border border-border-strong bg-cream px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-terracotta-500"
            />
            <button
              type="submit"
              aria-label={t.chat.send}
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta-500 text-cream disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
