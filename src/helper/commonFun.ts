export function paginateResponse(data,limit) {
    const [result, total]=data;
    const totalPage=Math.ceil(total/limit);
    return {
      data: result,
      count: total,
      totalPage: totalPage,
      limit:limit
    }
  }