"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, Check, X, GraduationCap, Building2 } from "lucide-react";
import staticProgrammes from "@/data/programmes.json";
import staticDepartments from "@/data/departments.json";
import staticFaculties from "@/data/faculties.json";

interface ProgrammeComboboxProps {
  value?: string | number;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const FACULTY_SHORT_NAMES: Record<string, string> = {
  "Faculty of Agriculture, Environment and Food Systems": "Agriculture & Food",
  "Faculty of Arts and Humanities": "Arts & Humanities",
  "Faculty of Business Management Sciences and Economics": "Business & Econ",
  "Faculty of Computer Engineering Informatics and Communications": "Computing & IT",
  "Faculty of Education": "Education",
  "Faculty of Engineering and the Built Environment": "Engineering",
  "Faculty of Law": "Law",
  "Faculty of Medicine and Health Sciences": "Medicine & Health",
  "Faculty of Science": "Science",
  "Faculty of Social and Behavioural Sciences": "Social Sciences",
  "Faculty of Veterinary Science": "Veterinary",
};

export function ProgrammeCombobox({
  value,
  onValueChange,
  placeholder = "Search or select degree programme...",
  disabled = false,
  className = "",
}: ProgrammeComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("All");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Build lookup maps for faculties and departments
  const enrichedProgrammes = useMemo(() => {
    const deptMap = new Map(staticDepartments.map((d) => [d.id, d]));
    const facMap = new Map(staticFaculties.map((f) => [f.id, f.name]));

    return staticProgrammes.map((p) => {
      const dept = deptMap.get(p.department_id);
      const facultyName = dept ? facMap.get(dept.faculty_id) : "University of Zimbabwe";
      return {
        id: p.id,
        code: p.code,
        name: p.name,
        department: dept?.name || "",
        faculty: facultyName || "University of Zimbabwe",
      };
    });
  }, []);

  // Distinct faculties for filter pills
  const facultiesList = useMemo(() => {
    const unique = Array.from(new Set(enrichedProgrammes.map((p) => p.faculty))).filter(Boolean);
    return ["All", ...unique];
  }, [enrichedProgrammes]);

  // Find currently selected programme
  const selectedProgramme = useMemo(() => {
    if (!value) return null;
    return enrichedProgrammes.find((p) => String(p.id) === String(value)) || null;
  }, [value, enrichedProgrammes]);

  // Filter programmes based on search and faculty
  const filteredProgrammes = useMemo(() => {
    let list = enrichedProgrammes;

    if (selectedFaculty !== "All") {
      list = list.filter((p) => p.faculty === selectedFaculty);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.code.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.faculty.toLowerCase().includes(q) ||
          (FACULTY_SHORT_NAMES[p.faculty] && FACULTY_SHORT_NAMES[p.faculty].toLowerCase().includes(q))
      );

      // Prioritize exact code matches, then startsWith, then alphabetical
      list = [...list].sort((a, b) => {
        const aCodeExact = a.code.toLowerCase() === q ? -1 : 1;
        const bCodeExact = b.code.toLowerCase() === q ? -1 : 1;
        if (aCodeExact !== bCodeExact) return aCodeExact - bCodeExact;

        const aCodeStarts = a.code.toLowerCase().startsWith(q) ? -1 : 1;
        const bCodeStarts = b.code.toLowerCase().startsWith(q) ? -1 : 1;
        if (aCodeStarts !== bCodeStarts) return aCodeStarts - bCodeStarts;

        return a.name.localeCompare(b.name);
      });
    }

    return list;
  }, [enrichedProgrammes, selectedFaculty, search]);

