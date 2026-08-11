import { Search } from "lucide-react";
import { useLanguage } from "../../context/useLanguage";

function SearchBar({
    value,
    onChange,
    placeholder,
}) {
    const { t } = useLanguage();

    return (
        <div className="relative group w-full">
            <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors"
            />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder || t("search", "Search...")}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 pl-12 pr-4 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm outline-none transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
            />
        </div>
    );
}

export default SearchBar;