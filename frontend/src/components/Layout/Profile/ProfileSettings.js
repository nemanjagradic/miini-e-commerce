import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useUpdateSettings } from "../../../hooks/useUpdateSettings";
import { useUpdatePassword } from "../../../hooks/useUpdatePassword";

const ProfileSettings = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const ASSET_URL = API_URL.replace("/api", "");
  const user = useSelector((state) => state.user.currentUser);
  const [photoPreview, setPhotoPreview] = useState(
    `${ASSET_URL}/images/users/${user.photo}`,
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
      user?.photo
        ? `${ASSET_URL}/images/users/${user.photo}`
        : "/images/users/default.jpg",
    );
  }, [user?.photo, ASSET_URL]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFile(file);
  };

  return (
    <div className="flex-1 px-3 py-10 shadow-[0_2px_6px_rgba(0,0,0,0.1)] sm:px-10 sm:py-12">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateSettings();
        }}
        className="space-y-6 border-b-2 pb-10"
      >
        <h3 className="mb-10 text-xl font-semibold uppercase">
          Profile Settings
        </h3>
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
            className="mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm"
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
            className="mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-x-4">
          <img
            src={photoPreview}
            alt="Profile"
            onError={(e) => (e.target.src = "/images/users/default.jpg")}
            className="h-14 w-14 rounded-full object-cover"
          />
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="absolute -z-10 h-0 w-0 opacity-0"
          />
          <label
            htmlFor="photo"
            className="cursor-pointer text-sm hover:underline"
          >
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
        <button
          type="submit"
          className="bg-lightBlack px-6 py-2 text-white shadow-md"
        >
          Save changes
        </button>
      </form>
      <form
        className="space-y-6 pt-10"
        onSubmit={(e) => {
          e.preventDefault();
          updatePassword();
        }}
      >
        <h3 className="mb-10 text-lg font-semibold uppercase">
          Change password
        </h3>
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
            className="mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm"
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
            className="mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm"
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
            className="mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          {passwordError?.map((err, idx) => (
            <p key={idx} className="text-sm text-red-600">
              {err}
            </p>
          ))}
        </div>
        <button
          type="submit"
          className="bg-lightBlack px-6 py-2 text-white shadow-md"
        >
          Update password
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
