"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function ReportGenerator() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedPositiveAttributes, setSelectedPositiveAttributes] = useState<
    number[]
  >([]);
  const [selectedImproveAttributes, setSelectedImproveAttributes] = useState<
    number[]
  >([]);
  const [generatedReport, setGeneratedReport] = useState<string>("");

  const { data: students } = api.student.getAll.useQuery();

  // Use search queries with empty search term to get all attributes by category
  const { data: positiveAttributes } = api.attribute.search.useQuery({
    searchTerm: "",
    category: "positive",
  });

  const { data: improveAttributes } = api.attribute.search.useQuery({
    searchTerm: "",
    category: "improve",
  });

  // Add search state for each category
  const [positiveSearchTerm, setPositiveSearchTerm] = useState("");
  const [improveSearchTerm, setImproveSearchTerm] = useState("");

  // Filtered attributes based on search
  const filteredPositiveAttributes =
    positiveAttributes?.filter((attr) =>
      attr.text.toLowerCase().includes(positiveSearchTerm.toLowerCase()),
    ) ?? [];

  const filteredImproveAttributes =
    improveAttributes?.filter((attr) =>
      attr.text.toLowerCase().includes(improveSearchTerm.toLowerCase()),
    ) ?? [];

  const handleGenerateReport = () => {
    if (!selectedStudent || !students) return;

    const student = students.find((s) => s.id === selectedStudent);
    if (!student) return;

    const positiveAttrs =
      positiveAttributes?.filter((attr) =>
        selectedPositiveAttributes.includes(attr.id),
      ) ?? [];

    const improveAttrs =
      improveAttributes?.filter((attr) =>
        selectedImproveAttributes.includes(attr.id),
      ) ?? [];

    // Generate the report
    let report = `${student.name} `;

    if (positiveAttrs.length > 0) {
      report += positiveAttrs.map((attr) => attr.text).join(" ");
    }

    if (improveAttrs.length > 0) {
      if (positiveAttrs.length > 0) {
        report += " However, ";
      }
      report += improveAttrs.map((attr) => attr.text).join(" ");
    }

    setGeneratedReport(report);
  };

  const handleTogglePositiveAttribute = (id: number) => {
    setSelectedPositiveAttributes((prev) =>
      prev.includes(id)
        ? prev.filter((attrId) => attrId !== id)
        : [...prev, id],
    );
  };

  const handleToggleImproveAttribute = (id: number) => {
    setSelectedImproveAttributes((prev) =>
      prev.includes(id)
        ? prev.filter((attrId) => attrId !== id)
        : [...prev, id],
    );
  };

  const handleCopyToClipboard = () => {
    if (generatedReport) {
      void navigator.clipboard.writeText(generatedReport);
      alert("Report copied to clipboard!");
    }
  };

  return (
    <div className="w-full max-w-4xl rounded-xl bg-white/10 p-6">
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-bold">Select Student</h2>
        <select
          value={selectedStudent ?? ""}
          onChange={(e) => setSelectedStudent(Number(e.target.value) ?? null)}
          className="w-full rounded-md bg-white/5 p-2 text-white"
        >
          <option value="">-- Select a student --</option>
          {students?.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-xl font-bold text-green-400">
            Positive Attributes
          </h2>
          <div className="mb-2">
            <input
              type="text"
              value={positiveSearchTerm}
              onChange={(e) => setPositiveSearchTerm(e.target.value)}
              placeholder="Search positive attributes..."
              className="w-full rounded-md bg-white/5 p-2 text-white"
            />
          </div>
          <div className="max-h-64 overflow-y-auto rounded-md bg-white/5 p-2">
            {filteredPositiveAttributes.length > 0 ? (
              <ul className="space-y-2">
                {filteredPositiveAttributes.map((attr) => (
                  <li key={attr.id}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPositiveAttributes.includes(attr.id)}
                        onChange={() => handleTogglePositiveAttribute(attr.id)}
                        className="rounded"
                      />
                      <span>{attr.text}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-white/60">
                {positiveSearchTerm
                  ? "No matching positive attributes"
                  : "No positive attributes available"}
              </p>
            )}
          </div>
          {filteredPositiveAttributes.length > 0 && positiveSearchTerm && (
            <p className="mt-1 text-sm text-white/60">
              Showing {filteredPositiveAttributes.length} of{" "}
              {positiveAttributes?.length ?? 0} attributes
            </p>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-xl font-bold text-amber-400">
            Areas to Improve
          </h2>
          <div className="mb-2">
            <input
              type="text"
              value={improveSearchTerm}
              onChange={(e) => setImproveSearchTerm(e.target.value)}
              placeholder="Search areas to improve..."
              className="w-full rounded-md bg-white/5 p-2 text-white"
            />
          </div>
          <div className="max-h-64 overflow-y-auto rounded-md bg-white/5 p-2">
            {filteredImproveAttributes.length > 0 ? (
              <ul className="space-y-2">
                {filteredImproveAttributes.map((attr) => (
                  <li key={attr.id}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedImproveAttributes.includes(attr.id)}
                        onChange={() => handleToggleImproveAttribute(attr.id)}
                        className="rounded"
                      />
                      <span>{attr.text}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-white/60">
                {improveSearchTerm
                  ? "No matching improvement attributes"
                  : "No improvement attributes available"}
              </p>
            )}
          </div>
          {filteredImproveAttributes.length > 0 && improveSearchTerm && (
            <p className="mt-1 text-sm text-white/60">
              Showing {filteredImproveAttributes.length} of{" "}
              {improveAttributes?.length ?? 0} attributes
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={handleGenerateReport}
          disabled={!selectedStudent}
          className="w-full rounded-md bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Generate Report
        </button>
      </div>

      {generatedReport && (
        <div className="rounded-md bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold">Generated Report</h2>
            <button
              onClick={handleCopyToClipboard}
              className="rounded-md bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
            >
              Copy
            </button>
          </div>
          <p className="whitespace-pre-wrap">{generatedReport}</p>
        </div>
      )}
    </div>
  );
}
