export function openChatWidget() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("touraine:open-chat"));
  }
}
