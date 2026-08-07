"use client";

import {
  LOW_ACTION_SUGGESTIONS,
  HIGH_ACTION_SUGGESTIONS,
  CORRECTION_SCALE_SUGGESTIONS,
  SICK_DAY_SUGGESTIONS,
} from "@/lib/diabetes-tracker-data";
import { useDiabetesManagementPlan } from "@/lib/diabetes-management-plan-storage";
import EditableListSection from "@/components/EditableListSection";
import PrintButton from "@/components/PrintButton";

export default function DiabetesManagementPlan() {
  const { plan, updateField, clearPlan } = useDiabetesManagementPlan();

  const hasTargetRange = plan.targetLowMmol !== "" && plan.targetHighMmol !== "";

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear this whole management plan? This can't be undone.")) {
              clearPlan();
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
        >
          Clear plan
        </button>
        <PrintButton label="Print plan" />
      </div>

      {/* The visual, printable summary - this is the "poster" version to
          stick on the fridge, send to school, or hand to a support worker. */}
      <div className="print-avoid-break rounded-2xl border-2 border-brand bg-surface p-4">
        <h2 className="font-display mb-3 text-xl font-bold">
          {plan.doctorName ? `${plan.doctorName}'s ` : "My "}Diabetes Management Plan
        </h2>

        {!hasTargetRange ? (
          <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
            Fill in the target range below to build the visual plan.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {plan.emergencyLowMmol && (
              <ZoneCard
                color="var(--sev-5)"
                label={`Below ${plan.emergencyLowMmol} mmol/L - Emergency low`}
                steps={["Follow severe hypo plan from your care team", "If unconscious or seizing: call 000 and use glucagon if prescribed"]}
              />
            )}
            <ZoneCard
              color="var(--sev-4)"
              label={`Below ${plan.targetLowMmol} mmol/L - Low`}
              steps={plan.lowActionSteps}
            />
            <ZoneCard
              color="var(--sev-1)"
              label={`${plan.targetLowMmol}-${plan.targetHighMmol} mmol/L - Target range`}
              steps={["No action needed"]}
            />
            <ZoneCard
              color="var(--sev-3)"
              label={`Above ${plan.targetHighMmol} mmol/L - High`}
              steps={plan.highActionSteps}
            />
            {plan.emergencyHighMmol && (
              <ZoneCard
                color="var(--sev-5)"
                label={`Above ${plan.emergencyHighMmol} mmol/L - Emergency high`}
                steps={["Follow severe hyper plan from your care team", "Contact doctor urgently - go to hospital if directed"]}
              />
            )}
          </div>
        )}

        {(plan.carbRatio || plan.basalInsulin || plan.correctionScale.length > 0) && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {plan.carbRatio && (
              <div className="rounded-xl border-2 border-border bg-background p-3">
                <p className="text-xs font-semibold text-muted">Carb ratio</p>
                <p className="font-semibold">{plan.carbRatio}</p>
              </div>
            )}
            {plan.basalInsulin && (
              <div className="rounded-xl border-2 border-border bg-background p-3">
                <p className="text-xs font-semibold text-muted">Basal/long-acting insulin</p>
                <p className="font-semibold">{plan.basalInsulin}</p>
              </div>
            )}
          </div>
        )}

        {plan.correctionScale.length > 0 && (
          <div className="mt-3 rounded-xl border-2 border-border bg-background p-3">
            <p className="mb-1 text-xs font-semibold text-muted">Insulin correction scale</p>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {plan.correctionScale.map((row) => (
                <li key={row}>{row}</li>
              ))}
            </ul>
          </div>
        )}

        {(plan.doctorName || plan.doctorPhone || plan.diabetesEducatorName || plan.nextAppointment) && (
          <div className="mt-3 rounded-xl border-2 border-border bg-background p-3 text-sm">
            <p className="mb-1 text-xs font-semibold text-muted">Care team</p>
            {plan.doctorName && <p>Doctor: {plan.doctorName} {plan.doctorPhone && `- ${plan.doctorPhone}`}</p>}
            {plan.diabetesEducatorName && <p>Diabetes educator: {plan.diabetesEducatorName}</p>}
            {plan.nextAppointment && (
              <p>Next appointment: {new Date(plan.nextAppointment).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p>
            )}
          </div>
        )}

        {plan.otherNotes && (
          <div className="mt-3 rounded-xl border-2 border-border bg-background p-3 text-sm">
            <p className="mb-1 text-xs font-semibold text-muted">Other notes</p>
            <p>{plan.otherNotes}</p>
          </div>
        )}

        <p className="mt-3 text-xs text-muted">
          {plan.lastConfirmed
            ? `Last confirmed with the doctor/diabetes educator: ${new Date(plan.lastConfirmed).toLocaleDateString("en-AU")}`
            : "Add the date this plan was last confirmed with the doctor, below, so it's clear how current it is."}
        </p>
      </div>

      {/* Editable source - fill this in from the doctor's/diabetes
          educator's actual written plan. */}
      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-1 text-lg font-bold">Fill in from your doctor&apos;s plan</h2>
        <p className="mb-3 text-sm text-muted">
          Enter exactly what your own doctor or diabetes educator has told
          you - this tool never sets or suggests these numbers itself.
        </p>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Target range - low (mmol/L)</span>
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              value={plan.targetLowMmol}
              onChange={(e) => updateField("targetLowMmol", e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Target range - high (mmol/L)</span>
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              value={plan.targetHighMmol}
              onChange={(e) => updateField("targetHighMmol", e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Emergency low threshold (mmol/L)</span>
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              value={plan.emergencyLowMmol}
              onChange={(e) => updateField("emergencyLowMmol", e.target.value)}
              placeholder="Optional"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Emergency high threshold (mmol/L)</span>
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              value={plan.emergencyHighMmol}
              onChange={(e) => updateField("emergencyHighMmol", e.target.value)}
              placeholder="Optional"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Carb ratio</span>
            <input
              type="text"
              value={plan.carbRatio}
              onChange={(e) => updateField("carbRatio", e.target.value)}
              maxLength={100}
              placeholder="e.g. 1 unit per 10g carbs"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Basal/long-acting insulin</span>
            <input
              type="text"
              value={plan.basalInsulin}
              onChange={(e) => updateField("basalInsulin", e.target.value)}
              maxLength={100}
              placeholder="e.g. Lantus, 10 units at 8pm"
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
        </div>

        <EditableListSection
          title="If BGL is low"
          description="Steps from your doctor's plan for treating a low"
          placeholder="e.g. Give 15g fast-acting carbs"
          items={plan.lowActionSteps}
          suggestions={LOW_ACTION_SUGGESTIONS}
          onChange={(items) => updateField("lowActionSteps", items)}
        />

        <div className="h-3" />

        <EditableListSection
          title="If BGL is high"
          description="Steps from your doctor's plan for treating a high"
          placeholder="e.g. Check for ketones"
          items={plan.highActionSteps}
          suggestions={HIGH_ACTION_SUGGESTIONS}
          onChange={(items) => updateField("highActionSteps", items)}
        />

        <div className="h-3" />

        <EditableListSection
          title="Insulin correction scale"
          description="Your doctor's sliding scale, written out in your own words"
          placeholder="e.g. 10-14 mmol/L: 2 units"
          items={plan.correctionScale}
          suggestions={CORRECTION_SCALE_SUGGESTIONS}
          onChange={(items) => updateField("correctionScale", items)}
        />

        <div className="h-3" />

        <EditableListSection
          title="Sick day rules"
          description="What to do differently when unwell"
          placeholder="e.g. Check BGL every 2-4 hours"
          items={plan.sickDayRules}
          suggestions={SICK_DAY_SUGGESTIONS}
          onChange={(items) => updateField("sickDayRules", items)}
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Doctor&apos;s name</span>
            <input
              type="text"
              value={plan.doctorName}
              onChange={(e) => updateField("doctorName", e.target.value)}
              maxLength={120}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Doctor&apos;s phone</span>
            <input
              type="tel"
              value={plan.doctorPhone}
              onChange={(e) => updateField("doctorPhone", e.target.value)}
              maxLength={40}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Diabetes educator&apos;s name</span>
            <input
              type="text"
              value={plan.diabetesEducatorName}
              onChange={(e) => updateField("diabetesEducatorName", e.target.value)}
              maxLength={120}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Next appointment</span>
            <input
              type="date"
              value={plan.nextAppointment}
              onChange={(e) => updateField("nextAppointment", e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Plan last confirmed with doctor</span>
            <input
              type="date"
              value={plan.lastConfirmed}
              onChange={(e) => updateField("lastConfirmed", e.target.value)}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-3"
            />
          </label>
        </div>

        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-semibold">Other notes</span>
          <textarea
            value={plan.otherNotes}
            onChange={(e) => updateField("otherNotes", e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full touch-target rounded-xl border-2 border-border bg-background px-4 py-3"
          />
        </label>
      </div>
    </div>
  );
}

function ZoneCard({ color, label, steps }: { color: string; label: string; steps: string[] }) {
  return (
    <div className="rounded-xl border-2 bg-background p-3" style={{ borderColor: color }}>
      <p className="font-display font-bold" style={{ color }}>
        {label}
      </p>
      {steps.length > 0 && (
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
