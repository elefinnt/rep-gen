"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function StudentManager() {
  const [newStudentName, setNewStudentName] = useState("");
  
  const { data: students, refetch: refetchStudents } = api.student.getAll.useQuery();
  
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
    
    createStudent.mutate({ name: newStudentName.trim() });
  };
  
  const handleDeleteStudent = (id: number) => {
    deleteStudent.mutate({ id });
  };
  
  return (
    <div className="rounded-xl bg-white/10 p-6">
      <h2 className="mb-4 text-2xl font-bold">Students</h2>
      
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          placeholder="Enter student name"
          className="w-full rounded-md bg-white/5 p-2 text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddStudent();
          }}
        />
        <button
          onClick={handleAddStudent}
          className="rounded-md bg-white/20 px-4 py-2 font-medium hover:bg-white/30"
        >
          Add
        </button>
      </div>
      
      {createStudent.isError && (
        <p className="mb-4 text-red-400">
          Error adding student: {createStudent.error.message}
        </p>
      )}
      
      <div className="max-h-96 overflow-y-auto">
        {students && students.length > 0 ? (
          <ul className="space-y-2">
            {students.map((student) => (
              <li
                key={student.id}
                className="flex items-center justify-between rounded-md bg-white/5 p-3"
              >
                <span>{student.name}</span>
                <button
                  onClick={() => handleDeleteStudent(student.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-white/60">No students added yet</p>
        )}
      </div>
    </div>
  );
}
