import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

function ATT_08() {
  const navigate = useNavigate();

  const [att, setAtt] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus({ loading: true, error: null });
        const res = await fetch("../../public/att_summary.json");
        if (!res.ok)
          throw new Error(
            `Failed to fetch ../../public/att_summary.json (${res.status})`,
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

  const fmt = (v, digits = 4) =>
    typeof v === "number" && Number.isFinite(v) ? v.toFixed(digits) : "—";

  const fmtP = (v) =>
    typeof v === "number" && Number.isFinite(v) ? v.toFixed(4) : "—";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-4xl space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Average Treatment Effect (ATT)
        </h1>

        {/* Explanation */}
        <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
          <p>
            While the event-study plot shows the full dynamic path, it is often
            useful to summarize the overall post-treatment effect with a single
            number.
          </p>
          <p>
            Here, the ATT is defined transparently as the{" "}
            <span className="font-medium text-gray-900">
              average of post-event coefficients
            </span>{" "}
            for event time <InlineMath math={`t=0,...,5`} />, relative to{" "}
            <InlineMath math={`t=-1`} />.
          </p>
        </div>

        {/* Main metric card */}
        <div className="bg-white rounded-lg border p-6">
          {status.loading ? (
            <div className="space-y-3">
              <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />
              <div className="h-12 w-64 animate-pulse rounded bg-gray-50" />
              <div className="h-5 w-56 animate-pulse rounded bg-gray-50" />
            </div>
          ) : status.error ? (
            <div>
              <p className="text-sm font-medium text-gray-900">ATT summary</p>
              <p className="mt-2 text-sm text-red-600">Error: {status.error}</p>
              <p className="mt-2 text-xs text-gray-500">
                Ensure{" "}
                <span className="font-mono">public/data/att_summary.json</span>{" "}
                exists.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">
                  Estimated average effect (pp)
                </p>
                <p className="mt-1 text-4xl md:text-5xl font-semibold text-gray-900">
                  {fmt(att?.att, 4)}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Change in unemployment rate (percentage points), averaged over{" "}
                  <InlineMath math={`t=0,...,5`} />.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 border rounded p-4">
                  <p className="text-sm text-gray-500">Cluster-robust SE</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {fmt(att?.se_cluster, 4)}
                  </p>
                </div>

                <div className="bg-gray-50 border rounded p-4">
                  <p className="text-sm text-gray-500">p-value</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {fmtP(att?.p_value)}
                  </p>
                </div>

                <div className="bg-gray-50 border rounded p-4">
                  <p className="text-sm text-gray-500">Event window</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {Array.isArray(att?.window)
                      ? `[${att.window[0]}, ${att.window[1]}]`
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="bg-white border-l-4 border-blue-400 rounded p-4">
                <p className="text-gray-800 font-medium">Interpretation:</p>
                <p className="text-gray-700 leading-relaxed">
                  On average, sharp minimum wage increases are associated with a{" "}
                  <span className="font-medium text-gray-900">
                    {fmt(att?.att, 4)} percentage point
                  </span>{" "}
                  change in the unemployment rate over the five years after the
                  increase, relative to the year before the increase. Inference
                  uses{" "}
                  <span className="font-medium text-gray-900">
                    state-clustered
                  </span>{" "}
                  standard errors.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Button onClick={() => navigate("/07")}>← Go Back</Button>
          <Button onClick={() => navigate("/09")}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default ATT_08;
