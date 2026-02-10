import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

function Design_04() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-4xl space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Research Design
        </h1>

        {/* High-level summary */}
        <p className="text-lg text-gray-700 leading-relaxed">
          To estimate the causal impact of minimum wage increases, I use a{" "}
          <span className="font-medium text-gray-900">stacked event-study</span>{" "}
          design that compares treated states to clean control states within a
          narrow event window around each policy change.
        </p>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: What counts as an event */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              What counts as a “treatment event”
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Not every change is meaningful. I focus on{" "}
              <span className="font-medium text-gray-900">sharp increases</span>{" "}
              in a state’s minimum wage.
            </p>

            <div className="bg-gray-50 border rounded p-4">
              <p className="text-sm text-gray-600">A year is treated if:</p>

              <div className="mt-3 text-gray-800">
                <BlockMath
                  math={`\\Delta MW_{s,t} \\ge n_\\sigma\\,\\sigma_s \\quad (\\text{baseline: } n_\\sigma=3)`}
                />
              </div>

              <p className="mt-2 text-sm text-gray-600">
                where <InlineMath math={`\\sigma_s`} /> is the state-specific
                standard deviation of positive historical minimum wage changes.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Each qualifying increase is treated as a{" "}
              <span className="font-medium text-gray-900">separate event</span>,
              so states can contribute multiple events over time.
            </p>
          </div>

          {/* Right: How the comparison is built */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              How the counterfactual is constructed
            </h2>

            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>
                Build an event window around each increase:{" "}
                <InlineMath math={`t=-3,...,5`} />
              </li>
              <li>
                Define event time as{" "}
                <BlockMath math={`event\\_time = year − event\\_year`} />
              </li>
              <li>
                Use{" "}
                <span className="font-medium text-gray-900">
                  clean controls
                </span>
                : states with{" "}
                <span className="font-medium text-gray-900">
                  no sharp increases
                </span>{" "}
                inside the same event window
              </li>
              <li>
                Drop treated events if the treated state has overlapping sharp
                increases within the window
              </li>
            </ul>

            <div className="bg-gray-50 border rounded p-4">
              <p className="text-sm text-gray-600">Estimated model:</p>

              <div className="mt-3 text-gray-800">
                <BlockMath
                  math={`y_{s,t} = \\alpha_s + \\gamma_t + \\sum_{k \\in \\{-3,...,5\\}} \\beta_k\\,\\mathbf{1}[\\text{event\\_time}=k]\\cdot \\mathbf{1}[\\text{treated\\_event}] + \\varepsilon_{s,t}`}
                />
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Reference period is <InlineMath math={`k = −1`} /> (omitted), so
                all effects are relative to the year before the increase.
              </p>
            </div>
          </div>
        </div>

        {/* Key identification statement */}
        <div className="bg-white border-l-4 border-blue-400 rounded p-5">
          <p className="text-gray-800 font-medium">
            Identification assumption:
          </p>
          <p className="text-gray-700 leading-relaxed">
            Within each event window, treated and control states would have
            followed similar unemployment trends absent the sharp minimum wage
            increase (
            <span className="font-medium text-gray-900">
              local parallel trends
            </span>
            ).
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button onClick={() => navigate("/03")}>← Go Back</Button>
          <Button onClick={() => navigate("/05")}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default Design_04;
