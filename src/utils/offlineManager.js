// src/utils/offlineManager.js
import localforage from "localforage";

localforage.config({
  name: "kyc-offline-db",
  storeName: "kycPackets",
});

export const saveOfflinePacket = async (packet) => {
  const id = Date.now().toString();
  await localforage.setItem(id, { ...packet, id, synced: false });
  return id;
};

export const getPendingPackets = async () => {
  const packets = [];
  await localforage.iterate((value) => {
    if (!value.synced) packets.push(value);
  });
  return packets;
};

export const markAsSynced = async (id) => {
  const packet = await localforage.getItem(id);
  if (packet) {
    packet.synced = true;
    await localforage.setItem(id, packet);
  }
};
