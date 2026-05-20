"use client";

import { useMemo, useState } from "react";

type Level = "JHS" | "SHS";

type ResultItem = {
  subject: string;
  grade: string;
};

const JHS_ALIASES: Record<string, string> = {
  "ENGLISH": "ENGLISH LANGUAGE",
  "ENGLISH LANG": "ENGLISH LANGUAGE",
  "ENG LANG": "ENGLISH LANGUAGE",
  "ENGLISH LANGUAGE": "ENGLISH LANGUAGE",

  "MATH": "MATHEMATICS",
  "MATHS": "MATHEMATICS",
  "MATS": "MATHEMATICS",
  "MATHEMATICS": "MATHEMATICS",

  "SCIENCE": "INTERGRATED SCIENCE",
  "INTEGRATED SCIENCE": "INTERGRATED SCIENCE",
  "INTERGRATED SCIENCE": "INTERGRATED SCIENCE",

  "SOCIAL": "SOCIAL STUDIES",
  "SOCIAL STUDIES": "SOCIAL STUDIES",

  "RME": "RME",
  "RELIGIOUS AND MORAL EDUCATION": "RME",
  "RELIGIOUS & MORAL EDUCATION": "RME",

  "ICT": "ICT",
  "I.C.T": "ICT",

  "FRENCH": "FRENCH",

  "GA": "GHANAIAN LANGUAGE",
  "TWI": "GHANAIAN LANGUAGE",
  "ASANTE TWI": "GHANAIAN LANGUAGE",
  "FANTE": "GHANAIAN LANGUAGE",
  "DANGME": "DANGME",
  "GHANAIAN LANGUAGE": "GHANAIAN LANGUAGE",

  "BDT": "BDT",
  "B.D.T": "BDT",
  "BASIC DESIGN TECHNOLOGY": "BDT",

  "CAREER TECHNOLOGY": "CAREER TECHNOLOGY",
  "CREATIVE ART": "CREATIVE ART AND DESIGN",
  "CREATIVE ARTS": "CREATIVE ART AND DESIGN",
  "CREATIVE ART AND DESIGN": "CREATIVE ART AND DESIGN",

  "CULTURAL STUDIES": "CULTURAL STUDIES",

  "AGRIC": "AGRICULTURAL SCIENCE",
  "AGRICULTURE": "AGRICULTURAL SCIENCE",
  "AGRICULTURAL SCIENCE": "AGRICULTURAL SCIENCE",

  "LIFE SKILLS": "LIFE SKILLS",
  "TECHNICAL SKILLS": "TECHNICAL SKILLS",
  "VOCATIONAL SKILLS": "VOCATIONAL SKILLS",

  "TECH DRAWING": "TECHNICAL DRAWING",
  "TECHNICAL DRAWING": "TECHNICAL DRAWING",

  "PRE TECH": "PRE-TECHNICAL SKILLS",
  "PRE-TECH": "PRE-TECHNICAL SKILLS",
  "PRE-TECHNICAL SKILLS": "PRE-TECHNICAL SKILLS",

  "BASKETRY": "BASKETRY",
  "CATERING": "CATERING",
  "SEWING": "SEWING",
  "BEADMAKING": "BEADMAKING",
  "HISTORY": "HISTORY",
  "GEOGRAPHY": "GEOGRAPHY"
};

