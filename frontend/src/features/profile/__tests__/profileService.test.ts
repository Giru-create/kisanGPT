import { describe, it, expect, vi, beforeEach } from "vitest";
import { profileService } from "../services/profileService";
import { profileMockService } from "../services/profileMock";
import { useProfileStore } from "../store/profileStore";

describe("profileMockService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    profileMockService._reset();
  });

  it("fetches farmer profile via mock service", async () => {
    const data = await profileMockService.getProfile();
    expect(data).toBeDefined();
    expect(data.profile).toBeDefined();
    expect(data.profile.name).toBe("Rajesh Kumar");
    expect(data.farm).toBeDefined();
    expect(data.farm.farmName).toBe("Kumar Family Farm");
  });

  it("returns farm overview data", async () => {
    const data = await profileMockService.getProfile();
    expect(data.farm.totalLandArea).toBe(12);
    expect(data.farm.numberOfFields).toBe(3);
    expect(data.fields.length).toBe(3);
  });

  it("returns achievements", async () => {
    const data = await profileMockService.getProfile();
    expect(data.achievements.length).toBeGreaterThan(0);
    const unlocked = data.achievements.filter((a) => a.isUnlocked);
    expect(unlocked.length).toBeGreaterThan(0);
  });

  it("returns recent activity", async () => {
    const data = await profileMockService.getProfile();
    expect(data.recentActivity.length).toBeGreaterThan(0);
    expect(data.recentActivity[0]!.title).toBeDefined();
  });

  it("returns documents", async () => {
    const data = await profileMockService.getProfile();
    expect(data.documents.length).toBeGreaterThan(0);
    expect(data.documents[0]!.name).toBeDefined();
  });

  it("updates profile via mock", async () => {
    const updated = await profileMockService.updateProfile({
      name: "Test Name",
    });
    expect(updated.name).toBe("Test Name");
  });

  it("updates farm via mock", async () => {
    const updated = await profileMockService.updateFarm({
      farmName: "Test Farm",
    });
    expect(updated.farmName).toBe("Test Farm");
  });

  it("updates privacy settings via mock", async () => {
    const updated = await profileMockService.updatePrivacySettings({
      dataSharing: false,
      aiMemory: true,
      locationTracking: false,
      analytics: false,
      marketing: false,
    });
    expect(updated.dataSharing).toBe(false);
    expect(updated.aiMemory).toBe(true);
  });

  it("deletes account via mock", async () => {
    const result = await profileMockService.deleteAccount();
    expect(result.detail).toContain("deleted");
  });

  it("resets data after delete", async () => {
    await profileMockService.deleteAccount();
    const data = await profileMockService.getProfile();
    expect(data.profile.name).toBe("Rajesh Kumar");
  });
});

describe("profileService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    profileMockService._reset();
  });

  it("returns mock data by default (mock mode)", async () => {
    const data = await profileService.getProfile();
    expect(data).toBeDefined();
    expect(data.profile.name).toBeDefined();
  });

  it("updates profile via mock by default", async () => {
    const updated = await profileService.updateProfile({ name: "Test" });
    expect(updated.name).toBe("Test");
  });

  it("falls back to mock on API error", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ detail: "Server error" }),
      }),
    );

    const data = await profileService.getProfile();
    expect(data).toBeDefined();
    expect(data.profile.name).toBe("Rajesh Kumar");
  });
});

describe("profileStore", () => {
  beforeEach(() => {
    useProfileStore.getState().reset();
  });

  it("has correct initial state", () => {
    const state = useProfileStore.getState();
    expect(state.activeTab).toBe("overview");
    expect(state.isEditing).toBe(false);
    expect(state.isDeleteModalOpen).toBe(false);
  });

  it("setActiveTab updates tab", () => {
    useProfileStore.getState().setActiveTab("farm");
    expect(useProfileStore.getState().activeTab).toBe("farm");
  });

  it("setIsEditing toggles editing", () => {
    useProfileStore.getState().setIsEditing(true);
    expect(useProfileStore.getState().isEditing).toBe(true);
  });

  it("setDeleteModalOpen toggles modal", () => {
    useProfileStore.getState().setDeleteModalOpen(true);
    expect(useProfileStore.getState().isDeleteModalOpen).toBe(true);
  });

  it("reset clears all state", () => {
    useProfileStore.getState().setActiveTab("privacy");
    useProfileStore.getState().setIsEditing(true);
    useProfileStore.getState().setDeleteModalOpen(true);
    useProfileStore.getState().reset();
    const state = useProfileStore.getState();
    expect(state.activeTab).toBe("overview");
    expect(state.isEditing).toBe(false);
    expect(state.isDeleteModalOpen).toBe(false);
  });
});
