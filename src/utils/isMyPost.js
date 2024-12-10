import { fetchWithAuth } from "./auth/tokenUtils";

const isMyPost = async (postId, userId) => {
  try {
    const response = await fetchWithAuth(`/api/post/search/${postId}`);
    const data = await response.json();

    return data.post.isMyself;
  } catch (error) {
    console.error("게시글 정보를 가져오는 중 오류 발생 :", error);
    return false;
  }
};

export default isMyPost;
