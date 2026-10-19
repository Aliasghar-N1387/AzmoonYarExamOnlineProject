
import { useMemo, useState } from "react";
import {
  Search,
  MessageCircleMore,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  CheckCheck,
  Inbox,
  ArrowRight,
  Phone,
  Video,
  Sparkles,
} from "lucide-react";

const initialConversations = [
  {
    id: 1,
    name: "پشتیبانی آزمون‌یار",
    role: "تیم پشتیبانی",
    avatar: "پ",
    color: "from-violet-500 to-indigo-600",
    lastMessage: "چطور می‌تونیم کمکت کنیم؟",
    time: "۱۰:۴۲",
    unread: 2,
    online: true,
    messages: [
      {
        id: 1,
        text: "سلام! به پشتیبانی آزمون‌یار خوش اومدی 👋",
        time: "۱۰:۳۹",
        mine: false,
      },
      {
        id: 2,
        text: "اگر درباره آزمون‌ها یا حساب کاربری سوالی داری، اینجا برامون بنویس.",
        time: "۱۰:۴۰",
        mine: false,
      },
      {
        id: 3,
        text: "چطور می‌تونیم کمکت کنیم؟",
        time: "۱۰:۴۲",
        mine: false,
      },
    ],
  },
  {
    id: 2,
    name: "تیم آموزشی",
    role: "آموزش",
    avatar: "آ",
    color: "from-emerald-400 to-teal-600",
    lastMessage: "محتوای جدید آزمون اضافه شد.",
    time: "دیروز",
    unread: 1,
    online: false,
    messages: [
      {
        id: 1,
        text: "محتوای جدید آزمون اضافه شد.",
        time: "دیروز",
        mine: false,
      },
    ],
  },
  {
    id: 3,
    name: "اطلاع‌رسانی",
    role: "اعلان‌های سیستم",
    avatar: "ا",
    color: "from-orange-400 to-rose-500",
    lastMessage: "به پنل آزمون‌یار خوش آمدید.",
    time: "شنبه",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        text: "به پنل آزمون‌یار خوش آمدید.",
        time: "شنبه",
        mine: false,
      },
    ],
  },
];

