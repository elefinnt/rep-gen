"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type StudentAttributeManagerProps = {
  studentId: number;
  onClose: () => void;
};

export function StudentAttributeManager({
  studentId,
  onClose,
}: StudentAttributeManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState<
    "positive" | "improve" | "all"
  >("all");

  // Get student details
  const { data: student } = api.student.getById.useQuery({ id: studentId });

  // Get student's attributes
  const { data: studentAttributes = [], refetch: refetchStudentAttributes } =
    api.student.getStudentAttributes.useQuery({ studentId });

  // Search for attributes
  const { data: searchResults = [] } = api.attribute.search.useQuery({
    searchTerm,
    category: searchCategory,
  });

  // Add attribute to student
  const addAttributeMutation = api.student.addAttributeToStudent.useMutation({
    onSuccess: () => {
      void refetchStudentAttributes();
    },
  });

  // Remove attribute from student
  const removeAttributeMutation =
    api.student.removeAttributeFromStudent.useMutation({
      onSuccess: () => {
        void refetchStudentAttributes();
      },
    });

  // Check if an attribute is assigned to the student
  const isAttributeAssigned = (attributeId: number): boolean => {
    return studentAttributes.some((attr) => attr.id === attributeId);
  };

  // Handle toggling an attribute for a student
  const handleToggleAttribute = (attributeId: number): void => {
    if (isAttributeAssigned(attributeId)) {
      removeAttributeMutation.mutate({ studentId, attributeId });
    } else {
      addAttributeMutation.mutate({ studentId, attributeId });
    }
  };

  // Filter attributes by category
  const positiveAttributes = studentAttributes.filter(
    (attr) => attr.category === "positive",
  );
  const improveAttributes = studentAttributes.filter(
    (attr) => attr.category === "improve",
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-4xl border-none bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>
            Manage Attributes for {student?.name ?? "Student"}
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            className="h-8 w-8 rounded-full p-0 text-white/70 hover:bg-white/10 hover:text-white"
          >
            ✕
          </Button>
        </CardHeader>
        <CardContent>
          {/* Current attributes section */}
          <div className="mb-6">
            <h3 className="mb-2 text-xl font-semibold">Current Attributes</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-lg font-medium text-green-400">
                  Positive
                </h4>
                <div className="rounded-md bg-white/5 p-3">
                  {positiveAttributes.length > 0 ? (
                    <ul className="space-y-2">
                      {positiveAttributes.map((attr) => (
                        <li
                          key={attr.id}
                          className="flex items-center justify-between"
                        >
                          <span>{attr.text}</span>
                          <Button
                            onClick={() => handleToggleAttribute(attr.id)}
                            variant="outline"
                            size="sm"
                            className="ml-2 h-7 border-red-500/30 bg-red-500/20 px-2 py-0 text-xs text-red-300 hover:bg-red-500/30"
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/60">
                      No positive attributes assigned
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-lg font-medium text-amber-400">
                  To Improve
                </h4>
                <div className="rounded-md bg-white/5 p-3">
                  {improveAttributes.length > 0 ? (
                    <ul className="space-y-2">
                      {improveAttributes.map((attr) => (
                        <li
                          key={attr.id}
                          className="flex items-center justify-between"
                        >
                          <span>{attr.text}</span>
                          <Button
                            onClick={() => handleToggleAttribute(attr.id)}
                            variant="outline"
                            size="sm"
                            className="ml-2 h-7 border-red-500/30 bg-red-500/20 px-2 py-0 text-xs text-red-300 hover:bg-red-500/30"
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/60">
                      No improvement attributes assigned
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search and add attributes section */}
          <div>
            <h3 className="mb-2 text-xl font-semibold">Add Attributes</h3>

            <div className="mb-4 flex gap-2">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search attributes..."
                className="w-full border-white/20 bg-white/5 text-white placeholder:text-white/50"
              />
              <Select
                value={searchCategory}
                onValueChange={(value) =>
                  setSearchCategory(value as "positive" | "improve" | "all")
                }
              >
                <SelectTrigger className="w-[150px] border-white/20 bg-white/5 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-slate-950 text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="improve">To Improve</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="max-h-64 overflow-y-auto rounded-md bg-white/5 p-3">
              {searchResults.length > 0 ? (
                <ul className="space-y-2">
                  {searchResults.map((attr) => (
                    <li
                      key={attr.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <span
                          className={
                            attr.category === "positive"
                              ? "text-green-400"
                              : "text-amber-400"
                          }
                        >
                          [
                          {attr.category === "positive"
                            ? "Positive"
                            : "To Improve"}
                          ]
                        </span>{" "}
                        <span>{attr.text}</span>
                      </div>
                      <Button
                        onClick={() => handleToggleAttribute(attr.id)}
                        variant="outline"
                        size="sm"
                        className={`ml-2 h-7 px-2 py-0 text-xs ${
                          isAttributeAssigned(attr.id)
                            ? "border-red-500/30 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                            : "border-green-500/30 bg-green-500/20 text-green-300 hover:bg-green-500/30"
                        }`}
                      >
                        {isAttributeAssigned(attr.id) ? "Remove" : "Add"}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-white/60">
                  {searchTerm
                    ? "No matching attributes found"
                    : "Search for attributes to add"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
