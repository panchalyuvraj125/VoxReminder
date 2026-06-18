export const CATEGORIES: Record<string, string[]> = {
  '💼 Work/Study': ['work', 'study', 'code', 'meeting', 'assignment', 'project', 'class', 'deadline', 'report', 'presentation', 'kaam', 'padhai', 'office'],
  '💧 Health': ['water', 'medicine', 'gym', 'eat', 'sleep', 'exercise', 'walk', 'breathe', 'stretch', 'yoga', 'run', 'pill', 'vitamin', 'paani', 'dawai', 'khaana', 'sona', 'neend', 'workout'],
  '📞 Personal': ['call', 'mom', 'dad', 'friend', 'message', 'text', 'email', 'birthday', 'gift', 'family', 'brother', 'sister', 'maa', 'papa', 'bhai', 'behen', 'dost', 'baat'],
  '⏰ General': [],
};

/**
 * Auto-categorize a task based on keyword matching.
 */
export function categorizeTask(task: string): string {
  const lower = task.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.length === 0) continue;
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }

  return '⏰ General';
}
