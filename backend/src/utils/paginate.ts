export const paginate = async ({
  model,
  filter = {},
  page = 1,
  limit = 10,
  search = "",
  searchFields = [],
  sort = { createdAt: -1 },
}: any) => {

  const skip = (page - 1) * limit;

  const query = { ...filter };

  if (search && searchFields.length > 0) {
    query.$or = searchFields.map((field: string) => ({
      [field]: {
        $regex: search,
        $options: "i",
      },
    }));
  }

  const [docs, total] = await Promise.all([
    model.find(query).sort(sort).skip(skip).limit(limit),
    model.countDocuments(query),
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