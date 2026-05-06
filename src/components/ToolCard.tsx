"use client"

import { Tool, stageLabels } from "@/data/tools"
import { toolPath } from "@/data/tool-meta"
import { brandLogoFromName, domainIcon } from "@/lib/visual-assets"
import { ExternalLink, Zap } from "lucide-react"
import Link from "next/link"

export function ToolCard({ tool }: { tool: Tool }) {
  const stageLabel = stageLabels[tool.stage]
  const logo = tool.logo || brandLogoFromName(tool.name) || domainIcon(tool.url)

  return (
    <Link
      href={toolPath(tool)}
      className="card block p-4 no-underline group"
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        {logo && (
          <span className="w-9 h-9 rounded-lg border border-gray-100 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={logo} alt={`${tool.name} logo`} className="w-6 h-6 object-contain" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {tool.name}
            </h3>
            {tool.featured && (
              <span className="tag tag-gold"><Zap size={10} />推荐</span>
            )}
          </div>
          <p className="text-[11px] text-gray-400">{tool.pricing}</p>
        </div>
        <ExternalLink size={14} className="text-gray-300 group-hover:text-primary-400 flex-shrink-0 mt-0.5 transition-colors" />
      </div>

      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
        {tool.description}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="tag tag-green">{stageLabel}</span>
        {tool.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag tag-gray">{tag}</span>
        ))}
      </div>
    </Link>
  )
}
