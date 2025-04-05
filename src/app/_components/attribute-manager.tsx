"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function AttributeManager() {
  const [newAttributeText, setNewAttributeText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "positive" | "improve"
  >("positive");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState<
    "positive" | "improve" | "all"
  >("all");

  // Use the search endpoint instead of getAll
  const { data: searchResults, refetch: refetchSearch } =
    api.attribute.search.useQuery({
      searchTerm,
      category: searchCategory,
    });

  const createAttribute = api.attribute.create.useMutation({
    onSuccess: () => {
      setNewAttributeText("");
      void refetchSearch();
    },
  });

  const deleteAttribute = api.attribute.delete.useMutation({
    onSuccess: () => {
      void refetchSearch();
    },
  });

  const handleAddAttribute = () => {
    if (newAttributeText.trim() === "") return;

    createAttribute.mutate({
      text: newAttributeText.trim(),
      category: selectedCategory,
    });
  };

  const handleDeleteAttribute = (id: number) => {
    deleteAttribute.mutate({ id });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const positiveAttributes =
    searchResults?.filter((attr) => attr.category === "positive") ?? [];
  const improveAttributes =
    searchResults?.filter((attr) => attr.category === "improve") ?? [];

  return (
    <div className="rounded-xl bg-white/10 p-6">
      <h2 className="mb-4 text-2xl font-bold">Attributes</h2>

      {/* Add new attribute section */}
      <div className="mb-6 rounded-md bg-white/5 p-4">
        <h3 className="mb-2 text-lg font-semibold">Add New Attribute</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newAttributeText}
            onChange={(e) => setNewAttributeText(e.target.value)}
            placeholder="Enter attribute text"
            className="w-full rounded-md bg-white/5 p-2 text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddAttribute();
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as "positive" | "improve")
            }
            className="rounded-md bg-white/5 p-2 text-white"
          >
            <option value="positive">Positive</option>
            <option value="improve">To Improve</option>
          </select>
          <button
            onClick={handleAddAttribute}
            className="rounded-md bg-white/20 px-4 py-2 font-medium hover:bg-white/30"
          >
            Add
          </button>
        </div>

        {createAttribute.isError && (
          <p className="mt-2 text-red-400">
            Error adding attribute: {createAttribute.error.message}
          </p>
        )}
      </div>

      {/* Search section */}
      <div className="mb-6 rounded-md bg-white/5 p-4">
        <h3 className="mb-2 text-lg font-semibold">Search Attributes</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search attributes..."
            className="w-full rounded-md bg-white/5 p-2 text-white"
          />
          <select
            value={searchCategory}
            onChange={(e) =>
              setSearchCategory(
                e.target.value as "positive" | "improve" | "all",
              )
            }
            className="rounded-md bg-white/5 p-2 text-white"
          >
            <option value="all">All Categories</option>
            <option value="positive">Positive</option>
            <option value="improve">To Improve</option>
          </select>
        </div>
      </div>

      {/* Results section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xl font-semibold text-green-400">
            Positive Attributes
          </h3>
          <div className="max-h-64 overflow-y-auto rounded-md bg-white/5 p-2">
            {positiveAttributes.length > 0 ? (
              <ul className="space-y-2">
                {positiveAttributes.map((attr) => (
                  <li
                    key={attr.id}
                    className="flex items-center justify-between rounded-md bg-white/5 p-2"
                  >
                    <span className="line-clamp-2">{attr.text}</span>
                    <button
                      onClick={() => handleDeleteAttribute(attr.id)}
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-white/60">
                No positive attributes found
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold text-amber-400">
            To Improve
          </h3>
          <div className="max-h-64 overflow-y-auto rounded-md bg-white/5 p-2">
            {improveAttributes.length > 0 ? (
              <ul className="space-y-2">
                {improveAttributes.map((attr) => (
                  <li
                    key={attr.id}
                    className="flex items-center justify-between rounded-md bg-white/5 p-2"
                  >
                    <span className="line-clamp-2">{attr.text}</span>
                    <button
                      onClick={() => handleDeleteAttribute(attr.id)}
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-white/60">
                No improvement attributes found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
