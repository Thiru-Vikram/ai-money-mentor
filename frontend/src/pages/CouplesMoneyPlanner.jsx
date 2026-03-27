import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  IndianRupee,
  Building2,
  Home,
  PiggyBank,
  LineChart,
  Shield,
} from "lucide-react";

const indianCurrencyFormat = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const InputField = ({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  name,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center">
      {icon}
      <span className="ml-2">{label}</span>
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Toggle = ({ label, value, onChange, name }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-1">
      {label}
    </label>
    <div className="flex items-center space-x-4 bg-gray-800 border border-gray-700 rounded-lg p-2">
      <button
        type="button"
        onClick={() => onChange({ target: { name, value: "Metro" } })}
        className={`w-1/2 py-1 rounded-md text-sm ${value === "Metro" ? "bg-blue-600 text-white" : "text-gray-400"}`}
      >
        Metro
      </button>
      <button
        type="button"
        onClick={() => onChange({ target: { name, value: "Non-Metro" } })}
        className={`w-1/2 py-1 rounded-md text-sm ${value === "Non-Metro" ? "bg-blue-600 text-white" : "text-gray-400"}`}
      >
        Non-Metro
      </button>
    </div>
  </div>
);

const TaxRegimeToggle = ({ label, value, onChange, name }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-1">
      {label}
    </label>
    <div className="flex items-center space-x-4 bg-gray-800 border border-gray-700 rounded-lg p-2">
      <button
        type="button"
        onClick={() => onChange({ target: { name, value: "Old" } })}
        className={`w-1/2 py-1 rounded-md text-sm ${value === "Old" ? "bg-blue-600 text-white" : "text-gray-400"}`}
      >
        Old
      </button>
      <button
        type="button"
        onClick={() => onChange({ target: { name, value: "New" } })}
        className={`w-1/2 py-1 rounded-md text-sm ${value === "New" ? "bg-blue-600 text-white" : "text-gray-400"}`}
      >
        New
      </button>
    </div>
  </div>
);

const PartnerForm = ({ partner, setPartner, partnerLabel }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartner((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 w-full">
      <h3 className="text-xl font-bold text-white mb-6">{partnerLabel}</h3>
      <InputField
        icon={<User size={16} />}
        label="Name"
        type="text"
        name="name"
        value={partner.name}
        onChange={handleChange}
        placeholder="Enter name"
      />
      <InputField
        icon={<IndianRupee size={16} />}
        label="Monthly Basic Salary"
        type="number"
        name="monthlyBasic"
        value={partner.monthlyBasic}
        onChange={handleChange}
        placeholder="e.g., 100000"
      />
      <InputField
        icon={<IndianRupee size={16} />}
        label="Monthly HRA Received"
        type="number"
        name="monthlyHra"
        value={partner.monthlyHra}
        onChange={handleChange}
        placeholder="e.g., 40000"
      />
      <Toggle
        label="City Type"
        name="cityType"
        value={partner.cityType}
        onChange={handleChange}
      />
      <InputField
        icon={<Home size={16} />}
        label="Monthly Rent Paid"
        type="number"
        name="monthlyRent"
        value={partner.monthlyRent}
        onChange={handleChange}
        placeholder="e.g., 30000"
      />
      <InputField
        icon={<PiggyBank size={16} />}
        label="Annual 80C Investments"
        type="number"
        name="existing80C"
        value={partner.existing80C}
        onChange={handleChange}
        placeholder="PF, LIC, ELSS etc."
      />
      <InputField
        icon={<LineChart size={16} />}
        label="NPS Tier-1 Annual Contribution"
        type="number"
        name="npsTier1"
        value={partner.npsTier1}
        onChange={handleChange}
        placeholder="e.g., 50000"
      />
      <TaxRegimeToggle
        label="Tax Regime"
        name="taxRegime"
        value={partner.taxRegime}
        onChange={handleChange}
      />
      <InputField
        icon={<Shield size={16} />}
        label="Annual Health Insurance Premium"
        type="number"
        name="healthPremium"
        value={partner.healthPremium}
        onChange={handleChange}
        placeholder="e.g., 25000"
      />
    </div>
  );
};

const LoadingStep = ({ onComplete }) => {
  const messages = [
    "Analyzing combined income...",
    "Optimizing HRA claims...",
    "Calculating NPS benefits...",
    "Running tax simulations...",
  ];
  const [visibleMessages, setVisibleMessages] = useState([]);

  useEffect(() => {
    messages.forEach((msg, index) => {
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg]);
      }, index * 600);
    });
    setTimeout(onComplete, messages.length * 600);
  }, [onComplete]);

  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <AnimatePresence>
          {visibleMessages.map((msg, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-gray-300 mt-2"
            >
              {msg}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ResultCard = ({ title, children }) => (
  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
    <h3 className="text-lg font-bold text-blue-400 mb-4">{title}</h3>
    {children}
  </div>
);

const CouplesMoneyPlanner = () => {
  const [step, setStep] = useState(1);
  const [partnerA, setPartnerA] = useState({
    name: "Partner A",
    monthlyBasic: "",
    monthlyHra: "",
    cityType: "Metro",
    monthlyRent: "",
    existing80C: "",
    npsTier1: "",
    taxRegime: "Old",
    healthPremium: "",
  });
  const [partnerB, setPartnerB] = useState({
    name: "Partner B",
    monthlyBasic: "",
    monthlyHra: "",
    cityType: "Metro",
    monthlyRent: "",
    existing80C: "",
    npsTier1: "",
    taxRegime: "Old",
    healthPremium: "",
  });
  const [results, setResults] = useState(null);

  const calculateResults = () => {
    const calculateHraExemption = (partner) => {
      const annualBasic = Number(partner.monthlyBasic) * 12;
      const annualHra = Number(partner.monthlyHra) * 12;
      const annualRent = Number(partner.monthlyRent) * 12;

      if (annualRent === 0) return 0;

      const rule1 = annualHra;
      const rule2 =
        partner.cityType === "Metro" ? annualBasic * 0.5 : annualBasic * 0.4;
      const rule3 = annualRent - annualBasic * 0.1;

      return Math.max(0, Math.min(rule1, rule2, rule3));
    };

    const getOldRegimeTaxSlabRate = (income) => {
      if (income <= 300000) return 0;
      if (income <= 600000) return 0.05;
      if (income <= 900000) return 0.1;
      if (income <= 1200000) return 0.15;
      if (income <= 1500000) return 0.2;
      return 0.3;
    };

    const getNewRegimeTaxSlabRate = (income) => {
      if (income <= 300000) return 0;
      if (income <= 700000) return 0.05;
      if (income <= 1000000) return 0.1;
      if (income <= 1200000) return 0.15;
      if (income <= 1500000) return 0.2;
      return 0.3;
    };

    const calculateTax = (
      partner,
      hraExemption,
      c80Deduction,
      npsDeduction,
    ) => {
      const annualBasic = Number(partner.monthlyBasic) * 12;
      let taxableIncome;
      let tax = 0;

      if (partner.taxRegime === "Old") {
        const standardDeduction = 50000;
        const healthPremiumDeduction = Math.min(
          Number(partner.healthPremium),
          25000,
        );
        taxableIncome =
          annualBasic -
          standardDeduction -
          hraExemption -
          c80Deduction -
          npsDeduction -
          healthPremiumDeduction;
        taxableIncome = Math.max(0, taxableIncome);

        if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.3;
        if (taxableIncome > 1200000)
          tax += Math.min(taxableIncome - 1200000, 300000) * 0.2;
        if (taxableIncome > 900000)
          tax += Math.min(taxableIncome - 900000, 300000) * 0.15;
        if (taxableIncome > 600000)
          tax += Math.min(taxableIncome - 600000, 300000) * 0.1;
        if (taxableIncome > 300000)
          tax += Math.min(taxableIncome - 300000, 300000) * 0.05;
      } else {
        // New Regime
        taxableIncome = annualBasic; // No deductions
        if (taxableIncome <= 700000) return 0; // Rebate u/s 87A

        if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.3;
        if (taxableIncome > 1200000)
          tax += Math.min(taxableIncome - 1200000, 300000) * 0.2;
        if (taxableIncome > 1000000)
          tax += Math.min(taxableIncome - 1000000, 200000) * 0.15;
        if (taxableIncome > 700000)
          tax += Math.min(taxableIncome - 700000, 300000) * 0.1;
        if (taxableIncome > 300000)
          tax += Math.min(taxableIncome - 300000, 400000) * 0.05;
      }

      // Health and Education Cess
      return tax * 1.04;
    };

    const processPartner = (partner) => {
      const annualBasic = Number(partner.monthlyBasic) * 12;
      const existing80C = Number(partner.existing80C);
      const npsTier1 = Number(partner.npsTier1);

      // Before optimization
      const hraExemptionBefore = calculateHraExemption(partner);
      const c80Before = Math.min(150000, existing80C + npsTier1);
      const nps80CCD1B_Before = 0; // Not considering this for 'before' state
      const taxBefore = calculateTax(
        partner,
        hraExemptionBefore,
        c80Before,
        nps80CCD1B_Before,
      );

      // Optimization calculations
      const npsHeadroom = Math.max(0, 50000 - npsTier1);
      const recommendedNpsTopUp = npsHeadroom;

      const c80Headroom = Math.max(0, 150000 - existing80C - npsTier1);
      const recommendedElssSip = c80Headroom / 12;

      // After optimization
      const hraExemptionAfter = hraExemptionBefore; // HRA is optimized by claiming, not changing value
      const c80After = Math.min(150000, existing80C + npsTier1 + c80Headroom);
      const nps80CCD1B_After = recommendedNpsTopUp;
      const taxAfter = calculateTax(
        partner,
        hraExemptionAfter,
        c80After,
        nps80CCD1B_After,
      );

      const taxSlabRate =
        partner.taxRegime === "Old"
          ? getOldRegimeTaxSlabRate(annualBasic)
          : getNewRegimeTaxSlabRate(annualBasic);

      const hraTaxSaving = hraExemptionAfter * taxSlabRate;
      const npsTaxSaving = recommendedNpsTopUp * taxSlabRate;
      const c80TaxSaving = c80Headroom * taxSlabRate;

      return {
        name: partner.name,
        hraExemption: hraExemptionAfter,
        hraTaxSaving,
        npsHeadroom,
        recommendedNpsTopUp,
        npsTaxSaving,
        c80Headroom,
        recommendedElssSip,
        c80TaxSaving,
        taxBefore,
        taxAfter,
        taxSaving: taxBefore - taxAfter,
      };
    };

    const resA = processPartner(partnerA);
    const resB = processPartner(partnerB);

    setResults({ partnerA: resA, partnerB: resB });
    setStep(3);
  };

  const handleOptimize = () => {
    setStep(2);
  };

  const handleStartNew = () => {
    setStep(1);
    setPartnerA({
      name: "Partner A",
      monthlyBasic: "",
      monthlyHra: "",
      cityType: "Metro",
      monthlyRent: "",
      existing80C: "",
      npsTier1: "",
      taxRegime: "Old",
      healthPremium: "",
    });
    setPartnerB({
      name: "Partner B",
      monthlyBasic: "",
      monthlyHra: "",
      cityType: "Metro",
      monthlyRent: "",
      existing80C: "",
      npsTier1: "",
      taxRegime: "Old",
      healthPremium: "",
    });
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Couple's Money Planner
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Jointly optimize your taxes and investments.
        </p>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid md:grid-cols-2 gap-8">
                <PartnerForm
                  partner={partnerA}
                  setPartner={setPartnerA}
                  partnerLabel="Partner A"
                />
                <PartnerForm
                  partner={partnerB}
                  setPartner={setPartnerB}
                  partnerLabel="Partner B"
                />
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={handleOptimize}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Optimize Our Finances &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <LoadingStep onComplete={calculateResults} />
            </motion.div>
          )}

          {step === 3 && results && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <ResultCard title="HRA Optimization">
                  <div className="space-y-3">
                    <p>
                      {results.partnerA.name}:{" "}
                      <span className="font-bold text-green-400">
                        {indianCurrencyFormat.format(
                          results.partnerA.hraExemption,
                        )}
                      </span>{" "}
                      exemption
                    </p>
                    <p>
                      {results.partnerB.name}:{" "}
                      <span className="font-bold text-green-400">
                        {indianCurrencyFormat.format(
                          results.partnerB.hraExemption,
                        )}
                      </span>{" "}
                      exemption
                    </p>
                    <hr className="border-gray-700" />
                    <p className="font-bold">
                      Combined HRA Tax Saving:{" "}
                      <span className="text-green-400">
                        {indianCurrencyFormat.format(
                          results.partnerA.hraTaxSaving +
                            results.partnerB.hraTaxSaving,
                        )}
                      </span>
                    </p>
                  </div>
                </ResultCard>
                <ResultCard title="NPS (80CCD-1B) Recommendation">
                  <div className="space-y-3">
                    <p>
                      {results.partnerA.name} Top-up:{" "}
                      <span className="font-bold text-green-400">
                        {indianCurrencyFormat.format(
                          results.partnerA.recommendedNpsTopUp,
                        )}
                      </span>
                    </p>
                    <p>
                      {results.partnerB.name} Top-up:{" "}
                      <span className="font-bold text-green-400">
                        {indianCurrencyFormat.format(
                          results.partnerB.recommendedNpsTopUp,
                        )}
                      </span>
                    </p>
                    <hr className="border-gray-700" />
                    <p className="font-bold">
                      Combined NPS Tax Saving:{" "}
                      <span className="text-green-400">
                        {indianCurrencyFormat.format(
                          results.partnerA.npsTaxSaving +
                            results.partnerB.npsTaxSaving,
                        )}
                      </span>
                    </p>
                  </div>
                </ResultCard>
                <ResultCard title="ELSS (80C) SIP Tax Split">
                  <div className="space-y-3">
                    <p>
                      {results.partnerA.name} Monthly SIP:{" "}
                      <span className="font-bold text-green-400">
                        {indianCurrencyFormat.format(
                          results.partnerA.recommendedElssSip,
                        )}
                      </span>
                    </p>
                    <p>
                      {results.partnerB.name} Monthly SIP:{" "}
                      <span className="font-bold text-green-400">
                        {indianCurrencyFormat.format(
                          results.partnerB.recommendedElssSip,
                        )}
                      </span>
                    </p>
                    <hr className="border-gray-700" />
                    <p className="font-bold">
                      Combined 80C Tax Saving:{" "}
                      <span className="text-green-400">
                        {indianCurrencyFormat.format(
                          results.partnerA.c80TaxSaving +
                            results.partnerB.c80TaxSaving,
                        )}
                      </span>
                    </p>
                  </div>
                </ResultCard>
                <ResultCard title="Combined Tax Summary">
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold">
                        {results.partnerA.name}'s Savings
                      </p>
                      <p className="text-sm text-gray-400">
                        Before:{" "}
                        {indianCurrencyFormat.format(
                          results.partnerA.taxBefore,
                        )}{" "}
                        | After:{" "}
                        {indianCurrencyFormat.format(results.partnerA.taxAfter)}
                      </p>
                      <p className="text-green-400 font-bold">
                        Saving:{" "}
                        {indianCurrencyFormat.format(
                          results.partnerA.taxSaving,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {results.partnerB.name}'s Savings
                      </p>
                      <p className="text-sm text-gray-400">
                        Before:{" "}
                        {indianCurrencyFormat.format(
                          results.partnerB.taxBefore,
                        )}{" "}
                        | After:{" "}
                        {indianCurrencyFormat.format(results.partnerB.taxAfter)}
                      </p>
                      <p className="text-green-400 font-bold">
                        Saving:{" "}
                        {indianCurrencyFormat.format(
                          results.partnerB.taxSaving,
                        )}
                      </p>
                    </div>
                  </div>
                </ResultCard>
              </div>
              <div className="bg-blue-900 bg-opacity-30 border border-blue-500 p-6 rounded-xl text-center">
                <p className="text-gray-300 text-lg">
                  Total Combined Annual Saving
                </p>
                <p className="text-5xl font-bold text-green-400 my-2">
                  {indianCurrencyFormat.format(
                    results.partnerA.taxSaving + results.partnerB.taxSaving,
                  )}
                </p>
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={handleStartNew}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Start New Analysis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CouplesMoneyPlanner;
