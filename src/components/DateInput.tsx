type DateInputProps = {
    title: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    timeInput?: boolean
    errorMsg?: string
    className?: string
    inputClassName?: string

}

function DateInput({title, name, value, onChange, timeInput, errorMsg, className, inputClassName}: DateInputProps) {
    return (
        <div className={`relative mb-6 ${className}`}>
            <p className={`absolute left-4  font-bold top-2 text-xs ${errorMsg ? 'text-red-400' : 'text-stone-400'} transition-all duration-200`}>{errorMsg ? title + ' ' + errorMsg : title}</p>
            <input type={timeInput ? 'datetime-local' : 'date'} name={name} onChange={e => onChange(e)} value={value} className={`bg-[#f5f5f5] focus:bg-[#f9f9f9] font-bold  pt-6 pb-2 text-md px-4 rounded-xl w-full focus:outline-none focus:border-2 focus:border-themeDarkGreen/75 focus:shadow focus:shadow-themeGreen text-black ${inputClassName}`}/>
        </div>
        
    );
}

export default DateInput;