import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";

export default function CategoryDropdown({
  categories = [],
  value = "",
  onSelect,
  onDelete,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const items = useMemo(() => {
    const safe = Array.isArray(categories) ? categories : [];
    return safe.map((c) => ({ ...c, id: String(c.id) }));
  }, [categories]);

  const selectedName = useMemo(() => {
    if (!value) return "Uncategorized";
    const hit = items.find((c) => c.id === String(value));
    return hit?.name || "Uncategorized";
  }, [items, value]);

  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current) return;
      if (rootRef.current.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function handleDelete(e, id) {
    e.preventDefault();
    e.stopPropagation();
    if (!onDelete) return;
    await onDelete(id);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className={
          "mt-1 flex w-full items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60 " +
          (disabled ? "cursor-not-allowed opacity-60" : "")
        }
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selectedName}</span>
        <ChevronDown
          className={"h-4 w-4 shrink-0 transition " + (open ? "rotate-180" : "")}
        />
      </button>

      {open && !disabled && (
        <div
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg"
          role="listbox"
        >
          <div
            role="option"
            tabIndex={0}
            className={
              "flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm hover:bg-black/5 " +
              (!value ? "font-semibold" : "")
            }
            onClick={() => {
              onSelect?.("");
              setOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect?.("");
                setOpen(false);
              }
            }}
          >
            <span className="truncate">Uncategorized</span>
            <span className="text-xs text-primary/40"></span>
          </div>

          <div className="max-h-60 overflow-auto">
            {items.length === 0 ? (
              <div className="px-4 py-3 text-sm text-primary/60">No categories</div>
            ) : (
              items.map((c) => (
                <div
                  key={c.id}
                  role="option"
                  tabIndex={0}
                  className={
                    "group flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm hover:bg-black/5 " +
                    (String(value) === c.id ? "font-semibold" : "")
                  }
                  onClick={() => {
                    onSelect?.(c.id);
                    setOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onSelect?.(c.id);
                      setOpen(false);
                    }
                  }}
                >
                  <span className="truncate pr-3">{c.name}</span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-primary/40">
                      {String(value) === c.id ? "Selected" : ""}
                    </span>

                    <button
                      type="button"
                      className="rounded-lg p-1 text-primary/60 hover:bg-black/10 hover:text-primary"
                      title="Delete category"
                      onClick={(e) => handleDelete(e, c.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
