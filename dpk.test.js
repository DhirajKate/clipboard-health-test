const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

jest.mock("crypto", () => ({
  createHash: jest.fn(),
}));

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  describe("when event is defined with partition key", () => {
    it("returns the given partition key when partition key's length is smaller than max partition key length", () => {
      let event = { partitionKey: "sample" };
      const trivialKey = deterministicPartitionKey(event);
      expect(trivialKey).toBe("sample");
    });
    it("returns the given partition key when partition key's length is equal to max partition key length", () => {
      //here we can use random string generation for given length, as of now hardcoded string is used
      let event = {
        partitionKey:
          "samplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesamp" +
          "samplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesamp",
      };
      const trivialKey = deterministicPartitionKey(event);
      expect(trivialKey).toBe(event.partitionKey);
    });
  });

  describe("when event is defined with partition key greater than max partition key length", () => {
    let mockDigest;
    let mockUpdate;
    beforeEach(() => {
      mockDigest = jest.fn().mockReturnValue("sample");
      mockUpdate = jest.fn().mockImplementation(() => ({
        digest: mockDigest,
      }));
      crypto.createHash.mockImplementation(() => ({
        update: mockUpdate,
      }));
    });
    it("returns the encrypted hex when partition key's length is greater than max partition key length ", () => {
      //here we can use random string generation for given length, as of now hardcoded string is used
      let event = {
        partitionKey:
          "ssamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesamp" +
          "samplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesamp",
      };

      let encryptedHexForGivenKey = "sample";

      const trivialKey = deterministicPartitionKey(event);
      expect(crypto.createHash).toHaveBeenCalledWith("sha3-512");
      expect(mockUpdate).toHaveBeenCalledWith(event.partitionKey);
      expect(mockDigest).toHaveBeenCalledWith("hex");
      expect(trivialKey).toBe(encryptedHexForGivenKey);
    });
  });

  describe("when event is defined with partition key as a object", () => {
    let mockDigest;
    let mockUpdate;
    beforeEach(() => {
      mockDigest = jest.fn().mockReturnValue("sample");
      mockUpdate = jest.fn().mockImplementation(() => ({
        digest: mockDigest,
      }));
      crypto.createHash.mockImplementation(() => ({
        update: mockUpdate,
      }));
    });
    it("returns the encrypted hex when partition key's length is greater than max partition key length ", () => {
      //here we can use random string generation for given length, as of now hardcoded string is used
      let event = {
        partitionKey: {
          data:
            "ssamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesamp" +
            "samplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesamp",
        },
      };

      let encryptedHexForGivenKey = "sample";

      const trivialKey = deterministicPartitionKey(event);
      expect(crypto.createHash).toHaveBeenCalledWith("sha3-512");
      expect(mockUpdate).toHaveBeenCalledWith(JSON.stringify(event.partitionKey));
      expect(mockDigest).toHaveBeenCalledWith("hex");
      expect(trivialKey).toBe(encryptedHexForGivenKey);
    });
  });

  describe("when event is defined without partition key", () => {
    let mockDigest;
    let mockUpdate;
    beforeEach(() => {
      mockDigest = jest.fn().mockReturnValue("sample");
      mockUpdate = jest.fn().mockImplementation(() => ({
        digest: mockDigest,
      }));
      crypto.createHash.mockImplementation(() => ({
        update: mockUpdate,
      }));
    });
    it("returns the excrypted hex of stringified event object when generated hex is smaller than max partition key length", () => {
      let event = {
        data:
          "samplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesamp" +
          "samplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesamp",
      };
      let encryptedHexForGivenKey = "sample";

      const trivialKey = deterministicPartitionKey(event);

      expect(crypto.createHash).toHaveBeenCalledWith("sha3-512");
      expect(mockUpdate).toHaveBeenCalledWith(JSON.stringify(event));
      expect(mockDigest).toHaveBeenCalledWith("hex");
      expect(trivialKey).toBe(encryptedHexForGivenKey);
    });
  });

  describe("when event is defined without partition key", () => {
    let event = {
      data:
        "ssamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesamp" +
        "samplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesampsamplesamplesamp",
    };
    let mockDigest;
    let mockUpdate;
    beforeEach(() => {
      mockDigest = jest.fn().mockReturnValue(event.data);
      mockUpdate = jest.fn().mockImplementation(() => ({
        digest: mockDigest,
      }));
      crypto.createHash.mockImplementation(() => ({
        update: mockUpdate,
      }));
    });

    it("returns the excrypted hex of encrypted hex of stringified event object when generated hex of event object is greater than max partition key length", () => {
      const trivialKey = deterministicPartitionKey(event);
      expect(crypto.createHash).toHaveBeenCalledWith("sha3-512");
      expect(mockUpdate).toHaveBeenCalledWith(JSON.stringify(event));
      expect(mockDigest).toHaveBeenCalledWith("hex");

      expect(mockUpdate).toHaveBeenCalledWith(event.data);
      expect(trivialKey).toBe(event.data);
    });
  });
});
