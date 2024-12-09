import { useEffect, useState } from "react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useUser } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import { PageHeader } from "~/components/layout/page-header";
import { Book, Plus, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ObservationCard, type Observation } from "~/components/cards/observation-card";
import { StoryCard, type Story } from "~/components/cards/story-card";
import { NewObservationDialog } from "~/components/new-observation-dialog";

export async function loader(args: LoaderFunctionArgs) {
  const { sessionId } = await getAuth(args);
  if (!sessionId) return redirect("/");
  return null;
}

const observations: Observation[] = [
  {
    id: 1,
    child: { name: "Emma S.", initials: "ES", image: null },
    date: "2024-01-15",
    type: "Individual",
    framework: "EYLF",
    outcomes: ["1.1", "2.4"],
    content: "Emma demonstrated great interest in pattern-making during block play...",
    tags: ["Social Skills", "Problem Solving"],
  },
  {
    id: 2,
    child: { name: "Lucas M.", initials: "LM", image: null },
    date: "2024-01-14",
    type: "Group",
    framework: "EYLF",
    outcomes: ["3.2", "4.1"],
    content: "During outdoor exploration, Lucas and peers investigated...",
    tags: ["Nature", "Collaboration"],
  },
];

const stories: Story[] = [
  {
    id: 1,
    title: "Building Bridges Together",
    children: [
      { name: "Sophia R.", initials: "SR", image: null },
      { name: "Oliver P.", initials: "OP", image: null },
    ],
    date: "2024-01-15",
    framework: "EYLF",
    outcomes: ["4.1", "5.1"],
    content: "Today, Sophia and Oliver collaborated on an engineering project...",
    tags: ["Teamwork", "Engineering"],
  },
  {
    id: 2,
    title: "Musical Discovery",
    children: [{ name: "Mia K.", initials: "MK", image: null }],
    date: "2024-01-13",
    framework: "EYLF",
    outcomes: ["1.3", "5.3"],
    content: "Mia's journey of musical exploration led to a wonderful discovery...",
    tags: ["Music", "Creative Expression"],
  },
];

export default function Learning() {
  const { isLoaded, isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState("observations");
  const [showNewObservation, setShowNewObservation] = useState(false);

  // Authentication check
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = "/";
    }
  }, [isLoaded, isSignedIn]);

  const handleEdit = (id: number) => {
    console.log("Edit item:", id);
  };

  const handleNewObservation = (observation: string) => {
    console.log("New observation:", observation);
    setShowNewObservation(false);
  };

  return (
    <div className="h-full flex-1 bg-purple-400">
      <PageHeader>
        <Book className="h-5 w-5" />
        <h1 className="text-lg font-semibold">Learning</h1>
        <div className="ml-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="observations">Observations</TabsTrigger>
              <TabsTrigger value="stories">Stories</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </PageHeader>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="observations" className="space-y-6">
              {/* Header with actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                  <Input placeholder="Search observations..." className="max-w-sm" type="search" />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={() => setShowNewObservation(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Observation
                </Button>
              </div>

              {/* Observations list */}
              <div className="grid gap-4">
                {observations.map((observation) => (
                  <ObservationCard
                    key={observation.id}
                    observation={observation}
                    onEdit={() => handleEdit(observation.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stories" className="space-y-6">
              {/* Header with actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                  <Input
                    placeholder="Search learning stories..."
                    className="max-w-sm"
                    type="search"
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Story
                </Button>
              </div>

              {/* Stories list */}
              <div className="grid gap-4">
                {stories.map((story) => (
                  <StoryCard key={story.id} story={story} onEdit={() => handleEdit(story.id)} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <NewObservationDialog
        open={showNewObservation}
        onOpenChange={setShowNewObservation}
        onSave={handleNewObservation}
      />
    </div>
  );
}
