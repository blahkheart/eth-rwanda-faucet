import { useState } from "react";

export const CustomSelect = ({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="w-full h-12 bg-white/20 text-white text-left rounded-md px-3 py-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find(option => option.value === selected)?.label || "Choose a network"}
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
