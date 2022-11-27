export const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const searchOnYoutube = (shoesName) => {
  const pattern = /\s/g;

  if (shoesName.match(pattern)) {
    const keyword = shoesName.replace(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/).replace(/\s/g, '+');
    return `https://www.youtube.com/results?search_query=${keyword}`;
  } else {
    return `https://www.youtube.com/results?search_query=${shoesName}`;
  }
};
