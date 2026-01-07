import { usePublicSheet } from "./usePublicSheet";

export interface GroupInfo {
  name: string;
  project: string;
  members: string[];
  bgColor: string;
  breakOutRoom: string;
  hubCoordinator: string;
  hubCoordinatorTwo: string;
  hubTimes: string;
  hubTimesTwo: string;
  hub: string;
  judge: string;
  judgeRoom: string;
}

export interface CoordinatorInfo {
  name: string;
  meetings: {
    place: string;
    times: string;
  }[];
}

export interface JudgeInfo {
  judge: string;
  judgeRoom: string;
  time: string;
}

export interface PitchSummitLiveData {
  groups: GroupInfo[];
  coordinators: CoordinatorInfo[];
  judges: JudgeInfo[];
}

/**
 * Get consistent background color based on group name/number
 */
const getBackgroundColor = (groupName: string): string => {
  const colors = [
    "bg-red-600",
    "bg-blue-600",
    "bg-yellow-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-indigo-600",
    "bg-teal-600",
    "bg-orange-600",
    "bg-lime-600",
    "bg-cyan-600",
    "bg-rose-600",
    "bg-amber-600"
  ];

  const numberMatch = groupName.match(/\d+/);
  if (numberMatch) {
    const num = parseInt(numberMatch[0], 10);
    return colors[num % colors.length];
  }

  return colors[0];
};

/**
 * Parse CSV data from Google Sheets and extract groups, coordinators, and judges
 * Handles Google Sheets format with empty rows and section headers
 */
const parsePitchSummitData = (csv: string): PitchSummitLiveData => {
  const lines = csv.split("\n");
  const groups: GroupInfo[] = [];
  const coordinators: CoordinatorInfo[] = [];
  const judges: JudgeInfo[] = [];

  let i = 0;

  while (i < lines.length) {
    const firstValue = parseCSVLine(lines[i])[0]?.toLowerCase() || "";

    if (firstValue === "groups") {
      i = skipEmptyRowsAndHeader(lines, i);
      i = parseGroupsSection(lines, i, groups);
    } else if (firstValue === "coordinators") {
      i = skipEmptyRowsAndHeader(lines, i);
      i = parseCoordinatorsSection(lines, i, coordinators);
    } else if (firstValue === "judges") {
      i = skipEmptyRowsAndHeader(lines, i);
      i = parseJudgesSection(lines, i, judges);
    } else {
      i++;
    }
  }

  return { groups, coordinators, judges };
};

/**
 * Skip empty rows and header row, return index of first data row
 */
const skipEmptyRowsAndHeader = (lines: string[], startIndex: number): number => {
  let i = startIndex + 1;

  // Skip empty rows
  while (i < lines.length && !parseCSVLine(lines[i])[0]) {
    i++;
  }

  // Skip header row
  if (i < lines.length) {
    i++;
  }

  // Skip remaining empty rows
  while (i < lines.length && !parseCSVLine(lines[i])[0]) {
    i++;
  }

  return i;
};

/**
 * Parse groups section
 */
const parseGroupsSection = (
  lines: string[],
  startIndex: number,
  groups: GroupInfo[]
): number => {
  let i = startIndex;

  while (i < lines.length) {
    const values = parseCSVLine(lines[i]);

    // Stop at empty row or new section
    if (!values[0]) {
      break;
    }

    if (values[0].toLowerCase() === "coordinators" || 
        values[0].toLowerCase() === "judges") {
      break;
    }

    groups.push({
      name: values[0],
      project: values[1] || "",
      members: values[2] ? values[2].split(";").map((m) => m.trim()).filter(Boolean) : [],
      bgColor: getBackgroundColor(values[0]),
      breakOutRoom: values[3] || "",
      hubCoordinator: values[4] || "",
      hubCoordinatorTwo: values[5] || "",
      hubTimes: values[6] || "",
      hubTimesTwo: values[7] || "",
      hub: values[8] || "",
      judge: values[9] || "",
      judgeRoom: values[10] || ""
    });

    i++;
  }

  return i;
};

/**
 * Parse coordinators section
 */
const parseCoordinatorsSection = (
  lines: string[],
  startIndex: number,
  coordinators: CoordinatorInfo[]
): number => {
  let i = startIndex;
  let currentCoordinator: CoordinatorInfo | null = null;

  while (i < lines.length) {
    const values = parseCSVLine(lines[i]);

    // Stop at empty row or new section
    if (!values[0]) {
      break;
    }

    if (values[0].toLowerCase() === "judges" || 
        values[0].toLowerCase() === "groups") {
      break;
    }

    // New coordinator or same coordinator with different meeting
    if (currentCoordinator && currentCoordinator.name !== values[0]) {
      coordinators.push(currentCoordinator);
    }

    if (!currentCoordinator || currentCoordinator.name !== values[0]) {
      currentCoordinator = {
        name: values[0],
        meetings: []
      };
    }

    // Add meeting
    if (values[1] && values[2]) {
      currentCoordinator.meetings.push({
        place: values[1],
        times: values[2]
      });
    }

    i++;
  }

  if (currentCoordinator) {
    coordinators.push(currentCoordinator);
  }

  return i;
};

/**
 * Parse judges section
 */
const parseJudgesSection = (
  lines: string[],
  startIndex: number,
  judges: JudgeInfo[]
): number => {
  let i = startIndex;

  while (i < lines.length) {
    const values = parseCSVLine(lines[i]);

    // Stop at empty row
    if (!values[0]) {
      break;
    }

    judges.push({
      judge: values[0],
      judgeRoom: values[1] || "",
      time: values[2] || ""
    });

    i++;
  }

  return i;
};

/**
 * Helper function to parse CSV line, handling quoted values
 */
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

/**
 * Custom hook to fetch and parse Pitch Summit live info from Google Sheets
 * Uses the generic usePublicSheet hook with Pitch Summit-specific parsing
 * @param sheetId - The Google Sheets ID
 * @param pollInterval - Interval in milliseconds to refresh data (default: 60000 = 1 minute)
 */
export const usePitchSummitLiveInfo = (
  sheetId: string,
  pollInterval: number = 60000
) => {
  return usePublicSheet<PitchSummitLiveData>(sheetId, parsePitchSummitData, pollInterval);
};
