const mockFS = {
  DocumentDirectoryPath: '/mock/documents',
  exists: jest.fn().mockResolvedValue(true),
  existsAssets: jest.fn().mockResolvedValue(false),
  mkdir: jest.fn().mockResolvedValue(undefined),
  copyFileAssets: jest.fn().mockResolvedValue(undefined),
  downloadFile: jest.fn().mockReturnValue({
    promise: Promise.resolve({ statusCode: 200 }),
  }),
};

export default mockFS;
