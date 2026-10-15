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
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";

import BtnContents from "../../components/custom/BtnContents";
import FiltersBooks from "../../components/books/FiltersBooks";
import SearchBooks from "../../components/books/SearchBooks";
import Book from "../../components/books/Book";
import Modal from "../../components/custom/Modal";
import DropDown from "../../components/custom/DropDown";
import bookCrud from "../../api/bookCrud";
import { useToast } from "../../components/custom/Toast";
import { useAlert } from "../../components/custom/AlertContext";

function BookContent() {
  const toast = useToast();
  const { alert } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

  const [bookName, setBookName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedLessons, setSelectedLessons] = useState([]);

  const [description, setDescription] = useState("");
  const [bookImage, setBookImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [status, setStatus] = useState("active");

  const [lessonCount, setLessonCount] = useState(0);
  const [lessonNames, setLessonNames] = useState([]);

  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

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

  const resetBookForm = () => {
    setBookName("");
    setSelectedGrade(null);
    setSelectedLevel(null);
    setSelectedField(null);
    setSelectedYear(null);
    setSelectedLessons([]);
    setDescription("");
    setBookImage(null);
    setPreviewImage(null);
    setStatus("active");
    setLessonCount(0);
    setLessonNames([]);
    setIsEditMode(false);
    setEditingBookId(null);
  };

  const closeBookModal = () => {
    setIsModalOpen(false);
    resetBookForm();
  };

  const handleLessonCountChange = (e) => {
    const count = Math.min(100, Math.max(0, Number(e.target.value) || 0));

    setLessonCount(count);

    setLessonNames((prev) =>
      Array.from({ length: count }, (_, index) => prev[index] || ""),
    );
  };

  const handleLessonNameChange = (index, value) => {
    setLessonNames((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const normalizeLessonName = (value = "") => {
    return value.replace(/^درس\s*\d+\s*:\s*/, "").trim();
  };

  const handleBookImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warning("لطفاً یک فایل تصویری انتخاب کنید", {
        title: "فرمت نامعتبر",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("حجم تصویر نباید بیشتر از 5 مگابایت باشد", {
        title: "حجم فایل زیاد است",
      });
      return;
    }

    if (previewImage?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    const imageUrl = URL.createObjectURL(file);

    setBookImage(file);
    setPreviewImage(imageUrl);
  };

  const getBooks = async (page = 1) => {
    try {
      const response = await bookCrud.getBooks(page, pageSize);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      const paginationData = result?.data;

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

  const handleSaveBook = async () => {
    if (!bookName.trim()) {
      toast.error("لطفاً نام کتاب را وارد کنید");
      return;
    }

    if (!selectedGrade) {
      toast.error("لطفاً پایه تحصیلی را انتخاب کنید");
      return;
    }

    if (isEditMode && !editingBookId) {
      toast.error("شناسه کتاب برای ویرایش مشخص نیست");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("BookName", bookName.trim());
      formData.append("Grade", String(selectedGrade.id));

      if (bookImage) {
        formData.append("Picture", bookImage);
      }

      const lessonRequestsData = lessonNames
        .slice(0, lessonCount)
        .map((title, index) => ({
          lessonNumber: index + 1,
          title: normalizeLessonName(title),
        }));

      if (isEditMode) {
        lessonRequestsData.forEach((lesson, index) => {
          formData.append(
            `UpdateLessonRequests[${index}].lessonNumber`,
            String(lesson.lessonNumber),
          );

          formData.append(`UpdateLessonRequests[${index}].title`, lesson.title);
        });

        for (const [key, value] of formData.entries()) {
          console.log("UPDATE FORM DATA:", key, value);
        }

        const response = await bookCrud.updateBook(editingBookId, formData);

        if (!response.ok) {
          const errorResult = await response.json().catch(() => null);

          const validationErrors = errorResult?.error;

          if (validationErrors && typeof validationErrors === "object") {
            Object.entries(validationErrors).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach((message) => {
                  toast.error(`${field}: ${message}`);
                });
              }
            });
          }

          throw new Error(
            errorResult?.error?.message ||
              errorResult?.error?.detail ||
              `HTTP Error: ${response.status}`,
          );
        }

        await getBooks(currentPage);

        closeBookModal();

        toast.success("کتاب با موفقیت ویرایش شد", {
          title: "عملیات موفق",
        });

        return;
      }

      lessonRequestsData.forEach((lesson, index) => {
        formData.append(
          `LessonRequests[${index}].lessonNumber`,
          String(lesson.lessonNumber),
        );

        formData.append(`LessonRequests[${index}].title`, lesson.title);
      });

      for (const [key, value] of formData.entries()) {
        console.log("CREATE FORM DATA:", key, value);
      }

      const response = await bookCrud.createBook(formData);

      if (!response.ok) {
        const errorResult = await response.json().catch(() => null);

        const validationErrors = errorResult?.error;

        if (validationErrors && typeof validationErrors === "object") {
          Object.entries(validationErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((message) => {
                toast.error(`${field}: ${message}`);
              });
            }
          });
        }

        throw new Error(
          errorResult?.error?.message ||
            errorResult?.error?.detail ||
            `HTTP Error: ${response.status}`,
        );
      }

      await getBooks(currentPage);

      closeBookModal();

      toast.success("کتاب با موفقیت ایجاد شد", {
        title: "عملیات موفق",
      });
    } catch (error) {
      console.error("handleSaveBook error:", error);

      toast.error(error?.message || "خطایی هنگام ذخیره کتاب رخ داد", {
        title: "خطا در ذخیره کتاب",
        duration: 5000,
      });
    }
  };

  const handleBookDetails = async (bookId) => {
    try {
      setIsDetailLoading(true);
      setSelectedBook(null);
      setIsDetailModalOpen(true);

      const response = await bookCrud.getDetail(bookId);

      if (!response.ok) {
        const errorResult = await response.json().catch(() => null);

        throw new Error(
          errorResult?.error?.message ||
            errorResult?.error?.detail ||
            `HTTP Error: ${response.status}`,
        );
      }

      const result = await response.json();

      setSelectedBook(result?.data || result);
    } catch (error) {
      console.error("Error fetching book detail:", error);

      setIsDetailModalOpen(false);
      setSelectedBook(null);

      toast.error(error?.message || "دریافت جزئیات کتاب با خطا مواجه شد", {
        title: "خطا در دریافت اطلاعات",
        duration: 5000,
      });
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleDeleteBook = (bookId) => {
    alert({
      type: "confirm",
      title: "حذف کتاب",
      message: "آیا مطمئن هستید که می‌خواهید این کتاب را حذف کنید؟",
      confirmText: "بله، حذف کن",
      cancelText: "انصراف",
      showCancel: true,

      onConfirm: async () => {
        try {
          const response = await bookCrud.deleteBook(bookId);

          if (!response.ok) {
            const errorResult = await response.json().catch(() => null);

            throw new Error(
              errorResult?.error?.message ||
                errorResult?.error?.detail ||
                `HTTP Error: ${response.status}`,
            );
          }

          await getBooks(currentPage);

          toast.success("کتاب با موفقیت حذف شد", {
            title: "عملیات موفق",
          });
        } catch (error) {
          console.error("Error deleting book:", error);

          toast.error(error?.message || "حذف کتاب با خطا مواجه شد", {
            title: "خطا در حذف کتاب",
            duration: 5000,
          });
        }
      },
    });
  };

  const handleEditBook = async (book) => {
    try {
      setIsEditMode(true);
      setEditingBookId(book.id);

      const response = await bookCrud.getDetail(book.id);

      if (!response.ok) {
        const errorResult = await response.json().catch(() => null);

        throw new Error(
          errorResult?.error?.message ||
            errorResult?.error?.detail ||
            `HTTP Error: ${response.status}`,
        );
      }

      const result = await response.json();
      const data = result?.data || result;

      const grade = gradeItems.find((item) => item.id === data.grade) || null;

      const lessons = Array.isArray(data.lessons) ? data.lessons : [];

      setBookName(data.bookName || "");
      setSelectedGrade(grade);
      setSelectedLevel(null);
      setSelectedField(null);
      setSelectedYear(null);
      setSelectedLessons([]);
      setDescription(data.description || "");
      setStatus(data.status || "active");

      setBookImage(null);
      setPreviewImage(data.picture || null);

      setLessonCount(lessons.length);

      setLessonNames(
        lessons.map((lesson) => normalizeLessonName(lesson.lessonName || "")),
      );

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading book for edit:", error);

      toast.error(error?.message || "دریافت اطلاعات کتاب با خطا مواجه شد", {
        title: "خطا در ویرایش",
        duration: 5000,
      });

      setIsEditMode(false);
      setEditingBookId(null);
    }
  };

  const btnHeader = [
    {
      id: 1,
      name: "اضافه کردن کتاب",
      icon: <Plus size={16} />,
      styleButton:
        "bg-violet-900 text-white hover:bg-violet-800 hover:shadow-violet-500/30 active:bg-violet-950 dark:bg-violet-900 dark:hover:bg-violet-800",
      onClick: () => {
        resetBookForm();
        setIsModalOpen(true);
      },
    },
    {
      id: 2,
      name: "دسته بندی کردن کتاب",
      icon: <Funnel size={16} />,
      styleButton:
        "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md active:bg-gray-100 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600",
    },
  ];

  return (
    <div className="p-6 h-full bg-violet-50/50 dark:bg-slate-950">
      <div className="flex pl-10 justify-between text-right">
        <div className="flex justify-center items-center gap-4">
          {btnHeader.map((btn) => (
            <div key={btn.id}>
              <BtnContents
                name={btn.name}
                icon={btn.icon}
                styleButton={btn.styleButton}
                onClick={btn.onClick}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-6 mr-10">
          <div>
            <p className="text-2xl font-bold dark:text-white">کتاب ها</p>

            <p className="text-md text-slate-600 dark:text-slate-400">
              کتاب های درسی خود را مدیریت کنید و برای هر کتاب، درس ها و سوالات
              را تعریف نمایید
            </p>
          </div>

          <div className="flex items-center justify-center size-12 rounded-xl bg-violet-100 dark:bg-violet-950/40">
            <BookOpen className="size-8 text-violet-700 dark:text-violet-400" />
          </div>
        </div>
      </div>

      <div className="my-10 flex justify-center items-end gap-14">
        <FiltersBooks />
        <SearchBooks />
      </div>

      <div className="latest-scroll px-10 cursor-s-resize mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-h-120 overflow-auto">
        {books.map((book) => (
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
              onDetails={() => handleBookDetails(book.id)}
              onDelete={() => handleDeleteBook(book.id)}
              bookSource={book.bookSource}
              onEdit={() => handleEditBook(book)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-12 mt-8">
        <p className="text-sm text-gray-500 dark:text-white">
          تعداد کل کتاب‌ها :
          <span className="font-bold text-violet-700"> {totalCount}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => getBooks(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-lg border bg-white dark:bg-violet-900 dark:text-white px-3 py-1 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            قبلی
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                type="button"
                key={page}
                onClick={() => getBooks(page)}
                className={`h-8 w-8 rounded-lg text-sm ${
                  currentPage === page
                    ? "bg-violet-700 text-white dark:bg-violet-900 dark:border dark:border-white"
                    : "border bg-white text-gray-600"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => getBooks(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-lg border bg-white dark:bg-violet-900 dark:text-white px-3 py-1 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            بعدی
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          onClose={closeBookModal}
          header={
            <div>
              <div className="flex items-center gap-3">
                <BookOpen className="text-violet-600" size={25} />

                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {isEditMode ? "ویرایش کتاب" : "افزودن کتاب جدید"}
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-400 dark:text-gray-300">
                {isEditMode
                  ? "اطلاعات کتاب را ویرایش کنید و تغییرات را ذخیره نمایید."
                  : "اطلاعات کتاب را وارد کنید و آن را به ساختار آموزشی خود اضافه نمایید."}
              </p>
            </div>
          }
          content={
            <div className="grid grid-cols-12 gap-0">
              <div className="col-span-12 border-b border-gray-100 p-7 lg:col-span-4 lg:border-b-0 lg:border-l">
                <div className="text-right">
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    تصویر جلد کتاب
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-gray-400 dark:text-gray-300">
                    تصویر جلد کتاب را انتخاب کنید.
                  </p>
                </div>

                <div className="mt-6 flex flex-col items-center">
                  <label
                    htmlFor="book-image"
                    className="group relative flex h-72 w-52 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50 transition hover:border-violet-500 hover:bg-violet-100"
                  >
                    {previewImage ? (
                      <>
                        <img
                          src={previewImage}
                          alt="پیش‌نمایش جلد کتاب"
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                          <span className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-violet-700">
                            تغییر تصویر
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                          <BookOpen size={28} />
                        </div>

                        <p className="text-sm font-bold text-gray-700">
                          انتخاب تصویر جلد
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          PNG، JPG یا WEBP
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          حداکثر 5 مگابایت
                        </p>
                      </div>
                    )}
                  </label>

                  <input
                    id="book-image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleBookImageChange}
                    className="hidden"
                  />

                  {bookImage && (
                    <div className="mt-4 flex w-full items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-gray-700">
                          {bookImage.name}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {(bookImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (previewImage?.startsWith("blob:")) {
                            URL.revokeObjectURL(previewImage);
                          }

                          setBookImage(null);
                          setPreviewImage(null);
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-12 p-7 lg:col-span-8">
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-white">
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
                        maxLength={50}
                        placeholder="مثلاً: فیزیک ۳"
                        className="h-11 w-full rounded-xl border border-gray-200 bg-white dark:bg-slate-900 dark:text-white px-4 pl-10 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                      />
                    </div>
                  </div>

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

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-white">
                      وضعیت
                    </label>

                    <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-gray-200">
                      {[
                        ["active", "فعال"],
                        ["inactive", "غیرفعال"],
                        ["archive", "آرشیو"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setStatus(value)}
                          className={`h-11 text-sm font-bold transition ${
                            status === value
                              ? "bg-violet-950 text-white"
                              : "bg-white text-gray-400 hover:bg-gray-50 dark:bg-violet-800 dark:hover:bg-violet-900 dark:hover:text-white"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

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

                    <div className="rounded-2xl mt-5 border border-gray-100 bg-gray-50/50 dark:bg-slate-900 p-4">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-gray-700 dark:text-white">
                            تعداد درس‌ها
                          </label>

                          <span className="text-xs text-gray-400 dark:text-gray-300">
                            نام درس‌ها اختیاری است
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-300">
                          تعداد درس‌هایی که برای این کتاب در نظر گرفته‌اید را
                          وارد کنید.
                        </p>
                      </div>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={lessonCount}
                        onChange={handleLessonCountChange}
                        placeholder="مثلاً 10"
                        className="h-11 w-full rounded-xl border border-gray-200 bg-white dark:bg-slate-900 dark:text-white px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                      />

                      {lessonCount > 0 && (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600 dark:text-white">
                              نام درس‌ها
                            </span>

                            <span className="text-[11px] text-gray-400">
                              {lessonCount} درس
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {lessonNames.map((name, index) => (
                              <div key={index}>
                                <label className="mb-1.5 block text-xs font-bold text-gray-600 dark:text-gray-400">
                                  درس {index + 1}
                                </label>

                                <input
                                  type="text"
                                  value={name}
                                  onChange={(e) =>
                                    handleLessonNameChange(
                                      index,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={`نام درس ${index + 1} (اختیاری)`}
                                  className="h-10 w-full rounded-xl border border-gray-200 bg-white dark:bg-slate-900 dark:text-white px-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

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

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-700 dark:text-white">
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
                onClick={closeBookModal}
                className="h-12 rounded-xl border border-gray-300 bg-white px-8 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleSaveBook}
                className="h-12 flex-1 rounded-xl bg-violet-700 px-6 text-sm font-bold text-white transition hover:bg-violet-800"
              >
                {isEditMode ? "ذخیره تغییرات" : "ذخیره کتاب"}
              </button>
            </div>
          }
        />
      )}

      {isDetailModalOpen && (
        <Modal
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedBook(null);
          }}
          header={
            <div className="relative overflow-hidden">
              <div className="absolute -right-16 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
              <div className="absolute -left-10 -bottom-20 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
                  <BookOpen size={25} strokeWidth={2.2} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">
                      جزئیات کتاب
                    </h2>

                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-black text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                      اطلاعات کامل
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    مشخصات کتاب، درس‌ها و اطلاعات تکمیلی
                  </p>
                </div>
              </div>
            </div>
          }
          content={
            isDetailLoading ? (
              <div className="flex min-h-107 items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                  <div className="relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen size={20} className="text-violet-600" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                      در حال دریافت اطلاعات
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      لطفاً چند لحظه صبر کنید...
                    </p>
                  </div>
                </div>
              </div>
            ) : selectedBook ? (
              <div className="max-h-[72vh] space-y-5 overflow-y-auto px-1 pb-2">
                <div className="group relative overflow-hidden rounded-[28px] border border-violet-100 bg-linear-to-br from-violet-50 via-white to-indigo-50 p-5 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-400/10 blur-3xl transition duration-500 group-hover:bg-violet-400/20" />
                  <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />

                  <div className="relative flex flex-col gap-5 sm:flex-row">
                    <div className="group/image relative mx-auto h-48 w-36 shrink-0 overflow-hidden rounded-2xl bg-violet-100 shadow-xl shadow-violet-900/10 sm:mx-0">
                      {selectedBook.picture ? (
                        <>
                          <img
                            src={selectedBook.picture}
                            alt={selectedBook.bookName}
                            className="h-full w-full object-cover transition duration-700 group-hover/image:scale-110"
                          />

                          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-white/10" />
                        </>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-violet-100 to-indigo-100 text-violet-400">
                          <BookOpen size={46} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          فعال
                        </span>

                        <span className="rounded-full bg-violet-50 px-3 py-1.5 text-[11px] font-black text-violet-700 ring-1 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20">
                          کتاب درسی
                        </span>
                      </div>

                      <h3 className="line-clamp-3 text-2xl font-black leading-9 tracking-tight text-slate-800 dark:text-white">
                        {selectedBook.bookName}
                      </h3>

                      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2.5 rounded-xl border border-white/80 bg-white/80 px-3.5 py-2.5 text-xs font-bold text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-300">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                            <GraduationCap size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] font-medium text-slate-400">
                              پایه
                            </p>
                            <p className="truncate">
                              {gradeBooks[selectedBook.grade] ||
                                selectedBook.grade}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 rounded-xl border border-white/80 bg-white/80 px-3.5 py-2.5 text-xs font-bold text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-300">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                            <Users size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] font-medium text-slate-400">
                              رشته
                            </p>
                            <p className="truncate">
                              {selectedBook.field || "عمومی"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="group rounded-2xl border border-slate-200/70 bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:scale-110 dark:bg-violet-500/10 dark:text-violet-400">
                      <BookOpen size={19} />
                    </div>

                    <p className="text-[10px] font-bold text-slate-400">
                      تعداد درس
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-800 dark:text-white">
                      {selectedBook.lessons?.length || 0}
                    </p>
                  </div>

                  <div className="group rounded-2xl border border-slate-200/70 bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:scale-110 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <GraduationCap size={19} />
                    </div>

                    <p className="text-[10px] font-bold text-slate-400">پایه</p>

                    <p className="mt-1 truncate text-sm font-black text-slate-800 dark:text-white">
                      {gradeBooks[selectedBook.grade] || selectedBook.grade}
                    </p>
                  </div>

                  <div className="group rounded-2xl border border-slate-200/70 bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:scale-110 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <Users size={19} />
                    </div>

                    <p className="text-[10px] font-bold text-slate-400">رشته</p>

                    <p className="mt-1 truncate text-sm font-black text-slate-800 dark:text-white">
                      {selectedBook.field || "عمومی"}
                    </p>
                  </div>

                  <div className="group rounded-2xl border border-slate-200/70 bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition group-hover:scale-110 dark:bg-rose-500/10 dark:text-rose-400">
                      <FileText size={19} />
                    </div>

                    <p className="text-[10px] font-bold text-slate-400">
                      سوالات
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-800 dark:text-white">
                      {selectedBook.questions?.length || 0}
                    </p>
                  </div>
                </div>

                {selectedBook.lessons?.length > 0 && (
                  <div className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                          <Layers size={19} />
                        </div>

                        <div>
                          <h3 className="text-sm font-black text-slate-800 dark:text-white">
                            درس‌های کتاب
                          </h3>

                          <p className="mt-1 text-[10px] font-medium text-slate-400">
                            فهرست کامل محتوای آموزشی
                          </p>
                        </div>
                      </div>

                      <div className="rounded-full bg-violet-50 px-3.5 py-2 text-xs font-black text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                        {selectedBook.lessons.length} درس
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 p-4 sm:grid-cols-2">
                      {selectedBook.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id || index}
                          className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-3.5 py-3 transition duration-300 hover:border-violet-200 hover:bg-violet-50/60 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-violet-500/20 dark:hover:bg-violet-500/5"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-violet-600 shadow-sm transition duration-300 group-hover:bg-violet-600 group-hover:text-white dark:bg-slate-900 dark:text-violet-400 dark:group-hover:bg-violet-600 dark:group-hover:text-white">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="mb-0.5 text-[10px] font-medium text-slate-400">
                              درس {index + 1}
                            </p>

                            <span className="block truncate text-sm font-black text-slate-700 dark:text-slate-200">
                              {lesson.lessonName}
                            </span>
                          </div>

                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-slate-300 opacity-0 transition group-hover:opacity-100 dark:bg-slate-900">
                            <BookOpen size={13} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBook.description && (
                  <div className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <FileText size={17} />
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-white">
                          توضیحات کتاب
                        </h3>

                        <p className="mt-1 text-[10px] font-medium text-slate-400">
                          توضیحات و اطلاعات تکمیلی
                        </p>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-8 text-slate-600 dark:bg-slate-950 dark:text-slate-400">
                        {selectedBook.description}
                      </p>
                    </div>
                  </div>
                )}

                {!selectedBook.lessons?.length && !selectedBook.description && (
                  <div className="flex min-h-44 flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-500 dark:bg-violet-500/10">
                      <BookOpen size={23} />
                    </div>

                    <p className="text-sm font-black text-slate-600 dark:text-slate-300">
                      اطلاعات تکمیلی ثبت نشده است
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      برای این کتاب هنوز درس یا توضیحی ثبت نشده است.
                    </p>
                  </div>
                )}
              </div>
            ) : null
          }
          footer={
            <div className="flex w-full items-center justify-between gap-3">
              <div className="hidden items-center gap-2 text-[11px] font-medium text-slate-400 sm:flex">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                اطلاعات کتاب
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedBook(null);
                }}
                className="h-11 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-8 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/25 active:translate-y-0"
              >
                بستن
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}

export default BookContent;
