import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

function Pretrends_07() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-4xl space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Pre-trends (Validation Check)
        </h1>

        {/* Explanation */}
        <div className="space-y-5 text-lg text-gray-700 leading-relaxed">
          <p>
            The stacked event-study design relies on a{" "}
            <span className="font-medium text-gray-900">
              local parallel trends
            </span>{" "}
            assumption: in the absence of a sharp minimum wage increase, treated
            and clean-control states would have followed similar unemployment
            trends within the event window.
          </p>

          <p>
            A standard diagnostic is to test whether the{" "}
            <span className="font-medium text-gray-900">lead coefficients</span>{" "}
            (pre-treatment estimates) are jointly equal to zero.
          </p>
        </div>

        {/* Test box */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Joint Wald test on leads
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 border rounded p-4">
              <p className="text-sm text-gray-500">Null hypothesis</p>
              <BlockMath math={`H_0=\\beta_{-3}=\\beta_{-2}=0`} />
            </div>

            <div className="bg-gray-50 border rounded p-4">
              <p className="text-sm text-gray-500">Test statistic</p>
              <BlockMath math={`\\chi^2(2)=2.61`} />
            </div>

            <div className="bg-gray-50 border rounded p-4">
              <p className="text-sm text-gray-500">p-value</p>
              <BlockMath math={`0.073`} />
            </div>
          </div>

          <div className="bg-white border-l-4 border-amber-400 rounded p-4">
            <p className="text-gray-800 font-medium">Interpretation:</p>
            <p className="text-gray-700 leading-relaxed">
              We do <span className="font-medium text-gray-900">not</span>{" "}
              reject the joint null at the 5% level, but the p-value is
              borderline at 10%. This suggests{" "}
              <span className="font-medium text-gray-900">
                mild evidence of pre-trends
              </span>{" "}
              and motivates conservative interpretation and robustness checks.
            </p>
          </div>
        </div>

        {/* Why it matters */}
        <div className="bg-white border-l-4 border-blue-400 rounded p-5">
          <p className="text-gray-800 font-medium">Why this matters:</p>
          <p className="text-gray-700 leading-relaxed">
            If unemployment was already rising in treated states before the
            policy change, part of the post-period increase could reflect
            continuation of prior trends rather than a causal effect of the
            minimum wage increase.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button onClick={() => navigate("/06")}>← Go Back</Button>
          <Button onClick={() => navigate("/08")}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default Pretrends_07;
