import PageHeader from "../PageHeader";

export default function PageHeaderExample() {
  return (
    <div className="space-y-4">
      <PageHeader title="Tonight's Sleep Ritual" childFriendly />
      <PageHeader title="Good Evening, Family" subtitle="Welcome home" />
    </div>
  );
}
