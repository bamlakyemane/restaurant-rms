import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { FormField, Input, Select } from "../ui/Input";

const EMPTY = {
  name: "",
  email: "",
  pin: "",
  role: "waiter",
  avatar: "🧑‍🍳",
};

const AVATAR_SUGGESTIONS = ["🧑‍🍳", "👩‍🍳", "👨‍🍳", "👩‍💼", "👨‍💼", "🧑‍💼", "👤"];

export default function StaffFormModal({
  open,
  onClose,
  onSubmit,
  user,
  saving,
  isSelf,
}) {
  const [form, setForm] = useState(() =>
    user
      ? {
          name: user.name,
          email: user.email,
          pin: "", // don't prefill PIN for security
          role: user.role,
          avatar: user.avatar || "👤",
        }
      : EMPTY,
  );
  const [errors, setErrors] = useState({});

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email";
    // PIN required on create; on edit, empty = leave unchanged
    if (!user && !form.pin.trim()) e.pin = "PIN is required";
    if (!user && form.pin.trim().length < 4)
      e.pin = "PIN must be 4+ characters";
    if (!form.role) e.role = "Role is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    // Only include pin if it's non-empty (editing: leave unchanged if blank)
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      avatar: form.avatar,
    };
    if (form.pin.trim()) payload.pin = form.pin.trim();

    try {
      await onSubmit(payload);
      onClose();
    } catch {
      /* toast already shown */
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={user ? "Edit staff member" : "Add staff member"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="staff-form" loading={saving}>
            {user ? "Save changes" : "Add staff"}
          </Button>
        </>
      }
    >
      <form id="staff-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            label="Full name"
            htmlFor="name"
            required
            error={errors.name}
          >
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Jane Smith"
            />
          </FormField>

          <FormField
            label="Email"
            htmlFor="email"
            required
            error={errors.email}
          >
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="jane@rms.dev"
            />
          </FormField>

          <FormField
            label={user ? "New PIN (leave blank to keep current)" : "PIN"}
            htmlFor="pin"
            required={!user}
            error={errors.pin}
            hint={
              user
                ? "Only fill this if you want to change it"
                : "At least 4 characters"
            }
          >
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={10}
              value={form.pin}
              onChange={(e) => set("pin", e.target.value)}
              placeholder="••••"
            />
          </FormField>

          <FormField
            label="Role"
            htmlFor="role"
            required
            error={errors.role}
            hint={isSelf ? "You can't change your own role" : undefined}
          >
            <Select
              id="role"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              disabled={isSelf}
            >
              <option value="waiter">Waiter</option>
              <option value="chef">Chef</option>
              <option value="admin">Admin</option>
            </Select>
          </FormField>
        </div>

        <FormField label="Avatar" htmlFor="avatar" hint="Pick an emoji">
          <div className="flex flex-wrap gap-2">
            {AVATAR_SUGGESTIONS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => set("avatar", a)}
                className={`
                  w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition
                  ${
                    form.avatar === a
                      ? "bg-brand-100 ring-2 ring-brand-500"
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                `}
              >
                {a}
              </button>
            ))}
          </div>
        </FormField>
      </form>
    </Modal>
  );
}
