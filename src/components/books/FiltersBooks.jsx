import DropDown from "../custom/DropDown";

function FiltersBooks({
  selectedStatus,
  setSelectedStatus,
  selectedBookSource,
  setSelectedBookSource,
  selectedGrade,
  setSelectedGrade,
}) {
  const filters = [
    {
      id: 1,
      name: "وضعیت",
      placeholder: "همه وضعیت‌ها",
      items: [
        { id: 1, name: "فعال" },
        { id: 2, name: "غیرفعال" },
      ],
      value: selectedStatus,
      onChange: setSelectedStatus,
    },
    {
      id: 2,
      name: "منبع کتاب",
      placeholder: "همه منابع",
      items: [
        { id: 1, name: "سیستمی" },
        { id: 2, name: "کاربر" },
      ],
      value: selectedBookSource,
      onChange: setSelectedBookSource,
    },
    {
      id: 3,
      name: "پایه تحصیلی",
      placeholder: "همه پایه‌ها",
      items: [
        { id: 1, name: "اول ابتدایی" },
        { id: 2, name: "دوم ابتدایی" },
        { id: 3, name: "سوم ابتدایی" },
        { id: 4, name: "چهارم ابتدایی" },
        { id: 5, name: "پنجم ابتدایی" },
        { id: 6, name: "ششم ابتدایی" },
        { id: 7, name: "هفتم" },
        { id: 8, name: "هشتم" },
        { id: 9, name: "نهم" },
        { id: 10, name: "دهم" },
        { id: 11, name: "یازدهم" },
        { id: 12, name: "دوازدهم" },
        { id: 13, name: "دانشگاه" },
        { id: 14, name: "سایر" },
      ],
      value: selectedGrade,
      onChange: setSelectedGrade,
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ml-10">
      {filters.map((filter) => (
        <div className="" key={filter.id}>
          <DropDown
            name={filter.name}
            labelOn={true}
            placeholder={filter.placeholder}
            items={filter.items}
            value={filter.value}
            onChange={filter.onChange}
          />
        </div>
      ))}
    </div>
  );
}

export default FiltersBooks;
