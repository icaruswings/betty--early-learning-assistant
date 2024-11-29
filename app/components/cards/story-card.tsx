import { MoreVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { formatDate } from "~/lib/format";

interface Child {
  name: string;
  initials: string;
  image: string | null;
}

export interface Story {
  id: number;
  title: string;
  children: Child[];
  date: string;
  framework: string;
  outcomes: string[];
  content: string;
  tags: string[];
}

interface StoryCardProps {
  story: Story;
  onEdit?: () => void;
}

export function StoryCard({ story, onEdit }: StoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{story.title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {story.children.map((child) => (
              <Avatar
                key={child.initials}
                className="border-2 border-background"
              >
                <AvatarImage src={child.image || undefined} />
                <AvatarFallback>{child.initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span>·</span>
          {formatDate(story.date)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {story.content}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{story.framework}</Badge>
          {story.outcomes.map((outcome) => (
            <Badge key={outcome} variant="outline">
              {outcome}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          {story.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
