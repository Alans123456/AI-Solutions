## Task: Fix dark background on Blog + Contact pages

### Steps

- [ ] Update wrapper background styling in `src/pages/Blog.tsx`
- [ ] Update wrapper background styling in `src/pages/BlogPost.tsx` (including loading + not-found states)
- [ ] Update wrapper background styling in `src/pages/Contact.tsx` (including submitted state)
- [ ] Verify visually by running the app: Blog list, single blog post, Contact form + submitted screen

### Notes

- User request: “components bg make it like in dark make it gray-900/80”
- Implemented approach: set top-level wrappers to `bg-white dark:bg-gray-900/80` for consistent dark background.