const SHS_ALIASES: Record<string, string> = {
  "ENGLISH": "ENGLISH LANGUAGE",
  "ENGLISH LANG": "ENGLISH LANGUAGE",
  "ENG LANG": "ENGLISH LANGUAGE",
  "CORE ENGLISH": "ENGLISH LANGUAGE",
  "ENGLISH LANGUAGE": "ENGLISH LANGUAGE",

  "MATH": "CORE MATHEMATICS",
  "MATHS": "CORE MATHEMATICS",
  "MATHEMATICS CORE": "CORE MATHEMATICS",
  "MATHEMATICS (CORE)": "CORE MATHEMATICS",
  "CORE MATH": "CORE MATHEMATICS",
  "CORE MATHEMATICS": "CORE MATHEMATICS",
  "MATHEMATICS": "MATHEMATICS",

  "SCIENCE": "INTEGRATED SCIENCE",
  "CORE SCIENCE": "INTEGRATED SCIENCE",
  "INTEGRATED SCIENCE": "INTEGRATED SCIENCE",
  "INTERGRATED SCIENCE": "INTEGRATED SCIENCE",

  "SOCIAL": "SOCIAL STUDIES",
  "SOCIAL STUDIES": "SOCIAL STUDIES",

  "BIO": "BIOLOGY",
  "BIOLOGY": "BIOLOGY",
  "CHEM": "CHEMISTRY",
  "CHEMISTRY": "CHEMISTRY",
  "PHYSICS": "PHYSICS",

  "CRS": "CRS",
  "CHRISTIAN RELIGIOUS STUDIES": "CHRISTAIN REL STUD",
  "CHRISTIAN REL STUD": "CHRISTAIN REL STUD",
  "CHRISTAIN REL STUD": "CHRISTAIN REL STUD",

  "IRS": "IRS",
  "GOVT": "GOVERNMENT",
  "GOVERNMENT": "GOVERNMENT",

  "ECONS": "ECONOMICS",
  "ECONOMICS": "ECONOMICS",

  "ACCOUNTS": "ACCOUNTING",
  "ACCOUNTING": "ACCOUNTING",
  "FINANCIAL ACCOUNTING": "FINANCIAL ACCOUNTING",

  "COST ACCOUNTING": "PRIN OF COST ACCTS",
  "PRIN OF COST ACCT": "PRIN OF COST ACCTS",
  "PRIN OF COST ACCTS": "PRIN OF COST ACCTS",
  "PRINCIPLES OF COST ACCOUNTING": "PRIN OF COST ACCTS",

  "POA": "PRINCIPALS OF ACCOUNTING",
  "PRINCIPLES OF ACCOUNTING": "PRINCIPALS OF ACCOUNTING",
  "PRINCIPALS OF ACCOUNTING": "PRINCIPALS OF ACCOUNTING",

  "BUSINESS MANAGEMENT": "BUSINESS MANAGEMENT",
  "BUSINESS METHODS": "BUSINESS METHOD",
  "BUSINESS METHOD": "BUSINESS METHOD",
  "INTRO TO BUSINESS METHODS": "INTRO TO BUS METHODS",
  "INTRO TO BUS METHODS": "INTRO TO BUS METHODS",

  "BUSINESS MATHEMATICS": "BUS MATHS & COST",
  "BUS MATHS": "BUS MATHS & COST",
  "BUS MATHS & COST": "BUS MATHS & COST",
  "BUS MATHS & COSTING": "BUS MATHS & COST",

  "COMMERCE": "COMMERCE",
  "GKA": "GKA",
  "GEOGRAPHY": "GEOGRAPHY",
  "HISTORY": "HISTORY",
  "FRENCH": "FRENCH",
  "GHANAIAN LANGUAGE": "GHANAIAN LANGUAGE",

  "AGRIC": "AGRICULTURAL SCIENCE",
  "AGRICULTURE": "AGRICULTURAL SCIENCE",
  "AGRICULTURAL SCIENCE": "AGRICULTURAL SCIENCE",

  "TEXTILES": "TEXTILES",
  "GRAPHICS": "GRAPHIC DESIGN",
  "GRAPHIC DESIGN": "GRAPHIC DESIGN",
  "PICTURE MAKING": "PICTURE MAKING",

  "LITERATURE": "LITERATURE IN ENGLISH",
  "LIT-IN-ENGLISH": "LITERATURE IN ENGLISH",
  "LITERATURE IN ENGLISH": "LITERATURE IN ENGLISH",

  "TYPEWRITING": "TYPEWRITTING",
  "TYPEWRITTING": "TYPEWRITTING",

  "FOOD AND NUTRITION": "FOOD & NUTRITION",
  "FOOD & NUTRITION": "FOOD & NUTRITION",

  "MANAGEMENT IN LIVING": "MGT IN LIVING",
  "MGT IN LIVING": "MGT IN LIVING",

  "INFO TECH": "INFO COM TECH (ELECTIVE)",
  "ICT ELECTIVE": "INFO COM TECH (ELECTIVE)",
  "INFO COM TECH (ELECTIVE)": "INFO COM TECH (ELECTIVE)",

  "HEALTH SCIENCE": "HEALTH SCIENCE",
  "TECHNICAL DRAWING": "TECHNICAL DRAWING",
  "LIFE SKILLS": "LIFE SKILLS"
};

