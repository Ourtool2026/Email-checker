import * as React from "react"

import { Panel, PanelBody } from "@/components/kit/panel"

/** The studio panel: gray shell with a header, content on the white body. */
export function Card({
  icon,
  title,
  description,
  actions,
  children,
  className,
  bodyClass,
  flush,
}: {
  icon?: React.ElementType
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  children?: React.ReactNode
  className?: string
  bodyClass?: string
  flush?: boolean
}) {
  return (
    <Panel
      icon={icon}
      title={title}
      description={description}
      actions={actions}
      className={className}
    >
      <PanelBody flush={flush} className={bodyClass}>
        {children}
      </PanelBody>
    </Panel>
  )
}
