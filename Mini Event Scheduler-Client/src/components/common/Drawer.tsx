import { useEffect } from "react";
import { FiX } from "react-icons/fi";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Drawer({ isOpen, onClose, children }: DrawerProps) {
  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed  z-40 lg:hidden" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FiX className="h-6 w-6" />
        </button>
        <div className="h-full overflow-y-auto pt-12 pb-4">{children}</div>
      </div>
    </>
  );
}
