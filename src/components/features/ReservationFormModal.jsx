import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { FormField, Input, Textarea } from "../ui/Input";

const todayStr = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  customerName: "",
  phone: "",
  guests: 2,
  date: todayStr(),
  time: "19:00",
  notes: "",
};

export default function ReservationFormModal({
  open,
  onClose,
  onSubmit,
  reservation,
  saving,
}) {
  /*
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  */
  const [form, setForm] = useState(() =>
    reservation
      ? {
          customerName: reservation.customerName,
          phone: reservation.phone,
          guests: reservation.guests,
          date: reservation.date,
          time: reservation.time,
          notes: reservation.notes || "",
        }
      : EMPTY,
  );
  const [errors, setErrors] = useState({});
  /*
  useEffect(() => {
    if (!open) return;
    setForm(
      reservation
        ? {
            customerName: reservation.customerName,
            phone: reservation.phone,
            guests: reservation.guests,
            date: reservation.date,
            time: reservation.time,
            notes: reservation.notes || "",
          }
        : EMPTY,
    );
    setErrors({});
  }, [open, reservation]);
*/
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    if (!form.guests || Number(form.guests) < 1) e.guests = "At least 1 guest";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      guests: Number(form.guests),
      notes: form.notes.trim(),
    };
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
      title={reservation ? "Edit reservation" : "New reservation"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="reservation-form" loading={saving}>
            {reservation ? "Save changes" : "Create reservation"}
          </Button>
        </>
      }
    >
      <form id="reservation-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            label="Customer name"
            htmlFor="customerName"
            required
            error={errors.customerName}
          >
            <Input
              id="customerName"
              value={form.customerName}
              onChange={(e) => set("customerName", e.target.value)}
              placeholder="e.g. Jane Doe"
            />
          </FormField>

          <FormField
            label="Phone"
            htmlFor="phone"
            required
            error={errors.phone}
          >
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 555 0100"
            />
          </FormField>

          <FormField
            label="Guests"
            htmlFor="guests"
            required
            error={errors.guests}
          >
            <Input
              id="guests"
              type="number"
              min="1"
              max="50"
              value={form.guests}
              onChange={(e) => set("guests", e.target.value)}
            />
          </FormField>

          <FormField label="Date" htmlFor="date" required error={errors.date}>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </FormField>

          <FormField label="Time" htmlFor="time" required error={errors.time}>
            <Input
              id="time"
              type="time"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
            />
          </FormField>
        </div>

        <FormField
          label="Notes"
          htmlFor="notes"
          hint="Allergies, occasion, seating preference…"
        >
          <Textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Any special requests?"
          />
        </FormField>
      </form>
    </Modal>
  );
}
