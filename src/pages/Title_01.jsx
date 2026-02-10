import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function Title_01() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-3xl text-center space-y-6">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
          Do Sharp Minimum Wage Increases,
          <br />
          Increase Unemployment?
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600">
          A causal analysis using stacked event studies
          <br className="hidden md:block" />
          on U.S. state-level data
        </p>

        {/* Method Badges */}
        <div className="flex justify-center gap-3 flex-wrap text-sm text-gray-700">
          <span className="px-3 py-1 bg-white border rounded-full">
            Difference-in-Differences
          </span>
          <span className="px-3 py-1 bg-white border rounded-full">
            Event-Study Design
          </span>
          <span className="px-3 py-1 bg-white border rounded-full">
            Causal Inference
          </span>
        </div>

        {/* CTA */}
        <div className="pt-6">
          <Button onClick={() => navigate("/02")}>Start Presentation →</Button>
        </div>
      </div>
    </div>
  );
}

export default Title_01;
