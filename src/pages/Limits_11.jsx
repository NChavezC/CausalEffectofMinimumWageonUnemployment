import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function Limits_11() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-5xl space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Limits & Caveats
        </h1>

        {/* Framing */}
        <div className="space-y-5 text-lg text-gray-700 leading-relaxed max-w-4xl">
          <p>
            This project is designed as an applied causal inference analysis,
            with explicit transparency about assumptions and diagnostics. Like
            any observational design, it has limitations that affect how results
            should be interpreted.
          </p>
        </div>

        {/* Limits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Local identification */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">1) Identification is local</p>
            <h2 className="text-xl font-semibold text-gray-900">
              Local parallel trends, not global
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The design identifies effects within a narrow event window around
              sharp increases. It does not claim that treated and control states
              follow parallel trends over long horizons.
            </p>
          </div>

          {/* Pre-trends borderline */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">
              2) Pre-trends are borderline
            </p>
            <h2 className="text-xl font-semibold text-gray-900">
              Some evidence of differential trends
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The joint test of lead coefficients is not rejected at 5%, but is
              borderline at 10%. This raises the possibility that part of the
              post-treatment pattern reflects prior momentum.
            </p>
          </div>

          {/* Event definition */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">3) Event definition matters</p>
            <h2 className="text-xl font-semibold text-gray-900">
              “Sharp increase” threshold is a design choice
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Treatment events are defined using a state-specific volatility
              threshold (n_sigma). Different thresholds can change the set of
              events and therefore the estimand. This is why sensitivity checks
              are essential.
            </p>
          </div>

          {/* Outcome scope */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">4) Outcome is high-level</p>
            <h2 className="text-xl font-semibold text-gray-900">
              Unemployment is not the whole labor market
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Unemployment can change due to employment, labor force
              participation, and measurement dynamics. The analysis does not
              directly measure hours, wages, job flows, or sector-specific
              effects.
            </p>
          </div>

          {/* Mechanisms */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">
              5) Mechanisms are not identified
            </p>
            <h2 className="text-xl font-semibold text-gray-900">
              Reduced hiring vs. other channels
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The design estimates a reduced-form effect on unemployment. It
              cannot isolate mechanisms such as changes in hiring, separations,
              participation, or compositional changes in the workforce.
            </p>
          </div>

          {/* External validity */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">6) External validity</p>
            <h2 className="text-xl font-semibold text-gray-900">
              Results may not generalize to small changes
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Because events are restricted to sharp increases, the results
              should not be extrapolated to incremental or routine adjustments
              (e.g., indexation-style changes).
            </p>
          </div>
        </div>

        {/* Bottom line box */}
        <div className="bg-white border-l-4 border-amber-400 rounded p-5 max-w-4xl">
          <p className="text-gray-800 font-medium">Bottom line:</p>
          <p className="text-gray-700 leading-relaxed">
            The project provides a transparent and reproducible estimate of
            dynamic effects under a credible local comparison design. The
            conclusions should be interpreted conservatively and evaluated
            alongside robustness checks that stress-test the event definition
            and sample construction.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Button onClick={() => navigate("/10")}>← Go Back</Button>
          <Button onClick={() => navigate("/12")}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default Limits_11;
