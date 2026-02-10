import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function Repro_12() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-5xl space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Reproducibility
        </h1>

        {/* Core framing */}
        <div className="space-y-5 text-lg text-gray-700 leading-relaxed max-w-4xl">
          <p>
            This project is designed to be fully reproducible: data is pulled
            from public APIs, transformed via a transparent pipeline, and
            exported into a frontend-friendly format for visualization and
            reporting.
          </p>
          <p>
            The goal is for any reviewer to be able to replicate the analysis
            end-to-end with a single command, and to verify that the figures
            shown in this webapp match the underlying estimation outputs.
          </p>
        </div>

        {/* Repro checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">1) Data sourcing</p>
            <h2 className="text-xl font-semibold text-gray-900">
              FRED API pipeline
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Economic series are fetched programmatically from the{" "}
              <span className="font-medium text-gray-900">FRED API</span>,
              ensuring the raw data inputs are public and versionable.
            </p>
            <div className="bg-gray-50 border rounded p-4 text-sm text-gray-700">
              Output: cleaned state-year panel used for the stacked event study
            </div>
          </div>

          {/* Estimation */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">2) Estimation</p>
            <h2 className="text-xl font-semibold text-gray-900">
              Scripted, not manual
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Event construction, clean-control filtering, regression
              estimation, and inference are all executed via a single R script.
              No manual editing of results.
            </p>
            <div className="bg-gray-50 border rounded p-4 text-sm text-gray-700">
              Inference: state-clustered standard errors; transparent pre-trend
              test and ATT
            </div>
          </div>

          {/* Export contract */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">
              3) Data contract to the webapp
            </p>
            <h2 className="text-xl font-semibold text-gray-900">
              JSON exports
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The R pipeline exports analysis-ready outputs (event-study series,
              confidence intervals, ATT summary) to JSON files consumed directly
              by the React frontend.
            </p>
            <div className="bg-gray-50 border rounded p-4 text-sm text-gray-700">
              Example:{" "}
              <span className="font-mono">event_study_series.json</span>,{" "}
              <span className="font-mono">att_summary.json</span>
            </div>
          </div>

          {/* Repo & structure */}
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <p className="text-sm text-gray-500">4) Repository structure</p>
            <h2 className="text-xl font-semibold text-gray-900">
              Readable + reviewable
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The repository is organized so reviewers can quickly locate the
              data pipeline, estimation code, exported outputs, and the UI that
              renders the results.
            </p>
            <div className="bg-gray-50 border rounded p-4 text-sm text-gray-700">
              Includes: README, scripts, exported artifacts, and a deployed web
              app
            </div>
          </div>
        </div>

        {/* Links section */}
        <div className="bg-white rounded-lg border p-6 space-y-4 max-w-4xl">
          <h2 className="text-xl font-semibold text-gray-900">Project links</h2>

          <p className="text-gray-700 leading-relaxed">
            These links are placeholders—you can connect them to your GitHub
            repository and deployed webapp when ready.
          </p>

          <div className="space-y-2 text-sm">
            <a
              href="https://github.com/NChavezC/CausalEffectofMinimumWageonUnemployment"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-medium text-blue-600 hover:text-blue-800 underline"
            >
              GitHub repository →
            </a>

            <a
              href="https://github.com/NChavezC/CausalEffectofMinimumWageonUnemployment/blob/main/public/UnempATT.R"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-medium text-blue-600 hover:text-blue-800 underline"
            >
              R estimation script (link to file) →
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Button onClick={() => navigate("/11")}>← Go Back</Button>
          <Button onClick={() => navigate("/01")}>Back To Title ↺</Button>
        </div>
      </div>
    </div>
  );
}

export default Repro_12;
