import EventForm from "../EventForm";
export default function CreateEventPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-primary">Create New Event</h1>
      <EventForm />
    </div>
  );
}