const JHS_GRADE_ALIASES: Record<string, string> = {
  "A": "1",
  "B": "2",
  "C": "3",
  "D": "4",
  "E": "5",
  "F": "6",

  "A1": "1",
  "B2": "2",
  "B3": "3",
  "C4": "4",
  "C5": "5",
  "C6": "6",
  "D7": "7",
  "E8": "8",
  "F9": "9",

  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9"
};

function getAliases(level: Level) {
  return level === "JHS" ? JHS_ALIASES : SHS_ALIASES;
}

function normalizeText(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, " ");
}

function normalizeSubject(subject: string, level: Level) {
  const clean = normalizeText(subject);
  const aliases = getAliases(level);
  return aliases[clean] || clean;
}

function normalizeGrade(grade: string, level: Level) {
  const clean = normalizeText(grade);
  if (level === "JHS") return JHS_GRADE_ALIASES[clean] || clean;
  return clean;
}

function looksKnown(subject: string, level: Level) {
  const clean = normalizeText(subject);
  return Object.values(getAliases(level)).includes(clean);
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("SHS");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleExtract() {
    if (!file) {
      setError("Select a certificate image first.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("level", level);

    const res = await fetch("/api/extract-results", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Extraction failed.");
      return;
    }

    const cleanedResults = (data.results || []).map((r: ResultItem) => ({
 	 subject: normalizeSubject(r.subject, level),
 	 grade: normalizeGrade(r.grade, level),
	}));

    setResults(cleanedResults);
  }

  function updateResult(index: number, field: keyof ResultItem, value: string) {
    setResults((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
  field === "subject"
    ? normalizeSubject(value, level)
    : normalizeGrade(value, level),
            }
          : item
      )
    );
  }

  function removeResult(index: number) {
    setResults((prev) => prev.filter((_, i) => i !== index));
  }

  function addRow() {
    setResults((prev) => [...prev, { subject: "", grade: "" }]);
  }

  const generatedScript = useMemo(() => generateHrScript(level, results), [level, results]);

  async function copyScript() {
    await navigator.clipboard.writeText(generatedScript);
    alert("Script copied.");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Results Extraction Tool</h1>
          <p className="mt-2 text-slate-600">
            Upload a certificate, review the extracted subjects and grades, then copy the HR script.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="mb-3 text-sm font-semibold text-slate-500">STEP 1</div>
            <h2 className="mb-4 text-xl font-bold">Choose level</h2>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
              className="w-full rounded-lg border border-slate-300 p-3"
            >
              <option value="JHS">JHS</option>
              <option value="SHS">SHS</option>
            </select>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <div className="mb-3 text-sm font-semibold text-slate-500">STEP 2</div>
            <h2 className="mb-4 text-xl font-bold">Upload certificate</h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-slate-300 p-3"
            />

            {file && <p className="mt-3 text-sm text-slate-600">{file.name}</p>}
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <div className="mb-3 text-sm font-semibold text-slate-500">STEP 3</div>
            <h2 className="mb-4 text-xl font-bold">Extract</h2>

            <button
              onClick={handleExtract}
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white disabled:bg-slate-400"
            >
              {loading ? "Extracting..." : "Extract Results"}
            </button>

            {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
          </div>
        </section>

        {results.length > 0 && (
          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-5 shadow">
              <div className="mb-3 text-sm font-semibold text-slate-500">STEP 4</div>
              <h2 className="mb-4 text-xl font-bold">Review results</h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border p-2 text-left">Subject</th>
                      <th className="border p-2 text-left">Grade</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td className="border p-2">
                          <input
                            value={r.subject}
                            onChange={(e) => updateResult(i, "subject", e.target.value)}
                            className="w-full rounded border border-slate-300 p-2"
                          />
                        </td>

                        <td className="border p-2">
                          <input
                            value={r.grade}
                            onChange={(e) => updateResult(i, "grade", e.target.value)}
                            className="w-full rounded border border-slate-300 p-2"
                          />
                        </td>

                        <td className="border p-2 text-center">
                        {looksKnown(r.subject, level) ? (
                            <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                              OK
                            </span>
                          ) : (
                            <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                              Check
                            </span>
                          )}
                        </td>

                        <td className="border p-2 text-center">
                          <button
                            onClick={() => removeResult(i)}
                            className="rounded bg-red-100 px-3 py-1 text-sm font-semibold text-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={addRow}
                className="mt-4 rounded-lg border border-slate-300 px-4 py-2 font-semibold"
              >
                Add Row
              </button>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <div className="mb-3 text-sm font-semibold text-slate-500">STEP 5</div>
              <h2 className="mb-4 text-xl font-bold">Copy HR script</h2>

              <button
                onClick={copyScript}
                className="mb-4 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white"
              >
                Copy Script
              </button>

              <textarea
                value={generatedScript}
                readOnly
                className="h-[520px] w-full rounded-lg border border-slate-300 bg-slate-950 p-4 font-mono text-xs text-slate-100"
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function generateHrScript(level: Level, results: ResultItem[]) {
  const cleaned = results
    .filter((r) => r.subject.trim() && r.grade.trim())
    .map((r) => [normalizeSubject(r.subject, level), normalizeGrade(r.grade, level)]);

  const entriesName = level === "SHS" ? "shsEntries" : "entries";
  const addFunction = level === "SHS" ? "addShsSubjects" : "addSubjects";
  const addOneFunction = level === "SHS" ? "addOneShsSubject" : "addOneSubject";
  const getButtonFunction = level === "SHS" ? "getShsAddSubjectButton" : "getJhsAddSubjectButton";
  const sectionName = level === "SHS" ? "SHS RESULTS" : "JHS RESULT";

  return `
const ${entriesName} = ${JSON.stringify(cleaned, null, 2)};

const aliases = ${JSON.stringify(level === "JHS" ? JHS_ALIASES : SHS_ALIASES, null, 2)};

const gradeAliases = ${JSON.stringify(level === "JHS" ? JHS_GRADE_ALIASES : {}, null, 2)};

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeText(text) {
  return String(text).trim().toUpperCase().replace(/\\s+/g, " ");
}

function realClick(el) {
  if (!el) throw new Error("Element not found for clicking");
  el.scrollIntoView({ block: "center" });

  ["pointerdown", "mousedown", "mouseup", "click"].forEach(type => {
    el.dispatchEvent(new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window
    }));
  });
}

function clickListItem(text) {
  const clean = normalizeText(text);
  const target = aliases[clean] || clean;

  const item = [...document.querySelectorAll(".v-list-item")]
    .reverse()
    .find(el => normalizeText(el.innerText) === target);

  if (!item) throw new Error("Not found: " + text + " → " + target);

  realClick(item);
}

function findButtonByIcon(iconName) {
  const btn = [...document.querySelectorAll("button")]
    .reverse()
    .find(b => b.querySelector("i")?.getAttribute("data-icon") === iconName);

  if (!btn) throw new Error("Button icon not found: " + iconName);
  return btn;
}

function ${getButtonFunction}() {
  const buttons = [...document.querySelectorAll("button")];

  const headerIndex = buttons.findIndex(
    b => normalizeText(b.innerText) === "${sectionName}"
  );

  if (headerIndex === -1) throw new Error("${sectionName} section not found");

  const btn = buttons
    .slice(headerIndex)
    .find(b => normalizeText(b.innerText) === "ADD SUBJECT");

  if (!btn) throw new Error("${level} Add Subject button not found");

  return btn;
}

async function ${addOneFunction}(subject, grade) {
  console.log("Adding ${level}:", subject, grade);

  realClick(${getButtonFunction}());
  await wait(700);

  realClick([...document.querySelectorAll("input")].at(-2));
  await wait(500);

  clickListItem(subject);
  await wait(500);

  realClick([...document.querySelectorAll("input")].at(-1));
  await wait(500);

clickListItem(gradeAliases[normalizeText(grade)] || String(grade));
  await wait(500);

  realClick(findButtonByIcon("check"));
  await wait(2200);
}

async function ${addFunction}(entries) {
  for (const [subject, grade] of entries) {
    await ${addOneFunction}(subject, grade);
  }

  console.log("${level} done.");
}

${addFunction}(${entriesName});
`.trim();
}
