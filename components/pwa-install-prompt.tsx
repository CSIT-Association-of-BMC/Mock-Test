"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkStandalone = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsStandalone(isStandalone || isInWebAppiOS);
    };

    // Check if iOS
    const checkIOS = () => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(iOS);
    };

    checkStandalone();
    checkIOS();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show prompt if not in standalone mode
    if (isIOS && !isStandalone) {
      setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [isIOS, isStandalone]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (isIOS) {
      // For iOS, show instructions
      alert(
        'To install this app on iOS: tap the share button and select "Add to Home Screen"'
      );
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not show again for 24 hours
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  // Don't show if already installed or dismissed recently
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 animate-in slide-in-from-bottom-2">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              Install MockTest App
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Get the full experience! Install our app for offline access and
              better performance.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleInstall}
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Install Now
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
