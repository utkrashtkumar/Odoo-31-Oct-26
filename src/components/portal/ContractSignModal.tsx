"use client";

import { useState, useRef, useEffect } from "react";
import { 
  X, Check, ShieldCheck, FileText, CheckCircle2, 
  RotateCcw, Sparkles, Lock, AlertCircle 
} from "lucide-react";
import { formatMoney, formatDate } from "@/lib/utils";

interface ContractSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionNumber: string;
  customerName: string;
  companyName: string;
  totalAmount: number;
  planName: string;
  onSignSuccess: (signatureData: {
    signerName: string;
    signatureType: "drawn" | "typed";
    signatureToken: string;
    signedAt: string;
  }) => void;
}

export function ContractSignModal({
  isOpen,
  onClose,
  subscriptionNumber,
  customerName,
  companyName,
  totalAmount,
  planName,
  onSignSuccess,
}: ContractSignModalProps) {
  const [signMode, setSignMode] = useState<"draw" | "type">("draw");
  const [typedName, setTypedName] = useState(customerName || "");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (isOpen && signMode === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#56384e";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [isOpen, signMode]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSignConfirm = () => {
    if (!agreeTerms) return;
    if (signMode === "draw" && !hasDrawn) return;
    if (signMode === "type" && !typedName.trim()) return;

    setIsSubmitting(true);

    const token = `ESIGN-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    setTimeout(() => {
      onSignSuccess({
        signerName: typedName.trim() || customerName,
        signatureType: signMode === "draw" ? "drawn" : "typed",
        signatureToken: token,
        signedAt: new Date().toISOString(),
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#5B3953] to-[#714B67] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-odoo-teal" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Digital Contract E-Sign</h3>
              <p className="text-[11px] text-white/80">Order #{subscriptionNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700">
          {/* Summary Details */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Company / Client:</span>
              <span className="font-bold text-gray-900">{companyName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Plan & Subscription:</span>
              <span className="font-bold text-gray-900">{planName}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-sm">
              <span className="font-semibold text-gray-700">Total Recurring Commitment:</span>
              <span className="font-black text-odoo-purple text-base">{formatMoney(totalAmount)}</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800">Select Signature Method:</span>
              <div className="flex items-center space-x-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setSignMode("draw")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                    signMode === "draw" ? "bg-white text-odoo-purple shadow-xs" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Draw Signature
                </button>
                <button
                  type="button"
                  onClick={() => setSignMode("type")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                    signMode === "type" ? "bg-white text-odoo-purple shadow-xs" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Type Name
                </button>
              </div>
            </div>

            {/* DRAW MODE CANVAS */}
            {signMode === "draw" ? (
              <div className="space-y-1.5">
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/70 overflow-hidden cursor-crosshair">
                  <canvas
                    ref={canvasRef}
                    width={440}
                    height={140}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-36 touch-none"
                  />
                  {!hasDrawn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-xs italic">
                      Draw your signature here with your mouse or finger
                    </div>
                  )}
                  <div className="absolute bottom-2 left-4 pointer-events-none text-[10px] text-gray-300 uppercase tracking-widest font-mono">
                    SIGN HERE ——————————————————
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[11px] text-gray-500 hover:text-red-600 flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear & Redraw</span>
                  </button>
                </div>
              </div>
            ) : (
              /* TYPE MODE INPUT */
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter full legal name"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-odoo-purple"
                />
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center font-serif text-2xl text-odoo-purple italic">
                  {typedName.trim() ? typedName : "Your Signature Preview"}
                </div>
              </div>
            )}
          </div>

          {/* Legal Compliance Checkbox */}
          <div className="pt-2">
            <label className="flex items-start space-x-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50/70 cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-odoo-purple focus:ring-odoo-purple"
              />
              <span className="text-[11px] text-gray-600 leading-snug">
                I confirm that I am authorized to bind <strong>{companyName}</strong>. I accept the subscription agreement, automated recurring billing intervals, and cancellation terms.
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] text-gray-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Encrypted E-Sign</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!agreeTerms || (signMode === "draw" && !hasDrawn) || (signMode === "type" && !typedName.trim()) || isSubmitting}
              onClick={handleSignConfirm}
              className="bg-odoo-purple hover:bg-odoo-purple-dark text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Executing E-Signature..." : "Sign & Activate Contract"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

