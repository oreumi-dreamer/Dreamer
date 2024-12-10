import { useSelector } from "react-redux";
import WritePost from "../write/WritePost";
import PostModal from "./PostModal";

const ModalController = () => {
  const isActive = useSelector((state) => state.activeState.isActive);

  switch (isActive) {
    case "글쓰기":
      return <WritePost />;
    case "게시물":
      return <PostModal />;
    default:
      return null;
  }
};

export default ModalController;
