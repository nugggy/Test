"use client";

import { useHolidayPlan } from "@/lib/holiday-planner-storage";
import EditableListSection from "@/components/EditableListSection";
import ChecklistSection from "@/components/ChecklistSection";
import PrintButton from "@/components/PrintButton";
import { budgetTotal, tripLength, tripStatus } from "@/lib/holiday-planner-calc";
import { formatDateOnly } from "@/lib/budget-calc";
import { formatCurrency } from "@/lib/budget-data";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

const ACCOMMODATION_SUGGESTIONS = [
  "Hotel booking - confirmation number...",
  "Flight - booking reference...",
  "Train/coach - booking reference...",
  "Airport transfer booked",
  "Accessible room/seating requested",
  "Airline told about my support needs",
];

const ITINERARY_SUGGESTIONS = [
  "Day 1: Travel day",
  "Day 2: Rest and settle in",
  "Last day: Pack up and travel home",
];

const PACKING_SUGGESTIONS = [
  "Medication (enough for the whole trip, plus a few extra days)",
  "NDIS plan / support documents",
  "Chargers",
  "Comfort item",
  "Headphones",
  "Sensory/regulation tools",
  "Weather-appropriate clothing",
  "Communication device/board",
  "Medication in my carry-on bag, with a copy of my scripts",
  "Phone charger and power bank",
];

const DOCUMENTS_SUGGESTIONS = [
  "Photo ID",
  "Medicare card",
  "NDIS plan copy",
  "Travel insurance details",
  "Tickets/bookings",
  "Medication list from GP",
  "Emergency contact card",
  "Companion Card (if I have one)",
  "Accessible parking permit (if I have one)",
];

const BUDGET_SUGGESTIONS = [
  "Flights/travel - $",
  "Accommodation - $",
  "Food - $",
  "Activities - $",
  "Spending money - $",
];

export default function HolidayPlanner() {
  const { plan, updateField, clearPlan } = useHolidayPlan();
  const { timezone } = useTimezone();
  const today = getTodayDateString(timezone);
  const status = tripStatus(plan.startDate, plan.endDate, today);
  const length = tripLength(plan.startDate, plan.endDate);
  const budget = budgetTotal(plan.budget);
  const datesBackwards = !!plan.startDate && !!plan.endDate && plan.endDate < plan.startDate;

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear this whole plan? This can't be undone.")) {
              clearPlan();
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
        >
          Clear plan
        </button>
        <PrintButton />
      </div>

      <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display text-lg font-bold">Trip details</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-sm sm:col-span-1">
            <span className="mb-1 block font-semibold text-muted">Destination</span>
            <input
              type="text"
              value={plan.destination}
              onChange={(e) => updateField("destination", e.target.value)}
              maxLength={140}
              placeholder="e.g. Gold Coast"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-muted">Start date</span>
            <input
              type="date"
              value={plan.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-muted">End date</span>
            <input
              type="date"
              value={plan.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
        </div>
        {datesBackwards && (
          <p className="mt-2 text-sm font-semibold" role="alert">
            <span aria-hidden="true">⚠️ </span>The end date is before the start date.
          </p>
        )}
        {status.kind !== "none" && (
          <div className="mt-3 rounded-xl border-2 border-brand bg-brand-soft p-3 text-center" aria-live="polite">
            <p className="font-display text-2xl font-bold">
              {status.kind === "upcoming" && (
                <>
                  <span aria-hidden="true">🗓️ </span>
                  {status.sleeps} {status.sleeps === 1 ? "sleep" : "sleeps"} until the trip
                </>
              )}
              {status.kind === "today" && (
                <>
                  <span aria-hidden="true">🎒 </span>The trip starts today!
                </>
              )}
              {status.kind === "during" && (
                <>
                  <span aria-hidden="true">🏖️ </span>Day {status.day} of {status.of}
                </>
              )}
              {status.kind === "finished" && (
                <>
                  <span aria-hidden="true">🏠 </span>This trip has finished
                </>
              )}
            </p>
            <p className="text-sm">
              {formatDateOnly(plan.startDate)}
              {plan.endDate && ` to ${formatDateOnly(plan.endDate)}`}
              {length && ` · ${length.days} ${length.days === 1 ? "day" : "days"}, ${length.nights} ${length.nights === 1 ? "night" : "nights"}`}
            </p>
          </div>
        )}
        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-semibold text-muted">
            Overview - what&apos;s this trip for, and anything a support person should know
          </span>
          <textarea
            value={plan.overview}
            onChange={(e) => updateField("overview", e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="e.g. Family holiday. I get overwhelmed at airports - allow extra time and a quiet spot if possible."
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
          />
        </label>
      </div>

      <EditableListSection
        title="Accommodation & transport"
        description="Bookings, confirmation numbers, and any access requirements"
        placeholder="e.g. Hotel - confirmation ABC123"
        items={plan.accommodationAndTransport}
        suggestions={ACCOMMODATION_SUGGESTIONS}
        onChange={(items) => updateField("accommodationAndTransport", items)}
      />

      <EditableListSection
        title="Itinerary"
        description="A rough plan for each day - as much or as little detail as helps"
        placeholder="e.g. Day 3: Beach in the morning, rest in the afternoon"
        items={plan.itinerary}
        suggestions={ITINERARY_SUGGESTIONS}
        onChange={(items) => updateField("itinerary", items)}
      />

      <ChecklistSection
        title="Packing checklist"
        description="Tick things off as you pack them"
        placeholder="e.g. Sunhat"
        items={plan.packingChecklist}
        suggestions={PACKING_SUGGESTIONS}
        onChange={(items) => updateField("packingChecklist", items)}
      />

      <ChecklistSection
        title="Documents checklist"
        description="Important paperwork to bring"
        placeholder="e.g. Travel insurance policy number"
        items={plan.documentsChecklist}
        suggestions={DOCUMENTS_SUGGESTIONS}
        onChange={(items) => updateField("documentsChecklist", items)}
      />

      <EditableListSection
        title="Budget"
        description="Write each cost with a $ amount, e.g. Food - $200. The total is added up for you."
        placeholder="e.g. Flights - $450"
        items={plan.budget}
        suggestions={BUDGET_SUGGESTIONS}
        onChange={(items) => updateField("budget", items)}
      />
      {budget.counted > 0 && (
        <p className="-mt-2 rounded-xl border-2 border-border bg-surface-2 p-3 font-semibold">
          Budget total: {formatCurrency(budget.total)}
          {budget.skipped > 0 && (
            <span className="block text-sm font-normal text-muted">
              {budget.skipped} {budget.skipped === 1 ? "line has" : "lines have"} no $ amount, so{" "}
              {budget.skipped === 1 ? "it is" : "they are"} not counted.
            </span>
          )}
        </p>
      )}

      <EditableListSection
        title="Emergency contacts"
        description="Who to call while away, and how to reach them"
        placeholder="e.g. Mum - 0412 345 678"
        items={plan.emergencyContacts}
        onChange={(items) => updateField("emergencyContacts", items)}
      />
    </div>
  );
}
