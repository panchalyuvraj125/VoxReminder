import type { Reminder } from '../../hooks/useReminders';
import { categorizeTask } from '../../utils/categories';
import RemindersTable from './RemindersTable';

export default function CategoriesView({ allReminders }: { allReminders: Reminder[] }) {
  const categories = allReminders.reduce((acc, r) => {
    const cat = categorizeTask(r.parsedTask);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {} as Record<string, Reminder[]>);

  const sortedCategories = Object.keys(categories).sort();

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h2 className="text-xl font-medium text-white/90">Categories</h2>
        <p className="text-sm text-white/50 mt-1">View your reminders grouped by subject.</p>
      </div>

      {Object.entries(categories).length === 0 ? (
         <div className="text-center py-12 text-white/40 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
           No reminders found to categorize.
         </div>
      ) : (
        <div className="space-y-6">
          {sortedCategories.map((cat) => (
            <div key={cat} className="space-y-3">
              <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                {cat} 
                <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-medium">
                  {categories[cat].length}
                </span>
              </h3>
              <RemindersTable reminders={categories[cat]} showStatus />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
