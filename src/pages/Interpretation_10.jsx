import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

function Interpretation_10() {
  const navigate = useNavigate();

  const [att, setAtt] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus({ loading: true, error: null });
        const res = await fetch("/att_summary.json");
        if (!res.ok)
          throw new Error(
            `Failed to fetch /../../public/att_summary.json (${res.status})`,
          );
        const json = await res.json();
        if (!cancelled) {
          setAtt(json);
          setStatus({ loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setStatus({
            loading: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const fmt = (v, digits = 3) =>
    typeof v === "number" && Number.isFinite(v) ? v.toFixed(digits) : "—";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-5xl space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Interpretation
        </h1>

        {/* Core message */}
        <div className="space-y-5 text-lg text-gray-700 leading-relaxed max-w-4xl">
          <p>
            The estimates suggest that sharp minimum wage increases are followed
            by a modest rise in unemployment relative to the year before the
            increase.
          </p>
          <p>
            Interpreting this result requires separating{" "}
            <span className="font-medium text-gray-900">
              what the design identifies
            </span>{" "}
            from{" "}
            <span className="font-medium text-gray-900">what it does not</span>.
          </p>
        </div>

        {/* What it means / What it doesn't mean */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What it means */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              What this means
            </h2>

            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>
                This is a{" "}
                <span className="font-medium text-gray-900">local</span>{" "}
                comparison: treated states are compared to clean-control states
                within a narrow event window.
              </li>
              <li>
                Effects are interpreted{" "}
                <span className="font-medium text-gray-900">
                  relative to <InlineMath math={`t = −1`} />
                </span>
                , so the estimates capture changes after the policy increase,
                net of state and year fixed effects.
              </li>
              <li>
                The ATT summarizes the average post-period effect for{" "}
                <InlineMath math={`t = 0,…,5`} />.
              </li>
            </ul>

            <div className="bg-gray-50 border rounded p-4">
              <p className="text-sm text-gray-500">ATT (post-period average)</p>
              {status.loading ? (
                <div className="mt-2 h-7 w-40 animate-pulse rounded bg-gray-100" />
              ) : status.error ? (
                <p className="mt-2 text-sm text-red-600">{status.error}</p>
              ) : (
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {fmt(att?.att, 4)} pp
                </p>
              )}
              <p className="mt-2 text-sm text-gray-600">
                Average change in unemployment rate (percentage points),
                relative to the year before.
              </p>
            </div>
          </div>

          {/* What it does NOT mean */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              What this does not mean
            </h2>

            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>
                It does <span className="font-medium text-gray-900">not</span>{" "}
                claim a universal effect of all minimum wage changes—only the
                subset classified as{" "}
                <span className="font-medium text-gray-900">
                  sharp increases
                </span>
                .
              </li>
              <li>
                It does <span className="font-medium text-gray-900">not</span>{" "}
                prove a single mechanism (e.g., reduced hiring). The outcome is
                unemployment, which can move for multiple reasons.
              </li>
              <li>
                Because pre-trends are borderline, the result should be
                interpreted{" "}
                <span className="font-medium text-gray-900">
                  conservatively
                </span>{" "}
                and alongside robustness checks.
              </li>
            </ul>

            <div className="bg-white border-l-4 border-amber-400 rounded p-4">
              <p className="text-gray-800 font-medium">Caution:</p>
              <p className="text-gray-700 leading-relaxed">
                If treated states were already on a different trajectory before
                the increase, part of the post-event change could reflect
                continuation of earlier trends.
              </p>
            </div>
          </div>
        </div>

        {/* Practical takeaway */}
        <div className="bg-white border-l-4 border-blue-400 rounded p-5 max-w-4xl">
          <p className="text-gray-800 font-medium">Practical takeaway:</p>
          <p className="text-gray-700 leading-relaxed">
            The most credible interpretation is that{" "}
            <span className="font-medium text-gray-900">
              large, sudden minimum wage increases
            </span>{" "}
            may be followed by a small increase in unemployment in the
            short-to-medium run, but uncertainty around pre-trends means the
            effect size should be treated as approximate and stress-tested with
            robustness checks.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Button onClick={() => navigate("/09")}>← Go Back</Button>
          <Button onClick={() => navigate("/11")}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default Interpretation_10;
