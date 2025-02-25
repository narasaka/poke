import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function LandingSection() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 p-4">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">poke</h1>
        <h2 className="text-muted-foreground">
          open-source, app-less push notifications
        </h2>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold">installation</h3>
        <Tabs defaultValue="computer">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="computer">Computer</TabsTrigger>
            <TabsTrigger value="android">Android</TabsTrigger>
            <TabsTrigger value="iphone-ipad">iPhone / iPad</TabsTrigger>
          </TabsList>
          <TabsContent value="computer">
            <div className="bg-muted rounded p-4 font-mono text-sm">
              <ol className="list-inside list-decimal">
                <li>
                  on chrome, go to the three-dot menu &rarr;{" "}
                  <strong>Cast, save, and share</strong> &rarr;{" "}
                  <strong>Install page as app...</strong>
                </li>
                <li>follow the on-screen instructions</li>
              </ol>
            </div>
          </TabsContent>
          <TabsContent value="android">
            <div className="bg-muted rounded p-4 font-mono text-sm">
              <ol className="list-inside list-decimal">
                <li>
                  on chrome, go to the three-dot menu &rarr;{" "}
                  <strong>Add to home screen</strong> &rarr;{" "}
                  <strong>Install</strong>
                </li>
                <li>follow the on-screen instructions</li>
              </ol>
            </div>
          </TabsContent>
          <TabsContent value="iphone-ipad">
            <div className="bg-muted rounded p-4 font-mono text-sm">
              <ol className="list-inside list-decimal">
                <li>on chrome / safari, tap Share</li>
                <li>
                  tap <strong>Add to Home Screen</strong>
                </li>
                <li>
                  confirm or edit the website details and tap{" "}
                  <strong>Add</strong>
                </li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
