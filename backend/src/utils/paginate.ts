
export const paginate = async ({
  model,
  filter = {},
  page = 1,
  limit = 10,
  sort = { createdAt: -1 },
}: any) => {

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    model
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    model.countDocuments(filter),
  ]);

  return {
    docs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};