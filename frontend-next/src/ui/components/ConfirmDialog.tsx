'use client';

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Delete", 
  cancelText = "Cancel", 
  variant = "danger" 
}: ConfirmDialogProps) => {
  
  if (!isOpen) return null;

  const variantStyles: Record<string, { icon: string; button: string; border: string }> = {
    danger: {
      icon: "text-red-400",
      button: "bg-red-600 hover:bg-red-700 text-white",
      border: "border-red-500/30",
    },
    warning: {
      icon: "text-yellow-400",
      button: "bg-yellow-600 hover:bg-yellow-700 text-white",
      border: "border-yellow-500/30",
    },
    info: { // Added info variant for completeness based on AdminPage usage
      icon: "text-blue-400",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      border: "border-blue-500/30",
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-900 rounded-2xl w-full max-w-md border ${styles.border} shadow-2xl`}>
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 ${styles.icon}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-300 text-sm">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 pt-4 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 ${styles.button} px-4 py-2 rounded-lg font-semibold transition-all duration-200`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;