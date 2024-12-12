import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FileCardProps {
  name: string;
  uploadedDate: string;
}

export function FileCard({ name,uploadedDate }: FileCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col items-center text-center gap-2">
          <FileText className="h-6 w-6 md:h-8 md:w-8 text-gray-600" />
          <div className="font-medium text-sm md:text-base text-wrap">{name}</div>
          <div className="text-xs md:text-sm text-gray-500">{uploadedDate}</div>
        </div>
      </CardContent>
    </Card>
  );
}
