import { Loader2 } from "lucide-react";

export default function Loader({ size = 24, className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin text-cyan-400" size={size} />
    </div>
  );
}
