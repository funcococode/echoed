'use client';

import { TbUser, TbTag, TbFileText } from "react-icons/tb";
import type { AnySearchItem } from "@/actions/types/search";

export function getIcon(type?: AnySearchItem['type']) {
  const iconClasses = "w-5 h-5";
  switch (type) {
    case "user": return <TbUser className={`${iconClasses} text-blue-500`} />;
    case "tag": return <TbTag className={`${iconClasses} text-green-500`} />;
    case "echo": return <TbFileText className={`${iconClasses} text-yellow-500`} />;
    default: return <TbFileText className={`${iconClasses} text-gray-400`} />;
  }
}

export function highlightMatch(text: string, query?: string) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <span key={i} className="bg-primary-light text-primary">{part}</span> : part
  );
}

// Safer regex (escapes special chars in query)
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
