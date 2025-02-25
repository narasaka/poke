import ky from "ky";
import { useEffect, useState } from "react";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { useSubscription } from "~/hooks/use-subscription";
import { Button } from "./ui/button";

export function FunctionalSection() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientId = useReadLocalStorage<string>("client-id");
  const [currentClientId, setCurrentClientId] = useLocalStorage(
    "client-id",
    clientId ?? "",
  );
  const { isSubscribed, isCheckingSubscription, subscribe, isSubscribing } =
    useSubscription(currentClientId);

  const isNotificationSupported = "Notification" in window;
  const isPushNotificationSupported =
    isNotificationSupported &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  useEffect(() => {
    if (!currentClientId) {
      setCurrentClientId(crypto.randomUUID());
    }
  }, [currentClientId, setCurrentClientId]);
  const curlExample = `curl --request POST \\
  --url ${import.meta.env.VITE_API_URL} \\
  --header 'Content-Type: application/json' \\
  --data '{
  "clientId": "${currentClientId}",
  "notificationPayload": {
    "title": "Hello",
    "body": "This is sent from the API"
  }
}'`;

  const subscribeToPushNotifications = async () => {
    if (!("Notification" in window)) {
      setError("Notifications are not supported in this browser.");
      return;
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
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

  const errorText = (() => {
    if (!isPushNotificationSupported) {
      return "Push notifications are not supported in this browser. Try opening this from the installed web app.";
    }
    if (permission === "denied") {
      return "Push notification permission denied";
    }
    return error ?? "null";
  })();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-2 p-4">
      <h3 className="text-lg font-bold">usage</h3>
      <div className="rounded bg-neutral-100 p-4 font-mono text-sm">
        <p>
          client id: <strong>{currentClientId}</strong>
        </p>
        <p>
          status:{" "}
          <strong>
            {isCheckingSubscription ?? "checking..."}
            {!isCheckingSubscription && isSubscribed
              ? "subscribed"
              : "not subscribed"}
          </strong>
        </p>
        <p>
          error?: <strong>{errorText}</strong>
        </p>
      </div>
      {isPushNotificationSupported && !isSubscribed && (
        <Button
          className="w-full sm:w-fit"
          onClick={subscribeToPushNotifications}
          disabled={isSubscribing}
        >
          {isSubscribing ? "Subscribing..." : "Subscribe to push notifications"}
        </Button>
      )}
      {isSubscribed && (
        <div className="flex flex-col gap-4">
          <Button
            className="sm:w-fit"
            onClick={() =>
              triggerPushNotificationToClient(
                currentClientId,
                "Hello",
                "This is a test notification",
              )
            }
            disabled={isSendingNotification}
          >
            {isSendingNotification ? "Sending Push..." : "Press to test"}
          </Button>
          <p>...or you can use the API like so:</p>
          <div className="rounded bg-neutral-100 p-4">
            <code className="text-xs break-all whitespace-pre-wrap">
              {curlExample}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
