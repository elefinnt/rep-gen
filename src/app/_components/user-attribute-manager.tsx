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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function UserAttributeManager() {
  const [newAttributeText, setNewAttributeText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "positive" | "improve"
  >("positive");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState<
    "positive" | "improve" | "all"
  >("all");
  const [activeTab, setActiveTab] = useState<"global" | "personal">("global");

  // Default user ID (will be replaced with actual user ID when auth is added)
  const defaultUserId = "default";

  // Use the search endpoint for global attributes
  const { data: globalAttributes = [], refetch: refetchGlobal } =
    api.attribute.search.useQuery({
      searchTerm,
      category: searchCategory,
    });

  // Use the search endpoint for user-specific attributes
  const { data: userAttributes = [], refetch: refetchUser } =
    api.userAttribute.search.useQuery({
      searchTerm,
      category: searchCategory,
      userId: defaultUserId,
    });

  const createGlobalAttribute = api.attribute.create.useMutation({
    onSuccess: () => {
      setNewAttributeText("");
      void refetchGlobal();
    },
  });

  const createUserAttribute = api.userAttribute.create.useMutation({
    onSuccess: () => {
      setNewAttributeText("");
      void refetchUser();
    },
  });

  const deleteGlobalAttribute = api.attribute.delete.useMutation({
    onSuccess: () => {
      void refetchGlobal();
    },
  });

  const deleteUserAttribute = api.userAttribute.delete.useMutation({
    onSuccess: () => {
      void refetchUser();
    },
  });

  const handleAddAttribute = () => {
    if (newAttributeText.trim() === "") return;

    if (activeTab === "global") {
      createGlobalAttribute.mutate({
        text: newAttributeText.trim(),
        category: selectedCategory,
      });
    } else {
      createUserAttribute.mutate({
        text: newAttributeText.trim(),
        category: selectedCategory,
        userId: defaultUserId,
      });
    }
  };

  const handleDeleteAttribute = (id: number) => {
    if (activeTab === "global") {
      deleteGlobalAttribute.mutate({ id });
    } else {
      deleteUserAttribute.mutate({ id });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const positiveAttributes =
    activeTab === "global"
      ? globalAttributes.filter((attr) => attr.category === "positive")
      : userAttributes.filter((attr) => attr.category === "positive");

  const improveAttributes =
    activeTab === "global"
      ? globalAttributes.filter((attr) => attr.category === "improve")
      : userAttributes.filter((attr) => attr.category === "improve");

  return (
    <Card className="border-none bg-white/10 text-white">
      <CardHeader>
        <CardTitle>Attributes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="global"
          className="w-full"
          onValueChange={(value) =>
            setActiveTab(value as "global" | "personal")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global">Global Attributes</TabsTrigger>
            <TabsTrigger value="personal">Personal Attributes</TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            <div className="mb-6 space-y-2">
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
            </div>

            <div className="mb-4">
              <Input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search attributes..."
                className="w-full border-white/20 bg-white/5 text-white placeholder:text-white/50"
              />
            </div>

            <div className="mb-4">
              <Select
                value={searchCategory}
                onValueChange={(value) =>
                  setSearchCategory(value as "positive" | "improve" | "all")
                }
              >
                <SelectTrigger className="w-full border-white/20 bg-white/5 text-white">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-slate-950 text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="improve">To Improve</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-medium text-green-400">
                  Positive
                </h3>
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
                            onClick={() => handleDeleteAttribute(attr.id)}
                            variant="outline"
                            size="sm"
                            className="ml-2 h-7 border-red-500/30 bg-red-500/20 px-2 py-0 text-xs text-red-300 hover:bg-red-500/30"
                          >
                            Delete
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/60">No positive attributes</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium text-amber-400">
                  To Improve
                </h3>
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
                            onClick={() => handleDeleteAttribute(attr.id)}
                            variant="outline"
                            size="sm"
                            className="ml-2 h-7 border-red-500/30 bg-red-500/20 px-2 py-0 text-xs text-red-300 hover:bg-red-500/30"
                          >
                            Delete
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/60">No improvement attributes</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="personal">
            <div className="mb-6 space-y-2">
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
            </div>

            <div className="mb-4">
              <Input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search attributes..."
                className="w-full border-white/20 bg-white/5 text-white placeholder:text-white/50"
              />
            </div>

            <div className="mb-4">
              <Select
                value={searchCategory}
                onValueChange={(value) =>
                  setSearchCategory(value as "positive" | "improve" | "all")
                }
              >
                <SelectTrigger className="w-full border-white/20 bg-white/5 text-white">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-slate-950 text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="improve">To Improve</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-medium text-green-400">
                  Positive
                </h3>
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
                            onClick={() => handleDeleteAttribute(attr.id)}
                            variant="outline"
                            size="sm"
                            className="ml-2 h-7 border-red-500/30 bg-red-500/20 px-2 py-0 text-xs text-red-300 hover:bg-red-500/30"
                          >
                            Delete
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/60">No positive attributes</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium text-amber-400">
                  To Improve
                </h3>
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
                            onClick={() => handleDeleteAttribute(attr.id)}
                            variant="outline"
                            size="sm"
                            className="ml-2 h-7 border-red-500/30 bg-red-500/20 px-2 py-0 text-xs text-red-300 hover:bg-red-500/30"
                          >
                            Delete
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/60">No improvement attributes</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
