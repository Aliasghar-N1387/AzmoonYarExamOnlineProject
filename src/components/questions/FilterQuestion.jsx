import DropDown from "../custom/DropDown";

const filters = [
  {
    key: "difficultyLevel",
    placeholder: "همه سطح‌ها",
    label: "سطح",
    items: [
      { id: 1, name: "آسان" },
      { id: 2, name: "متوسط" },
      { id: 3, name: "سخت" },
    ],
  },
  {
    key: "questionStatus",
    placeholder: "همه وضعیت‌ها",
    label: "وضعیت",
    items: [
      { id: 1, name: "تکمیل" },
      { id: 2, name: "در حال تکمیل" },
    ],
  },
  {
    key: "questionType",
    placeholder: "همه نوع‌ها",
    label: "نوع سؤال",
    items: [
      { id: 1, name: "تشریحی" },
      { id: 2, name: "جای خالی" },
      { id: 3, name: "وصل کردنی" },
      { id: 4, name: "تستی" },
      { id: 5, name: "کوتاه پاسخ" },
      { id: 6, name: "صحیح / غلط" },
    ],
  },
];

function FilterQuestion({ value, onChange }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filters.map((filter) => (
        <div key={filter.key} className="min-w-0">
          <DropDown
            name={filter.label}
            labelOn={true}
            placeholder={filter.placeholder}
            items={filter.items}
            value={value?.[filter.key] ?? null}
            onChange={(selected) => onChange(filter.key, selected)}
          />
        </div>
      ))}
    </div>
  );
}

export default FilterQuestion;
