import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { FormField, Input, Select, Textarea } from "../ui/Input";

const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks"];

const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: "Mains",
  prepTime: 10,
  image: "🍽️",
  available: true,
};

export default function MenuFormModal({
  open,
  onClose,
  onSubmit,
  item,
  saving,
}) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Reset form whenever modal opens or target item changes
  useEffect(() => {
    if (!open) return;
    setForm(item ? { ...item, price: String(item.price) } : EMPTY);
    setErrors({});
  }, [open, item]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (form.prepTime && Number(form.prepTime) < 0)
      e.prepTime = "Cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      prepTime: Number(form.prepTime) || 0,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch {
      /* parent toast already shown */
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={item ? "Edit menu item" : "Add menu item"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="menu-form" loading={saving}>
            {item ? "Save changes" : "Add item"}
          </Button>
        </>
      }
    >
      <form id="menu-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField label="Name" htmlFor="name" required error={errors.name}>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Margherita Pizza"
            />
          </FormField>

          <FormField label="Category" htmlFor="category" required>
            <Select
              id="category"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Price"
            htmlFor="price"
            required
            error={errors.price}
          >
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0.00"
            />
          </FormField>

          <FormField
            label="Prep time (minutes)"
            htmlFor="prepTime"
            error={errors.prepTime}
          >
            <Input
              id="prepTime"
              type="number"
              min="0"
              value={form.prepTime}
              onChange={(e) => set("prepTime", e.target.value)}
            />
          </FormField>

          <FormField
            label="Emoji (visual)"
            htmlFor="image"
            hint="Use a food emoji — no upload needed"
          >
            <Input
              id="image"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              maxLength={4}
            />
          </FormField>

          <FormField label="Availability" htmlFor="available">
            <Select
              id="available"
              value={form.available ? "yes" : "no"}
              onChange={(e) => set("available", e.target.value === "yes")}
            >
              <option value="yes">Available</option>
              <option value="no">Out of stock</option>
            </Select>
          </FormField>
        </div>

        <FormField label="Description" htmlFor="description">
          <Textarea
            id="description"
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Short description shown on the card"
          />
        </FormField>
      </form>
    </Modal>
  );
}
