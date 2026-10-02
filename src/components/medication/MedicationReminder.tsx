"use client";

import { useEffect, useId, useState } from "react";
import {
  useMedications,
  useMedicationLog,
  useRecordedBy,
  dateKeyInTimezone,
  timeHmInTimezone,
  formatDateKey,
  type Medication,
} from "@/lib/medication-storage";
import { useTimezone } from "@/lib/timezone-context";
import { formatDateTime } from "@/lib/datetime";
import { downloadCsv } from "@/lib/csv-export";
import MedicationCard from "./MedicationCard";
import MedicationDashboard from "./MedicationDashboard";
import DoseRow from "./DoseRow";
import PrintButton from "@/components/PrintButton";
import Tabs from "@/components/Tabs";

type Tab = "checklist" | "dashboard";

const TABS = [
  { id: "checklist" as const, label: "Checklist", icon: "💊" },
  { id: "dashboard" as const, label: "Dashboard", icon: "📊" },
];

/** Re-renders once a minute so "due" labels stay current while the page is open. */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export default function MedicationReminder() {
  const [tab, setTab] = useState<Tab>("checklist");
  const { timezone } = useTimezone();
  const { medications, addMedication, updateMedication, removeMedication } = useMedications();
  const { entries, recordDose, clearDose, removeEntry, getDose } = useMedicationLog();
  const { recordedBy, setRecordedBy } = useRecordedBy();
  const [newMedication, setNewMedication] = useState("");
  const [newAsNeeded, setNewAsNeeded] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const now = useNow();
  const today = dateKeyInTimezone(now, timezone);
  const nowHm = timeHmInTimezone(now, timezone);
  const viewDate = pickedDate && pickedDate <= today ? pickedDate : today;
  const isToday = viewDate === today;
  const recordedById = useId();
  const dateId = useId();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addMedication(newMedication, newAsNeeded);
    setNewMedication("");
    setNewAsNeeded(false);
  }

  function handleExportCsv() {
    const sorted = [...entries].sort(
      (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
    );
    downloadCsv(
      "medication-log",
      [
        "Date",
        "Time",
        "Medication",
        "Dose",
        "Type",
        "Outcome",
        "Reason or note",
        "Recorded by",
        "Recorded at",
      ],
      sorted.map((entry) => {
        const med = medications.find((m) => m.id === entry.medicationId);
        return [
          formatDateKey(entry.date),
          entry.time,
          med?.name || entry.medicationName || "(removed medication)",
          entry.doseText || med?.dose || "",
          entry.kind === "as-needed" ? "As needed" : "Scheduled",
          entry.status === "taken" ? "Taken" : "Not taken",
          entry.reason,
          entry.recordedBy,
          formatDateTime(entry.takenAt, timezone),
        ];
      })
    );
  }

  function record(med: Medication, time: string, status: "taken" | "not-taken", reason = "") {
    recordDose({
      medicationId: med.id,
      time,
      date: viewDate,
      status,
      reason,
      recordedBy,
      medicationName: med.name,
      doseText: med.dose,
    });
    setAnnouncement(
      `${med.name || "Medication"} at ${time} recorded as ${status === "taken" ? "taken" : "not taken"}.`
    );
  }

  function undo(med: Medication, time: string) {
    clearDose(med.id, time, viewDate);
    setAnnouncement(`Record cleared for ${med.name || "medication"} at ${time}.`);
  }

  function recordAsNeeded(med: Medication, note: string) {
    const time = timeHmInTimezone(new Date(), timezone);
    recordDose({
      medicationId: med.id,
      time,
      date: today,
      status: "taken",
      kind: "as-needed",
      reason: note,
      recordedBy,
      medicationName: med.name,
      doseText: med.dose,
    });
    setAnnouncement(`${med.name || "Medication"} recorded as given at ${time}.`);
  }

  const scheduledDoses = medications
    .filter((m) => !m.asNeeded)
    .flatMap((med) => med.times.map((time) => ({ med, time })))
    .sort((a, b) => a.time.localeCompare(b.time) || a.med.name.localeCompare(b.med.name));
  const asNeededMeds = medications.filter((m) => m.asNeeded);

  const recordedCount = scheduledDoses.filter(({ med, time }) => getDose(med.id, time, viewDate)).length;
  const dueCount = scheduledDoses.filter(
    ({ med, time }) => !getDose(med.id, time, viewDate) && (!isToday || time <= nowHm)
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <Tabs tabs={TABS} active={tab} onChange={setTab} label="Medication reminder sections" />

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {tab === "dashboard" ? (
        <MedicationDashboard
          medications={medications}
          entries={entries}
          todayKey={today}
          nowHm={nowHm}
          onExportCsv={handleExportCsv}
        />
      ) : (
        <>
          <div className="no-print rounded-xl border-2 border-border bg-surface px-4 py-3 text-sm text-muted">
            This is a checklist and record, not an alarm. It cannot remind you
            when the page is closed, so please don&apos;t rely on it to prevent
            a missed dose. For time-critical medication, also set an alarm in
            your phone&apos;s own clock or reminder app. Always follow the
            instructions from your doctor or pharmacist.
          </div>

          {medications.length > 0 && (
            <div className="no-print grid gap-3 rounded-2xl border-2 border-border bg-surface p-4 sm:grid-cols-2">
              <div>
                <label htmlFor={dateId} className="mb-1 block font-semibold">
                  Checklist for
                </label>
                <div className="flex gap-2">
                  <input
                    id={dateId}
                    type="date"
                    value={viewDate}
                    max={today}
                    onChange={(e) => setPickedDate(e.target.value || null)}
                    className="touch-target min-w-0 flex-1 rounded-xl border-2 border-border bg-background px-3"
                  />
                  {!isToday && (
                    <button
                      type="button"
                      onClick={() => setPickedDate(null)}
                      className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
                    >
                      Back to today
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor={recordedById} className="mb-1 block font-semibold">
                  Recorded by (optional)
                </label>
                <input
                  id={recordedById}
                  type="text"
                  value={recordedBy}
                  onChange={(e) => setRecordedBy(e.target.value)}
                  maxLength={60}
                  placeholder="Your name or initials"
                  className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
                />
              </div>
            </div>
          )}

          {scheduledDoses.length > 0 && (
            <div className="rounded-2xl border-2 border-border bg-surface p-4">
              <h2 className="font-display text-lg font-bold">
                {isToday ? "Today's checklist" : `Checklist for ${formatDateKey(viewDate)}`}
              </h2>
              <p className="mb-3 text-sm text-muted">
                {recordedCount} of {scheduledDoses.length} doses recorded
                {dueCount > 0
                  ? `. ${dueCount} ${dueCount === 1 ? "dose has" : "doses have"} no record yet${isToday ? " and the time has passed" : ""}.`
                  : "."}
              </p>
              {!isToday && (
                <p className="mb-3 rounded-xl border-2 border-accent bg-accent-soft px-3 py-2 text-sm">
                  You are filling in an earlier day. Only record what you know
                  happened.
                </p>
              )}
              <ul className="flex flex-col gap-2">
                {scheduledDoses.map(({ med, time }) => (
                  <DoseRow
                    key={`${med.id}-${time}`}
                    medication={med}
                    time={time}
                    record={getDose(med.id, time, viewDate)}
                    isDue={!isToday || time <= nowHm}
                    timezone={timezone}
                    onTaken={() => record(med, time, "taken")}
                    onNotTaken={(reason) => record(med, time, "not-taken", reason)}
                    onUndo={() => undo(med, time)}
                  />
                ))}
              </ul>
            </div>
          )}

          {asNeededMeds.length > 0 && isToday && (
            <div className="rounded-2xl border-2 border-border bg-surface p-4">
              <h2 className="font-display text-lg font-bold">As needed medication</h2>
              <p className="mb-3 text-sm text-muted">
                Record each dose when it is given. Only give as-needed
                medication as written in the person&apos;s medication plan.
              </p>
              <ul className="flex flex-col gap-3">
                {asNeededMeds.map((med) => (
                  <AsNeededRow
                    key={med.id}
                    medication={med}
                    givenToday={entries
                      .filter(
                        (e) =>
                          e.kind === "as-needed" && e.medicationId === med.id && e.date === today
                      )
                      .sort((a, b) => a.time.localeCompare(b.time))}
                    onGive={(note) => recordAsNeeded(med, note)}
                    onRemove={(id) => {
                      if (window.confirm("Remove this dose record?")) {
                        removeEntry(id);
                        setAnnouncement("Dose record removed.");
                      }
                    }}
                  />
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border-2 border-border bg-surface p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold">My medications</h2>
              {medications.length > 0 && (
                <div className="no-print flex flex-wrap items-center gap-2">
                  {entries.length > 0 && (
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
                    >
                      ⬇️ Download CSV
                    </button>
                  )}
                  <PrintButton label="Print medication list" />
                </div>
              )}
            </div>

            {medications.length > 0 && (
              <>
                <div className="no-print mb-3 flex flex-col gap-3">
                  {medications.map((med) => (
                    <MedicationCard
                      key={med.id}
                      medication={med}
                      onChange={(patch) => updateMedication(med.id, patch)}
                      onRemove={() => {
                        if (
                          window.confirm(
                            `Remove ${med.name || "this medication"} from the list? Past records stay in the log and CSV.`
                          )
                        ) {
                          removeMedication(med.id);
                        }
                      }}
                    />
                  ))}
                </div>
                <PrintableMedicationList medications={medications} />
              </>
            )}

            <form onSubmit={handleAdd} className="no-print flex flex-col gap-2">
              <label htmlFor="new-medication" className="font-semibold">
                Add a medication
              </label>
              <div className="flex gap-2">
                <input
                  id="new-medication"
                  type="text"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Medication name"
                  maxLength={120}
                  className="touch-target min-w-0 flex-1 rounded-xl border-2 border-border bg-background px-4 py-3"
                />
                <button
                  type="submit"
                  className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
                >
                  Add
                </button>
              </div>
              <label className="touch-target flex items-center gap-3 rounded-xl border-2 border-border bg-background px-3">
                <input
                  type="checkbox"
                  checked={newAsNeeded}
                  onChange={(e) => setNewAsNeeded(e.target.checked)}
                  className="h-6 w-6 shrink-0 accent-brand"
                />
                <span className="text-sm">Taken only as needed (no set times)</span>
              </label>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

function AsNeededRow({
  medication,
  givenToday,
  onGive,
  onRemove,
}: {
  medication: Medication;
  givenToday: { id: string; time: string; reason: string; recordedBy: string }[];
  onGive: (note: string) => void;
  onRemove: (id: string) => void;
}) {
  const [note, setNote] = useState("");
  const noteId = useId();
  return (
    <li className="rounded-xl border-2 border-border bg-background p-3">
      <p className="font-semibold">
        {medication.name || "(unnamed)"}
        {medication.dose ? ` (${medication.dose})` : ""}
      </p>
      {medication.notes && <p className="text-sm text-muted">{medication.notes}</p>}
      {givenToday.length > 0 ? (
        <ul className="mt-2 flex flex-col gap-1">
          {givenToday.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-2 text-sm">
              <span>
                Given at <strong>{e.time}</strong>
                {e.reason ? `: ${e.reason}` : ""}
                {e.recordedBy ? ` (${e.recordedBy})` : ""}
              </span>
              <button
                type="button"
                onClick={() => onRemove(e.id)}
                aria-label={`Remove the ${e.time} dose record`}
                className="no-print touch-target shrink-0 rounded-xl border-2 border-border bg-surface px-3"
              >
                <span aria-hidden="true">🗑️</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-muted">None recorded today.</p>
      )}
      <div className="no-print mt-2 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={noteId} className="sr-only">
          Note for this dose (optional)
        </label>
        <input
          id={noteId}
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={200}
          placeholder="Note, e.g. reason given (optional)"
          className="touch-target min-w-0 flex-1 rounded-xl border-2 border-border bg-surface px-3"
        />
        <button
          type="button"
          onClick={() => {
            onGive(note);
            setNote("");
          }}
          className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
        >
          Record a dose given now
        </button>
      </div>
    </li>
  );
}

/** Clean, read-only list for printing (the editable cards don't print). */
function PrintableMedicationList({ medications }: { medications: Medication[] }) {
  return (
    <table className="hidden w-full border-collapse text-sm print:table">
      <thead>
        <tr>
          <th className="border border-border p-2 text-left">Medication</th>
          <th className="border border-border p-2 text-left">Dose</th>
          <th className="border border-border p-2 text-left">Times</th>
          <th className="border border-border p-2 text-left">Notes</th>
        </tr>
      </thead>
      <tbody>
        {medications.map((m) => (
          <tr key={m.id}>
            <td className="border border-border p-2 font-semibold">{m.name}</td>
            <td className="border border-border p-2">{m.dose}</td>
            <td className="border border-border p-2">
              {m.asNeeded ? "As needed" : m.times.join(", ") || "No times set"}
            </td>
            <td className="border border-border p-2">{m.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
