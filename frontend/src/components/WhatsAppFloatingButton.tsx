"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, X } from "lucide-react";
import Link from "next/link";

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(true);

  // Hide button on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show button if scrolled to top or scrolling up
          if (currentScrollY < 100 || currentScrollY < lastScrollY) {
            setShowButton(true);
          } else {
            // Hide button if scrolled down significantly
            if (currentScrollY - lastScrollY > 50) {
              setShowButton(false);
            }
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappNumber = "972559737025";
  const whatsappMessage = encodeURIComponent("שלום, אני מעוניין במידע על שירותי האבטחה שלכם");

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3"
          >
            {/* WhatsApp Options */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="flex flex-col gap-2 mb-2"
                >
                  <motion.a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full px-6 py-3 shadow-lg flex items-center gap-3 font-semibold transition-colors"
                  >
                    <MessageCircle className="size-5" />
                    <span>WhatsApp</span>
                  </motion.a>
                  
                  <motion.a
                    href={`tel:+${whatsappNumber}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full px-6 py-3 shadow-lg flex items-center gap-3 font-semibold transition-colors"
                  >
                    <Phone className="size-5" />
                    <span>התקשר</span>
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`size-16 rounded-full shadow-2xl flex items-center justify-center transition-colors ${
                isOpen
                  ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                  : "bg-[#25D366] hover:bg-[#20BA5A] text-white"
              }`}
              aria-label={isOpen ? "סגור תפריט" : "פתח תפריט WhatsApp"}
            >
              {isOpen ? (
                <X className="size-6" />
              ) : (
                <MessageCircle className="size-7" />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse animation ring */}
      <AnimatePresence>
        {showButton && !isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="fixed bottom-6 left-6 size-16 rounded-full bg-[#25D366] z-[9998] pointer-events-none"
            style={{
              transform: "scale(1.5)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

