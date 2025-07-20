import { useEffect } from "react";
import { use } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate("/" + nextUrl);
      }, 8000);
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-14 w-14 border-t-primary border-2"></div>
    </div>
  );
};

export default Loading;
