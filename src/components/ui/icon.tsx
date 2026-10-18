"use client"

import React from "react"
import { HugeiconsIcon, HugeiconsProps } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

export interface IconProps extends Omit<HugeiconsProps, "icon"> {
  icon: IconSvgElement
  className?: string
  size?: number | string
}

export function Icon({ icon, size = 18, className, ...props }: IconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      className={className}
      {...props}
    />
  )
}

export { HugeiconsIcon }
export type { IconSvgElement }
