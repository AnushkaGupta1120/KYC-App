import { getPendingPackets, markAsSynced } from "./offlineManager";

export const autoSync = async () => {
  const packets = await getPendingPackets();

  for (const p of packets) {
    try {
      const res = await fetch("/api/kyc/offline-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });

      if (res.ok) {
        await markAsSynced(p.id);
        console.log("Synced packet:", p.id);
      }
    } catch (err) {
      console.log("Sync failed, retrying later");
    }
  }
};
