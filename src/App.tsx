import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import About from "./pages/AboutUs";
import Contact from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import RetirementCalc from "./pages/RetirementCalc";
import IncomeTaxCalculator from "./pages/IncomeTaxCalculator";
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/retirement-calculator" element={<RetirementCalc />} />
        <Route path="/incometax-calculator" element={<IncomeTaxCalculator />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
};

export default App;
