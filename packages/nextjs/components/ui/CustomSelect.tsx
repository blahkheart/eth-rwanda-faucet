import { useEffect, useRef, useState } from "react";

export const CustomSelect = ({
  options,
  selected,
  placeholder = "Choose a network",
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string;
  placeholder?: string;
  onChange: (value: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (value: any) => {
    onChange(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <button
        className="w-full h-12 bg-white/20 text-white text-left rounded-md px-3 py-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find(option => option.value === selected)?.label || placeholder}
      </button>
      {isOpen && (
        <ul className="absolute w-full bg-gray-800 text-white rounded-md mt-1 shadow-lg z-10">
          {options.map(option => (
            <li
              key={option.value}
              className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