function MessagesPage() {
  const [conversations, setConversations] = useState(
    initialConversations
  );
  const [activeId, setActiveId] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeId
  );

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesSearch =
        conversation.name.toLowerCase().includes(search.toLowerCase()) ||
        conversation.lastMessage.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && conversation.unread > 0);

      return matchesSearch && matchesFilter;
    });
  }, [conversations, search, filter]);

  const openConversation = (id) => {
    setActiveId(id);

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === id
          ? { ...conversation, unread: 0 }
          : conversation
      )
    );
  };

  const sendMessage = (event) => {
    event.preventDefault();

    const text = message.trim();
    if (!text || !activeConversation) return;

    const newMessage = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mine: true,
    };

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === activeId
          ? {
              ...conversation,
              lastMessage: text,
              time: "اکنون",
              messages: [...conversation.messages, newMessage],
            }
          : conversation
      )
    );

    setMessage("");
  };

  return (
    <main
      dir="rtl"
      className="min-h-[calc(100vh-100px)] bg-slate-50 p-3 transition-colors duration-300 dark:bg-slate-950 sm:p-5 lg:p-7"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Page heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-violet-600 dark:text-violet-400">
              <Sparkles size={17} />
              <span className="text-xs font-bold">مرکز ارتباطات</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              پیام‌های من
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              گفتگوها و پیام‌های خود را یکجا مدیریت کن.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
              <MessageCircleMore size={21} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                پیام‌های خوانده‌نشده
              </p>
              <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                {conversations.reduce(
                  (total, conversation) => total + conversation.unread,
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Messaging workspace */}
        <section className="grid min-h-155 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Conversation sidebar */}
          <aside className="flex min-h-0 flex-col border-b border-slate-200 dark:border-slate-800 lg:border-b-0 lg:border-l">
            <div className="border-b border-slate-100 p-4 dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-extrabold text-slate-900 dark:text-white">
                  گفتگوها
                </h2>
                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  {conversations.length}
                </span>
              </div>

              <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950">
                <Search size={17} className="shrink-0 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="جستجوی گفتگو..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </label>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    filter === "all"
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  همه پیام‌ها
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    filter === "unread"
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  خوانده‌نشده
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto p-2">
              {filteredConversations.map((conversation) => {
                const active = activeId === conversation.id;

                return (
                  <button
                    key={conversation.id}
                    onClick={() => openConversation(conversation.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl p-3 text-right transition-all duration-200 ${
                      active
                        ? "bg-violet-50 ring-1 ring-violet-100 dark:bg-violet-500/10 dark:ring-violet-500/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`flex size-12 items-center justify-center rounded-2xl bg-linear-to-br ${conversation.color} text-lg font-black text-white shadow-md`}
                      >
                        {conversation.avatar}
                      </div>
                      {conversation.online && (
                        <span className="absolute -bottom-1 -left-1 size-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p
                          className={`truncate text-sm ${
                            conversation.unread
                              ? "font-extrabold text-slate-900 dark:text-white"
                              : "font-bold text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {conversation.name}
                        </p>
                        <span className="shrink-0 text-[10px] text-slate-400">
                          {conversation.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-extrabold text-white">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredConversations.length === 0 && (
                <div className="px-4 py-12 text-center">
                  <Inbox
                    size={32}
                    className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
                  />
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    گفتگویی پیدا نشد
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    عبارت جستجو یا فیلتر را تغییر بده.
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Active conversation */}
          <div className="flex min-h-125 min-w-0 flex-col">
            {activeConversation ? (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 dark:border-slate-800 sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${activeConversation.color} font-black text-white`}
                    >
                      {activeConversation.avatar}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-extrabold text-slate-900 dark:text-white">
                        {activeConversation.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {activeConversation.online
                          ? "آنلاین"
                          : activeConversation.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="تماس صوتی"
                      className="hidden size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-slate-800 sm:flex"
                    >
                      <Phone size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="تماس تصویری"
                      className="hidden size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-slate-800 sm:flex"
                    >
                      <Video size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="گزینه‌های گفتگو"
                      className="flex size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-slate-800"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-50/70 via-white to-white p-4 dark:from-violet-950/10 dark:via-slate-900 dark:to-slate-900 sm:p-6">
                  <div className="mx-auto mb-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-[10px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    شروع گفتگو
                  </div>

                  {activeConversation.messages.map((item) => (
                    <div
                      key={item.id}
                      className={`flex ${
                        item.mine ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                          item.mine
                            ? "rounded-bl-md bg-violet-600 text-white shadow-lg shadow-violet-500/10"
                            : "rounded-br-md border border-slate-200/80 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7">
                          {item.text}
                        </p>
                        <div
                          className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                            item.mine
                              ? "text-violet-100"
                              : "text-slate-400"
                          }`}
                        >
                          <span>{item.time}</span>
                          {item.mine && <CheckCheck size={13} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={sendMessage}
                  className="border-t border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4"
                >
                  <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950">
                    <button
                      type="button"
                      aria-label="پیوست فایل"
                      className="mb-1 flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-violet-600 dark:hover:bg-slate-800"
                    >
                      <Paperclip size={19} />
                    </button>

                    <textarea
                      rows={1}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          !event.shiftKey &&
                          !event.nativeEvent.isComposing
                        ) {
                          event.preventDefault();
                          event.currentTarget.form?.requestSubmit();
                        }
                      }}
                      placeholder="پیامت رو اینجا بنویس..."
                      className="max-h-32 min-h-10 min-w-0 flex-1 resize-y bg-transparent px-1 py-2 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                    />

                    <button
                      type="button"
                      aria-label="ایموجی"
                      className="mb-1 hidden size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-violet-600 dark:hover:bg-slate-800 sm:flex"
                    >
                      <Smile size={19} />
                    </button>

                    <button
                      type="submit"
                      disabled={!message.trim()}
                      aria-label="ارسال پیام"
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Send size={18} />
                    </button>
                  </div>

                  <p className="mt-2 text-center text-[10px] text-slate-400">
                    Enter برای ارسال · Shift + Enter برای خط جدید
                  </p>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex size-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                  <MessageCircleMore size={36} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  گفتگویی انتخاب نشده
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
                  برای مشاهده پیام‌ها، یکی از گفتگوهای فهرست را انتخاب کن.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default MessagesPage;
