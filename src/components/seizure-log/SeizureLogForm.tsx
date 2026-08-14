"use client";

import { useId, useState } from "react";
import {
  ACTION_OPTIONS,
  SEIZURE_TYPE_SUGGESTIONS,
  TRIGGER_SUGGESTIONS,
  SEVERITY_OPTIONS,
  CONSCIOUSNESS_OPTIONS,
  LOCATION_SUGGESTIONS,
} from "@/lib/seizure-log-data";
import type { SeizureLogEntry } from "@/lib/seizure-log-storage";
import SuggestField from "@/components/SuggestField";

interface SeizureLogFormProps {
  onSave: (data: Omit<SeizureLogEntry, "id">) => void;
}

function toLocalDatetimeInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function SeizureLogForm({ onSave }: SeizureLogFormProps) {
  const [seizureType, setSeizureType] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [severity, setSeverity] = useState("");
  const [consciousness, setConsciousness] = useState("");
  const [warningSigns, setWarningSigns] = useState("");
  const [trigger, setTrigger] = useState("");
  const [triggerReason, setTriggerReason] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const [recovery, setRecovery] = useState("");
  const [recoveryMinutes, setRecoveryMinutes] = useState(0);
  const [location, setLocation] = useState("");
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);
  const [medicationDetail, setMedicationDetail] = useState("");
  const [notes, setNotes] = useState("");
  const [occurredAtLocal, setOccurredAtLocal] = useState(() =>
    toLocalDatetimeInputValue(new Date())
  );
  const occurredAtId = useId();
  const notesId = useId();

  function toggleAction(action: string) {
    setActionsTaken((prev) =>
      prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!seizureType.trim()) return;
    onSave({
      occurredAt: new Date(occurredAtLocal).toISOString(),
      seizureType: seizureType.trim(),
      durationSeconds: minutes * 60 + seconds,
      severity,
      consciousness,
      warningSigns: warningSigns.trim(),
      trigger: trigger.trim(),
      triggerReason: trigger.trim() ? triggerReason.trim() : "",
      whatHappened: whatHappened.trim(),
      recovery: recovery.trim(),
      recoveryMinutes,
      location: location.trim(),
      actionsTaken,
      medicationDetail: actionsTaken.includes("Rescue medication given")
        ? medicationDetail.trim()
        : "",
      notes: notes.trim(),
    });
    setSeizureType("");
    setMinutes(0);
    setSeconds(0);
    setSeverity("");
    setConsciousness("");
    setWarningSigns("");
    setTrigger("");
    setTriggerReason("");
    setWhatHappened("");
    setRecovery("");
    setRecoveryMinutes(0);
    setLocation("");
    setActionsTaken([]);
    setMedicationDetail("");
    setNotes("");
    setOccurredAtLocal(toLocalDatetimeInputValue(new Date()));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border-2 border-border bg-surface p-4"
    >
      <h2 className="font-display text-lg font-bold">Log a seizure</h2>

      <div>
        <label htmlFor={occurredAtId} className="block font-semibold mb-1">
          When did it start?
        </label>
        <input
          id={occurredAtId}
          type="datetime-local"
          value={occurredAtLocal}
          onChange={(e) => setOccurredAtLocal(e.target.value)}
          required
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </div>

      <SuggestField
        label="Seizure type"
        value={seizureType}
        onChange={setSeizureType}
        suggestions={SEIZURE_TYPE_SUGGESTIONS}
        placeholder="e.g. Tonic-clonic"
        required
      />

      <div>
        <span className="block font-semibold mb-1">Duration</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={180}
            value={minutes}
            onChange={(e) => setMinutes(Math.max(0, Number(e.target.value)))}
            aria-label="Minutes"
            className="w-20 rounded-xl border-2 border-border bg-background px-3 py-3 text-center touch-target"
          />
          <span className="text-sm text-muted">min</span>
          <input
            type="number"
            min={0}
            max={59}
            value={seconds}
            onChange={(e) => setSeconds(Math.min(59, Math.max(0, Number(e.target.value))))}
            aria-label="Seconds"
            className="w-20 rounded-xl border-2 border-border bg-background px-3 py-3 text-center touch-target"
          />
          <span className="text-sm text-muted">sec</span>
        </div>
      </div>

      <div>
        <span className="block font-semibold mb-2">Severity</span>
        <div className="flex flex-wrap gap-1.5">
          {SEVERITY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSeverity(severity === option ? "" : option)}
              aria-pressed={severity === option}
              className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
                severity === option
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-background"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="block font-semibold mb-2">Awareness during the seizure</span>
        <div className="flex flex-wrap gap-1.5">
          {CONSCIOUSNESS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setConsciousness(consciousness === option ? "" : option)}
              aria-pressed={consciousness === option}
              className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
                consciousness === option
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-background"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="warning-signs">
          Any warning signs beforehand (aura)?
        </label>
        <input
          id="warning-signs"
          type="text"
          value={warningSigns}
          onChange={(e) => setWarningSigns(e.target.value)}
          maxLength={300}
          placeholder="e.g. Said they could smell something odd"
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </div>

      <SuggestField
        label="Where did it happen?"
        value={location}
        onChange={setLocation}
        suggestions={LOCATION_SUGGESTIONS}
        placeholder="e.g. Home"
      />

      <SuggestField
        label="Possible trigger"
        value={trigger}
        onChange={setTrigger}
        suggestions={TRIGGER_SUGGESTIONS}
        placeholder="e.g. Lack of sleep"
      />

      {trigger.trim() && (
        <div>
          <label className="block font-semibold mb-1" htmlFor="trigger-reason">
            Why do you think this was the trigger?
          </label>
          <textarea
            id="trigger-reason"
            value={triggerReason}
            onChange={(e) => setTriggerReason(e.target.value)}
            rows={2}
            maxLength={500}
            placeholder="e.g. They'd only had 4 hours' sleep the night before, which has happened before a seizure previously"
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
        </div>
      )}

      <div>
        <label className="block font-semibold mb-1" htmlFor="what-happened">
          What happened during the seizure?
        </label>
        <textarea
          id="what-happened"
          value={whatHappened}
          onChange={(e) => setWhatHappened(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Movements, breathing, colour, awareness, anything noticed"
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="recovery">
          Recovery - what happened afterwards?
        </label>
        <textarea
          id="recovery"
          value={recovery}
          onChange={(e) => setRecovery(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder="e.g. Confused for 10 minutes, then slept for an hour"
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="recovery-minutes">
          How long until they were back to normal? (minutes)
        </label>
        <input
          id="recovery-minutes"
          type="number"
          min={0}
          max={1440}
          value={recoveryMinutes}
          onChange={(e) => setRecoveryMinutes(Math.max(0, Number(e.target.value)))}
          className="w-28 rounded-xl border-2 border-border bg-background px-3 py-3 text-center touch-target"
        />
      </div>

      <div>
        <span className="block font-semibold mb-2">Actions taken</span>
        <div className="flex flex-wrap gap-1.5">
          {ACTION_OPTIONS.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => toggleAction(action)}
              aria-pressed={actionsTaken.includes(action)}
              className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
                actionsTaken.includes(action)
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-background"
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {actionsTaken.includes("Rescue medication given") && (
        <div>
          <label className="block font-semibold mb-1" htmlFor="medication-detail">
            Medication name and dose given
          </label>
          <input
            id="medication-detail"
            type="text"
            value={medicationDetail}
            onChange={(e) => setMedicationDetail(e.target.value)}
            maxLength={200}
            placeholder="e.g. Midazolam 10mg buccal"
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
        </div>
      )}

      <div>
        <label className="block font-semibold mb-1" htmlFor={notesId}>
          Other notes
        </label>
        <textarea
          id={notesId}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          maxLength={500}
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
        />
      </div>

      <button
        type="submit"
        className="touch-target rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
      >
        Save entry
      </button>
    </form>
  );
}
