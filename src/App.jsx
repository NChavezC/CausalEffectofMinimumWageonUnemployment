import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PageNotFound from "./ui/PageNotFound";
import AppLayout from "./ui/AppLayout";
import Title_01 from "./pages/Title_01";
import Motivation_02 from "./pages/Motivation_02";
import WhyNaiveFails_03 from "./pages/WhyNaiveFails_03";
import Design_04 from "./pages/Design_04";
import Data_05 from "./pages/Data_05";
import EventStudyResults_06 from "./pages/EventStudyResults_06";
import Pretrends_07 from "./pages/Pretrends_07";
import ATT_08 from "./pages/ATT_08";
import Robustness_09 from "./pages/Robustness_09";
import Interpretation_10 from "./pages/Interpretation_10";
import Limits_11 from "./pages/Limits_11";
import Repro_12 from "./pages/Repro_12";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 0 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="01" />} />
            <Route path="01" element={<Title_01 />} />
            <Route path="02" element={<Motivation_02 />} />
            <Route path="03" element={<WhyNaiveFails_03 />} />
            <Route path="04" element={<Design_04 />} />
            <Route path="05" element={<Data_05 />} />
            <Route path="06" element={<EventStudyResults_06 />} />
            <Route path="07" element={<Pretrends_07 />} />
            <Route path="08" element={<ATT_08 />} />
            <Route path="09" element={<Robustness_09 />} />
            <Route path="10" element={<Interpretation_10 />} />
            <Route path="11" element={<Limits_11 />} />
            <Route path="12" element={<Repro_12 />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
