import ProgressBar from "../ProgressBar";

export default function ProgressBarExample() {
  return (
    <div className="p-8 max-w-md space-y-6">
      <ProgressBar current={2} total={3} />
      <ProgressBar current={3} total={3} />
      <ProgressBar current={0} total={3} />
    </div>
  );
}
