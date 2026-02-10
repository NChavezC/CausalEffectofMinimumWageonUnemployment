import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

function Robustness_09() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-5xl space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Robustness Checks
        </h1>

        {/* Framing */}
        <div className="space-y-5 text-lg text-gray-700 leading-relaxed max-w-4xl">
          <p>
            Robustness checks evaluate whether the main result is sensitive to
            reasonable alternative choices in the research design.
          </p>
          <p>
            Given the borderline pre-trend evidence, robustness is especially
            important for assessing how stable the estimated effect is under
            variations in the event definition and sample construction.
          </p>
        </div>

        {/* Checklist grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Threshold sensitivity */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">
              1) Event definition sensitivity
            </p>
            <h2 className="text-xl font-semibold text-gray-900">
              Vary the “sharp increase” threshold
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Re-estimate using alternative <InlineMath math={`n_\\sigma`} />{" "}
              values (e.g., 0.5, 1, 2, 3). If the effect is real, the direction
              and magnitude should remain broadly consistent for plausible
              thresholds.
            </p>
            <div className="bg-gray-50 border rounded p-4 text-sm text-gray-700">
              Example: compare results for n_sigma = 1 vs 2 vs 3
            </div>
          </div>

          {/* Window sensitivity */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">2) Event window sensitivity</p>
            <h2 className="text-xl font-semibold text-gray-900">
              Change the lead/lag window
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Re-run the stacked event-study with alternative windows (e.g.,{" "}
              <span className="font-medium text-gray-900">[−2,+5]</span>,{" "}
              <span className="font-medium text-gray-900">[−3,+4]</span>,{" "}
              <span className="font-medium text-gray-900">[−4,+6]</span>). This
              checks whether results depend on the chosen horizon or thin
              support at the edges.
            </p>
            <div className="bg-gray-50 border rounded p-4 text-sm text-gray-700">
              Also report support-by-event-time for transparency.
            </div>
          </div>

          {/* Clean controls / overlap */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">3) Sample construction</p>
            <h2 className="text-xl font-semibold text-gray-900">
              Tighten or relax clean-control rules
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Test whether results persist when the control pool changes. For
              example, require no sharp increases in a slightly wider window, or
              allow a narrower exclusion window and compare estimates.
            </p>
            <div className="bg-gray-50 border rounded p-4 text-sm text-gray-700">
              Goal: verify the result is not driven by contamination or
              selection in controls.
            </div>
          </div>

          {/* Placebo checks */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">4) Placebo / falsification</p>
            <h2 className="text-xl font-semibold text-gray-900">
              Run placebo timing checks
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Assign placebo event years (e.g., shift events earlier by 2–3
              years) and re-estimate. A credible design should show no
              systematic “effects” under placebo timing.
            </p>
            <div className="bg-gray-50 border rounded p-4 text-sm text-gray-700">
              If placebo effects appear, revisit pre-trends and event
              definition.
            </div>
          </div>
        </div>

        {/* Implementation note */}
        <div className="bg-white border-l-4 border-blue-400 rounded p-5 max-w-4xl">
          <p className="text-gray-800 font-medium">Implementation plan:</p>
          <p className="text-gray-700 leading-relaxed">
            The web app will progressively add these checks and display the
            updated event-study and ATT side-by-side, so readers can see how
            sensitive results are to key modeling choices.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Button onClick={() => navigate("/08")}>← Go Back</Button>
          <Button onClick={() => navigate("/10")}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default Robustness_09;
