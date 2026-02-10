import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

function EventStudyResults_06() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-5xl space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Event Study Results
        </h1>

        {/* High-level takeaway */}
        <p className="text-lg text-gray-700 leading-relaxed max-w-4xl">
          The figure below shows the estimated dynamic effect of sharp minimum
          wage increases on state unemployment, relative to the year before the
          increase (<InlineMath math={`t=1`} />
          ).
        </p>

        {/* Plot placeholder */}
        <img
          src="/event_study_sharp_mw.png"
          alt="Event study plot"
          className="w-full rounded-lg border"
        />

        {/* Interpretation bullets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6 space-y-2">
            <p className="text-sm text-gray-500">Pre-treatment period</p>
            <p className="text-gray-700 leading-relaxed">
              Estimates for years prior to the increase are close to zero,
              suggesting no large differential trends before treatment.
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6 space-y-2">
            <p className="text-sm text-gray-500">Post-treatment dynamics</p>
            <p className="text-gray-700 leading-relaxed">
              After the increase, unemployment rises modestly and persists for
              several years, relative to the pre-treatment baseline.
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6 space-y-2">
            <p className="text-sm text-gray-500">Normalization</p>
            <p className="text-gray-700 leading-relaxed">
              The effect at <InlineMath math={`t=1`} /> is normalized to zero by
              construction and therefore has no confidence interval.
            </p>
          </div>
        </div>

        {/* Caution box */}
        <div className="bg-white border-l-4 border-blue-400 rounded p-5 max-w-4xl">
          <p className="text-gray-800 font-medium">How to read this figure:</p>
          <p className="text-gray-700 leading-relaxed">
            Each point compares treated states to clean control states at the
            same event time, within a narrow window around the policy change.
            The pattern of coefficients—not any single estimate—is the primary
            object of interest.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 max-w-4xl">
          <Button onClick={() => navigate("/05")}>← Go Back</Button>
          <Button onClick={() => navigate("/07")}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default EventStudyResults_06;
