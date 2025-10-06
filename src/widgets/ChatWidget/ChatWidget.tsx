import { useState } from 'react';
import { useChatRetriever } from '@features/useChatRetriever';

export function ChatWidget() {
  const { isOpen, toggle, respond } = useChatRetriever();
  const [history, setHistory] = useState<{ prompt: string; response: string }[]>([]);
  const [input, setInput] = useState('');
  const [ariaMessage, setAriaMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    const answer = respond(input);
    if (answer.shortcutHref) {
      window.location.assign(answer.shortcutHref);
    }
    const responseText = answer.suggestions
      ? `${answer.answer} ${answer.suggestions.join(', ')}`
      : answer.answer;
    setHistory((prev) => [...prev, { prompt: input, response: responseText }]);
    setAriaMessage(responseText);
    setInput('');
  };

  return (
    <div className={`chat-widget${isOpen ? ' is-open' : ''}`}>
      <button className="chat-widget__trigger" type="button" onClick={toggle} aria-expanded={isOpen} aria-controls="chat-panel">
        <span className="chat-widget__spark" aria-hidden="true">✨</span>
        <span className="chat-widget__label">Chat</span>
      </button>

      {isOpen && (
        <div className="chat-widget__panel" id="chat-panel" role="dialog" aria-modal="false">
          <header className="chat-widget__header">
            <h2 className="chat-widget__title">SwiftSend Assistant</h2>
            <button className="chat-widget__close" type="button" aria-label="Close chat" onClick={toggle}>
              ✕
            </button>
          </header>

          <div className="chat-widget__body">
            {history.length === 0 && <p className="chat-widget__placeholder">Ask about packs, labs, pricing, or timelines.</p>}
            <ul className="chat-widget__log" role="list">
              {history.map((item, index) => (
                <li key={index} className="chat-widget__entry">
                  <p className="chat-widget__prompt">{item.prompt}</p>
                  <p className="chat-widget__response">{item.response}</p>
                </li>
              ))}
            </ul>
          </div>

          <form className="chat-widget__form" onSubmit={handleSubmit}>
            <label htmlFor="chat-input" className="sr-only">
              Ask SwiftSend
            </label>
            <input
              id="chat-input"
              className="chat-widget__input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about pricing, services, timeline..."
            />
            <button className="chat-widget__send" type="submit">
              Send
            </button>
          </form>
          <div className="sr-only" role="status" aria-live="polite">
            {ariaMessage}
          </div>
        </div>
      )}
    </div>
  );
}
