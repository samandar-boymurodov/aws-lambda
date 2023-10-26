export default {
  type: "object",
  properties: {
    title: { type: 'string' },
    price: { type: 'string' },
    description: { type: 'string' },
    imgSrc: { type: 'string' },
  },
  required: ['title', 'price', 'description', 'imgSrc'],
} as const;
