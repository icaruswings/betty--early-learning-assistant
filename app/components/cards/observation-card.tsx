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

export interface Observation {
  id: number;
  child: Child;
  date: string;
  type: "Individual" | "Group";
  framework: string;
  outcomes: string[];
  content: string;
  tags: string[];
}

interface ObservationCardProps {
  observation: Observation;
  onEdit?: () => void;
}

export function ObservationCard({ observation, onEdit }: ObservationCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={observation.child.image || undefined} />
          <AvatarFallback>{observation.child.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{observation.child.name}</CardTitle>
          <CardDescription>
            {formatDate(observation.date)} · {observation.type}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {observation.content}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{observation.framework}</Badge>
          {observation.outcomes.map((outcome) => (
            <Badge key={outcome} variant="outline">
              {outcome}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          {observation.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
