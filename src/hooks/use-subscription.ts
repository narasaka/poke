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
          "http://localhost:8000/check-subscription",
          { searchParams: { clientId } },
        )
        .json();
      return isSubscribed;
    },
  });

  const mutation = useMutation({
    mutationFn: async (subscription: PushSubscription) => {
      await ky.post("http://localhost:8000/subscribe", {
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
