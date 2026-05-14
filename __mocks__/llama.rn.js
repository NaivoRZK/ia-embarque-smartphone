export const initLlama = jest.fn().mockResolvedValue({
  completion: jest.fn().mockImplementation(async (_params, cb) => {
    cb({ token: 'Mock response' });
  }),
});

export const LlamaContext = {};
