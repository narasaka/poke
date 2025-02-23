import ky from "ky";
import { useState, useEffect } from "react";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { useSubscription } from "./hooks/use-subscription";
import { Button } from "~/components/button";

function App() {
  const [isPushNotificationSupported, setIsPushNotificationSupported] =
    useState(false);
  const [permission, setPermission] = useState(Notification.permission);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientId = useReadLocalStorage<string>("client-id");
  const [currentClientId, setCurrentClientId] = useLocalStorage(
    "client-id",
    clientId ?? "",
  );
  const { isSubscribed, isCheckingSubscription, subscribe, isSubscribing } =
    useSubscription(currentClientId);

  useEffect(() => {
    setIsPushNotificationSupported(
      "serviceWorker" in navigator && "PushManager" in window,
    );
  }, []);

  useEffect(() => {
    Notification.requestPermission().then((perm) => {
      setPermission(perm);
    });
  }, []);

  useEffect(() => {
    if (!currentClientId) {
      setCurrentClientId(crypto.randomUUID());
    }
  }, [currentClientId, setCurrentClientId]);

  const subscribeToPushNotifications = async () => {
    try {
      if (permission !== "granted") {
        throw new Error("Push notification permission not granted.");
      }
      await subscribe();
    } catch (err) {
      console.error("Failed to subscribe for push notifications", err);
      setError("Failed to subscribe.");
    }
  };

  const triggerPushNotificationToClient = async (
    clientId: string,
    title: string,
    body: string,
  ) => {
    setError(null);
    try {
      setIsSendingNotification(true);
      await serverSendPushNotificationToClient(clientId, {
        title: title,
        body: body,
        icon: "pwa-512x512.png",
        data: { customData: "example" },
      });
      console.log(
        `Push notification triggered to client ${clientId} (via server call)`,
      );
    } catch (err: Error | unknown) {
      console.error(`Failed to trigger push to client ${clientId}`, err);
      setError(
        err instanceof Error
          ? err.message
          : `Failed to trigger push to client ${clientId}.`,
      );
    } finally {
      setIsSendingNotification(false);
    }
  };

  const serverSendPushNotificationToClient = async (
    clientId: string,
    notificationPayload: {
      title: string;
      body: string;
      icon?: string;
      data?: Record<string, unknown>;
    },
  ) => {
    try {
      const data = await ky
        .post(`${import.meta.env.VITE_API_URL}/send-notification`, {
          json: { clientId, notificationPayload },
        })
        .json();
      console.log("Server send push response:", data);
      return data;
    } catch (error) {
      console.error("Error during server send push call:", error);
      throw error;
    }
  };

  return (
    <div className="flex h-svh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-5xl font-medium">poke</h1>
      <div className="rounded bg-neutral-100 p-4">
        <p>
          Client ID: <strong>{currentClientId}</strong>
        </p>
        <p>
          Status:{" "}
          <strong>
            {isCheckingSubscription ?? "checking..."}
            {!isCheckingSubscription && isSubscribed
              ? "subscribed"
              : "not subscribed"}
          </strong>
        </p>
      </div>

      {!isPushNotificationSupported && (
        <p className="text-destructive text-center">
          Push notifications are not supported in this browser.
        </p>
      )}

      {isPushNotificationSupported &&
        permission !== "granted" &&
        permission !== "denied" && (
          <Button
            onClick={() => Notification.requestPermission().then(setPermission)}
          >
            Request Notification Permission
          </Button>
        )}

      {isPushNotificationSupported &&
        permission === "granted" &&
        !isSubscribed && (
          <Button
            onClick={subscribeToPushNotifications}
            disabled={isSubscribing}
          >
            {isSubscribing
              ? "Subscribing..."
              : "Subscribe to Push Notifications"}
          </Button>
        )}

      {error && (
        <p className="text-destructive text-center text-sm">Error: {error}</p>
      )}

      {isSubscribed && (
        <Button
          onClick={() =>
            triggerPushNotificationToClient(
              currentClientId,
              "Hello!",
              "This is a test notification",
            )
          }
          disabled={isSendingNotification}
        >
          {isSendingNotification ? "Sending Push..." : "Test Push Notification"}
        </Button>
      )}

      {permission === "denied" && (
        <p className="text-destructive">
          Push notifications permission denied.
        </p>
      )}
    </div>
  );
}

export default App;
