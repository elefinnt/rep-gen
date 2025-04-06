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
  const { data: searchResults = [], refetch: refetchSearch } =
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

  const positiveAttributes = searchResults.filter(
    (attr) => attr.category === "positive",
  );
  const improveAttributes = searchResults.filter(
    (attr) => attr.category === "improve",
  );
  return (
    <Card className="border-none bg-white/10 text-white">
      <CardHeader>
        <CardTitle>Attributes</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add new attribute section */}
        <div className="mb-6 rounded-md bg-white/5 p-4">
          <h3 className="mb-2 text-lg font-semibold">Add New Attribute</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newAttributeText}
              onChange={(e) => setNewAttributeText(e.target.value)}
              placeholder="Enter attribute text"
              className="w-full border-white/20 bg-white/5 text-white placeholder:text-white/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddAttribute();
              }}
            />
            <Select
              value={selectedCategory}
              onValueChange={(value) =>
                setSelectedCategory(value as "positive" | "improve")
              }
            >
              <SelectTrigger className="w-[120px] border-white/20 bg-white/5 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="border-white/20 bg-slate-950 text-white">
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="improve">To Improve</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddAttribute} variant="secondary">
              Add
            </Button>
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
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
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
                      <Button
                        onClick={() => handleDeleteAttribute(attr.id)}
                        variant="ghost"
                        className="ml-2 h-6 px-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        Delete
                      </Button>
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
                      <Button
                        onClick={() => handleDeleteAttribute(attr.id)}
                        variant="ghost"
                        className="ml-2 h-6 px-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        Delete
                      </Button>
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
      </CardContent>
    </Card>
  );
}
