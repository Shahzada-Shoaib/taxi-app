"use client";

import { useEffect, useId, useState } from "react";

type Postcode = { postcode: string; admin_district: string | null };

export default function PostcodeInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const id = useId();
  const [results, setResults] = useState<{ query: string; items: Postcode[]; error?: boolean }>({ query: "", items: [] });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const items = results.query === value ? results.items : [];
  const compact = value.replace(/\s/g, "").toUpperCase();
  const searchable = compact.length >= 2 && /^[A-Z]{1,2}(?:\d[A-Z\d]{0,4})?$/.test(compact);
  const visible = open;
  const message = !searchable
    ? "Type a UK postcode (at least 2 characters), or enter an address manually."
    : results.query !== value
      ? "Searching postcodes…"
      : results.error
        ? "Suggestions unavailable. You can still enter your address."
        : "No matching postcodes. You can enter your address manually.";

  useEffect(() => {
    if (!open || !searchable) return;
    // Add the space when an inward postcode (including a partial one) is present.
    const query = compact.replace(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{0,2})$/, "$1 $2");
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`https://api.postcodes.io/postcodes?query=${encodeURIComponent(query)}&limit=5`, { signal: controller.signal });
        if (!response.ok) throw new Error("Postcode lookup failed");
        const data = await response.json();
        if (!controller.signal.aborted) setResults({ query: value, items: data.result ?? [] });
      } catch {
        // Manual address entry still works if the lookup is unavailable.
        if (!controller.signal.aborted) setResults({ query: value, items: [], error: true });
      }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [value, open, compact, searchable]);

  function select(item: Postcode) {
    onChange([item.postcode, item.admin_district].filter(Boolean).join(", "));
    setOpen(false);
    setActive(-1);
  }

  return (
    <span className="postcode-input">
      <input
        required pattern=".*\S.*" maxLength={250} value={value} placeholder={placeholder}
        autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={visible}
        aria-controls={visible ? id : undefined}
        aria-activedescendant={visible && items[active] ? `${id}-${active}` : undefined}
        onChange={event => { onChange(event.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)} onBlur={() => { setOpen(false); setActive(-1); }}
        onKeyDown={event => {
          if (event.key === "Escape") { setOpen(false); setActive(-1); }
          if (!visible || !items.length) return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setActive(current => event.key === "ArrowDown" ? (current + 1) % items.length : (current <= 0 ? items.length - 1 : current - 1));
          }
          if (event.key === "Enter" && items[active]) { event.preventDefault(); select(items[active]); }
        }}
      />
      {visible && <span className="postcode-suggestions">
        <span id={id} role="listbox" aria-label="Postcode suggestions">
        {items.map((item, index) => <span
          className="postcode-option"
          key={item.postcode} id={`${id}-${index}`} role="option" aria-selected={active === index}
          onMouseDown={event => event.preventDefault()} onClick={() => select(item)}
        ><strong>{item.postcode}</strong>{item.admin_district ? ` — ${item.admin_district}` : ""}</span>)}
        </span>
        {!items.length && <span className="postcode-status" role="status">{message}</span>}
      </span>}
    </span>
  );
}
