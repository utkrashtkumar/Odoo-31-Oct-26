"use client";

import { useState } from "react";
import { 
  X, CreditCard, ShieldCheck, CheckCircle2, 
  AlertTriangle, RefreshCw, Smartphone, ArrowRight, 
  Terminal, Zap, Check 
} from "lucide-react";
import { formatMoney } from "@/lib/utils";

interface PaymentSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceNumber: string;
  customerName: string;
  balanceDue: number;
  onPaymentSuccess: (paymentRecord: {
    transactionId: string;
    amount: number;
    method: string;
    scenario: string;
  }) => void;
  onPaymentDeclined: (errorReason: string) => void;
}

export function PaymentSandboxModal({
  isOpen,
  onClose,
  invoiceNumber,
  customerName,
  balanceDue,
  onPaymentSuccess,
  onPaymentDeclined,
}: PaymentSandboxModalProps) {
  const [selectedScenario, setSelectedScenario] = useState<"success" | "insufficient_funds" | "3ds" | "fraud">("success");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [paymentAmount, setPaymentAmount] = useState(balanceDue.toString());
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [logOutput, setLogOutput] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcess = () => {
    setIsProcessing(true);
    setLogOutput(null);

    // Scenario: 3D Secure Challenge
    if (selectedScenario === "3ds") {
      setTimeout(() => {
        setIsProcessing(false);
        setShowOtpScreen(true);
      }, 700);
      return;
    }

    // Process other scenarios
    setTimeout(() => {
      setIsProcessing(false);
      const amount = parseFloat(paymentAmount) || balanceDue;
      const txId = `txn_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;

      if (selectedScenario === "success") {
        setLogOutput(`[Webhook Dispatched] event: "payment_intent.succeeded" | txId: "${txId}" | amount: $${amount.toFixed(2)}`);
        onPaymentSuccess({
          transactionId: txId,
          amount,
          method: "Credit Card (Visa - 4242)",
          scenario: "Approved",
        });
        setTimeout(onClose, 1000);
      } else if (selectedScenario === "insufficient_funds") {
        setLogOutput(`[Webhook Dispatched] event: "payment_intent.payment_failed" | code: "card_declined" | decline_code: "insufficient_funds"`);
        onPaymentDeclined("Transaction declined: The card has insufficient funds. Triggered Dunning Tier 1 alert.");
      } else if (selectedScenario === "fraud") {
        setLogOutput(`[Webhook Dispatched] event: "charge.dispute.created" | reason: "fraudulent"`);
        onPaymentDeclined("Transaction blocked by AI fraud detection filters. Risk score: 89/100.");
      }
    }, 900);
  };

  const handleVerifyOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const amount = parseFloat(paymentAmount) || balanceDue;
      const txId = `txn_3ds_${Math.random().toString(36).substring(2, 9)}`;
      setLogOutput(`[3D Secure Passed] OTP Verified. event: "payment_intent.succeeded" | txId: "${txId}"`);
      onPaymentSuccess({
        transactionId: txId,
        amount,
        method: "Credit Card (3DS Verified)",
        scenario: "3D Secure Authentication Passed",
      });
      setTimeout(onClose, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-teal-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm">Payment Gateway Sandbox</h3>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono font-bold">
                  TEST ENVIRONMENT
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Simulate provider responses against {invoiceNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {!showOtpScreen ? (
            <>
              {/* Payment Amount & Invoice details */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-500 block text-[11px]">Invoice Balance:</span>
                  <span className="text-base font-black text-gray-900">{formatMoney(balanceDue)}</span>
                </div>
                <div>
                  <label className="text-gray-500 block text-[11px] font-semibold mb-1">Charge Amount ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full p-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold bg-white"
                  />
                </div>
              </div>

              {/* Scenarios Picker */}
              <div className="space-y-2">
                <span className="font-bold text-gray-800 block text-xs">Select Test Scenario:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedScenario("success")}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      selectedScenario === "success"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">🟢 Successful Charge</span>
                      {selectedScenario === "success" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">200 OK • Immediate settlement &amp; receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedScenario("insufficient_funds")}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      selectedScenario === "insufficient_funds"
                        ? "border-red-500 bg-red-50 text-red-900 ring-1 ring-red-500"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">🔴 Insufficient Funds</span>
                      {selectedScenario === "insufficient_funds" && <Check className="w-3.5 h-3.5 text-red-600" />}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">402 Declined • Triggers Dunning reminder</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedScenario("3ds")}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      selectedScenario === "3ds"
                        ? "border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">🟡 3D Secure Challenge</span>
                      {selectedScenario === "3ds" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">Bank 2FA OTP verification modal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedScenario("fraud")}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      selectedScenario === "fraud"
                        ? "border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">⚠️ AI Fraud Filter Block</span>
                      {selectedScenario === "fraud" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">High risk score dispute triggered</span>
                  </button>
                </div>
              </div>

              {/* Card visual */}
              <div className="p-3 bg-gray-100 rounded-xl flex items-center justify-between font-mono text-gray-700 text-xs">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-odoo-purple" />
                  <span>{cardNumber}</span>
                </div>
                <span className="text-[11px] text-gray-500">EXP: 12/28 • CVC: 739</span>
              </div>
            </>
          ) : (
            /* 3D SECURE OTP SIMULATOR SCREEN */
            <div className="py-4 space-y-4 text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto border border-blue-200">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">3D Secure Two-Factor Authentication</h4>
                <p className="text-gray-500 text-xs mt-1">
                  Bank challenge sent for verification of {formatMoney(parseFloat(paymentAmount) || balanceDue)}.
                </p>
                <div className="mt-2 text-[11px] text-blue-700 font-mono bg-blue-50 p-1.5 rounded inline-block">
                  Simulated Demo OTP: <strong>123456</strong>
                </div>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono font-bold p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-odoo-purple"
                />
                <button
                  type="button"
                  disabled={otpCode.length < 4 || isProcessing}
                  onClick={handleVerifyOtp}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition disabled:opacity-50"
                >
                  {isProcessing ? "Verifying with Bank..." : "Confirm & Authorize Payment"}
                </button>
              </div>
            </div>
          )}

          {/* Webhook logs */}
          {logOutput && (
            <div className="p-3 bg-gray-900 text-teal-400 font-mono text-[11px] rounded-xl space-y-1">
              <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Gateway Terminal Log:</span>
              <p className="leading-tight">{logOutput}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!showOtpScreen && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-mono">Status: Ready for dispatch</span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcess}
                className="bg-gray-900 hover:bg-black text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>{isProcessing ? "Transmitting..." : "Execute Gateway Simulation"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

