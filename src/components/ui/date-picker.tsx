"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { cn } from "cn"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  name?: string
  id?: string
  required?: boolean
  disabled?: boolean
  defaultValue?: Date | string
}

export function DatePicker({
  date: controlledDate,
  onDateChange,
  placeholder = "Pick a date",
  className,
  name,
  id,
  required,
  disabled,
  defaultValue,
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(() => {
    if (controlledDate !== undefined) return controlledDate
    if (defaultValue) {
      return typeof defaultValue === "string" ? new Date(defaultValue) : defaultValue
    }
    return undefined
  })
  const [open, setOpen] = React.useState(false)

  const selectedDate = controlledDate !== undefined ? controlledDate : internalDate

  const handleSelect = (newDate: Date | undefined) => {
    if (controlledDate === undefined) {
      setInternalDate(newDate)
    }
    onDateChange?.(newDate)
    setOpen(false)
  }

  const formattedDate = selectedDate ? format(selectedDate, "PPP") : ""
  const formValue = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""

  return (
    <div className={cn("relative w-full", className)}>
      {name && (
        <input
          type="hidden"
          name={name}
          id={id ? `${id}-hidden` : undefined}
          value={formValue}
          required={required}
        />
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          disabled={disabled}
          className={cn(
            "flex h-7 w-full items-center justify-start text-left text-xs font-normal rounded-md border border-input bg-input/20 px-2 py-0.5 shadow-none transition-colors hover:bg-input/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <Icon icon={Calendar01Icon} size={13} className="mr-2 text-muted-foreground shrink-0" />
          <span className="truncate">{selectedDate ? formattedDate : placeholder}</span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