  // Reset active index when filtered programmes change
  useEffect(() => {
    setActiveIndex(0);
  }, [search, selectedFaculty]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen]);

  // Handle outside click and keyboard shortcuts
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < filteredProgrammes.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredProgrammes[activeIndex]) {
          handleSelect(filteredProgrammes[activeIndex].id);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, filteredProgrammes, activeIndex]);

  const handleSelect = (progId: number) => {
    onValueChange(String(progId));
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[46px] px-3.5 py-2 text-left bg-white border rounded-xl flex items-center justify-between gap-2 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#003366] ${
          isOpen
            ? "border-[#003366] ring-2 ring-[#003366]/20 shadow-sm"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"}`}
      >
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {selectedProgramme ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2 py-0.5 rounded-md bg-[#003366] text-white text-[11px] font-mono font-bold tracking-wide shrink-0 shadow-xs">
                {selectedProgramme.code}
              </span>
              <span className="text-xs font-semibold text-gray-900 truncate">
                {selectedProgramme.name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400 font-normal flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
              {placeholder}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#003366]" : ""
          }`}
        />
      </button>

      {/* Floating Popover Menu - Opens downwards cleanly below trigger button */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 z-[100] bg-white rounded-2xl shadow-2xl border border-gray-200 ring-1 ring-black/5 flex flex-col max-h-[350px] animate-in fade-in-0 zoom-in-95 duration-150 overflow-hidden"
        >
          {/* Sticky Search Header */}
          <div className="p-3 border-b border-gray-100 bg-gray-50/95 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code (e.g. HCS) or programme name..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 shadow-xs text-gray-900 placeholder:text-gray-400 font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Faculty Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-0.5 text-[10px] no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {facultiesList.map((fac) => {
                const isSelected = selectedFaculty === fac;
                const shortLabel =
                  fac === "All"
                    ? "All Faculties"
                    : (FACULTY_SHORT_NAMES[fac] || fac.replace(/^Faculty of\s+/i, ""));
                return (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => setSelectedFaculty(fac)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      isSelected
                        ? "bg-[#003366] text-white shadow-xs"
                        : "bg-white text-gray-600 hover:bg-gray-200/70 border border-gray-200"
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="px-3.5 py-1.5 bg-gray-100/70 border-b border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium shrink-0">
            <span>
              {filteredProgrammes.length} programme{filteredProgrammes.length === 1 ? "" : "s"} found
            </span>
            {search.trim() && filteredProgrammes.length > 0 && (
              <span className="text-gray-400 text-[10px]">Press [Enter] to select</span>
            )}
            {selectedProgramme && !search.trim() && (
              <span className="text-[#003366] font-semibold flex items-center gap-1">
                <span>Selected:</span>
                <span className="font-mono bg-blue-100 text-[#003366] px-1 py-0.2 rounded font-bold text-[10px]">
                  {selectedProgramme.code}
                </span>
              </span>
            )}
          </div>

          {/* Scrollable Programmes List */}
          <div ref={listRef} className="overflow-y-auto divide-y divide-gray-100 flex-1 overscroll-contain">
            {filteredProgrammes.length === 0 ? (
              <div className="p-8 text-center">
                <GraduationCap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">No programmes found</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Try searching for a different code (e.g. HCS) or programme name.
                </p>
              </div>
            ) : (
              filteredProgrammes.map((prog, index) => {
                const isCurrent = String(prog.id) === String(value);
                const isActive = index === activeIndex;

                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => handleSelect(prog.id)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start justify-between gap-3 transition-colors ${
                      isCurrent
                        ? "bg-blue-50/90 border-l-4 border-[#003366]"
                        : isActive
                        ? "bg-gray-50/80 border-l-4 border-[#ff8c00]"
                        : "hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wide ${
                            isCurrent
                              ? "bg-[#003366] text-white"
                              : "bg-blue-100 text-[#003366]"
                          }`}
                        >
                          {prog.code}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
                          {FACULTY_SHORT_NAMES[prog.faculty] || prog.faculty}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-snug break-words ${
                          isCurrent ? "font-bold text-[#003366]" : "font-semibold text-gray-900"
                        }`}
                      >
                        {prog.name}
                      </p>
                    </div>

                    {isCurrent && (
                      <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
