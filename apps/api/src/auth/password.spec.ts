import { hashPassword, verifyPassword } from "./password";

describe("password", () => {
  describe("hashPassword", () => {
    it("returns a salt:hash string", async () => {
      const hash = await hashPassword("test-password");
      const parts = hash.split(":");

      expect(parts).toHaveLength(2);
      expect(parts[0]).toHaveLength(32); // 16 bytes hex
      expect(parts[1]).toHaveLength(128); // 64 bytes hex
    });

    it("produces different hashes for the same password", async () => {
      const hash1 = await hashPassword("same-password");
      const hash2 = await hashPassword("same-password");

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("verifyPassword", () => {
    it("returns true for the correct password", async () => {
      const hash = await hashPassword("correct-password");
      const result = await verifyPassword("correct-password", hash);

      expect(result).toBe(true);
    });

    it("returns false for the wrong password", async () => {
      const hash = await hashPassword("correct-password");
      const result = await verifyPassword("wrong-password", hash);

      expect(result).toBe(false);
    });

    it("returns false for a malformed hash", async () => {
      expect(await verifyPassword("anything", "not-a-valid-hash")).toBe(false);
      expect(await verifyPassword("anything", "")).toBe(false);
    });
  });
});
