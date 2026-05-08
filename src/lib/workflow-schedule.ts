const weekDays: Record<string, number> = {
  日: 0,
  天: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
}

function scheduleTime(schedule = "") {
  const match = schedule.trim().match(/(\d{1,2})[:：](\d{2})/)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return { hour, minute }
}

function scheduleWeekday(schedule = "") {
  const match = schedule.match(/每周([日天一二三四五六])/)
  return match ? weekDays[match[1]] : null
}

export function nextWorkflowRunAt(schedule = "", after = new Date()) {
  const time = scheduleTime(schedule)
  if (!time) return null

  const text = schedule.trim()
  const weekday = scheduleWeekday(text)
  const candidate = new Date(after)
  candidate.setSeconds(0, 0)
  candidate.setHours(time.hour, time.minute, 0, 0)

  if (text.includes("每周")) {
    const target = weekday ?? 5
    const daysAhead = (target - candidate.getDay() + 7) % 7
    candidate.setDate(candidate.getDate() + daysAhead)
    if (candidate <= after) candidate.setDate(candidate.getDate() + 7)
    return candidate
  }

  if (candidate <= after) candidate.setDate(candidate.getDate() + 1)
  return candidate
}

export function isWorkflowDue(workflow: { schedule?: string | null; next_run_at?: string | null }, now = new Date()) {
  if (workflow.next_run_at) {
    const dueAt = new Date(workflow.next_run_at)
    return !Number.isNaN(dueAt.getTime()) && dueAt <= now
  }
  return Boolean(nextWorkflowRunAt(workflow.schedule || "", now))
}
