import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useUpdateSettings } from "../../../hooks/useUpdateSettings";
import { useUpdatePassword } from "../../../hooks/useUpdatePassword";
import { hasUserPhoto } from "../../../UI/UserAvatar";
import ProfilePanel from "./ProfilePanel";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lightBlack focus:outline-none focus:ring-1 focus:ring-lightBlack";

const primaryButtonClass =
  "rounded-lg bg-lightBlack px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black";

const secondaryButtonClass =
  "cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-lightBlack";

const ProfileSettings = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const ASSET_URL = API_URL.replace("/api", "");
  const user = useSelector((state) => state.user.currentUser);
  const [photoPreview, setPhotoPreview] = useState(
    hasUserPhoto(user?.photo)
      ? `${ASSET_URL}/images/users/${user.photo}`
      : null,
  );
  const {
    updateSettings,
    setPhotoFile,
    name,
    setName,
    email,
    setEmail,
    settingsError,
  } = useUpdateSettings();

  const {
    updatePassword,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    passwordConfirm,
    setPasswordConfirm,
    passwordError,
  } = useUpdatePassword();

  useEffect(() => {
    setPhotoPreview(
      hasUserPhoto(user?.photo)
        ? `${ASSET_URL}/images/users/${user.photo}`
        : null,
    );
  }, [user?.photo, ASSET_URL]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFile(file);
  };

  return (
    <ProfilePanel>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateSettings();
          }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Personal info</h2>
          <div>
            <label htmlFor="name" className="text-sm">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) => setName(e.target.value.trim())}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => setEmail(e.target.value.trim())}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-x-4">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
                <FontAwesomeIcon icon={faUser} className="text-gray-500" />
              </div>
            )}
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="absolute -z-10 h-0 w-0 opacity-0"
            />
            <label htmlFor="photo" className={secondaryButtonClass}>
              Choose new photo
            </label>
          </div>
          <div>
            {settingsError?.map((err, idx) => (
              <p key={idx} className="mt-2 text-sm font-medium text-red-600">
                {err}
              </p>
            ))}
          </div>
          <button type="submit" className={primaryButtonClass}>
            Save changes
          </button>
        </form>

        <form
          className="space-y-6 lg:border-l lg:border-gray-200 lg:pl-12"
          onSubmit={(e) => {
            e.preventDefault();
            updatePassword();
          }}
        >
          <h2 className="text-2xl font-semibold">Change password</h2>
          <div>
            <label htmlFor="currentpassword" className="text-sm">
              Current password
            </label>
            <input
              id="currentpassword"
              name="currentPassword"
              type="password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="text-sm">
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="passwordConfirm" className="text-sm">
              Confirm password
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="Confirm new password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            {passwordError?.map((err, idx) => (
              <p key={idx} className="text-sm text-red-600">
                {err}
              </p>
            ))}
          </div>
          <button type="submit" className={primaryButtonClass}>
            Update password
          </button>
        </form>
      </div>
    </ProfilePanel>
  );
};

export default ProfileSettings;
