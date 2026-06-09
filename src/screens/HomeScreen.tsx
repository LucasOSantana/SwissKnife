import { AppCard } from "@/components/app/card/AppCard";
import {
  PocketKnife 
} from "lucide-react";

export function HomeScreen() {
  return (
    <div className="space-y-6">
      <AppCard
        title="Welcome to SwissKnife"
        description="Your complete technical toolkit for daily tasks."
        accent={<PocketKnife />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <AppCard
            title="Encode/Decode"
            description="Convert data between Base64, Hexadecimal, URL, and handle JWTs with ease."
          />
          <AppCard
            title="Converter"
            description="Transform text formats (Case), number bases, units of measurement, and date/unix timestamps."
          />
          <AppCard
            title="Formatter"
            description="Beautify and validate JSON, XML, SQL, and use the Text Inspector for detailed analysis."
          />
          <AppCard
            title="Generator"
            description="Generate secure passwords, UUIDs, Lorem Ipsum text, hashes, and test identities."
          />
        </div>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <PocketKnife className="size-6 text-primary" />
            <h2 className="text-xl font-semibold">About the Project</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            SwissKnife was developed to be the ideal companion for developers and IT professionals. 
            All operations are performed locally, ensuring that your data never leaves your machine. 
            Navigate through the categories in the sidebar to find the tool you need and good luck!
          </p>
        </div>
      </AppCard>
    </div>
  );
}
