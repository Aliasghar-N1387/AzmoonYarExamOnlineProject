import {
  BookOpen,
  Funnel,
  Plus,
  X,
  GraduationCap,
  Layers,
  Users,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import logo from "../../assets/img/LogoApp.png";
import BtnContents from "../../components/custom/BtnContents";
import FiltersBooks from "../../components/books/FiltersBooks";
import SearchBooks from "../../components/books/SearchBooks";
import Book from "../../components/books/Book";
import picBook from "../../assets/img/book.jpg";
import { useEffect, useState } from "react";
import Modal from "../../components/custom/Modal";
import DropDown from "../../components/custom/DropDown";
import bookCrud from "../../api/bookCrud";
import { useToast } from "../../components/custom/Toast";

function BookContent() {
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [bookName, setBookName] = useState("");

  const [selectedGrade, setSelectedGrade] = useState(null);

  const [selectedField, setSelectedField] = useState(null);

  const [selectedLevel, setSelectedLevel] = useState(null);

  const [selectedYear, setSelectedYear] = useState(null);

  const [selectedLessons, setSelectedLessons] = useState([]);

  const [description, setDescription] = useState("");

  // const [bookImage, setBookImage] = useState(null);

  // const [previewImage, setPreviewImage] = useState(null);

  const [status, setStatus] = useState("active");

  const [lessonCount, setLessonCount] = useState(0);

  const [lessonNames, setLessonNames] = useState([]);
  ///

  const btnHeader = [
    {
      id: 1,
      name: "اضافه کردن کتاب",
      icon: <Plus size={16} />,
      styleButton:
        "bg-violet-900 text-white hover:bg-violet-800 hover:shadow-violet-500/30 active:bg-violet-950",
      onClick: () => setIsModalOpen(true),
    },
    {
      id: 2,
      name: "دسته بندی کردن کتاب",
      icon: <Funnel size={16} />,
      styleButton:
        "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md active:bg-gray-100",
    },
  ];

  const gradeItems = [
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
  ];

  const fieldItems = [
    { id: 1, name: "همه رشته‌ها" },
    { id: 2, name: "ریاضی فیزیک" },
    { id: 3, name: "علوم تجربی" },
    { id: 4, name: "علوم انسانی" },
  ];

  const levelItems = [
    { id: 1, name: "متوسطه اول" },
    { id: 2, name: "متوسطه دوم" },
  ];

  const yearItems = [
    { id: 1, name: "1403-1404" },
    { id: 2, name: "1404-1405" },
    { id: 3, name: "1405-1406" },
  ];

  const lessonItems = [
    { id: 1, name: "ریاضی" },
    { id: 2, name: "هندسه" },
    { id: 3, name: "آمار" },
    { id: 4, name: "فیزیک" },
    { id: 5, name: "شیمی" },
  ];

  const gradeBooks = {
    1: "اول ابتدایی",
    2: "دوم ابتدایی",
    3: "سوم ابتدایی",
    4: "چهارم ابتدایی",
    5: "پنجم ابتدایی",
    6: "ششم ابتدایی",
    7: "هفتم",
    8: "هشتم",
    9: "نهم",
    10: "دهم",
    11: "یازدهم",
    12: "دوازدهم",
  };

  const handleLessonCountChange = (e) => {
    const count = Math.max(0, Number(e.target.value) || 0);

    setLessonCount(count);

    setLessonNames((prev) => {
      const updated = Array.from({ length: count }, (_, index) => {
        return prev[index] || "";
      });

      return updated;
    });
  };

  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const getBooks = async (page = 1) => {
    try {
      const response = await bookCrud.getBooks(page, pageSize);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();

      const paginationData = result.data;

      setBooks(paginationData?.items || []);
      setCurrentPage(paginationData?.pageNumber || page);
      setTotalPages(paginationData?.totalPages || 1);
      setTotalCount(paginationData?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching books:", error);

      setBooks([]);
      setTotalPages(1);
      setTotalCount(0);

      toast.error("اتصال به سرور برقرار نشد", {
        title: "خطا در دریافت کتاب‌ها",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    getBooks(1);
  }, []);

  const handleCreateBook = async () => {
    try {
      if (!bookName.trim()) {
        toast.warning("لطفاً نام کتاب را وارد کنید", {
          title: "اطلاعات ناقص",
        });
        return;
      }

      if (!selectedGrade) {
        toast.warning("لطفاً پایه را انتخاب کنید", {
          title: "اطلاعات ناقص",
        });
        return;
      }

      const data = {
        bookName: bookName.trim(),
        grade: Number(selectedGrade.id),
        lessonRequests: lessonNames
          .slice(0, lessonCount)
          .filter((title) => title.trim() !== "")
          .map((title) => ({
            title: title.trim(),
          })),
      };

      console.log("Create Book Payload:", data);

      const response = await bookCrud.createBook(data);

      if (!response.ok) {
        const errorResult = await response.json().catch(() => null);

        throw new Error(
          errorResult?.error?.message ||
            errorResult?.error?.detail ||
            `HTTP Error: ${response.status}`,
        );
      }

      // Post is Ok
      toast.success("کتاب با موفقیت ذخیره شد", {
        title: "عملیات موفق",
      });

      setIsModalOpen(false);

      setBookName("");
      setSelectedGrade(null);
      setSelectedLevel(null);
      setSelectedField(null);
      setSelectedYear(null);
      setSelectedLessons([]);
      setLessonCount(0);
      setLessonNames([]);
      setDescription("");

      await getBooks(1);
    } catch (error) {
      console.error("Error creating book:", error);

      toast.error(error.message || "ذخیره کتاب با خطا مواجه شد", {
        title: "خطا در ذخیره کتاب",
        duration: 5000,
      });
    }
  };

  return (
    <div className="p-6 h-full bg-violet-50/50 dark:bg-slate-950">
      {/* Header  */}
      <div className="flex pl-10 justify-between text-right">
        <div className="flex justify-center items-center gap-4">
          {btnHeader.map((btn) => {
            return (
              <div key={btn.id}>
                <BtnContents
                  name={btn.name}
                  icon={btn.icon}
                  styleButton={btn.styleButton}
                  onClick={btn.onClick}
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-bold text-white">کتاب ها</p>
            <p className="text-md dark:text-white">
              . کتاب های درسی خود را مدیريت كنيد وبرای هر كتاب، درس ها وسوالات
              را تعريف نمابيد
            </p>
          </div>
          <div className="flex justify-center items-center">
            <BookOpen className="size-10 text-violet-700 dark:text-shadow-sm dark:text-shadow-violet-500" />
          </div>
          <div className=""></div>
        </div>
      </div>

      {/* Filter & Search Books  */}
      <div className="my-10 flex justify-center items-end gap-14">
        <FiltersBooks />
        <SearchBooks />
      </div>
      {/* Book Card  */}
      <div className="latest-scroll px-10 cursor-s-resize mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-h-120 overflow-auto">
        {books.map((book) => {
          return (
            <div key={book.id}>
              <Book
                title={book.bookName}
                grade={`پایه ${gradeBooks[book.grade] || book.grade}`}
                field={book.bookSource === 1 ? "کتاب درسی" : "سایر منابع"}
                level=""
                image={book.picture}
                lessons={book.lessons?.length || 0}
                questions={0}
                onOpenModal={() => setIsModalOpen(true)}
              />
            </div>
          );
        })}
      </div>
      {/* Book Page Next -  Previous */}
      <div className="flex items-center justify-between px-10 mt-8">
        <p className="text-sm text-gray-500 dark:text-white">
          تعداد کل کتاب‌ها : 
          <span className="font-bold text-violet-700 "> {totalCount} </span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => getBooks(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-lg border bg-white dark:bg-violet-950 dark:text-white px-3 py-1 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            قبلی
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <button
                type="button"
                key={page}
                onClick={() => getBooks(page)}
                className={`h-8 w-8 rounded-lg text-sm ${
                  currentPage === page
                    ? "bg-violet-700 text-white dark:bg-violet-950 dark:border dark:border-white"
                    : "border bg-white text-gray-600"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => getBooks(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-lg border bg-white dark:bg-violet-950 dark:text-white px-3 py-1 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            بعدی
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          header={
            <div>
              <div className="flex items-center gap-3">
                <BookOpen className="text-violet-600" size={25} />

                <h2 className="text-xl font-bold text-gray-800">
                  افزودن کتاب جدید
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-400">
                اطلاعات کتاب را وارد کنید و آن را به ساختار آموزشی خود اضافه
                نمایید.
              </p>
            </div>
          }
          content={
            <div className="grid grid-cols-12 gap-0">
              {/* LEFT - IMAGE  */}
              <div className="col-span-12 border-b border-gray-100 p-7 lg:col-span-4 lg:border-b-0 lg:border-l">
                <div className="text-right">
                  <h3 className="font-bold text-gray-800">تصویر جلد کتاب</h3>

                  <p className="mt-2 text-xs leading-6 text-gray-400">
                    تصویر جلد کتاب را بارگذاری کنید.
                  </p>
                </div>

                {/* Upload */}
                <div className="flex justify-center mt-30 text-right mr-5">
                  <div className="mt-4">
                    <h1 className="font-[Vazir] text-violet-900 text-xl font-extrabold">
                      آزمون یار
                    </h1>

                    <p className="font-[Vazir] text-violet-700 text-sm font-bold">
                      AzmoonYar
                    </p>
                  </div>
                  <div
                    className="w-20 h-18 bg-violet-900"
                    style={{
                      WebkitMaskImage: `url(${logo})`,
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      WebkitMaskSize: "contain",
                      maskImage: `url(${logo})`,
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      maskSize: "contain",
                    }}
                  ></div>
                </div>
              </div>

              {/* RIGHT - FORM */}
              <div className="col-span-12 p-7 lg:col-span-8">
                <div className="space-y-5">
                  {/* Book Name */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      نام کتاب
                    </label>

                    <div className="relative">
                      <BookOpen
                        size={19}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        placeholder="مثلاً: فیزیک ۳"
                        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 pl-10 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                      />
                    </div>
                  </div>

                  {/* Grade + Level */}
                  <div className="grid grid-cols-2 gap-5">
                    <DropDown
                      name="مقطع تحصیلی"
                      labelOn
                      items={levelItems}
                      value={selectedLevel}
                      onChange={setSelectedLevel}
                      placeholder="انتخاب کنید"
                      BackIcon={GraduationCap}
                    />

                    <DropDown
                      name="پایه"
                      labelOn
                      items={gradeItems}
                      value={selectedGrade}
                      onChange={setSelectedGrade}
                      placeholder="انتخاب کنید"
                      BackIcon={Layers}
                    />
                  </div>

                  {/* Field + Year */}
                  <div className="grid grid-cols-2 gap-5">
                    <DropDown
                      name="رشته / گرایش"
                      labelOn
                      items={fieldItems}
                      value={selectedField}
                      onChange={setSelectedField}
                      placeholder="انتخاب کنید"
                      BackIcon={Users}
                    />

                    <DropDown
                      name="سال تحصیلی"
                      labelOn
                      items={yearItems}
                      value={selectedYear}
                      onChange={setSelectedYear}
                      placeholder="1403-1404"
                      BackIcon={CalendarDays}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      وضعیت
                    </label>

                    <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setStatus("active")}
                        className={`h-11 text-sm font-bold transition ${
                          status === "active"
                            ? "bg-violet-50 text-violet-700"
                            : "bg-white text-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        فعال
                      </button>

                      <button
                        type="button"
                        onClick={() => setStatus("inactive")}
                        className={`h-11 border-x text-sm font-bold transition ${
                          status === "inactive"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-white text-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        غیرفعال
                      </button>

                      <button
                        type="button"
                        onClick={() => setStatus("archive")}
                        className={`h-11 text-sm font-bold transition ${
                          status === "archive"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-white text-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        آرشیو
                      </button>
                    </div>
                  </div>

                  {/* Related Lessons */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      دروس مرتبط
                    </label>

                    <DropDown
                      items={lessonItems}
                      value={null}
                      onChange={(item) => {
                        if (!item) return;

                        setSelectedLessons((prev) => {
                          const exists = prev.some(
                            (lesson) => lesson.id === item.id,
                          );

                          if (exists) {
                            return prev.filter(
                              (lesson) => lesson.id !== item.id,
                            );
                          }

                          return [...prev, item];
                        });
                      }}
                      placeholder="انتخاب درس"
                      BackIcon={ChevronDown}
                    />

                    {/* Lesson Count & Names */}
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-gray-700">
                            تعداد درس‌ها
                          </label>

                          <span className="text-xs text-gray-400">
                            نام درس‌ها اختیاری است
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          تعداد درس‌هایی که برای این کتاب در نظر گرفته‌اید را
                          وارد کنید.
                        </p>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={lessonCount}
                          onChange={handleLessonCountChange}
                          placeholder="مثلاً 10"
                          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />
                      </div>

                      {lessonCount > 0 && (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600">
                              نام درس‌ها
                            </span>

                            <span className="text-[11px] text-gray-400">
                              {lessonCount} درس
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {lessonNames.map((name, index) => (
                              <div key={index}>
                                <label className="mb-1.5 block text-xs font-bold text-gray-600">
                                  درس {index + 1}
                                </label>

                                <input
                                  type="text"
                                  value={name}
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    setLessonNames((prev) => {
                                      const updated = [...prev];
                                      updated[index] = value;
                                      return updated;
                                    });
                                  }}
                                  placeholder={`نام درس ${index + 1} (اختیاری)`}
                                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {selectedLessons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedLessons.map((lesson) => (
                          <span
                            key={lesson.id}
                            className="flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700"
                          >
                            {lesson.name}

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedLessons((prev) =>
                                  prev.filter((item) => item.id !== lesson.id),
                                )
                              }
                              className="text-violet-400 hover:text-red-500"
                            >
                              <X size={13} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-700">
                        توضیحات کتاب
                      </label>

                      <span className="text-xs text-gray-400">اختیاری</span>
                    </div>

                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={500}
                      rows={4}
                      placeholder="توضیحات، نکات یا اطلاعات تکمیلی درباره این کتاب را وارد کنید..."
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    />

                    <div className="mt-1 text-left text-[11px] text-gray-400">
                      {description.length}/500
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          footer={
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-12 rounded-xl border border-gray-300 bg-white px-8 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleCreateBook}
                className="h-12 flex-1 rounded-xl bg-violet-700 px-6 text-sm font-bold text-white"
              >
                ذخیره کتاب
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}

export default BookContent;
