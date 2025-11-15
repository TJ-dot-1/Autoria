export const calculatePagination = (currentPage, limit, total) => {
  const page = parseInt(currentPage) || 1;
  const limitNum = parseInt(limit) || 12;
  const totalNum = parseInt(total) || 0;
  
  const totalPages = Math.ceil(totalNum / limitNum);
  const skip = (page - 1) * limitNum;
  
  return {
    page,
    limit: limitNum,
    total: totalNum,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    from: skip + 1,
    to: Math.min(skip + limitNum, totalNum)
  };
};

export const getPaginationParams = (query) => {
  const {
    page = 1,
    limit = 12,
    sort = 'createdAt',
    order = 'desc'
  } = query;
  
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
    sort: { [sort]: order === 'desc' ? -1 : 1 }
  };
};