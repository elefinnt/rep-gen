"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent } from "~/components/ui/card";

export function ReportGenerator() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedPositiveAttributes, setSelectedPositiveAttributes] = useState<
    number[]
  >([]);
  const [selectedImproveAttributes, setSelectedImproveAttributes] = useState<
    number[]
  >([]);
  const [generatedReport, setGeneratedReport] = useState<string>("");
  const [isGeneratingAIReport, setIsGeneratingAIReport] =
    useState<boolean>(false);
  const [useAI, setUseAI] = useState<boolean>(true);

  const { data: students = [] } = api.student.getAll.useQuery();

  // Get student attributes when a student is selected
  const {
    data: studentAttributes = [],
    isLoading: isLoadingStudentAttributes,
  } = api.student.getStudentAttributes.useQuery(
    { studentId: selectedStudent ?? 0 },
    { enabled: selectedStudent !== null },
  );

  // Use search queries with empty search term to get all attributes by category
  const { data: positiveAttributes = [] } = api.attribute.search.useQuery({
    searchTerm: "",
    category: "positive",
  });

  const { data: improveAttributes = [] } = api.attribute.search.useQuery({
    searchTerm: "",
    category: "improve",
  });

  // Add search state for each category
  const [positiveSearchTerm, setPositiveSearchTerm] = useState("");
  const [improveSearchTerm, setImproveSearchTerm] = useState("");

  // Filtered attributes based on search
  const filteredPositiveAttributes = positiveAttributes.filter((attr) =>
    attr.text.toLowerCase().includes(positiveSearchTerm.toLowerCase()),
  );

  const filteredImproveAttributes = improveAttributes.filter((attr) =>
    attr.text.toLowerCase().includes(improveSearchTerm.toLowerCase()),
  );

  // Student's positive and improvement attributes
  const studentPositiveAttributes = studentAttributes.filter(
    (attr) => attr.category === "positive",
  );
  const studentImproveAttributes = studentAttributes.filter(
    (attr) => attr.category === "improve",
  );

  // OpenAI report generation
  const generateAIReport = (api.openai.generateReport as any).useMutation({
    onMutate: () => {
      setIsGeneratingAIReport(true);
    },
    onSuccess: (data: any) => {
      if (data.success) {
        setGeneratedReport(data.report);
      } else {
        alert(`Failed to generate AI report: ${data.error ?? "Unknown error"}`);
      }
      setIsGeneratingAIReport(false);
    },
    onError: (error: any) => {
      alert(`Error generating AI report: ${error.message}`);
      setIsGeneratingAIReport(false);
    },
  });

  const handleGenerateReport = () => {
    if (!selectedStudent || !students) return;

    const student = students.find((s) => s.id === selectedStudent);
    if (!student) return;

    // Use student's assigned attributes if available, otherwise use selected attributes from the UI
    const useStudentAttributes =
      studentAttributes && studentAttributes.length > 0;

    const positiveAttrs = useStudentAttributes
      ? studentPositiveAttributes
      : positiveAttributes.filter((attr) =>
          selectedPositiveAttributes.includes(attr.id),
        );

    const improveAttrs = useStudentAttributes
      ? studentImproveAttributes
      : improveAttributes.filter((attr) =>
          selectedImproveAttributes.includes(attr.id),
        );

    if (useAI) {
      // Generate report using OpenAI
      generateAIReport.mutate({
        studentName: student.name,
        studentGender: student.gender,
        positiveAttributes: positiveAttrs,
        improveAttributes: improveAttrs,
      });
    } else {
      // Generate a simple report without AI
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
    }
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
    <Card className="w-full max-w-4xl border-none bg-white/10 text-white">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold">Select Student</h2>
          <Select
            value={selectedStudent?.toString() ?? ""}
            onValueChange={(value) => setSelectedStudent(Number(value) || null)}
          >
            <SelectTrigger className="w-full border-white/20 bg-white/5 text-white">
              <SelectValue placeholder="-- Select a student --" />
            </SelectTrigger>
            <SelectContent className="border-white/20 bg-slate-950 text-white">
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedStudent &&
            studentAttributes &&
            studentAttributes.length > 0 && (
              <div className="mt-2 rounded-md bg-green-500/20 p-2 text-sm">
                <p>
                  This student has {studentAttributes.length} assigned
                  attributes ({studentPositiveAttributes.length} positive,{" "}
                  {studentImproveAttributes.length} to improve). These will be
                  used for the report generation.
                </p>
              </div>
            )}

          {selectedStudent &&
            (!studentAttributes || studentAttributes.length === 0) &&
            !isLoadingStudentAttributes && (
              <div className="mt-2 rounded-md bg-amber-500/20 p-2 text-sm">
                <p>
                  This student has no assigned attributes. Please select
                  attributes below or assign attributes to the student in the
                  Settings page.
                </p>
              </div>
            )}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-xl font-bold text-green-400">
              Positive Attributes
            </h2>
            <div className="mb-2">
              <Input
                type="text"
                value={positiveSearchTerm}
                onChange={(e) => setPositiveSearchTerm(e.target.value)}
                placeholder="Search positive attributes..."
                className="w-full border-white/20 bg-white/5 text-white placeholder:text-white/50"
              />
            </div>
            <div className="max-h-64 overflow-y-auto rounded-md bg-white/5 p-2">
              {filteredPositiveAttributes.length > 0 ? (
                <ul className="space-y-2">
                  {filteredPositiveAttributes.map((attr) => (
                    <li key={attr.id}>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedPositiveAttributes.includes(attr.id)}
                          onCheckedChange={() =>
                            handleTogglePositiveAttribute(attr.id)
                          }
                          className="border-white/20"
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
                {positiveAttributes.length || 0} attributes
              </p>
            )}
          </div>

          <div>
            <h2 className="mb-2 text-xl font-bold text-amber-400">
              Areas to Improve
            </h2>
            <div className="mb-2">
              <Input
                type="text"
                value={improveSearchTerm}
                onChange={(e) => setImproveSearchTerm(e.target.value)}
                placeholder="Search areas to improve..."
                className="w-full border-white/20 bg-white/5 text-white placeholder:text-white/50"
              />
            </div>
            <div className="max-h-64 overflow-y-auto rounded-md bg-white/5 p-2">
              {filteredImproveAttributes.length > 0 ? (
                <ul className="space-y-2">
                  {filteredImproveAttributes.map((attr) => (
                    <li key={attr.id}>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedImproveAttributes.includes(attr.id)}
                          onCheckedChange={() =>
                            handleToggleImproveAttribute(attr.id)
                          }
                          className="border-white/20"
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
                {improveAttributes.length || 0} attributes
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between rounded-md bg-white/5 p-3">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={useAI}
                onCheckedChange={(checked) => setUseAI(checked === true)}
                className="border-white/20"
              />
              <span>Use AI to generate a detailed report</span>
            </label>
            {useAI && (
              <span className="text-sm text-white/60">
                Generates a 250-300 word professional report
              </span>
            )}
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={!selectedStudent || isGeneratingAIReport}
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
          >
            {isGeneratingAIReport ? "Generating Report..." : "Generate Report"}
          </Button>
        </div>

        {generatedReport && (
          <div className="rounded-md bg-white/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-bold">Generated Report</h2>
              <Button
                onClick={handleCopyToClipboard}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30"
              >
                Copy
              </Button>
            </div>
            <p className="whitespace-pre-wrap">{generatedReport}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
