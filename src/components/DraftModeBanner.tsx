import { draftMode } from 'next/headers';

// Lets an editor tell a preview from the live site, and get back out.
export async function DraftModeBanner() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed bottom-0 inset-x-0 z-50 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-black"
    >
      <span>Draft mode — you are previewing unpublished content.</span>
      <a href="/api/disable-draft" className="underline underline-offset-2">
        Exit preview
      </a>
    </div>
  );
}
