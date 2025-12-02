"use client";

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  label,
  error,
  disabled = false,
  required = false,
  className = "",
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          {label} {required && <span className="text-pink-400">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2.5 bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-lg 
          focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          placeholder:text-zinc-600 transition-all duration-200 ${className}`}
      />
      {error && <p className="mt-1.5 text-sm text-pink-400">{error}</p>}
    </div>
  );
}
