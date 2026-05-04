"use client"

import { Stage } from "@/data/learning-path"
import { ArrowRight, Clock, Users } from "lucide-react"
import Link from "next/link"

export function StageCard({ stage, index }: { stage: Stage; index: number }) {
  return (
    <Link href={`/learn/${stage.id}`} className="card p-5 flex flex-col md:flex-row gap-4 group no-underline cursor-pointer block">
      {/* 左侧：阶段图标 + 编号 */}
      <div className="flex-shrink-0 flex flex-row md:flex-col items-center gap-2.5 md:w-16">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${stage.color}18` }}
        >
          {stage.icon}
        </div>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ color: stage.color, background: `${stage.color}18` }}
        >
          阶段 {stage.id}
        </span>
      </div>

      {/* 中间：内容 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-[#ccc] mb-0.5 group-hover:text-primary-600 transition-colors">{stage.title}</h3>
        <p className="text-sm text-primary-500 font-medium mb-2.5">{stage.subtitle}</p>

        <div className="flex items-center gap-3 text-[11px] text-[#555] mb-2.5">
          <span className="flex items-center gap-1"><Users size={11} />{stage.whoIsThisFor.length > 25 ? stage.whoIsThisFor.slice(0, 25) + "..." : stage.whoIsThisFor}</span>
          <span className="flex items-center gap-1"><Clock size={11} />{stage.timeEstimate}</span>
        </div>

        <div className="space-y-1">
          {stage.sections.slice(0, 3).map((section) => (
            <div key={section.title} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: stage.color }} />
              <span className="text-xs text-[#888]">{section.title}</span>
            </div>
          ))}
          {stage.sections.length > 3 && (
            <p className="text-[11px] text-[#555] pl-3.5">+{stage.sections.length - 3} 个章节</p>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary-600 group-hover:text-primary-700 transition-colors">
          开始学习 <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 右侧：大图标 */}
      <div className="hidden md:flex items-center justify-center flex-shrink-0 w-20">
        <span className="text-4xl opacity-60">{stage.icon}</span>
      </div>
    </Link>
  )
}
