import { useRef } from "react";

export default function OtpBoxes({ value, onChange }) {
  const refs = useRef([]);
  const digits = (value + "      ").slice(0, 6).split("");

  function handleKey(i, e) {
    if (e.key === "Backspace") {
      const next = value.slice(0, i) + " " + value.slice(i + 1);
      onChange(next.trimEnd());
      if (i > 0) refs.current[i - 1]?.focus();
    } else if (/^\d$/.test(e.key)) {
      const arr = (value + "      ").slice(0, 6).split("");
      arr[i] = e.key;
      onChange(arr.join("").trimEnd());
      if (i < 5) refs.current[i + 1]?.focus();
    }
  }

  return (
    <div className="flex gap-2 justify-center my-4">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={() => {}}
          onKeyDown={(e) => handleKey(i, e)}
          onFocus={() => refs.current[i]?.select()}
          className={`w-11 h-12 text-center text-lg font-normal border-2 rounded-xl bg-gray-50 focus:outline-none transition ${
          d.trim() ? "border-orange-300 text-gray-800" : "border-gray-200"
          } focus:border-orange-400`}
        />
      ))}
    </div>
  );
}