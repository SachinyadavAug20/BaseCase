import { techDescriptions,specialCases,deviconSet } from "./icon.constant";

const normalize = (tech: string) =>
  tech.toLowerCase().replace(/\s+/g, "").replace(/[.#]/g, "");

export const getTechDescription = (tech: string) => {
  const key = normalize(tech);
  const finalKey = specialCases[key] || key;
  return techDescriptions[finalKey]
    ? techDescriptions[finalKey]
    : `${tech} is a modern technology used by developers to build software applications and digital experiences.`;
};

export const getDevIcon = (tech: string) => {
  const key = normalize(tech);
  const finalKey = specialCases[key] || key;

  if (deviconSet.has(finalKey)) {
    return `devicon-${finalKey}-plain colored`;
  }

  return "devicon-devicon-plain colored"; 
};
