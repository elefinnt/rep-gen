"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { StudentAttributeManager } from "./student-attribute-manager";
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

export function StudentManager() {
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGender, setNewStudentGender] = useState<
    "male" | "female" | "other"
  >("other");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );

  const { data: students = [], refetch: refetchStudents } =
    api.student.getAll.useQuery();

  const createStudent = api.student.create.useMutation({
    onSuccess: () => {
      setNewStudentName("");
      void refetchStudents();
    },
  });

  const deleteStudent = api.student.delete.useMutation({
    onSuccess: () => {
      void refetchStudents();
    },
  });

  const handleAddStudent = () => {
    if (newStudentName.trim() === "") return;

    createStudent.mutate({
      name: newStudentName.trim(),
      gender: newStudentGender,
    });
  };

  const handleDeleteStudent = (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this student? This will also remove all their attributes.",
      )
    ) {
      deleteStudent.mutate({ id });
    }
  };

  const handleManageAttributes = (studentId: number) => {
    setSelectedStudentId(studentId);
  };

  const handleCloseAttributeManager = () => {
    setSelectedStudentId(null);
  };

  return (
    <Card className="border-none bg-white/10 text-white">
      <CardHeader>
        <CardTitle>Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="Enter student name"
              className="w-full border-white/20 bg-white/5 text-white placeholder:text-white/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddStudent();
              }}
            />
            <Select
              value={newStudentGender}
              onValueChange={(value) =>
                setNewStudentGender(value as "male" | "female" | "other")
              }
            >
              <SelectTrigger className="w-[120px] border-white/20 bg-white/5 text-white">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent className="border-white/20 bg-slate-950 text-white">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddStudent} variant="secondary">
              Add
            </Button>
          </div>
        </div>

        {createStudent.isError && (
          <p className="mb-4 text-red-400">
            Error adding student: {createStudent.error.message}
          </p>
        )}

        <div className="max-h-96 overflow-y-auto">
          {students.length > 0 ? (
            <ul className="space-y-2">
              {students.map((student) => (
                <li
                  key={student.id}
                  className="flex items-center justify-between rounded-md bg-white/5 p-3"
                >
                  <div>
                    <span>{student.name}</span>
                    <span className="ml-2 text-xs text-white/60">
                      (
                      {student.gender.charAt(0).toUpperCase() +
                        student.gender.slice(1)}
                      )
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleManageAttributes(student.id)}
                      variant="outline"
                      className="h-8 border-blue-500/30 bg-blue-500/20 px-3 py-1 text-sm text-blue-300 hover:bg-blue-500/30"
                    >
                      Attributes
                    </Button>
                    <Button
                      onClick={() => handleDeleteStudent(student.id)}
                      variant="outline"
                      className="h-8 border-red-500/30 bg-red-500/20 px-3 py-1 text-sm text-red-300 hover:bg-red-500/30"
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-white/60">No students added yet</p>
          )}
        </div>

        {selectedStudentId !== null && (
          <StudentAttributeManager
            studentId={selectedStudentId}
            onClose={handleCloseAttributeManager}
          />
        )}
      </CardContent>
    </Card>
  );
}
