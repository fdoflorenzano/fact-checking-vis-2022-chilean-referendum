import v1 from "../../assets/v1.svg";
import v2 from "../../assets/v2.svg";
import v3 from "../../assets/v3.svg";
import v4 from "../../assets/v4.svg";
import v5 from "../../assets/v5.svg";

type AvatarProps = {
  className?: string;
  verification: string;
};

const getAvatar = (v: string) => {
  return {
    false: v5,
    creative: v4,
    misleading: v3,
    inaccurate: v2,
    true: v1,
  }[v];
};

function Avatar({ className, verification }: AvatarProps) {
  return <img className={className} src={getAvatar(verification)} />;
}

export default Avatar;
