'use client';

import { useState, useEffect, useRef } from 'react';

interface LinkedInPublishModalProps {
  isOpen: boolean;
  content: string;
  topic: string;
  publishing: boolean;
  onPublish: (content: string) => void;
  onClose: () => void;
}

export function LinkedInPublishModal({
  isOpen,
  content,
  topic,
  publishing,
  onPublish,
  onClose,
}: LinkedInPublishModalProps) {
  const [editedContent, setEditedContent] = useState(content);
  const [prevOpen, setPrevOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset content when modal opens (avoids useEffect + setState)
  if (isOpen && !prevOpen) {
    setEditedContent(content);
    setPrevOpen(true);
  } else if (!isOpen && prevOpen) {
    setPrevOpen(false);
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !publishing) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, publishing, onClose]);

  if (!isOpen) return null;

  const charCount = editedContent.length;
  const isOverLimit = charCount > 3000;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !publishing) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="animate-scale-in relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)',
          maxHeight: 'calc(100vh - 4rem)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4 sm:px-6"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: '#0A66C2' }}
            >
              <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Pubblica su LinkedIn
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {topic}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={publishing}
            className="focus-ring rounded-lg p-1.5 transition-colors duration-200 hover:bg-black/10 disabled:opacity-50 dark:hover:bg-white/10"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content editor */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            Contenuto del post
          </label>
          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            disabled={publishing}
            rows={12}
            className="focus-ring w-full resize-y rounded-xl border px-4 py-3 text-sm leading-relaxed transition-colors duration-200 disabled:opacity-50"
            style={{
              background: 'var(--bg-primary)',
              borderColor: isOverLimit ? 'var(--error)' : 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
            placeholder="Scrivi il contenuto del post..."
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={() => setEditedContent(content)}
              disabled={publishing || editedContent === content}
              className="text-xs font-medium transition-colors duration-200 disabled:opacity-30"
              style={{ color: 'var(--accent)' }}
            >
              Ripristina originale
            </button>
            <span
              className="text-xs tabular-nums font-medium"
              style={{ color: isOverLimit ? 'var(--error)' : 'var(--text-tertiary)' }}
            >
              {charCount.toLocaleString()}/3.000
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 border-t px-5 py-4 sm:px-6"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <button
            onClick={onClose}
            disabled={publishing}
            className="focus-ring rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            Annulla
          </button>
          <button
            onClick={() => onPublish(editedContent)}
            disabled={publishing || !editedContent.trim() || isOverLimit}
            className="focus-ring inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{ background: '#0A66C2' }}
          >
            {publishing ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Pubblicazione...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Pubblica
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
