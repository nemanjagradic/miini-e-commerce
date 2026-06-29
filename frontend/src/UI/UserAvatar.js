import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const hasUserPhoto = (photo) => photo && photo !== "default.jpg";

const UserAvatar = ({ photo, assetUrl, className = "h-9 w-9", iconClassName }) => {
  if (hasUserPhoto(photo)) {
    return (
      <img
        className={`${className} rounded-full object-cover`}
        src={`${assetUrl}/images/users/${photo}`}
        alt="User"
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center rounded-full bg-gray-200`}
    >
      <FontAwesomeIcon
        icon={faUser}
        className={iconClassName ?? "text-gray-500 text-sm"}
      />
    </div>
  );
};

export default UserAvatar;
export { hasUserPhoto };
