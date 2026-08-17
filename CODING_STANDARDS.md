# Coding Standards — Mini Contact Book

Purpose: this is your project, and code that reads as obviously
agent-generated (uniform docstrings on every function, defensive try/except
around everything, comment-explains-the-obvious, emoji in commit messages)
undermines that even when the logic is correct. This doc is what the
Antigravity agent should follow so the output reads like something you
actually wrote and understand.

## General

- **Comment why, not what.** `# subtract 1 because slice is exclusive` is
  useless; `# owner is set here, not accepted from the client, to prevent
  contact-hijacking via a forged owner id` is the kind of comment a human
  leaves because they got burned by the mistake once.
- **Don't docstring trivial functions.** A three-line `get_queryset`
  override doesn't need a docstring. Reserve docstrings for things that
  aren't obvious from the name + signature.
- **No blanket `except Exception`.** Catch what you expect (`IntegrityError`,
  `ValidationError`), let everything else surface — a bare except that
  swallows errors is one of the clearest AI-generated-code tells and it's
  also just bad practice.
- **Inconsistency is fine, uniformity is the tell.** Real projects have a
  slightly different quote style in a file written on day 1 vs day 5. Don't
  force every file to be mechanically identical.
- **No emoji, no "TODO: implement X" placeholders left in, no
  `# This function handles the logic for X`-style narration comments.**

## Django / Python

- Use Django's own conventions (fat models, thin views) rather than
  reinventing a service layer for a one-model app.
- Serializer validation lives in the serializer (`validate_email`, etc.),
  not duplicated in the view.
- Permission logic (`IsOwner`) is a small reusable class in
  `permissions.py`, not copy-pasted inline in every view.
- Migrations are generated, not hand-written — commit them as Django
  produces them, don't "clean them up" into something unnatural.
- Variable names: `contact`, `contacts`, `qs`, `serializer` — ordinary
  names, not `contact_object_instance`.

## React

- Function components with hooks, no class components (the deck's `.jsx`
  examples are already function components — stay consistent with that).
- One component, one responsibility. `ContactList` renders the list;
  `ContactDetail` renders detail; don't merge them into one 300-line
  `App.jsx` "for simplicity."
- Co-locate small helper logic in the component that uses it; only extract
  to `hooks/` when it's reused in 2+ places (`useDebounce` genuinely is —
  that's the one hook worth extracting up front).
- `useEffect` cleanup where relevant (the deck calls this out for a
  reason — an unmounted component setting state after a fetch resolves is
  a real bug, not a style nitpick).
- Prefer plain CSS/CSS modules for a two-pane layout over pulling in a
  component library — a UI this simple doesn't need Material UI or similar,
  and installing a large dependency for two panels reads as generated
  rather than considered.
- Loading and error states are handled explicitly per request, not
  papered over with a single global spinner.

## Git hygiene

- Commit in small, logical chunks (model → migration → serializer → view →
  url; then frontend piece by piece) rather than one giant "initial commit"
  with the entire app. A single 4,000-line commit is itself a signal.
- Commit messages: imperative mood, no punctuation theatrics —
  `add contact search filtering`, not `✨ Implemented awesome search
  feature! ✨`.
