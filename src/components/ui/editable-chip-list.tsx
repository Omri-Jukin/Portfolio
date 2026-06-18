import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EditableChipListProps {
  label: string;
  items: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onUpdate: (currentValue: string, nextValue: string) => void;
  onRemove: (value: string) => void;
  addLabel?: string;
  placeholder?: string;
  className?: string;
}

export function EditableChipList({
  label,
  items,
  inputValue,
  onInputChange,
  onAdd,
  onUpdate,
  onRemove,
  addLabel = "Add",
  placeholder,
  className,
}: EditableChipListProps) {
  const [editingItem, setEditingItem] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");

  const beginEdit = (item: string) => {
    setEditingItem(item);
    setEditValue(item);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue("");
  };

  const commitEdit = () => {
    if (!editingItem) return;
    const nextValue = editValue.trim();
    if (nextValue && nextValue !== editingItem) {
      onUpdate(editingItem, nextValue);
    }
    cancelEdit();
  };

  return (
    <div className={cn("min-w-0", className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-1.5 grid min-w-0 gap-2 sm:flex">
        <Input
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
        />
        <Button
          className="w-full sm:w-auto"
          variant="outline"
          onClick={onAdd}
          disabled={!inputValue.trim()}
        >
          {addLabel}
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="mt-3 flex min-w-0 flex-wrap gap-2">
          {items.map((item) => {
            const isEditing = editingItem === item;

            return (
              <div
                key={item}
                className={cn(
                  "max-w-full rounded-md border bg-background shadow-[var(--shadow-subtle)]",
                  isEditing ? "border-accent/60 p-2" : "border-border"
                )}
              >
                {isEditing ? (
                  <div className="grid min-w-0 gap-2 sm:flex sm:items-center">
                    <Input
                      value={editValue}
                      onChange={(event) => setEditValue(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          commitEdit();
                        }
                        if (event.key === "Escape") {
                          event.preventDefault();
                          cancelEdit();
                        }
                      }}
                      autoFocus
                    />
                    <div className="grid gap-2 sm:flex">
                      <Button
                        className="w-full sm:w-auto"
                        size="sm"
                        onClick={commitEdit}
                        disabled={!editValue.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        className="w-full sm:w-auto"
                        size="sm"
                        variant="quiet"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex max-w-full items-center gap-1.5 px-2 py-1">
                    <span className="min-w-0 break-words font-mono text-xs text-muted-foreground">
                      {item}
                    </span>
                    <button
                      type="button"
                      className="rounded-sm border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
                      onClick={() => beginEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-sm border border-destructive/40 px-1.5 py-0.5 text-[10px] font-medium uppercase text-destructive transition-colors hover:bg-destructive/10"
                      aria-label={`Remove ${item}`}
                      onClick={() => onRemove(item)}
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
