import { Eye, EyeOff } from "lucide-react";

function BtnDataForm({
  name,
  lable,
  backIcon,
  value,
  onChange,
  type = "text",
  showPassword = false,
  onTogglePassword,
}) {
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;
  return (
    <div className="relative w-full h-14 border-2 border-gray-300 rounded-lg mt-5">
      
      <input
        type={inputType}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="w-full h-full font-[Vazir] focus:outline-none peer text-right pr-12 pl-12 bg-transparent"
      />
      <label
        htmlFor={name}
        className="absolute px-3 top-5 right-8 cursor-text font-[Vazir] bg-white text-gray-400 text-sm transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs"
      >
        
        {lable}
      </label>
      <span className="absolute top-4 right-3 text-gray-400"> {backIcon} </span>
      {type === "password" && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute left-4 top-4 text-gray-400 hover:text-violet-800 cursor-pointer"
        >
          
          {showPassword ? (
            <Eye className="size-5" />
          ) : (
            <EyeOff className="size-5" />
          )}
        </button>
      )}
    </div>
  );
}
export default BtnDataForm;
