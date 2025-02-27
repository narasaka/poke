import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

interface CheckSubscriptionResponse {
  isSubscribed: boolean;
}
export const useSubscription = (clientId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["subscription"],
    enabled: !!clientId,
    queryFn: async () => {
      const { isSubscribed } = await ky
        .get<CheckSubscriptionResponse>(
          `${import.meta.env.VITE_API_URL}/check-subscription`,
          { searchParams: { clientId } },
        )
        .json();
      return isSubscribed;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { vapidPublicKey } = await ky
        .get<{
          vapidPublicKey: string;
        }>(`${import.meta.env.VITE_API_URL}/vapid-public-key`)
        .json();

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error("Service worker not registered.");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey, // Use fetched VAPID key
      });

      await ky.post(`${import.meta.env.VITE_API_URL}/subscribe`, {
        json: { clientId, subscription },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });

  return {
    isSubscribed: query.data,
    isCheckingSubscription: query.isLoading,
    subscribe: mutation.mutateAsync,
    isSubscribing: mutation.isPending,
  };
};
