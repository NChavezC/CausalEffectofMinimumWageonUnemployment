import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

function Data_05() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-4xl space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Data
        </h1>

        {/* Intro */}
        <p className="text-lg text-gray-700 leading-relaxed">
          The analysis uses an annual panel of{" "}
          <span className="font-medium text-gray-900">U.S. states</span> over
          multiple decades to study how unemployment evolves around{" "}
          <span className="font-medium text-gray-900">
            sharp minimum wage increases
          </span>
          .
        </p>

        {/* Source attribution */}
        <div className="bg-white rounded-lg border p-6 space-y-3">
          <p className="text-sm text-gray-500">Data source</p>
          <p className="text-gray-700 leading-relaxed">
            All economic series are obtained programmatically from the{" "}
            <span className="font-medium text-gray-900">
              Federal Reserve Economic Data (FRED) API
            </span>
            , ensuring reproducibility and transparency.
          </p>

          <p className="text-sm text-gray-600">
            The full data construction and cleaning pipeline is implemented in R
            and available in the project repository:
          </p>

          <a
            href="https://github.com/NChavezC/CausalEffectofMinimumWageonUnemployment/blob/main/public/DatasetImport.R"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-blue-600 hover:text-blue-800 underline"
          >
            View data pipeline (R code) →
          </a>
        </div>

        {/* Key facts cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6 space-y-2">
            <p className="text-sm text-gray-500">Unit of observation</p>
            <p className="text-lg font-semibold text-gray-900">State × Year</p>
            <p className="text-sm text-gray-600">
              Panel structure used to construct event windows.
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6 space-y-2">
            <p className="text-sm text-gray-500">Outcome</p>
            <p className="text-lg font-semibold text-gray-900">
              Unemployment rate
            </p>
            <p className="text-sm text-gray-600">
              Annual state unemployment rate (
              <span className="font-medium">unemp_rate</span>).
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6 space-y-2">
            <p className="text-sm text-gray-500">Policy variable</p>
            <p className="text-lg font-semibold text-gray-900">
              State minimum wage
            </p>
            <p className="text-sm text-gray-600">
              Annual minimum wage level by state (
              <span className="font-medium">min_wage</span>).
            </p>
          </div>
        </div>

        {/* Data usage */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            How the data is used in the design
          </h2>

          <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
            <li>
              Compute year-over-year changes in minimum wage (
              <InlineMath math={`\\Delta MW_{s,t}`} />)
            </li>
            <li>
              Identify sharp increases using a state-specific volatility
              threshold
            </li>
            <li>
              Construct event windows around each increase (
              <InlineMath math={`t = -3,...,+5`} />)
            </li>
            <li>
              Stack all events and estimate dynamic effects with{" "}
              <span className="font-medium text-gray-900">
                state and year fixed effects
              </span>
            </li>
          </ul>
        </div>

        {/* Caveat */}
        <div className="bg-white border-l-4 border-amber-400 rounded p-5">
          <p className="text-gray-800 font-medium">Important note:</p>
          <p className="text-gray-700 leading-relaxed">
            States may experience multiple minimum wage increases over time.
            Each qualifying sharp increase is treated as a separate event, while
            overlapping treatment windows are excluded to preserve clean
            identification.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button onClick={() => navigate("/04")}>← Go Back</Button>
          <Button onClick={() => navigate("/06")}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default Data_05;
