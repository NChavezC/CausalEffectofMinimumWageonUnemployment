import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function Motivation_02() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-3xl space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Why This Question Matters
        </h1>

        {/* Motivation Text */}
        <div className="space-y-5 text-lg text-gray-700 leading-relaxed">
          <p>
            Minimum wage increases are one of the most common labor market
            policies in the United States.
          </p>

          <p>
            Policymakers, businesses, and workers care about whether these
            increases reduce employment or raise unemployment — especially when
            changes are large and sudden.
          </p>

          <p>
            However, measuring the causal effect of minimum wage changes is
            challenging because wage increases are often:
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>Anticipated by firms and workers</li>
            <li>Implemented gradually</li>
            <li>Correlated with local economic conditions</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <Button onClick={() => navigate("/01")}>← Go Back</Button>

          <Button onClick={() => navigate("/03")}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default Motivation_02;
