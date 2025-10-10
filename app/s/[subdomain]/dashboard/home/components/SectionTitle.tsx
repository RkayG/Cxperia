
// A reusable title component for sections of the page
const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
  );
};
export default SectionTitle;