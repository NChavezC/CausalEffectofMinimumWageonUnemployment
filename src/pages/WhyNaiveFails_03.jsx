import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function WhyNaiveFails_03() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-3xl space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Why Naïve Comparisons Fail
        </h1>

        {/* Core Explanation */}
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            A simple before-and-after comparison of unemployment around minimum
            wage increases is unlikely to capture the true causal effect.
          </p>

          <p>
            States do not raise minimum wages at random. Policy changes often
            coincide with:
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>Local economic booms or downturns</li>
            <li>Political shifts or institutional reforms</li>
            <li>Anticipation by firms and workers</li>
          </ul>

          <p>
            As a result, observed changes in unemployment may reflect underlying
            economic trends rather than the effect of the policy itself.
          </p>
        </div>

        {/* Key Takeaway Box */}
        <div className="bg-white border-l-4 border-red-400 p-4 rounded">
          <p className="text-gray-800 font-medium">Key takeaway:</p>
          <p className="text-gray-700">
            Without a credible counterfactual, naïve comparisons confound policy
            effects with pre-existing trends.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <Button onClick={() => navigate("/02")}>← Go Back</Button>

          <Button onClick={() => navigate("/04")}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default WhyNaiveFails_03;
